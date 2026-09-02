import {
  PACE_REMINDER_ACTION_LOG,
  PACE_REMINDER_CATEGORY,
  PACE_REMINDER_ID_PREFIX,
  PACE_REMINDER_MAX,
  shouldSchedulePaceReminders,
  upcomingPaceReminders,
} from "../domain/pace-reminders";
import { goalPacing } from "../domain/pacing";
import { summarizePlan } from "../domain/plan-summary";
import { getDailyLog } from "./daily-log-store";
import { getDraft, updateDraft } from "./onboarding-store";
import { applyQuickLog } from "./quick-log";
import {
  bootNotificationListeners,
  cancelReminder,
  preparePaceNotifications,
  reminderPermission,
  requestReminderPermission,
  scheduleDateReminder,
} from "./reminders";
import { getSettings, updateSettings } from "./settings-store";

function paceIdentifiers(): string[] {
  return Array.from({ length: PACE_REMINDER_MAX }, (_, index) => {
    return `${PACE_REMINDER_ID_PREFIX}${String(index).padStart(2, "0")}`;
  });
}

export async function cancelPaceReminders(): Promise<void> {
  await Promise.all(paceIdentifiers().map((id) => cancelReminder(id)));
}

export function repairLeftoverNoticePreference(): boolean {
  if (getSettings().leftoverNoticeRepair) return false;
  const draft = getDraft();
  let changed = false;
  if (draft.intervalPacing !== false && draft.intervalPacingReminders !== true) {
    updateDraft({ intervalPacingReminders: true });
    changed = true;
  }
  updateSettings({ leftoverNoticeRepair: true });
  return changed;
}

export async function syncPaceReminders(): Promise<boolean> {
  repairLeftoverNoticePreference();
  const draft = getDraft();
  const wanted = shouldSchedulePaceReminders(
    draft.intervalPacing,
    draft.intervalPacingReminders,
  );
  if (!wanted) {
    await cancelPaceReminders();
    return false;
  }

  let permission = await reminderPermission();
  if (permission !== "granted") {
    permission = await requestReminderPermission();
  }
  if (permission !== "granted") {
    await cancelPaceReminders();
    return false;
  }

  await preparePaceNotifications();
  const summary = summarizePlan(draft);
  const pacing = goalPacing(summary.puffsPerDay, summary.commitment);
  const log = getDailyLog();
  const slots = upcomingPaceReminders(
    pacing,
    log.puffAt,
    new Date(),
    getSettings().timeZone,
    log.logged,
  );
  await cancelPaceReminders();
  await Promise.all(
    slots.map((slot) =>
      scheduleDateReminder({
        identifier: slot.identifier,
        date: new Date(slot.fireAt),
        title: slot.title,
        body: slot.body,
        categoryIdentifier: PACE_REMINDER_CATEGORY,
      }),
    ),
  );
  return true;
}

export async function applyPaceReminderPreference(
  requestedOn: boolean,
): Promise<boolean> {
  if (!requestedOn) {
    updateDraft({ intervalPacingReminders: false });
    await cancelPaceReminders();
    return false;
  }
  updateDraft({ intervalPacingReminders: true });
  const applied = await syncPaceReminders();
  if (!applied) {
    updateDraft({ intervalPacingReminders: false });
  }
  return applied;
}

export async function bootPaceReminders(): Promise<boolean> {
  const applied = await syncPaceReminders();
  await bootNotificationListeners(
    () => {
      void syncPaceReminders();
    },
    (response) => {
      handlePaceNotificationResponse(response);
    },
  );
  return applied;
}

export function handlePaceNotificationResponse(response: {
  actionIdentifier: string;
  notification: { request: { identifier: string } };
}): boolean {
  const identifier = response.notification.request.identifier;
  if (!identifier.startsWith(PACE_REMINDER_ID_PREFIX)) return false;
  const key = `${identifier}:${response.actionIdentifier}`;
  if (getSettings().lastNotificationResponseKey === key) return false;
  updateSettings({ lastNotificationResponseKey: key });
  if (response.actionIdentifier === PACE_REMINDER_ACTION_LOG) {
    applyQuickLog("up");
  }
  void syncPaceReminders();
  return true;
}
