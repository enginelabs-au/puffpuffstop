export const DAILY_REMINDER_ID = "puffpuffstop-daily-check-in";
export const DAILY_REMINDER_HOUR = 19;
export const DAILY_REMINDER_MINUTE = 0;
export const DAILY_REMINDER_TITLE = "Check in with PuffPuffStop";
export const DAILY_REMINDER_BODY =
  "Log today's puffs and stay under your commitment.";

export type ReminderPermission = "granted" | "denied" | "undetermined";

export type DailyReminder = {
  identifier: string;
  hour: number;
  minute: number;
  title: string;
  body: string;
};

export function dailyReminder(): DailyReminder {
  return {
    identifier: DAILY_REMINDER_ID,
    hour: DAILY_REMINDER_HOUR,
    minute: DAILY_REMINDER_MINUTE,
    title: DAILY_REMINDER_TITLE,
    body: DAILY_REMINDER_BODY,
  };
}

export function shouldEnableReminders(
  requestedOn: boolean,
  permission: ReminderPermission,
): boolean {
  return requestedOn && permission === "granted";
}
