export const PROGRESS_MAX_DAYS = 400;
export const PROGRESS_DISCLAIMER =
  "This tracks logs against your goal. It is not a medical score.";

export type ProgressRange = "7d" | "30d" | "12w";

export type ProgressDay = {
  dateKey: string;
  logged: number;
  goal: number;
  usual: number;
  met: boolean;
  saved?: number;
};

export type ProgressState = {
  days: ProgressDay[];
  lastGoal: number;
  lastUsual: number;
};

export type ProgressTotals = {
  range: ProgressRange;
  days: ProgressDay[];
  counted: number;
  met: number;
  adherence: number;
  averageLogged: number;
  averageGoal: number;
  streak: number;
  underGoal: number;
  savingsTotal: number;
  points: {
    key: string;
    logged: number;
    goal: number;
    met: boolean;
    saved: number;
    savedCumulative: number;
  }[];
};

export function emptyProgress(): ProgressState {
  return { days: [], lastGoal: 0, lastUsual: 0 };
}

export function makeProgressDay(
  dateKey: string,
  logged: number,
  goal: number,
  usual: number,
  saved = 0,
): ProgressDay {
  const safeLogged = Math.max(0, Math.round(logged));
  const safeGoal = Math.max(0, Math.round(goal));
  return {
    dateKey,
    logged: safeLogged,
    goal: safeGoal,
    usual: Math.max(0, Math.round(usual)),
    met: safeGoal > 0 && safeLogged <= safeGoal,
    saved: Math.max(0, Number.isFinite(saved) ? saved : 0),
  };
}

export function mergeProgressDays(
  days: readonly ProgressDay[],
  next: ProgressDay,
): ProgressDay[] {
  const without = days.filter((day) => day.dateKey !== next.dateKey);
  return [...without, next]
    .sort((a, b) => a.dateKey.localeCompare(b.dateKey))
    .slice(-PROGRESS_MAX_DAYS);
}

function addCalendarDays(dateKey: string, days: number): string {
  const parts = dateKey.split("-").map(Number);
  const year = parts[0] ?? 1970;
  const month = parts[1] ?? 1;
  const day = parts[2] ?? 1;
  const date = new Date(Date.UTC(year, month - 1, day + days));
  const yyyy = date.getUTCFullYear();
  const mm = String(date.getUTCMonth() + 1).padStart(2, "0");
  const dd = String(date.getUTCDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

export function rangeDayCount(range: ProgressRange): number {
  if (range === "7d") return 7;
  if (range === "30d") return 30;
  return 84;
}

export function daysInRange(
  days: readonly ProgressDay[],
  todayKey: string,
  range: ProgressRange,
): ProgressDay[] {
  const count = rangeDayCount(range);
  const start = addCalendarDays(todayKey, -(count - 1));
  return days.filter((day) => day.dateKey >= start && day.dateKey <= todayKey);
}

export function goalStreak(
  days: readonly ProgressDay[],
  todayKey: string,
): number {
  const byKey = new Map(days.map((day) => [day.dateKey, day]));
  let streak = 0;
  let cursor = todayKey;
  if (!byKey.get(cursor)?.met) {
    cursor = addCalendarDays(todayKey, -1);
  }
  while (byKey.get(cursor)?.met) {
    streak += 1;
    cursor = addCalendarDays(cursor, -1);
  }
  return streak;
}

export function summarizeProgress(
  days: readonly ProgressDay[],
  todayKey: string,
  range: ProgressRange,
): ProgressTotals {
  const inRange = daysInRange(days, todayKey, range);
  const counted = inRange.length;
  const met = inRange.filter((day) => day.met).length;
  const loggedSum = inRange.reduce((sum, day) => sum + day.logged, 0);
  const goalSum = inRange.reduce((sum, day) => sum + day.goal, 0);
  const rawPoints =
    range === "12w" ? weekPoints(inRange, todayKey) : dayPoints(inRange);
  const points = withCumulativeSavings(rawPoints);
  return {
    range,
    days: inRange,
    counted,
    met,
    adherence: counted === 0 ? 0 : Math.round((met / counted) * 100),
    averageLogged: counted === 0 ? 0 : Math.round((loggedSum / counted) * 10) / 10,
    averageGoal: counted === 0 ? 0 : Math.round((goalSum / counted) * 10) / 10,
    streak: goalStreak(days, todayKey),
    underGoal: inRange.reduce(
      (sum, day) => sum + Math.max(0, day.goal - day.logged),
      0,
    ),
    savingsTotal: roundMoney(
      inRange.reduce((sum, day) => sum + savedAmount(day), 0),
    ),
    points,
  };
}

function dayPoints(
  days: readonly ProgressDay[],
): Omit<ProgressTotals["points"][number], "savedCumulative">[] {
  return days.map((day) => ({
    key: day.dateKey,
    logged: day.logged,
    goal: day.goal,
    met: day.met,
    saved: roundMoney(savedAmount(day)),
  }));
}

function weekPoints(
  days: readonly ProgressDay[],
  todayKey: string,
): Omit<ProgressTotals["points"][number], "savedCumulative">[] {
  const byKey = new Map(days.map((day) => [day.dateKey, day]));
  const points = [];
  for (let week = 11; week >= 0; week -= 1) {
    const end = addCalendarDays(todayKey, -week * 7);
    const start = addCalendarDays(end, -6);
    const slice: ProgressDay[] = [];
    for (let offset = 0; offset < 7; offset += 1) {
      const day = byKey.get(addCalendarDays(start, offset));
      if (day) slice.push(day);
    }
    const logged =
      slice.length === 0
        ? 0
        : slice.reduce((sum, day) => sum + day.logged, 0) / slice.length;
    const goal =
      slice.length === 0
        ? 0
        : slice.reduce((sum, day) => sum + day.goal, 0) / slice.length;
    const saved =
      slice.length === 0
        ? 0
        : slice.reduce((sum, day) => sum + savedAmount(day), 0);
    points.push({
      key: end,
      logged: Math.round(logged * 10) / 10,
      goal: Math.round(goal * 10) / 10,
      met: slice.length > 0 && slice.every((day) => day.met),
      saved: roundMoney(saved),
    });
  }
  return points;
}

function withCumulativeSavings(
  points: readonly Omit<ProgressTotals["points"][number], "savedCumulative">[],
): ProgressTotals["points"] {
  let running = 0;
  return points.map((point) => {
    running += point.saved;
    return { ...point, savedCumulative: roundMoney(running) };
  });
}

function savedAmount(day: ProgressDay): number {
  return Math.max(0, day.saved ?? 0);
}

function roundMoney(value: number): number {
  return Math.round(Math.max(0, value) * 100) / 100;
}

export function profileScore(days: readonly ProgressDay[], todayKey: string): number | null {
  const week = summarizeProgress(days, todayKey, "7d");
  return week.counted === 0 ? null : week.adherence;
}
