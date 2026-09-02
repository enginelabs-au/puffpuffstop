import {
  PACE_LOG_ACTION,
  PACE_LOG_ACTION_TITLE,
  PACE_REMINDER_CATEGORY,
  PACE_REMINDER_CHANNEL,
  PACE_REMINDER_ID_PREFIX,
} from "../domain/pace-reminders";
import {
  dailyReminder,
  shouldEnableReminders,
  type DailyReminder,
  type ReminderPermission,
} from "../domain/reminders";
import { getSettings, updateSettings } from "./settings-store";

export type DateReminder = {
  identifier: string;
  date: Date;
  title: string;
  body: string;
  categoryIdentifier: string;
};

export type ReminderDriver = {
  getPermission(): Promise<ReminderPermission>;
  requestPermission(): Promise<ReminderPermission>;
  scheduleDaily(schedule: DailyReminder): Promise<void>;
  scheduleDate(schedule: DateReminder): Promise<void>;
  preparePaceNotifications(): Promise<void>;
  cancel(identifier: string): Promise<void>;
};

export type MemoryReminderDriver = ReminderDriver & {
  permission: ReminderPermission;
  scheduled: DailyReminder[];
  pace: DateReminder[];
};

type ExpoNotificationsModule = {
  AndroidImportance?: { DEFAULT: number };
  SchedulableTriggerInputTypes: { DAILY: string; DATE: string };
  cancelScheduledNotificationAsync(identifier: string): Promise<void>;
  getPermissionsAsync(): Promise<{ status?: string; granted?: boolean }>;
  requestPermissionsAsync(options?: unknown): Promise<{
    status?: string;
    granted?: boolean;
  }>;
  scheduleNotificationAsync(request: {
    identifier?: string;
    content: {
      title: string;
      body: string;
      categoryIdentifier?: string;
      sound?: boolean | string;
      vibrate?: number[];
      data?: Record<string, unknown>;
    };
    trigger:
      | { type: string; hour: number; minute: number }
      | { type: string; date: Date };
  }): Promise<string>;
  setNotificationChannelAsync?(
    channelId: string,
    options: {
      name: string;
      importance?: number;
      vibrationPattern?: number[];
      enableVibrate?: boolean;
    },
  ): Promise<unknown>;
  setNotificationCategoryAsync?(
    identifier: string,
    actions: {
      identifier: string;
      buttonTitle: string;
      options?: { opensAppToForeground?: boolean };
    }[],
  ): Promise<unknown>;
  setNotificationHandler?(handler: {
    handleNotification: (notification: {
      request: { identifier: string };
    }) => Promise<{
      shouldShowAlert?: boolean;
      shouldShowBanner?: boolean;
      shouldShowList?: boolean;
      shouldPlaySound: boolean;
      shouldSetBadge: boolean;
    }>;
  }): void;
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
    pace: [],
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
    async scheduleDate(schedule) {
      driver.pace = driver.pace.filter(
        (item) => item.identifier !== schedule.identifier,
      );
      driver.pace.push(schedule);
    },
    async preparePaceNotifications() {
      return;
    },
    async cancel(identifier) {
      driver.scheduled = driver.scheduled.filter(
        (item) => item.identifier !== identifier,
      );
      driver.pace = driver.pace.filter((item) => item.identifier !== identifier);
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
    async scheduleDate(schedule) {
      await Notifications.cancelScheduledNotificationAsync(
        schedule.identifier,
      ).catch(() => undefined);
      await Notifications.scheduleNotificationAsync({
        identifier: schedule.identifier,
        content: {
          title: schedule.title,
          body: schedule.body,
          categoryIdentifier: schedule.categoryIdentifier,
          sound: true,
          vibrate: [0, 50],
          data: { type: "pace-unused" },
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.DATE,
          date: schedule.date,
        },
      });
    },
    async preparePaceNotifications() {
      Notifications.setNotificationHandler?.({
        handleNotification: async (notification) => {
          const isPace = notification.request.identifier.startsWith(
            PACE_REMINDER_ID_PREFIX,
          );
          return {
            shouldShowAlert: !isPace,
            shouldShowBanner: !isPace,
            shouldShowList: !isPace,
            shouldPlaySound: !isPace,
            shouldSetBadge: false,
          };
        },
      });
      if (Notifications.setNotificationChannelAsync) {
        await Notifications.setNotificationChannelAsync(PACE_REMINDER_CHANNEL, {
          name: "Unused puff intervals",
          importance: Notifications.AndroidImportance?.DEFAULT,
          vibrationPattern: [0, 50],
          enableVibrate: true,
        }).catch(() => undefined);
      }
      if (Notifications.setNotificationCategoryAsync) {
        await Notifications.setNotificationCategoryAsync(PACE_REMINDER_CATEGORY, [
          {
            identifier: PACE_LOG_ACTION,
            buttonTitle: PACE_LOG_ACTION_TITLE,
            options: { opensAppToForeground: true },
          },
        ]).catch(() => undefined);
      }
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

export async function reminderPermission(): Promise<ReminderPermission> {
  return driver.getPermission();
}

export async function requestReminderPermission(): Promise<ReminderPermission> {
  return driver.requestPermission();
}

export async function scheduleDateReminder(item: DateReminder): Promise<void> {
  await driver.scheduleDate(item);
}

export async function cancelReminder(identifier: string): Promise<void> {
  await driver.cancel(identifier);
}

export async function preparePaceNotifications(): Promise<void> {
  await driver.preparePaceNotifications();
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

export async function bootNotificationListeners(
  onReceived: () => void,
  onResponse: (response: {
    actionIdentifier: string;
    notification: { request: { identifier: string } };
  }) => void,
): Promise<void> {
  try {
    const Notifications = (await import("expo-notifications")) as ExpoNotificationsModule & {
      addNotificationReceivedListener(listener: () => void): { remove(): void };
      addNotificationResponseReceivedListener(
        listener: (response: {
          actionIdentifier: string;
          notification: { request: { identifier: string } };
        }) => void,
      ): { remove(): void };
      getLastNotificationResponseAsync(): Promise<{
        actionIdentifier: string;
        notification: { request: { identifier: string } };
      } | null>;
    };
    Notifications.addNotificationReceivedListener(onReceived);
    Notifications.addNotificationResponseReceivedListener(onResponse);
    const last = await Notifications.getLastNotificationResponseAsync();
    if (last) onResponse(last);
  } catch {
    // Node tests and unsupported platforms stay silent.
  }
}
