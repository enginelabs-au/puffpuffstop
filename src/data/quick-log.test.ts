import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { getDailyLog, resetDailyLog } from "./daily-log-store";
import { resetDraft, updateDraft } from "./onboarding-store";
import { applyQuickLog, handleQuickLogUrl } from "./quick-log";
import { resetSettings } from "./settings-store";

describe("voice log runtime", () => {
  it("logs and undoes from a shortcut URL", () => {
    resetDraft();
    resetDailyLog(new Date(2026, 8, 1, 12));
    resetSettings();
    updateDraft({ durationCount: 8, frequencyCount: 12, cutDownPerDay: 1 });

    assert.equal(applyQuickLog("up"), "logged");
    assert.equal(getDailyLog().logged, 1);
    assert.equal(applyQuickLog("up", 3), "logged");
    assert.equal(getDailyLog().logged, 4);
    assert.equal(
      handleQuickLogUrl("puffpuffstop://quick-log?action=down&count=2"),
      "undone",
    );
    assert.equal(getDailyLog().logged, 2);
    assert.equal(handleQuickLogUrl("puffpuffstop://quick-log?action=clear"), "cleared");
    assert.equal(getDailyLog().logged, 0);
    assert.equal(applyQuickLog("up", 6), "logged");
    assert.equal(handleQuickLogUrl("puffpuffstop://quick-log?action=undo&count=2&t=1"), "undone");
    assert.equal(getDailyLog().logged, 4);
    assert.equal(handleQuickLogUrl("puffpuffstop://quick-log?action=undo&count=2&t=1"), "ignored");
    assert.equal(getDailyLog().logged, 4);
    assert.equal(handleQuickLogUrl("puffpuffstop://quick-log?action=reset&t=2"), "cleared");
    assert.equal(getDailyLog().logged, 0);
    assert.equal(handleQuickLogUrl("https://example.com"), "ignored");
  });
});
