import {
  clampVoiceCount,
  parseQuickLogUrl,
  type QuickLogAction,
  type QuickLogOutcome,
} from "../domain/quick-log";
import { adjustPuffs, clearTodayPuffs, getDailyLog } from "./daily-log-store";
import { hydrateFromDriver } from "./persist";
import { currentPlan } from "./plan";

const listeners = new Set<() => void>();

function commitment(): number {
  return currentPlan().commitment;
}

function notify(): void {
  for (const listener of listeners) listener();
}

export function subscribeQuickLog(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function applyQuickLog(action: QuickLogAction, amount = 1): QuickLogOutcome {
  if (action === "clear") {
    clearTodayPuffs(commitment());
    notify();
    return "cleared";
  }
  const count = clampVoiceCount(amount);
  adjustPuffs(commitment(), action === "down" ? -count : count);
  notify();
  return action === "up" ? "logged" : "undone";
}

let lastVoiceToken = "";
const seenTokens = new Set<string>();

export function rememberVoiceToken(token: string): void {
  if (!token) return;
  lastVoiceToken = token;
  seenTokens.add(token);
}

export function wasVoiceTokenSeen(token: string | undefined): boolean {
  return Boolean(token && (token === lastVoiceToken || seenTokens.has(token)));
}

export function handleQuickLogUrl(url: string): QuickLogOutcome {
  const parsed = parseQuickLogUrl(url);
  if (!parsed) return "ignored";
  const token = parsed.token;
  if (wasVoiceTokenSeen(token)) return "ignored";
  if (token) rememberVoiceToken(token);
  return applyQuickLog(parsed.action, parsed.count);
}

export async function syncVoiceLogFromDisk(): Promise<boolean> {
  const ok = await hydrateFromDriver();
  if (ok) notify();
  return ok;
}

export function peekQuickLogState(): { logged: number } {
  return { logged: getDailyLog().logged };
}
