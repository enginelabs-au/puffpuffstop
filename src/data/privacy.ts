import { getDailyLog, resetDailyLog } from "./daily-log-store";
import { resetDraft, getDraft } from "./onboarding-store";
import { persistNow, setHydrating } from "./persist-hook";
import { cancelPaceReminders } from "./pace-reminders";
import { cancelDailyReminder } from "./reminders";
import { getSavings, resetSavings } from "./savings-store";
import { redactHealthSecrets } from "../domain/health";
import { getHealth, resetHealth } from "./health-store";
import { getProgress, resetProgress } from "./progress-store";
import { getSettings, resetSettings } from "./settings-store";

export type PrivacyExport = {
  exportedAt: string;
  draft: ReturnType<typeof getDraft>;
  dailyLog: ReturnType<typeof getDailyLog>;
  settings: ReturnType<typeof getSettings>;
  savings: ReturnType<typeof getSavings>;
  health: ReturnType<typeof redactHealthSecrets>;
  progress: ReturnType<typeof getProgress>;
};

export function exportLocalData(now: Date = new Date()): PrivacyExport {
  return {
    exportedAt: now.toISOString(),
    draft: getDraft(),
    dailyLog: getDailyLog(),
    settings: getSettings(),
    savings: getSavings(),
    health: redactHealthSecrets(getHealth()),
    progress: getProgress(),
  };
}

export const DELETE_LOCAL_TITLE = "Delete all local data?";
export const DELETE_LOCAL_BODY =
  "This removes your plan, puff log, goal history, settings, puff savings, and connected watch data on this device. It cannot be undone.";
export const DELETE_LOCAL_KEEP = "Keep data";
export const DELETE_LOCAL_CONFIRM = "Delete";

export function formatLocalExport(data: PrivacyExport = exportLocalData()): string {
  return JSON.stringify(data, null, 2);
}

export function deleteLocalData(now: Date = new Date()): Promise<void> {
  setHydrating(true);
  try {
    resetDraft();
    resetDailyLog(now);
    resetSettings();
    resetSavings();
    resetHealth();
    resetProgress();
  } finally {
    setHydrating(false);
  }
  persistNow();
  return cancelDailyReminder().then(() => cancelPaceReminders());
}
