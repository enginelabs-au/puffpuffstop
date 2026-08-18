export type Period = "days" | "weeks" | "months" | "years";

export function daysIn(period: Period): number {
  switch (period) {
    case "days":
      return 1;
    case "weeks":
      return 7;
    case "months":
      return 30;
    case "years":
      return 365;
  }
}

export function puffsPerDay(
  frequencyCount: number,
  frequencyPeriod: Period,
): number {
  return frequencyCount / daysIn(frequencyPeriod);
}

export function historyDays(
  durationCount: number,
  durationPeriod: Period,
): number {
  return durationCount * daysIn(durationPeriod);
}

export function commitmentPuffs(
  estimatedPuffsPerDay: number,
  cutDownPerDay: number,
): number {
  return Math.max(0, estimatedPuffsPerDay - cutDownPerDay);
}
