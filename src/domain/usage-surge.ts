import { countPuffsInWindow } from "./pacing";

export const USAGE_HOUR_MS = 3_600_000;
export const USAGE_SURGE_MIN = 3;
export const USAGE_SURGE_EXTRA = 2;
export const USAGE_SURGE_MESSAGE = "Your usage has increased in the last hour.";

export type UsageHourCounts = {
  lastHour: number;
  previousHour: number;
};

export function usageHourCounts(
  puffAt: readonly number[],
  now: Date = new Date(),
): UsageHourCounts {
  const endMs = now.getTime() + 1;
  return {
    lastHour: countPuffsInWindow(puffAt, endMs - USAGE_HOUR_MS, endMs),
    previousHour: countPuffsInWindow(
      puffAt,
      endMs - 2 * USAGE_HOUR_MS,
      endMs - USAGE_HOUR_MS,
    ),
  };
}

export function isUsageSurge(lastHour: number, previousHour: number): boolean {
  if (lastHour < USAGE_SURGE_MIN) return false;
  if (lastHour < previousHour + USAGE_SURGE_EXTRA) return false;
  if (previousHour > 0 && lastHour < previousHour * 2) return false;
  return true;
}

export function usageSurgeKey(now: Date = new Date()): string {
  return String(Math.floor(now.getTime() / USAGE_HOUR_MS));
}

export function detectUsageSurge(
  puffAt: readonly number[],
  now: Date = new Date(),
): { active: boolean; key: string; message: string } {
  const counts = usageHourCounts(puffAt, now);
  return {
    active: isUsageSurge(counts.lastHour, counts.previousHour),
    key: usageSurgeKey(now),
    message: USAGE_SURGE_MESSAGE,
  };
}
