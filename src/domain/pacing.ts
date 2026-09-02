export const PACING_HOURS_PER_DAY = 24;
export const PACING_TRACKER_DISCLAIMER =
  "This only tracks what you log. It does not ask you to vape.";

export type GoalPacing = {
  averagePuffsPerDay: number;
  goalPuffsPerDay: number;
  applies: boolean;
  perHour: number;
  per30Minutes: number;
  per15Minutes: number;
};

export type PaceWindowKind = "hour" | "30 minutes" | "15 minutes";

export type PaceWindow = {
  kind: PaceWindowKind;
  minutes: number;
  allowance: number;
  used: number;
  remaining: number;
  open: boolean;
  msUntilReset: number;
};

export type LivePacing = {
  applies: boolean;
  hour: PaceWindow;
  halfHour: PaceWindow;
  quarterHour: PaceWindow;
};

function ceilPuffs(value: number): number {
  if (!Number.isFinite(value) || value <= 0) return 0;
  return Math.ceil(value);
}

export function goalPacing(
  averagePuffsPerDay: number,
  goalPuffsPerDay: number,
): GoalPacing {
  const average = Math.max(0, averagePuffsPerDay);
  const goal = Math.max(0, goalPuffsPerDay);
  const applies = goal > 0 && goal < average;
  const perHour = applies ? ceilPuffs(goal / PACING_HOURS_PER_DAY) : 0;
  return {
    averagePuffsPerDay: average,
    goalPuffsPerDay: goal,
    applies,
    perHour,
    per30Minutes: applies ? ceilPuffs(perHour / 2) : 0,
    per15Minutes: applies ? ceilPuffs(perHour / 4) : 0,
  };
}

export function goalPacingCaption(pacing: GoalPacing): string {
  if (!pacing.applies) return "";
  const hour = pacing.perHour === 1 ? "puff" : "puffs";
  return `A goal of ${pacing.goalPuffsPerDay} is ${pacing.perHour} ${hour} an hour, ${pacing.per30Minutes} per 30 minutes, and ${pacing.per15Minutes} per 15 minutes. Usual day is about ${pacing.averagePuffsPerDay}. ${PACING_TRACKER_DISCLAIMER}`;
}

export function formatPaceCountdown(ms: number): string {
  const total = Math.max(0, Math.ceil(ms / 1000));
  const hours = Math.floor(total / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const seconds = total % 60;
  const mm = String(minutes).padStart(2, "0");
  const ss = String(seconds).padStart(2, "0");
  if (hours > 0) return `${hours}:${mm}:${ss}`;
  return `${minutes}:${ss}`;
}

function zonedClock(
  now: Date,
  timeZone: string,
): { hour: number; minute: number; second: number; ms: number } {
  try {
    const parts = new Intl.DateTimeFormat("en-US", {
      timeZone,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hourCycle: "h23",
    }).formatToParts(now);
    const num = (type: Intl.DateTimeFormatPartTypes) =>
      Number(parts.find((part) => part.type === type)?.value ?? "0");
    return {
      hour: num("hour"),
      minute: num("minute"),
      second: num("second"),
      ms: now.getMilliseconds(),
    };
  } catch {
    return {
      hour: now.getHours(),
      minute: now.getMinutes(),
      second: now.getSeconds(),
      ms: now.getMilliseconds(),
    };
  }
}

export function startOfZonedDay(now: Date, timeZone: string): number {
  const clock = zonedClock(now, timeZone);
  const elapsedMs =
    clock.hour * 3_600_000 +
    clock.minute * 60_000 +
    clock.second * 1000 +
    clock.ms;
  return now.getTime() - elapsedMs;
}

export function startOfNextZonedDay(now: Date, timeZone: string): number {
  return startOfZonedDay(
    new Date(startOfZonedDay(now, timeZone) + 36 * 3_600_000),
    timeZone,
  );
}

export function msUntilDayReset(now: Date, timeZone: string): number {
  return Math.max(0, startOfNextZonedDay(now, timeZone) - now.getTime());
}

export function windowBounds(
  now: Date,
  timeZone: string,
  windowMinutes: number,
): { startMs: number; endMs: number } {
  const clock = zonedClock(now, timeZone);
  const minutesIntoDay = clock.hour * 60 + clock.minute;
  const windowStartMinute =
    Math.floor(minutesIntoDay / windowMinutes) * windowMinutes;
  const elapsedMs =
    (minutesIntoDay - windowStartMinute) * 60_000 +
    clock.second * 1000 +
    clock.ms;
  const startMs = now.getTime() - elapsedMs;
  return { startMs, endMs: startMs + windowMinutes * 60_000 };
}

export function hourAllowanceAfterUnused(
  puffAt: readonly number[],
  now: Date,
  timeZone: string,
  basePerHour: number,
  dailyGoal: number,
): number {
  const windowMs = 60 * 60_000;
  const dayStart = startOfZonedDay(now, timeZone);
  const currentStart = windowBounds(now, timeZone, 60).startMs;
  const loggedBeforeCurrent = countPuffsInWindow(puffAt, dayStart, currentStart);
  const remainingGoal = Math.max(0, dailyGoal - loggedBeforeCurrent);
  if (currentStart <= dayStart) {
    return Math.min(basePerHour, remainingGoal);
  }
  const previousUsed = countPuffsInWindow(
    puffAt,
    currentStart - windowMs,
    currentStart,
  );
  const unused = Math.max(0, basePerHour - previousUsed);
  return Math.min(basePerHour + unused, remainingGoal);
}

export function countPuffsInWindow(
  puffAt: readonly number[],
  startMs: number,
  endMs: number,
): number {
  return puffAt.filter((at) => at >= startMs && at < endMs).length;
}

function paceWindow(
  kind: PaceWindowKind,
  minutes: number,
  allowance: number,
  puffAt: readonly number[],
  now: Date,
  timeZone: string,
): PaceWindow {
  const { startMs, endMs } = windowBounds(now, timeZone, minutes);
  const used = countPuffsInWindow(puffAt, startMs, endMs);
  const remaining = Math.max(0, allowance - used);
  return {
    kind,
    minutes,
    allowance,
    used,
    remaining,
    open: remaining > 0,
    msUntilReset: Math.max(0, endMs - now.getTime()),
  };
}

export function livePacing(
  pacing: GoalPacing,
  puffAt: readonly number[],
  now: Date = new Date(),
  timeZone = "UTC",
): LivePacing {
  const hourAllowance = hourAllowanceAfterUnused(
    puffAt,
    now,
    timeZone,
    pacing.perHour,
    pacing.goalPuffsPerDay,
  );
  return {
    applies: pacing.applies,
    hour: paceWindow("hour", 60, hourAllowance, puffAt, now, timeZone),
    halfHour: paceWindow(
      "30 minutes",
      30,
      ceilPuffs(hourAllowance / 2),
      puffAt,
      now,
      timeZone,
    ),
    quarterHour: paceWindow(
      "15 minutes",
      15,
      ceilPuffs(hourAllowance / 4),
      puffAt,
      now,
      timeZone,
    ),
  };
}

export function paceWindowCaption(window: PaceWindow): string {
  const slot =
    window.kind === "hour"
      ? "This hour"
      : window.kind === "30 minutes"
        ? "This 30 minutes"
        : "This 15 minutes";
  const left = formatPaceCountdown(window.msUntilReset);
  if (!window.open) {
    return `${slot}: ${window.allowance} ${
      window.allowance === 1 ? "is" : "are"
    } used. Next window in ${left}.`;
  }
  return `${slot}: ${window.used} of ${window.allowance} used. ${left} left.`;
}
