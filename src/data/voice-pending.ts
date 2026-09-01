import {
  type QuickLogAction,
  type QuickLogOutcome,
  clampVoiceCount,
  resolveVoiceAction,
} from "../domain/quick-log";
import { handleQuickLogUrl, syncVoiceLogFromDisk } from "./quick-log";

export const VOICE_PENDING_FILE = "puffpuffstop-voice-pending.json";

export type VoicePending = {
  action: QuickLogAction;
  count: number;
  token: string;
  applied: boolean;
};

type PendingFile = {
  exists: boolean;
  text(): Promise<string>;
  delete(): void;
};

type ModernFileSystem = {
  File: new (...pathParts: unknown[]) => PendingFile;
  Paths?: { document?: unknown };
};

export function parseVoicePending(raw: unknown): VoicePending | null {
  if (!raw || typeof raw !== "object") return null;
  const value = raw as Record<string, unknown>;
  const actionRaw = typeof value.action === "string" ? value.action : undefined;
  const countRaw =
    typeof value.count === "number"
      ? String(value.count)
      : typeof value.count === "string"
        ? value.count
        : undefined;
  const action = resolveVoiceAction(actionRaw, countRaw);
  const token =
    typeof value.t === "string"
      ? value.t
      : typeof value.token === "string"
        ? value.token
        : "";
  return {
    action,
    count: action === "clear" ? 0 : clampVoiceCount(countRaw ?? 1),
    token,
    applied: value.applied === true,
  };
}

async function readPendingFile(): Promise<string | null> {
  try {
    const FS = (await import("expo-file-system")) as unknown as ModernFileSystem;
    if (typeof FS.File !== "function" || !FS.Paths?.document) return null;
    const file = new FS.File(FS.Paths.document, VOICE_PENDING_FILE);
    if (!file.exists) return null;
    const text = await file.text();
    if (typeof file.delete === "function") file.delete();
    return text;
  } catch {
    return null;
  }
}

export async function consumePendingVoiceLog(): Promise<QuickLogOutcome | null> {
  const text = await readPendingFile();
  if (!text) return null;
  let raw: unknown;
  try {
    raw = JSON.parse(text);
  } catch {
    return null;
  }
  const pending = parseVoicePending(raw);
  if (!pending) return null;
  if (pending.applied) {
    await syncVoiceLogFromDisk();
    return "ignored";
  }
  const count = pending.action === "clear" ? "0" : String(pending.count);
  const token = pending.token || String(Date.now());
  return handleQuickLogUrl(
    `puffpuffstop://quick-log?action=${pending.action}&count=${count}&t=${encodeURIComponent(token)}`,
  );
}
