import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { logPuff, resetDailyLog } from "./daily-log-store";
import { applyDayCycle } from "./day-cycle";
import { resetDraft, updateDraft } from "./onboarding-store";
import { getSavings, resetSavings } from "./savings-store";
import { resetSettings, updateSettings } from "./settings-store";

describe("day cycle", () => {
  it("adds estimated savings after a rolled day", () => {
    const monday = new Date(2026, 7, 17, 21);
    const tuesday = new Date(2026, 7, 18, 1);
    resetDraft();
    resetDailyLog(monday);
    resetSavings();
    resetSettings();
    updateDraft({
      brandKind: "catalog",
      puffsPerDevice: 100,
      deviceCost: 10,
    });
    updateSettings({ stakePerPuff: 0.5 });
    logPuff(3, monday);
    applyDayCycle(3, tuesday);
    assert.equal(getSavings().pot, 1);
  });

  it("uses buy frequency when a device cost is set", () => {
    const monday = new Date(2026, 7, 17, 21);
    const tuesday = new Date(2026, 7, 18, 1);
    resetDraft();
    resetDailyLog(monday);
    resetSavings();
    resetSettings();
    updateDraft({
      frequencyCount: 10,
      frequencyPeriod: "days",
      deviceCost: 40,
      deviceCostPeriod: "weeks",
    });
    applyDayCycle(10, tuesday);
    assert.ok(Math.abs(getSavings().pot - 40 / 7) < 1e-9);
  });
});
