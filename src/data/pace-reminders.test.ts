import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  PACE_REMINDER_ACTION_LOG,
  PACE_REMINDER_ID_PREFIX,
} from "../domain/pace-reminders";
import { getDailyLog, resetDailyLog } from "./daily-log-store";
import { resetDraft, updateDraft } from "./onboarding-store";
import {
  applyPaceReminderPreference,
  handlePaceNotificationResponse,
  syncPaceReminders,
} from "./pace-reminders";
import {
  createMemoryReminderDriver,
  resetReminderDriver,
  setReminderDriver,
} from "./reminders";
import { resetSettings } from "./settings-store";

describe("pace reminder preference", () => {
  it("schedules unused-puff lapses when permission is granted", async () => {
    const driver = createMemoryReminderDriver("granted");
    setReminderDriver(driver);
    resetSettings();
    resetDraft();
    resetDailyLog(new Date("2026-09-02T00:10:00.000Z"));
    updateDraft({
      durationCount: 8,
      frequencyCount: 50,
      frequencyPeriod: "days",
      cutDownPerDay: 25,
      intervalPacing: true,
    });

    assert.equal(await applyPaceReminderPreference(true), true);
    assert.ok(driver.pace.length > 0);
    assert.ok(driver.pace[0]?.identifier.startsWith(PACE_REMINDER_ID_PREFIX));
    assert.match(driver.pace[0]?.title ?? "", /unused/);
    assert.equal(driver.pace[0]?.categoryIdentifier, "pace-unused");
  });

  it("stays off when permission is denied", async () => {
    const driver = createMemoryReminderDriver("denied");
    setReminderDriver(driver);
    resetDraft();
    updateDraft({ intervalPacing: true, intervalPacingReminders: true });
    assert.equal(await syncPaceReminders(), false);
    assert.equal(driver.pace.length, 0);
    resetReminderDriver();
  });

  it("does not log a puff from a leftover notice tap", () => {
    resetSettings();
    resetDraft();
    resetDailyLog(new Date("2026-09-02T00:10:00.000Z"));
    updateDraft({ durationCount: 8, frequencyCount: 12, cutDownPerDay: 1 });
    const response = {
      actionIdentifier: "expo.modules.notifications.actions.DEFAULT",
      notification: { request: { identifier: `${PACE_REMINDER_ID_PREFIX}00` } },
    };
    assert.equal(handlePaceNotificationResponse(response), true);
    assert.equal(getDailyLog().logged, 0);
    assert.equal(handlePaceNotificationResponse(response), false);
  });

  it("logs one puff from the leftover notice action", () => {
    resetSettings();
    resetDraft();
    resetDailyLog(new Date("2026-09-02T00:10:00.000Z"));
    updateDraft({ durationCount: 8, frequencyCount: 12, cutDownPerDay: 1 });
    const response = {
      actionIdentifier: PACE_REMINDER_ACTION_LOG,
      notification: { request: { identifier: `${PACE_REMINDER_ID_PREFIX}00` } },
    };
    assert.equal(handlePaceNotificationResponse(response), true);
    assert.equal(getDailyLog().logged, 1);
  });
});
