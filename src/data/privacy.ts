import { getDailyLog, resetDailyLog } from "./daily-log-store";
import { resetDraft, getDraft } from "./onboarding-store";
import { persistNow, setHydrating } from "./persist-hook";
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

export function deleteLocalData(now: Date = new Date()): void {
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
}
