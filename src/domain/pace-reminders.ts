import {
  PACING_TRACKER_DISCLAIMER,
  livePacing,
  startOfNextZonedDay,
  startOfZonedDay,
  type GoalPacing,
  type LivePacing,
  type PaceWindow,
  type PaceWindowKind,
} from "./pacing";

export const PACE_REMINDER_ID_PREFIX = "puffpuffstop-pace-";
export const PACE_REMINDER_CATEGORY = "pace-unused";
export const PACE_REMINDER_ACTION_LOG = "pace-log-puff";
export const PACE_REMINDER_CHANNEL = "pace-reminders";
export const PACE_REMINDER_MAX = 48;
export const PACE_REMINDER_MIN_LEAD_MS = 1_000;
export const INTERVAL_PACING_REMINDER_HELPER =
  "When a 15, 30, or 60 minute slot ends with leftover puffs, the lock screen can show that unused count and a Log puff action. That leftover notice does not ask you to vape. Turn this on or off here, or later in Settings.";

export type PaceReminderSlot = {
  identifier: string;
  fireAt: number;
  kind: PaceWindowKind;
  unused: number;
  title: string;
  body: string;
};

export function shouldSchedulePaceReminders(
  intervalPacing: boolean | null,
  intervalPacingReminders: boolean | null,
): boolean {
  return intervalPacing !== false && intervalPacingReminders === true;
}

export function paceWindowEndMs(window: PaceWindow): number {
  return window.startMs + window.minutes * 60_000;
}

export function pickLapsingWindow(
  live: LivePacing,
  fireAt: number,
): PaceWindow | null {
  const windows = [live.hour, live.halfHour, live.quarterHour]
    .filter((window) => {
      return Math.abs(paceWindowEndMs(window) - fireAt) < 2 && window.remaining > 0;
    })
    .sort((left, right) => right.minutes - left.minutes);
  return windows[0] ?? null;
}

export function upcomingPaceLapseTimes(now: Date, timeZone: string): number[] {
  const nowMs = now.getTime();
  const dayStart = startOfZonedDay(now, timeZone);
  const dayEnd = startOfNextZonedDay(now, timeZone);
  const times: number[] = [];
  for (let at = dayStart + 15 * 60_000; at <= dayEnd; at += 15 * 60_000) {
    if (at - nowMs >= PACE_REMINDER_MIN_LEAD_MS) times.push(at);
  }
  return times;
}

export function paceReminderTitle(kind: PaceWindowKind, unused: number): string {
  const noun = unused === 1 ? "puff" : "puffs";
  const slot =
    kind === "hour"
      ? "this hour"
      : kind === "30 minutes"
        ? "this 30 minutes"
        : "this 15 minutes";
  return `You have ${unused} unused ${noun} ${slot}.`;
}

export function paceReminderBody(): string {
  return `Leftover room in that slot. ${PACING_TRACKER_DISCLAIMER}`;
}

export function upcomingPaceReminders(
  pacing: GoalPacing,
  puffAt: readonly number[],
  now: Date,
  timeZone: string,
  logged = puffAt.length,
  limit = PACE_REMINDER_MAX,
): PaceReminderSlot[] {
  if (!pacing.applies) return [];
  const slots: PaceReminderSlot[] = [];
  for (const fireAt of upcomingPaceLapseTimes(now, timeZone)) {
    if (slots.length >= limit) break;
    const live = livePacing(
      pacing,
      puffAt,
      new Date(fireAt - 1),
      timeZone,
      logged,
    );
    if (!live.applies) continue;
    const window = pickLapsingWindow(live, fireAt);
    if (!window) continue;
    slots.push({
      identifier: `${PACE_REMINDER_ID_PREFIX}${String(slots.length).padStart(2, "0")}`,
      fireAt,
      kind: window.kind,
      unused: window.remaining,
      title: paceReminderTitle(window.kind, window.remaining),
      body: paceReminderBody(),
    });
  }
  return slots;
}
