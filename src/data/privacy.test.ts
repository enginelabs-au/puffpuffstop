import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { logPuff, resetDailyLog } from "./daily-log-store";
import { resetDraft, updateDraft } from "./onboarding-store";
import { addSavings, getSavings, resetSavings } from "./savings-store";
import { getSettings, resetSettings, updateSettings } from "./settings-store";
import { deleteLocalData, exportLocalData } from "./privacy";

describe("privacy", () => {
  it("exports and then deletes all local stores", () => {
    const now = new Date(2026, 7, 18, 12);
    resetDraft();
    resetDailyLog(now);
    resetSettings();
    resetSavings();
    updateDraft({ nickname: "Sam", durationCount: 2, frequencyCount: 10 });
    logPuff(12, now);
    updateSettings({ remindersEnabled: true, stakePerPuff: 0.2 });
    addSavings(1.5);

    const exported = exportLocalData(now);
    assert.equal(exported.draft.nickname, "Sam");
    assert.equal(exported.dailyLog.logged, 1);
    assert.equal(exported.settings.remindersEnabled, true);
    assert.equal(exported.savings.pot, 1.5);

    deleteLocalData(now);
    assert.equal(exportLocalData(now).draft.nickname, "");
    assert.equal(exportLocalData(now).dailyLog.logged, 0);
    assert.equal(getSettings().remindersEnabled, false);
    assert.equal(getSavings().pot, 0);
  });
});
