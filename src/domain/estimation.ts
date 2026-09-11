export type Period = "days" | "weeks" | "months" | "years";

export function isPeriod(value: unknown): value is Period {
  return (
    value === "days" ||
    value === "weeks" ||
    value === "months" ||
    value === "years"
  );
}

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

export function daysBetweenDateKeys(fromKey: string, toKey: string): number {
  const from = parseDateKey(fromKey);
  const to = parseDateKey(toKey);
  if (!from || !to) return 0;
  return Math.max(0, Math.round((to.getTime() - from.getTime()) / 86_400_000));
}

export function periodsElapsed(
  fromKey: string,
  toKey: string,
  period: Period,
): number {
  return Math.floor(daysBetweenDateKeys(fromKey, toKey) / daysIn(period));
}

export function steppedDailyGoal(input: {
  usual: number;
  reduceCount: number;
  reducePeriod: Period;
  startDateKey: string | null | undefined;
  todayKey: string;
  baseGoal?: number | null;
  floor?: number;
}): number {
  const usual = Math.max(0, input.usual);
  const reduceCount = Math.max(0, input.reduceCount);
  const floor = Math.max(0, input.floor ?? 0);
  if (!input.startDateKey) {
    if (input.baseGoal != null) return Math.max(floor, input.baseGoal);
    return Math.max(floor, commitmentPuffs(usual, reduceCount));
  }
  const start = Math.max(0, input.baseGoal ?? usual);
  const drop = reduceCount * periodsElapsed(input.startDateKey, input.todayKey, input.reducePeriod);
  return Math.max(floor, start - drop);
}

function parseDateKey(dateKey: string): Date | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dateKey);
  if (!match) return null;
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const date = new Date(Date.UTC(year, month - 1, day));
  if (
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() !== month - 1 ||
    date.getUTCDate() !== day
  ) {
    return null;
  }
  return date;
}
