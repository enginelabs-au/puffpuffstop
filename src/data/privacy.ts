import { getDailyLog, resetDailyLog } from "./daily-log-store";
import { resetDraft, getDraft } from "./onboarding-store";
import { persistNow, setHydrating } from "./persist-hook";
import { cancelDailyReminder } from "./reminders";
import { getSavings, resetSavings } from "./savings-store";
import { getSettings, resetSettings } from "./settings-store";

export type PrivacyExport = {
  exportedAt: string;
  draft: ReturnType<typeof getDraft>;
  dailyLog: ReturnType<typeof getDailyLog>;
  settings: ReturnType<typeof getSettings>;
  savings: ReturnType<typeof getSavings>;
};

export function exportLocalData(now: Date = new Date()): PrivacyExport {
  return {
    exportedAt: now.toISOString(),
    draft: getDraft(),
    dailyLog: getDailyLog(),
    settings: getSettings(),
    savings: getSavings(),
  };
}

export const DELETE_LOCAL_TITLE = "Delete all local data?";
export const DELETE_LOCAL_BODY =
  "This removes your plan, puff log, settings, and puff savings on this device. It cannot be undone.";
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
  } finally {
    setHydrating(false);
  }
  persistNow();
  return cancelDailyReminder();
}
