export const PACING_HOURS_PER_DAY = 24;
export const PACING_UNUSED_LOOKBACK = 3;
export const PACING_TRACKER_DISCLAIMER =
  "This only tracks what you log. It does not ask you to vape.";
export const PACING_FOLD_HINT =
  "Intervals pace your daily goal. Unused puffs roll to the next slot. Extra puffs cut the next slot.";
export const PACING_INTERVALS_TITLE = "Pacing Intervals";
export const PACING_LENIENT_TIP =
  "Unused puffs are not lost. They are banked for upcoming windows. Extra puffs are borrowed from the next window. Chase the long-term cut-down, not a perfect hour. This only tracks what you log. It does not ask you to vape.";
export const INTERVAL_PACING_HELPER =
  "Interval pacing splits your daily goal into 1 hour, 30 minute, and 15 minute slots. Unused puffs roll into the next slot so we never invent extra. It only tracks what you log — it does not ask you to vape. Yes opens the pace menu on Home; No keeps it folded. You can also choose unused-puff reminders when a slot ends.";

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
  over: boolean;
  startMs: number;
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

export function formatNextWindowIn(ms: number): string {
  return `Next window in: ${formatPaceCountdown(ms)}`;
}

export function paceRingFill(used: number, allowance: number): number {
  if (!Number.isFinite(used) || used <= 0) return 0;
  if (!Number.isFinite(allowance) || allowance <= 0) return 1;
  return Math.min(1, used / allowance);
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

export function allowanceAfterUnused(
  puffAt: readonly number[],
  now: Date,
  timeZone: string,
  windowMinutes: number,
  base: number,
  dailyGoal: number,
  logged = puffAt.length,
): number {
  if (base <= 0 || dailyGoal <= 0) return 0;
  const windowMs = windowMinutes * 60_000;
  const dayStart = startOfZonedDay(now, timeZone);
  const currentStart = windowBounds(now, timeZone, windowMinutes).startMs;
  const untimed = Math.max(0, logged - puffAt.length);
  const remainingAt = (startMs: number): number => {
    const timedBefore = countPuffsInWindow(puffAt, dayStart, startMs);
    return Math.max(0, dailyGoal - untimed - timedBefore);
  };
  const origin = Math.max(
    dayStart,
    currentStart - PACING_UNUSED_LOOKBACK * windowMs,
  );
  let carry = 0;
  for (
    let startMs = origin;
    startMs < currentStart;
    startMs += windowMs
  ) {
    const raw = base + carry;
    const allowance = Math.min(Math.max(0, raw), remainingAt(startMs));
    const used = countPuffsInWindow(puffAt, startMs, startMs + windowMs);
    carry = (raw < 0 ? raw : allowance) - used;
  }
  return Math.min(Math.max(0, base + carry), remainingAt(currentStart));
}

export function hourAllowanceAfterUnused(
  puffAt: readonly number[],
  now: Date,
  timeZone: string,
  basePerHour: number,
  dailyGoal: number,
  logged = puffAt.length,
): number {
  return allowanceAfterUnused(
    puffAt,
    now,
    timeZone,
    60,
    basePerHour,
    dailyGoal,
    logged,
  );
}

function capToParentRemaining(
  rawAllowance: number,
  used: number,
  parentRemaining: number,
): number {
  return (
    used +
    Math.min(Math.max(0, rawAllowance - used), Math.max(0, parentRemaining))
  );
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
  dailyOver = false,
): PaceWindow {
  const { startMs, endMs } = windowBounds(now, timeZone, minutes);
  const used = countPuffsInWindow(puffAt, startMs, endMs);
  const remaining = Math.max(0, allowance - used);
  const open = remaining > 0;
  return {
    kind,
    minutes,
    allowance,
    used,
    remaining,
    open,
    over: used > allowance || (dailyOver && !open),
    startMs,
    msUntilReset: Math.max(0, endMs - now.getTime()),
  };
}

function lapsedWindows(
  previous: LivePacing,
  next: LivePacing,
): PaceWindow[] {
  const pairs: [PaceWindow, PaceWindow][] = [
    [previous.hour, next.hour],
    [previous.halfHour, next.halfHour],
    [previous.quarterHour, next.quarterHour],
  ];
  return pairs
    .filter(([before, after]) => after.startMs !== before.startMs)
    .map(([, after]) => after);
}

export function shouldVibrateOnPaceLapse(
  previous: LivePacing | null,
  next: LivePacing,
): boolean {
  if (!previous?.applies || !next.applies) return false;
  return lapsedWindows(previous, next).some((window) => window.open);
}

export function livePacing(
  pacing: GoalPacing,
  puffAt: readonly number[],
  now: Date = new Date(),
  timeZone = "UTC",
  logged = puffAt.length,
): LivePacing {
  const hourAllowance = allowanceAfterUnused(
    puffAt,
    now,
    timeZone,
    60,
    pacing.perHour,
    pacing.goalPuffsPerDay,
    logged,
  );
  const dailyOver = logged > pacing.goalPuffsPerDay;
  const hour = paceWindow(
    "hour",
    60,
    hourAllowance,
    puffAt,
    now,
    timeZone,
    dailyOver,
  );
  const rawHalf = allowanceAfterUnused(
    puffAt,
    now,
    timeZone,
    30,
    pacing.per30Minutes,
    pacing.goalPuffsPerDay,
    logged,
  );
  const rawQuarter = allowanceAfterUnused(
    puffAt,
    now,
    timeZone,
    15,
    pacing.per15Minutes,
    pacing.goalPuffsPerDay,
    logged,
  );
  const halfBounds = windowBounds(now, timeZone, 30);
  const quarterBounds = windowBounds(now, timeZone, 15);
  const halfUsed = countPuffsInWindow(
    puffAt,
    halfBounds.startMs,
    halfBounds.endMs,
  );
  const quarterUsed = countPuffsInWindow(
    puffAt,
    quarterBounds.startMs,
    quarterBounds.endMs,
  );
  return {
    applies: pacing.applies,
    hour,
    halfHour: paceWindow(
      "30 minutes",
      30,
      capToParentRemaining(rawHalf, halfUsed, hour.remaining),
      puffAt,
      now,
      timeZone,
      dailyOver || hour.over,
    ),
    quarterHour: paceWindow(
      "15 minutes",
      15,
      capToParentRemaining(rawQuarter, quarterUsed, hour.remaining),
      puffAt,
      now,
      timeZone,
      dailyOver || hour.over,
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
  if (window.over) {
    return `${slot}: ${window.used} of ${window.allowance} used. Next window in ${left}.`;
  }
  if (!window.open) {
    return `${slot}: ${window.allowance} ${
      window.allowance === 1 ? "is" : "are"
    } used. Next window in ${left}.`;
  }
  return `${slot}: ${window.used} of ${window.allowance} used. ${left} left.`;
}
