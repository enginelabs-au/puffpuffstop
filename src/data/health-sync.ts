import { Linking } from "react-native";

import { readFitbitClientId } from "../config/env";
import {
  HEALTH_FILE_NAME,
  effectsAroundPuff,
  emptyHealthSummary,
  fitbitAuthorizeUrl,
  healthAccessUrl,
  healthRefreshUrl,
  parseFitbitCallback,
  parseHealthFile,
  type HealthEffect,
  type HealthSummary,
} from "../domain/health";
import { getDailyLog } from "./daily-log-store";
import { getSettings } from "./settings-store";
import {
  getHealth,
  mergeHealthSummary,
  updateHealth,
} from "./health-store";

const listeners = new Set<() => void>();

export function subscribeHealth(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function notify(): void {
  for (const listener of listeners) listener();
}

async function readHealthFile(): Promise<string | null> {
  try {
    const FS = (await import("expo-file-system")) as unknown as {
      File: new (...pathParts: unknown[]) => {
        exists: boolean;
        text(): Promise<string>;
      };
      Paths?: { document?: unknown };
    };
    if (typeof FS.File !== "function" || !FS.Paths?.document) return null;
    const file = new FS.File(FS.Paths.document, HEALTH_FILE_NAME);
    if (!file.exists) return null;
    return await file.text();
  } catch {
    return null;
  }
}

export async function syncHealthFromDisk(): Promise<boolean> {
  const raw = await readHealthFile();
  if (!raw) return false;
  try {
    const parsed = parseHealthFile(JSON.parse(raw));
    const allowEnable =
      getHealth().healthEnabled || getHealth().healthStatus === "pending";
    mergeHealthSummary(parsed.summary, {
      status: parsed.status,
      source: parsed.source,
      syncedAt: parsed.syncedAt,
      dateKey: parsed.dateKey,
      enabledKey: allowEnable ? "healthEnabled" : undefined,
      effects: parsed.effects,
    });
    notify();
    return parsed.status === "ok";
  } catch {
    return false;
  }
}

export async function connectPhoneHealth(): Promise<void> {
  updateHealth({ healthStatus: "pending" });
  notify();
  try {
    await Linking.openURL(healthAccessUrl());
  } catch {
    updateHealth({ healthStatus: "failed", healthEnabled: false });
    notify();
    return;
  }
  await new Promise((resolve) => setTimeout(resolve, 1200));
  const synced = await syncHealthFromDisk();
  if (!synced && getHealth().healthStatus === "pending") {
    updateHealth({ healthStatus: "unavailable", healthEnabled: false });
    notify();
  }
}

export function disconnectPhoneHealth(): void {
  updateHealth({
    healthEnabled: false,
    healthStatus: "idle",
    lastSyncedAt: null,
    dateKey: null,
    sources: getHealth().sources.filter((source) => source === "fitbit"),
    summary: emptyHealthSummary(),
    effects: [],
  });
  notify();
}

export function fitbitRedirectUri(scheme = "puffpuffstop"): string {
  return `${scheme}://fitbit`;
}

export function canConnectFitbitDirect(
  env: Record<string, string | undefined> = process.env,
): boolean {
  return Boolean(readFitbitClientId(env));
}

function randomVerifier(): string {
  const bytes = new Uint8Array(32);
  for (let index = 0; index < bytes.length; index += 1) {
    bytes[index] = Math.floor(Math.random() * 256);
  }
  return btoa(String.fromCharCode(...bytes))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}

async function sha256Challenge(verifier: string): Promise<string> {
  if (typeof crypto !== "undefined" && crypto.subtle) {
    const digest = await crypto.subtle.digest(
      "SHA-256",
      new TextEncoder().encode(verifier),
    );
    return btoa(String.fromCharCode(...new Uint8Array(digest)))
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/g, "");
  }
  return verifier;
}

export async function connectFitbitAccount(): Promise<"opened" | "missing-client"> {
  const clientId = readFitbitClientId();
  if (!clientId) {
    updateHealth({ fitbitStatus: "unavailable", fitbitEnabled: false });
    notify();
    return "missing-client";
  }
  const verifier = randomVerifier();
  const challenge = await sha256Challenge(verifier);
  updateHealth({
    fitbitStatus: "pending",
    fitbitCodeVerifier: verifier,
  });
  notify();
  const url = fitbitAuthorizeUrl({
    clientId,
    redirectUri: fitbitRedirectUri(),
    codeChallenge: challenge,
    state: verifier.slice(0, 12),
  });
  await Linking.openURL(url);
  return "opened";
}

export function disconnectFitbitAccount(): void {
  updateHealth({
    fitbitEnabled: false,
    fitbitStatus: "idle",
    fitbitAccessToken: null,
    fitbitRefreshToken: null,
    fitbitCodeVerifier: null,
    sources: getHealth().sources.filter((source) => source !== "fitbit"),
  });
  notify();
}

export async function handleFitbitUrl(url: string): Promise<boolean> {
  const parsed = parseFitbitCallback(url);
  if (!parsed) return false;
  const clientId = readFitbitClientId();
  const verifier = getHealth().fitbitCodeVerifier;
  if (!clientId || !verifier) {
    updateHealth({ fitbitStatus: "failed", fitbitEnabled: false });
    notify();
    return true;
  }
  try {
    const body = new URLSearchParams({
      client_id: clientId,
      code: parsed.code,
      code_verifier: verifier,
      grant_type: "authorization_code",
      redirect_uri: fitbitRedirectUri(),
    });
    const response = await fetch("https://api.fitbit.com/oauth2/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: body.toString(),
    });
    if (!response.ok) {
      updateHealth({ fitbitStatus: "failed", fitbitEnabled: false });
      notify();
      return true;
    }
    const tokens = (await response.json()) as {
      access_token?: string;
      refresh_token?: string;
    };
    updateHealth({
      fitbitAccessToken: tokens.access_token ?? null,
      fitbitRefreshToken: tokens.refresh_token ?? null,
      fitbitCodeVerifier: null,
      fitbitEnabled: Boolean(tokens.access_token),
      fitbitStatus: tokens.access_token ? "ok" : "failed",
    });
    if (tokens.access_token) {
      await refreshFitbitSummary(tokens.access_token);
    }
    notify();
    return true;
  } catch {
    updateHealth({ fitbitStatus: "failed", fitbitEnabled: false });
    notify();
    return true;
  }
}

async function fitbitJson(
  token: string,
  path: string,
): Promise<Record<string, unknown> | null> {
  try {
    const response = await fetch(`https://api.fitbit.com${path}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) return null;
    return (await response.json()) as Record<string, unknown>;
  } catch {
    return null;
  }
}

function numberAt(value: unknown, ...keys: string[]): number | null {
  let current: unknown = value;
  for (const key of keys) {
    if (!current || typeof current !== "object") return null;
    current = (current as Record<string, unknown>)[key];
  }
  if (typeof current === "number" && Number.isFinite(current)) return current;
  if (typeof current === "string" && current.trim() !== "") {
    const parsed = Number(current);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
}

export async function refreshFitbitSummary(token = getHealth().fitbitAccessToken): Promise<boolean> {
  if (!token) return false;
  let today: string;
  try {
    const zone = getSettings().timeZone;
    today = new Intl.DateTimeFormat("en-CA", { timeZone: zone }).format(new Date());
  } catch {
    today = new Date().toISOString().slice(0, 10);
  }
  const [heart, spo2, spo2All, heartIntraday] = await Promise.all([
    fitbitJson(token, `/1/user/-/activities/heart/date/${today}/1d.json`),
    fitbitJson(token, `/1/user/-/spo2/date/${today}.json`),
    fitbitJson(token, `/1/user/-/spo2/date/${today}/all.json`),
    fitbitJson(token, `/1/user/-/activities/heart/date/${today}/1d/1min.json`),
  ]);
  const heartDays = Array.isArray(heart?.["activities-heart"])
    ? (heart?.["activities-heart"] as Record<string, unknown>[])
    : [];
  const resting = numberAt(heartDays[0], "value", "restingHeartRate");
  const lastPuffAt = getDailyLog().puffAt.at(-1);
  const heartSamples = fitbitIntradaySamples(heartIntraday, today, "dataset");
  const spo2Samples = fitbitMinuteSamples(spo2All, "minutes");
  const effects: HealthEffect[] = [];
  if (lastPuffAt) {
    const heartEffect = effectsAroundPuff(heartSamples, lastPuffAt, "heartRateBpm");
    const spo2Effect = effectsAroundPuff(spo2Samples, lastPuffAt, "spo2Percent");
    if (heartEffect) effects.push(heartEffect);
    if (spo2Effect) effects.push(spo2Effect);
  }
  const latestHeart = heartSamples.at(-1)?.value ?? resting;
  const summary: HealthSummary = {
    heartRateBpm: latestHeart,
    restingHeartRateBpm: resting,
    hrvMs: null,
    respiratoryRate: null,
    spo2Percent: spo2Samples.at(-1)?.value ?? numberAt(spo2, "value", "avg"),
    sleepMinutes: null,
    sleepAwakenings: null,
    steps: null,
    activeEnergyKcal: null,
    exerciseMinutes: null,
    vo2Max: null,
    wristTempC: null,
  };
  mergeHealthSummary(summary, {
    status: "ok",
    source: "fitbit",
    syncedAt: new Date().toISOString(),
    dateKey: today,
    enabledKey: "fitbitEnabled",
    effects,
  });
  notify();
  return true;
}

function localDateTimeMs(dateKey: string, clock: string, timeZone: string): number | null {
  const match = clock.trim().match(/^(\d{1,2}):(\d{2})(?::(\d{2}))?$/);
  if (!match) return null;
  const hour = Number(match[1]);
  const minute = Number(match[2]);
  const second = Number(match[3] ?? "0");
  const guess = new Date(`${dateKey}T${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}:${String(second).padStart(2, "0")}`);
  if (Number.isNaN(guess.getTime())) return null;
  try {
    const parts = new Intl.DateTimeFormat("en-US", {
      timeZone,
      hourCycle: "h23",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }).formatToParts(guess);
    const num = (type: Intl.DateTimeFormatPartTypes) =>
      Number(parts.find((part) => part.type === type)?.value ?? "0");
    const driftMinutes =
      (num("hour") - hour) * 60 + (num("minute") - minute);
    return guess.getTime() - driftMinutes * 60_000;
  } catch {
    return guess.getTime();
  }
}

function fitbitIntradaySamples(
  payload: Record<string, unknown> | null,
  dateKey: string,
  datasetKey: string,
): { at: number; value: number }[] {
  const intra = payload?.["activities-heart-intraday"];
  const dataset =
    intra && typeof intra === "object"
      ? (intra as Record<string, unknown>)[datasetKey]
      : null;
  if (!Array.isArray(dataset)) return [];
  const zone = getSettings().timeZone;
  return dataset.flatMap((row) => {
    if (!row || typeof row !== "object") return [];
    const item = row as Record<string, unknown>;
    const at = typeof item.time === "string" ? localDateTimeMs(dateKey, item.time, zone) : null;
    const value =
      typeof item.value === "number"
        ? item.value
        : typeof item.value === "string"
          ? Number(item.value)
          : null;
    if (at == null || value == null || !Number.isFinite(value)) return [];
    return [{ at, value }];
  });
}

function fitbitMinuteSamples(
  payload: Record<string, unknown> | null,
  key: string,
): { at: number; value: number }[] {
  const rows = payload?.[key];
  if (!Array.isArray(rows)) return [];
  return rows.flatMap((row) => {
    if (!row || typeof row !== "object") return [];
    const item = row as Record<string, unknown>;
    const stamp = typeof item.minute === "string" ? Date.parse(item.minute) : Number.NaN;
    const value =
      typeof item.value === "number"
        ? item.value
        : typeof item.value === "string"
          ? Number(item.value)
          : null;
    if (!Number.isFinite(stamp) || value == null || !Number.isFinite(value)) return [];
    return [{ at: stamp, value }];
  });
}

export async function refreshHealthAfterLog(): Promise<void> {
  try {
    await Linking.openURL(healthRefreshUrl());
  } catch {
    // Native HealthKit refresh is best-effort.
  }
  if (getHealth().fitbitEnabled) {
    await refreshFitbitSummary();
  }
  await new Promise((resolve) => setTimeout(resolve, 1200));
  await syncHealthFromDisk();
}
