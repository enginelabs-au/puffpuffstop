import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  INTERVAL_PACING_REMINDER_HELPER,
  formatPaceReminderClock,
  secondsUntilPaceReminder,
  upcomingPaceReminders,
  shouldSchedulePaceReminders,
} from "./pace-reminders";
import { goalPacing, windowBounds } from "./pacing";

describe("pace reminders", () => {
  it("schedules leftover notices unless the user turns them off", () => {
    assert.equal(shouldSchedulePaceReminders(true, true), true);
    assert.equal(shouldSchedulePaceReminders(true, false), false);
    assert.equal(shouldSchedulePaceReminders(true, null), true);
    assert.equal(shouldSchedulePaceReminders(false, true), false);
    assert.equal(shouldSchedulePaceReminders(null, true), true);
    assert.match(INTERVAL_PACING_REMINDER_HELPER, /lock screen/i);
    assert.match(INTERVAL_PACING_REMINDER_HELPER, /does not ask you to vape/);
  });

  it("notifies the next 15-minute lapse when that slot still has unused puffs", () => {
    const now = new Date("2026-09-02T00:10:00.000Z");
    const slots = upcomingPaceReminders(goalPacing(50, 25), [], now, "UTC", 0, 8);
    assert.ok(slots.length > 0);
    assert.equal(slots[0]?.fireAt, windowBounds(now, "UTC", 15).endMs);
    assert.equal(slots[0]?.kind, "15 minutes");
    assert.ok((slots[0]?.unused ?? 0) > 0);
    assert.match(slots[0]?.title ?? "", /You have 1 unused puff this 15 minutes/);
    assert.match(slots[0]?.body ?? "", /does not ask you to vape/);
    const hour = slots.find((slot) => slot.kind === "hour");
    assert.ok(hour);
    assert.ok(hour.unused > 0);
    assert.match(hour.title, /unused/);
  });

  it("still schedules a lapse that is under a second away", () => {
    const end = windowBounds(
      new Date("2026-09-02T00:10:00.000Z"),
      "UTC",
      15,
    ).endMs;
    const slots = upcomingPaceReminders(
      goalPacing(50, 25),
      [],
      new Date(end - 400),
      "UTC",
      0,
      4,
    );
    assert.equal(slots[0]?.fireAt, end);
    assert.equal(secondsUntilPaceReminder(end, end - 400), 1);
    assert.match(formatPaceReminderClock(end, "UTC"), /:/);
  });

  it("skips a lapse that has no unused puffs", () => {
    const now = new Date("2026-09-02T00:10:00.000Z");
    const start = windowBounds(now, "UTC", 60).startMs;
    const hourEnd = start + 60 * 60_000;
    const slots = upcomingPaceReminders(
      goalPacing(50, 25),
      [start + 1_000, start + 2_000],
      now,
      "UTC",
      2,
      12,
    );
    assert.equal(
      slots.filter((slot) => slot.fireAt <= hourEnd).length,
      0,
    );
  });
});
