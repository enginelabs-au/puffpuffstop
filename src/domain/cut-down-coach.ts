import type { ProgressDay } from "./progress";

export const CUT_DOWN_STRUGGLE_DAYS = 3;
export const CUT_DOWN_COACH_MESSAGE =
  "You're doing great. If this pace is hard, you can reduce by less so the next step is more achievable.";

export function consecutiveMissedDays(
  days: readonly ProgressDay[],
  todayKey: string,
): ProgressDay[] {
  const byKey = new Map(days.map((day) => [day.dateKey, day]));
  const missed: ProgressDay[] = [];
  let cursor = previousDateKey(todayKey);
  while (true) {
    const day = byKey.get(cursor);
    if (!day || day.met || day.goal <= 0) break;
    missed.push(day);
    cursor = previousDateKey(cursor);
  }
  return missed;
}

export function struggleWindowKey(
  days: readonly ProgressDay[],
  todayKey: string,
): string | null {
  const missed = consecutiveMissedDays(days, todayKey);
  if (missed.length < CUT_DOWN_STRUGGLE_DAYS) return null;
  return missed
    .slice(0, CUT_DOWN_STRUGGLE_DAYS)
    .map((day) => day.dateKey)
    .join(":");
}

export function shouldPromptEasierCutDown(
  days: readonly ProgressDay[],
  todayKey: string,
  reduceCount: number,
  dismissedKey: string | null,
): boolean {
  if (reduceCount < 1) return false;
  const key = struggleWindowKey(days, todayKey);
  return key !== null && key !== dismissedKey;
}

function previousDateKey(dateKey: string): string {
  const parts = dateKey.split("-").map(Number);
  const year = parts[0] ?? 1970;
  const month = parts[1] ?? 1;
  const day = parts[2] ?? 1;
  const date = new Date(Date.UTC(year, month - 1, day - 1));
  const yyyy = date.getUTCFullYear();
  const mm = String(date.getUTCMonth() + 1).padStart(2, "0");
  const dd = String(date.getUTCDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}
