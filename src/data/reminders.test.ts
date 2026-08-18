import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { DAILY_REMINDER_HOUR, DAILY_REMINDER_ID } from "../domain/reminders";
import { deleteLocalData } from "./privacy";
import {
  applyReminderPreference,
  createMemoryReminderDriver,
  resetReminderDriver,
  setReminderDriver,
  syncRemindersFromSettings,
} from "./reminders";
import { getSettings, resetSettings, updateSettings } from "./settings-store";

describe("reminder preference", () => {
  it("schedules the daily check-in when permission is granted", async () => {
    const driver = createMemoryReminderDriver("granted");
    setReminderDriver(driver);
    resetSettings();

    assert.equal(await applyReminderPreference(true), true);
    assert.equal(driver.scheduled.length, 1);
    assert.equal(driver.scheduled[0]?.identifier, DAILY_REMINDER_ID);
    assert.equal(driver.scheduled[0]?.hour, DAILY_REMINDER_HOUR);
  });

  it("stays off and does not schedule when permission is denied", async () => {
    const driver = createMemoryReminderDriver("denied");
    setReminderDriver(driver);

    assert.equal(await applyReminderPreference(true), false);
    assert.equal(driver.scheduled.length, 0);
  });

  it("requests once when permission is undetermined, then schedules", async () => {
    const driver = createMemoryReminderDriver("undetermined");
    setReminderDriver(driver);

    assert.equal(await applyReminderPreference(true), true);
    assert.equal(driver.permission, "granted");
    assert.equal(driver.scheduled.length, 1);
  });

  it("cancels when the user turns reminders off", async () => {
    const driver = createMemoryReminderDriver("granted");
    setReminderDriver(driver);
    await applyReminderPreference(true);
    assert.equal(await applyReminderPreference(false), false);
    assert.equal(driver.scheduled.length, 0);
  });

  it("clears a persisted flag if permission was revoked", async () => {
    const driver = createMemoryReminderDriver("denied");
    setReminderDriver(driver);
    resetSettings();
    updateSettings({ remindersEnabled: true });

    assert.equal(await syncRemindersFromSettings(), false);
    assert.equal(getSettings().remindersEnabled, false);
    assert.equal(driver.scheduled.length, 0);
  });

  it("cancels the schedule when local data is deleted", async () => {
    const driver = createMemoryReminderDriver("granted");
    setReminderDriver(driver);
    await applyReminderPreference(true);
    await deleteLocalData(new Date(2026, 7, 18, 12));
    assert.equal(driver.scheduled.length, 0);
    resetReminderDriver();
  });
});
