import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { SHADE_ACTION_LOG, SHADE_ACTION_UNDO, SHADE_LOG_ID } from "../domain/shade-log";
import { getDailyLog, resetDailyLog } from "./daily-log-store";
import { resetDraft, updateDraft } from "./onboarding-store";
import {
  createMemoryReminderDriver,
  resetReminderDriver,
  setReminderDriver,
} from "./reminders";
import { handleShadeNotificationResponse, presentShadeLog } from "./shade-log";
import { resetSettings } from "./settings-store";

describe("shade log", () => {
  it("presents a Notification Center log card when permission is granted", async () => {
    const driver = createMemoryReminderDriver("granted");
    setReminderDriver(driver);
    resetSettings();
    assert.equal(await presentShadeLog(), true);
    assert.ok(driver.pace.some((item) => item.identifier === SHADE_LOG_ID));
    resetReminderDriver();
  });

  it("logs and undoes from shade actions", () => {
    resetSettings();
    resetDraft();
    resetDailyLog(new Date("2026-09-02T00:10:00.000Z"));
    updateDraft({ durationCount: 8, frequencyCount: 12, cutDownPerDay: 1 });
    const log = {
      actionIdentifier: SHADE_ACTION_LOG,
      notification: { request: { identifier: SHADE_LOG_ID } },
    };
    assert.equal(handleShadeNotificationResponse(log), true);
    assert.equal(getDailyLog().logged, 1);
    const undo = {
      actionIdentifier: SHADE_ACTION_UNDO,
      notification: { request: { identifier: SHADE_LOG_ID } },
    };
    assert.equal(handleShadeNotificationResponse(undo), true);
    assert.equal(getDailyLog().logged, 0);
  });

  it("logs twice from later shade taps", () => {
    resetSettings();
    resetDraft();
    resetDailyLog(new Date("2026-09-02T00:10:00.000Z"));
    updateDraft({ durationCount: 8, frequencyCount: 12, cutDownPerDay: 1 });
    assert.equal(
      handleShadeNotificationResponse({
        actionIdentifier: SHADE_ACTION_LOG,
        notification: { date: 1, request: { identifier: SHADE_LOG_ID } },
      }),
      true,
    );
    assert.equal(
      handleShadeNotificationResponse({
        actionIdentifier: SHADE_ACTION_LOG,
        notification: { date: 2, request: { identifier: SHADE_LOG_ID } },
      }),
      true,
    );
    assert.equal(getDailyLog().logged, 2);
  });
});
