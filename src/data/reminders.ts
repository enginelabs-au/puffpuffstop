import {
  dailyReminder,
  shouldEnableReminders,
  type DailyReminder,
  type ReminderPermission,
} from "../domain/reminders";
import { getSettings, updateSettings } from "./settings-store";

export type ReminderDriver = {
  getPermission(): Promise<ReminderPermission>;
  requestPermission(): Promise<ReminderPermission>;
  scheduleDaily(schedule: DailyReminder): Promise<void>;
  cancel(identifier: string): Promise<void>;
};

export type MemoryReminderDriver = ReminderDriver & {
  permission: ReminderPermission;
  scheduled: DailyReminder[];
};

type ExpoNotificationsModule = {
  AndroidImportance?: { DEFAULT: number };
  SchedulableTriggerInputTypes: { DAILY: string };
  cancelScheduledNotificationAsync(identifier: string): Promise<void>;
  getPermissionsAsync(): Promise<{ status?: string; granted?: boolean }>;
  requestPermissionsAsync(options?: unknown): Promise<{
    status?: string;
    granted?: boolean;
  }>;
  scheduleNotificationAsync(request: {
    identifier?: string;
    content: { title: string; body: string };
    trigger: { type: string; hour: number; minute: number };
  }): Promise<string>;
  setNotificationChannelAsync?(
    channelId: string,
    options: { name: string; importance?: number },
  ): Promise<unknown>;
};

function normalizePermission(
  result: { status?: string; granted?: boolean } | undefined,
): ReminderPermission {
  if (result?.granted || result?.status === "granted") return "granted";
  if (result?.status === "undetermined") return "undetermined";
  return "denied";
}

export function createMemoryReminderDriver(
  permission: ReminderPermission = "granted",
): MemoryReminderDriver {
  const driver: MemoryReminderDriver = {
    permission,
    scheduled: [],
    async getPermission() {
      return driver.permission;
    },
    async requestPermission() {
      if (driver.permission === "undetermined") {
        driver.permission = "granted";
      }
      return driver.permission;
    },
    async scheduleDaily(schedule) {
      driver.scheduled = [schedule];
    },
    async cancel(identifier) {
      driver.scheduled = driver.scheduled.filter(
        (item) => item.identifier !== identifier,
      );
    },
  };
  return driver;
}

export function createExpoReminderDriver(
  Notifications: ExpoNotificationsModule,
): ReminderDriver {
  return {
    async getPermission() {
      return normalizePermission(await Notifications.getPermissionsAsync());
    },
    async requestPermission() {
      return normalizePermission(
        await Notifications.requestPermissionsAsync({
          ios: { allowAlert: true, allowBadge: false, allowSound: true },
        }),
      );
    },
    async scheduleDaily(schedule) {
      await Notifications.cancelScheduledNotificationAsync(
        schedule.identifier,
      ).catch(() => undefined);
      if (Notifications.setNotificationChannelAsync) {
        await Notifications.setNotificationChannelAsync("daily-reminders", {
          name: "Daily check-in",
          importance: Notifications.AndroidImportance?.DEFAULT,
        }).catch(() => undefined);
      }
      await Notifications.scheduleNotificationAsync({
        identifier: schedule.identifier,
        content: { title: schedule.title, body: schedule.body },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.DAILY,
          hour: schedule.hour,
          minute: schedule.minute,
        },
      });
    },
    async cancel(identifier) {
      await Notifications.cancelScheduledNotificationAsync(identifier).catch(
        () => undefined,
      );
    },
  };
}

let driver: ReminderDriver = createMemoryReminderDriver("denied");

export function setReminderDriver(next: ReminderDriver): void {
  driver = next;
}

export function resetReminderDriver(): void {
  driver = createMemoryReminderDriver("denied");
}

export async function cancelDailyReminder(): Promise<void> {
  await driver.cancel(dailyReminder().identifier);
}

export async function applyReminderPreference(
  requestedOn: boolean,
): Promise<boolean> {
  if (!requestedOn) {
    await cancelDailyReminder();
    return false;
  }

  let permission = await driver.getPermission();
  if (permission !== "granted") {
    permission = await driver.requestPermission();
  }
  if (!shouldEnableReminders(true, permission)) {
    await cancelDailyReminder();
    return false;
  }

  await driver.scheduleDaily(dailyReminder());
  return true;
}

export async function syncRemindersFromSettings(): Promise<boolean> {
  const wanted = getSettings().remindersEnabled;
  const applied = await applyReminderPreference(wanted);
  if (wanted && !applied) {
    updateSettings({ remindersEnabled: false });
  }
  return applied;
}

export async function bootReminders(): Promise<boolean> {
  try {
    const Notifications = (await import("expo-notifications")) as ExpoNotificationsModule;
    setReminderDriver(createExpoReminderDriver(Notifications));
  } catch {
    // Node tests and unsupported platforms keep the memory driver.
  }
  return syncRemindersFromSettings();
}
