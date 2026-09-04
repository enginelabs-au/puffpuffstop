import {
  SHADE_ACTION_LOG,
  SHADE_ACTION_UNDO,
  SHADE_LOG_BODY,
  SHADE_LOG_CATEGORY,
  SHADE_LOG_ID,
  SHADE_LOG_TITLE,
} from "../domain/shade-log";
import { applyQuickLog } from "./quick-log";
import {
  cancelReminder,
  presentImmediateReminder,
  reminderPermission,
} from "./reminders";
import { getSettings, updateSettings } from "./settings-store";

export async function presentShadeLog(): Promise<boolean> {
  if ((await reminderPermission()) !== "granted") return false;
  await presentImmediateReminder({
    identifier: SHADE_LOG_ID,
    date: new Date(),
    title: SHADE_LOG_TITLE,
    body: SHADE_LOG_BODY,
    categoryIdentifier: SHADE_LOG_CATEGORY,
    sticky: true,
    silent: true,
  });
  return true;
}

export async function cancelShadeLog(): Promise<void> {
  await cancelReminder(SHADE_LOG_ID);
}

export async function bootShadeLog(): Promise<boolean> {
  return presentShadeLog();
}

export function handleShadeNotificationResponse(response: {
  actionIdentifier: string;
  notification: { date?: number; request: { identifier: string } };
}): boolean {
  const identifier = response.notification.request.identifier;
  if (identifier !== SHADE_LOG_ID) return false;
  const stamp =
    typeof response.notification.date === "number"
      ? response.notification.date
      : "";
  const key = `${identifier}:${response.actionIdentifier}:${stamp}`;
  if (getSettings().lastNotificationResponseKey === key) return false;
  updateSettings({ lastNotificationResponseKey: key });
  if (response.actionIdentifier === SHADE_ACTION_LOG) {
    applyQuickLog("up");
  } else if (response.actionIdentifier === SHADE_ACTION_UNDO) {
    applyQuickLog("down");
  }
  void presentShadeLog();
  return true;
}
