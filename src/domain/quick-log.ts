export type QuickLogDirection = "up" | "down";
export type QuickLogAction = QuickLogDirection | "clear";
export type QuickLogSource = "shortcut" | "voice";
export type QuickLogUrlAction = QuickLogAction;
export type QuickLogOutcome = "logged" | "undone" | "cleared" | "ignored";

export const VOICE_COUNT_MAX = 999_999;
export const SIRI_LOG_PHRASE = "Hey Siri, log a puff in PuffPuffStop";
export const SIRI_LOG_MANY_PHRASE = "Hey Siri, log 40 puffs in PuffPuffStop";
export const SIRI_UNDO_PHRASE = "Hey Siri, undo in PuffPuffStop";
export const SIRI_UNDO_MANY_PHRASE = "Hey Siri, undo 3 in PuffPuffStop";
export const SIRI_REDUCE_PHRASE = "Hey Siri, remove 5 puffs from PuffPuffStop";
export const SIRI_UNDO_ALL_PHRASE = "Hey Siri, reset in PuffPuffStop";
export const SIRI_RESET_PHRASE = "Hey Siri, reset today's log in PuffPuffStop";
export const VOICE_EXAMPLE_LOG = "Hey (Assistant), Log a puff on PuffPuffStop";
export const VOICE_EXAMPLE_REMOVE = "Hey (Assistant), Remove 5 puffs from PuffPuffStop";
export const VOICE_EXAMPLE_HINT =
  "Say from, in, or on PuffPuffStop. Remove, undo, reset, subtract, take off, take away, reduce, revert, decrease, and clear all work.";
export const GEMINI_LOG_HINT =
  "Ask Gemini or Google Assistant the same phrases as Siri: log a puff, log 5, remove 5 puffs from PuffPuffStop, undo 5, take 5 off, take away, subtract, reduce, revert, decrease, reset in PuffPuffStop, or clear in PuffPuffStop. Say from, in, or on. If it does not know the app yet, add a routine that opens the matching shortcut.";

const ADD_TOKENS = new Set([
  "up",
  "log",
  "add",
  "include",
  "plus",
  "record",
  "increment",
]);
const SUBTRACT_TOKENS = new Set([
  "down",
  "undo",
  "remove",
  "reduce",
  "subtract",
  "substract",
  "take-back",
  "take-away",
  "takeaway",
  "take-off",
  "takeoff",
  "revert",
  "decrease",
]);
const CLEAR_TOKENS = new Set(["clear", "all", "wipe", "everything"]);
const RESET_TOKENS = new Set(["reset"]);

export const REDO_SETUP_TITLE = "Redo setup?";
export const REDO_SETUP_BODY =
  "You'll walk through onboarding again. Today's puff log and savings stay on this device.";
export const REDO_SETUP_CONFIRM = "Redo setup";
export const REDO_SETUP_CANCEL = "Cancel";

export type VoiceDailyLog = {
  dateKey: string;
  logged: number;
  recoveryTicks: number;
};

export type ParsedQuickLogUrl = {
  action: QuickLogUrlAction;
  count: number;
  token?: string;
};

const NUMBER_WORDS: [string, number][] = [
  ["thousand", 1000],
  ["hundred", 100],
  ["ninety", 90],
  ["eighty", 80],
  ["seventy", 70],
  ["sixty", 60],
  ["fifty", 50],
  ["forty", 40],
  ["thirty", 30],
  ["twenty", 20],
  ["nineteen", 19],
  ["eighteen", 18],
  ["seventeen", 17],
  ["sixteen", 16],
  ["fifteen", 15],
  ["fourteen", 14],
  ["thirteen", 13],
  ["twelve", 12],
  ["eleven", 11],
  ["ten", 10],
  ["nine", 9],
  ["eight", 8],
  ["seven", 7],
  ["six", 6],
  ["five", 5],
  ["four", 4],
  ["three", 3],
  ["two", 2],
  ["one", 1],
  ["an", 1],
  ["a", 1],
];

export function extractSpokenCount(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) {
    return Math.round(value);
  }
  const text = String(value ?? "")
    .trim()
    .toLowerCase();
  if (!text) return null;
  const digits = text.match(/(\d+)/);
  if (digits) return Number(digits[1]);
  for (const [word, amount] of NUMBER_WORDS) {
    if (new RegExp(`\\b${word}\\b`).test(text)) return amount;
  }
  return null;
}

export function clampVoiceCount(value: unknown): number {
  const raw = extractSpokenCount(value);
  if (raw == null) return 1;
  return Math.min(VOICE_COUNT_MAX, Math.max(1, raw));
}

export function isClearToken(value: string | undefined): boolean {
  if (!value) return false;
  return CLEAR_TOKENS.has(value.trim().toLowerCase());
}

function normalizeToken(value: string | undefined): string {
  return value?.trim().toLowerCase() ?? "";
}

function hasPositiveCount(count?: string): boolean {
  if (!count) return false;
  const raw = Number(count);
  return Number.isFinite(raw) && raw > 0;
}

export function resolveVoiceAction(
  action: string | undefined,
  count?: string,
): QuickLogAction {
  const verb = normalizeToken(action);
  const amount = normalizeToken(count);
  if (ADD_TOKENS.has(verb)) return "up";
  if (RESET_TOKENS.has(verb)) {
    return hasPositiveCount(amount) ? "down" : "clear";
  }
  if (CLEAR_TOKENS.has(verb)) return "clear";
  if (SUBTRACT_TOKENS.has(verb)) {
    return CLEAR_TOKENS.has(amount) ? "clear" : "down";
  }
  if (CLEAR_TOKENS.has(amount) && !verb) return "clear";
  return "up";
}

export function parseQuickLogUrl(url: string): ParsedQuickLogUrl | null {
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return null;
  }
  if (parsed.protocol !== "puffpuffstop:") return null;
  const host = parsed.hostname || parsed.host;
  const path = parsed.pathname.replace(/^\//, "");
  if (host !== "quick-log" && path !== "quick-log") return null;
  const actionRaw = parsed.searchParams.get("action") ?? undefined;
  const countRaw = parsed.searchParams.get("count") ?? undefined;
  const action = resolveVoiceAction(actionRaw, countRaw);
  const token = parsed.searchParams.get("t") ?? undefined;
  return {
    action,
    count: action === "clear" ? 0 : clampVoiceCount(countRaw ?? 1),
    ...(token ? { token } : {}),
  };
}

export function applyVoiceLogToDaily(
  daily: VoiceDailyLog,
  action: QuickLogAction,
  today: string,
  amount = 1,
): VoiceDailyLog {
  const baseLogged = daily.dateKey === today ? daily.logged : 0;
  if (action === "clear") {
    return { dateKey: today, logged: 0, recoveryTicks: daily.recoveryTicks };
  }
  const delta = clampVoiceCount(amount);
  return {
    dateKey: today,
    logged: action === "down" ? Math.max(0, baseLogged - delta) : baseLogged + delta,
    recoveryTicks: daily.recoveryTicks,
  };
}

export function voiceLogSpokenResult(
  action: QuickLogAction,
  status: "ok" | "missing" | "failed",
  todayTotal = 0,
  added = 1,
): string {
  if (status === "missing") {
    return "Open PuffPuffStop once first so I can save your log.";
  }
  if (status === "failed") {
    return "I could not save that puff. Try opening the app.";
  }
  const todayWord = todayTotal === 1 ? "puff" : "puffs";
  if (action === "clear") {
    return `Cleared today's log. That's ${todayTotal} ${todayWord} today.`;
  }
  const addedCount = clampVoiceCount(added);
  const addedWord = addedCount === 1 ? "puff" : "puffs";
  if (action === "down") {
    return `Undone ${addedCount} ${addedWord}. That's ${todayTotal} ${todayWord} today.`;
  }
  return `Logged ${addedCount} ${addedWord}. That's ${todayTotal} ${todayWord} today.`;
}

export function outcomeForDirection(direction: QuickLogDirection): "logged" | "undone" {
  return direction === "up" ? "logged" : "undone";
}
