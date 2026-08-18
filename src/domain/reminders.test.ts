import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  DAILY_REMINDER_HOUR,
  DAILY_REMINDER_ID,
  dailyReminder,
  shouldEnableReminders,
} from "./reminders";

describe("reminders", () => {
  it("locks a 19:00 local daily check-in", () => {
    const reminder = dailyReminder();
    assert.equal(reminder.identifier, DAILY_REMINDER_ID);
    assert.equal(reminder.hour, DAILY_REMINDER_HOUR);
    assert.equal(reminder.hour, 19);
    assert.equal(reminder.minute, 0);
    assert.match(reminder.title, /PuffPuffStop/);
    assert.match(reminder.body, /commitment/i);
  });

  it("enables only when the user opts in and permission is granted", () => {
    assert.equal(shouldEnableReminders(true, "granted"), true);
    assert.equal(shouldEnableReminders(true, "denied"), false);
    assert.equal(shouldEnableReminders(true, "undetermined"), false);
    assert.equal(shouldEnableReminders(false, "granted"), false);
  });
});
