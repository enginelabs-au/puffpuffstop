import {
  DEFAULT_CURRENCY,
  QUIT_WINDOWS,
  TRIGGERS,
  emptyDraft,
  type OnboardingDraft,
  type QuitWindow,
  type Trigger,
} from "../domain/onboarding";
import { isPeriod } from "../domain/estimation";
import { resolveTheme } from "../theme/tokens";
import { deviceTimeZone, resolveTimeZone } from "../domain/timezones";
import { isCurrencyCode } from "./currencies";
import { getDailyLog, replaceDailyLog, type DailyLogState } from "./daily-log-store";
import { getDraft, replaceDraft } from "./onboarding-store";
import { getSavings, replaceSavings, type SavingsState } from "./savings-store";
import type { HealthState } from "../domain/health";
import { getHealth, parseHealthState, replaceHealth } from "./health-store";
import { getProgress, parseProgressState, replaceProgress } from "./progress-store";
import { getSettings, replaceSettings, type SettingsState } from "./settings-store";
import type { ProgressState } from "../domain/progress";

export const SNAPSHOT_VERSION = 1;

export type AppSnapshot = {
  version: typeof SNAPSHOT_VERSION;
  draft: OnboardingDraft;
  dailyLog: DailyLogState;
  settings: SettingsState;
  savings: SavingsState;
  health: HealthState;
  progress: ProgressState;
};

function asFiniteNumber(value: unknown, fallback: number): number {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

function asString(value: unknown, fallback: string): string {
  return typeof value === "string" ? value : fallback;
}

function asNullNumber(value: unknown): number | null {
  if (value === null) return null;
  if (typeof value === "number" && Number.isFinite(value)) return value;
  return null;
}

function parseDraft(raw: unknown): OnboardingDraft | null {
  if (!raw || typeof raw !== "object") return null;
  const value = raw as Record<string, unknown>;
  const base = emptyDraft();
  const triggers = Array.isArray(value.triggers)
    ? value.triggers.filter((item): item is Trigger =>
        TRIGGERS.includes(item as Trigger),
      )
    : [];
  return {
    ...base,
    nickname: asString(value.nickname, base.nickname),
    durationCount: asFiniteNumber(value.durationCount, base.durationCount),
    durationPeriod:
      value.durationPeriod === "days" ||
      value.durationPeriod === "weeks" ||
      value.durationPeriod === "months" ||
      value.durationPeriod === "years"
        ? value.durationPeriod
        : base.durationPeriod,
    frequencyCount: asFiniteNumber(value.frequencyCount, base.frequencyCount),
    frequencyPeriod:
      value.frequencyPeriod === "days" ||
      value.frequencyPeriod === "weeks" ||
      value.frequencyPeriod === "months" ||
      value.frequencyPeriod === "years"
        ? value.frequencyPeriod
        : base.frequencyPeriod,
    deviceType:
      value.deviceType === "disposable" ||
      value.deviceType === "pod" ||
      value.deviceType === "refillable"
        ? value.deviceType
        : null,
    brandKind:
      value.brandKind === "catalog" ||
      value.brandKind === "other" ||
      value.brandKind === "custom"
        ? value.brandKind
        : null,
    catalogBrandId: asString(value.catalogBrandId ?? "", "") || null,
    catalogProductId: asString(value.catalogProductId ?? "", "") || null,
    otherBrandName: asString(value.otherBrandName, ""),
    puffsPerDevice: asNullNumber(value.puffsPerDevice),
    mlPerPuff: asNullNumber(value.mlPerPuff),
    deviceMl: asNullNumber(value.deviceMl),
    nicotineLabel: asString(value.nicotineLabel, ""),
    deviceCost: asNullNumber(value.deviceCost),
    deviceCostPeriod: isPeriod(value.deviceCostPeriod)
      ? value.deviceCostPeriod
      : base.deviceCostPeriod,
    currencyCode: isCurrencyCode(asString(value.currencyCode, DEFAULT_CURRENCY))
      ? asString(value.currencyCode, DEFAULT_CURRENCY)
      : DEFAULT_CURRENCY,
    triggers,
    strictness:
      value.strictness === "chill" ||
      value.strictness === "steady" ||
      value.strictness === "strict"
        ? value.strictness
        : null,
    motivation:
      value.motivation === "low" ||
      value.motivation === "medium" ||
      value.motivation === "high" ||
      value.motivation === "all-in"
        ? value.motivation
        : null,
    quitWindow: QUIT_WINDOWS.includes(value.quitWindow as QuitWindow)
      ? (value.quitWindow as QuitWindow)
      : null,
    quitOtherCount: asFiniteNumber(value.quitOtherCount, 0),
    quitOtherPeriod:
      value.quitOtherPeriod === "days" ||
      value.quitOtherPeriod === "weeks" ||
      value.quitOtherPeriod === "months" ||
      value.quitOtherPeriod === "years"
        ? value.quitOtherPeriod
        : base.quitOtherPeriod,
    quitExactDate: asString(value.quitExactDate, ""),
    cutDownPerDay: asFiniteNumber(value.cutDownPerDay, 0),
    cutDownPeriod: isPeriod(value.cutDownPeriod) ? value.cutDownPeriod : base.cutDownPeriod,
    cutDownStartDate: asDateKey(value.cutDownStartDate),
    cutDownBase: asNullNumber(value.cutDownBase),
    intervalPacing: parseIntervalPacing(
      value.intervalPacing,
      asFiniteNumber(value.durationCount, base.durationCount),
      asFiniteNumber(value.frequencyCount, base.frequencyCount),
    ),
    intervalPacingReminders: parseIntervalPacingReminders(
      value.intervalPacingReminders,
      asFiniteNumber(value.durationCount, base.durationCount),
      asFiniteNumber(value.frequencyCount, base.frequencyCount),
    ),
  };
}

function parseIntervalPacing(
  raw: unknown,
  durationCount: number,
  frequencyCount: number,
): boolean | null {
  if (raw === true) return true;
  if (raw === false) return false;
  return durationCount > 0 && frequencyCount > 0 ? true : null;
}

function parseIntervalPacingReminders(
  raw: unknown,
  durationCount: number,
  frequencyCount: number,
): boolean | null {
  if (raw === true) return true;
  if (raw === false) return false;
  return durationCount > 0 && frequencyCount > 0 ? true : null;
}

function parseDailyLog(raw: unknown): DailyLogState | null {
  if (!raw || typeof raw !== "object") return null;
  const value = raw as Record<string, unknown>;
  if (typeof value.dateKey !== "string") return null;
  const logged = Math.max(0, asFiniteNumber(value.logged, 0));
  const puffAt = Array.isArray(value.puffAt)
    ? value.puffAt.filter(
        (at): at is number => typeof at === "number" && Number.isFinite(at) && at > 0,
      )
    : [];
  return {
    dateKey: value.dateKey,
    logged,
    recoveryTicks: Math.max(0, asFiniteNumber(value.recoveryTicks, 0)),
    easeTicks: Math.max(0, asFiniteNumber(value.easeTicks, 0)),
    easeHourKey: asString(value.easeHourKey ?? "", "") || null,
    puffAt: puffAt.length > logged ? puffAt.slice(-logged) : puffAt,
  };
}

function parseSettings(raw: unknown): SettingsState | null {
  if (!raw || typeof raw !== "object") return null;
  const value = raw as Record<string, unknown>;
  if (typeof value.remindersEnabled !== "boolean") return null;
  return {
    remindersEnabled: value.remindersEnabled,
    stakePerPuff: asNullNumber(value.stakePerPuff),
    timeZone: resolveTimeZone(asString(value.timeZone, deviceTimeZone())),
    theme: resolveTheme(value.theme),
    lastNotificationResponseKey: asString(
      value.lastNotificationResponseKey ?? "",
      "",
    ) || null,
    leftoverNoticeRepair: value.leftoverNoticeRepair === true,
    cutDownCoachKey: asString(value.cutDownCoachKey ?? "", "") || null,
  };
}

function asDateKey(value: unknown): string | null {
  const text = asString(value ?? "", "");
  return /^\d{4}-\d{2}-\d{2}$/.test(text) ? text : null;
}

function parseSavings(raw: unknown): SavingsState | null {
  if (!raw || typeof raw !== "object") return null;
  const value = raw as Record<string, unknown>;
  return { pot: Math.max(0, asFiniteNumber(value.pot, 0)) };
}

export function captureSnapshot(): AppSnapshot {
  return {
    version: SNAPSHOT_VERSION,
    draft: getDraft(),
    dailyLog: getDailyLog(),
    settings: getSettings(),
    savings: getSavings(),
    health: getHealth(),
    progress: getProgress(),
  };
}

export function migrateSnapshot(raw: unknown): unknown {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return raw;
  const value = { ...(raw as Record<string, unknown>) };
  if (value.version === SNAPSHOT_VERSION) return value;
  if (
    value.version == null &&
    value.draft &&
    value.dailyLog &&
    value.settings &&
    value.savings
  ) {
    return { ...value, version: SNAPSHOT_VERSION };
  }
  return value;
}

export function parseSnapshot(raw: unknown): AppSnapshot | null {
  const migrated = migrateSnapshot(raw);
  if (!migrated || typeof migrated !== "object") return null;
  const value = migrated as Record<string, unknown>;
  if (value.version !== SNAPSHOT_VERSION) return null;
  const draft = parseDraft(value.draft);
  const dailyLog = parseDailyLog(value.dailyLog);
  const settings = parseSettings(value.settings);
  const savings = parseSavings(value.savings);
  if (!draft || !dailyLog || !settings || !savings) return null;
  return {
    version: SNAPSHOT_VERSION,
    draft,
    dailyLog,
    settings,
    savings,
    health: parseHealthState(value.health),
    progress: parseProgressState(value.progress),
  };
}

export function restoreSnapshot(raw: unknown): boolean {
  const parsed = parseSnapshot(raw);
  if (!parsed) return false;
  replaceDraft(parsed.draft);
  replaceDailyLog(parsed.dailyLog);
  replaceSettings(parsed.settings);
  replaceSavings(parsed.savings);
  replaceHealth(parsed.health);
  replaceProgress(parsed.progress);
  return true;
}
