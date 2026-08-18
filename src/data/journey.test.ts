import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { evaluateAgeGate } from "../domain/age-gate";
import { canShowHome } from "../domain/onboarding";
import { summarizePlan } from "../domain/plan-summary";
import { logPuff, resetDailyLog } from "./daily-log-store";
import { resetDraft, updateDraft } from "./onboarding-store";
import {
  deleteLocalData,
  exportLocalData,
  formatLocalExport,
} from "./privacy";
import { getSavings, resetSavings } from "./savings-store";
import { getSettings, resetSettings } from "./settings-store";

describe("local journey", () => {
  it("walks age-gate, plan, log, export, and confirmed delete", () => {
    const now = new Date(2026, 7, 18, 12);
    resetDraft();
    resetDailyLog(now);
    resetSettings();
    resetSavings();

    assert.equal(evaluateAgeGate(false).status, "blocked");
    assert.equal(evaluateAgeGate(true).status, "allowed");

    updateDraft({
      nickname: "Sam",
      durationCount: 8,
      frequencyCount: 12,
      cutDownPerDay: 2,
    });
    assert.equal(canShowHome(updateDraft({})), true);

    const summary = summarizePlan(updateDraft({}));
    assert.ok(summary.commitment >= 0);
    assert.equal(logPuff(summary.commitment, now).logged, 1);

    const exported = exportLocalData(now);
    assert.equal(exported.draft.nickname, "Sam");
    assert.match(formatLocalExport(exported), /"logged": 1/);

    deleteLocalData(now);
    assert.equal(exportLocalData(now).draft.nickname, "");
    assert.equal(exportLocalData(now).dailyLog.logged, 0);
    assert.equal(getSettings().remindersEnabled, false);
    assert.equal(getSavings().pot, 0);
  });
});
