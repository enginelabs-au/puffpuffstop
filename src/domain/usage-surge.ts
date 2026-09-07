import { countPuffsInWindow, startOfZonedDay } from "./pacing";

export const USAGE_HOUR_MS = 3_600_000;
export const USAGE_SURGE_MIN = 3;
export const USAGE_SURGE_EXTRA = 2;
export const USAGE_SURGE_MESSAGE = "Your usage has increased in the last hour.";
export const USAGE_EASE_MESSAGE =
  "Usage is easing this hour. Organs recover over months, not overnight.";
export const USAGE_TREND_DISCLAIMER =
  "This compares the puffs you log from hour to hour. It is not a medical score.";

export type UsageTrend = "higher" | "lower" | "steady";

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

export function hourUsageTrend(lastHour: number, previousHour: number): UsageTrend {
  if (lastHour > previousHour) return "higher";
  if (lastHour < previousHour) return "lower";
  return "steady";
}

export function isUsageEase(lastHour: number, previousHour: number): boolean {
  return previousHour > 0 && lastHour < previousHour;
}

export function detectUsageEase(
  puffAt: readonly number[],
  now: Date = new Date(),
): { active: boolean; key: string; message: string } {
  const counts = usageHourCounts(puffAt, now);
  return {
    active: isUsageEase(counts.lastHour, counts.previousHour),
    key: usageSurgeKey(now),
    message: USAGE_EASE_MESSAGE,
  };
}

export function clockHourPuffCounts(
  puffAt: readonly number[],
  now: Date,
  timeZone: string,
): number[] {
  const dayStart = startOfZonedDay(now, timeZone);
  const counts = Array.from({ length: 24 }, () => 0);
  for (const at of puffAt) {
    if (at < dayStart || at >= dayStart + 24 * USAGE_HOUR_MS) continue;
    const hour = Math.min(23, Math.floor((at - dayStart) / USAGE_HOUR_MS));
    counts[hour] = (counts[hour] ?? 0) + 1;
  }
  return counts;
}

export function dayHourUsageTrend(
  puffAt: readonly number[],
  now: Date,
  timeZone: string,
): { trend: UsageTrend; upHours: number; downHours: number } {
  const counts = clockHourPuffCounts(puffAt, now, timeZone);
  const dayStart = startOfZonedDay(now, timeZone);
  const currentHour = Math.min(
    23,
    Math.max(0, Math.floor((now.getTime() - dayStart) / USAGE_HOUR_MS)),
  );
  let upHours = 0;
  let downHours = 0;
  for (let hour = 1; hour <= currentHour; hour += 1) {
    const current = counts[hour] ?? 0;
    const previous = counts[hour - 1] ?? 0;
    if (current > previous) upHours += 1;
    if (current < previous) downHours += 1;
  }
  return {
    trend:
      upHours > downHours ? "higher" : downHours > upHours ? "lower" : "steady",
    upHours,
    downHours,
  };
}

export function hourlyUsageSeries(
  puffAt: readonly number[],
  now: Date,
  timeZone: string,
): number[] {
  const counts = clockHourPuffCounts(puffAt, now, timeZone);
  const dayStart = startOfZonedDay(now, timeZone);
  const currentHour = Math.min(
    23,
    Math.max(0, Math.floor((now.getTime() - dayStart) / USAGE_HOUR_MS)),
  );
  return counts.slice(0, currentHour + 1);
}

export function usageTrendLabel(trend: UsageTrend): string {
  if (trend === "higher") return "higher";
  if (trend === "lower") return "easing";
  return "steady";
}
