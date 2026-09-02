import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  countPuffsInWindow,
  formatPaceCountdown,
  goalPacing,
  goalPacingCaption,
  hourAllowanceAfterUnused,
  livePacing,
  msUntilDayReset,
  paceWindowCaption,
  windowBounds,
} from "./pacing";

describe("goal pacing", () => {
  it("rounds 25 daily puffs up to 2 an hour", () => {
    const pacing = goalPacing(50, 25);
    assert.equal(pacing.applies, true);
    assert.equal(pacing.perHour, 2);
    assert.equal(pacing.per30Minutes, 1);
    assert.equal(pacing.per15Minutes, 1);
    assert.match(goalPacingCaption(pacing), /2 puffs an hour/);
    assert.match(goalPacingCaption(pacing), /does not ask you to vape/);
  });

  it("hides windows when the goal is not below the usual day", () => {
    assert.equal(goalPacing(25, 25).applies, false);
    assert.equal(goalPacing(25, 25).perHour, 0);
    assert.equal(goalPacing(10, 0).applies, false);
    assert.equal(goalPacingCaption(goalPacing(25, 25)), "");
  });

  it("ceils a 1-puff goal across every window", () => {
    const pacing = goalPacing(20, 1);
    assert.equal(pacing.perHour, 1);
    assert.equal(pacing.per30Minutes, 1);
    assert.equal(pacing.per15Minutes, 1);
  });
});

describe("live pacing windows", () => {
  it("turns yellow after this hour's allowance is used", () => {
    const now = new Date("2026-09-02T00:10:00.000Z");
    const start = windowBounds(now, "UTC", 60).startMs;
    const live = livePacing(
      goalPacing(50, 25),
      [start + 1_000, start + 2_000],
      now,
      "UTC",
    );
    assert.equal(live.hour.open, false);
    assert.equal(live.hour.used, 2);
    assert.equal(live.hour.remaining, 0);
    assert.match(paceWindowCaption(live.hour), /used/);
    assert.equal(live.halfHour.open, false);
    assert.equal(live.quarterHour.open, false);
  });

  it("stays green while this hour still has room", () => {
    const now = new Date("2026-09-02T00:10:00.000Z");
    const start = windowBounds(now, "UTC", 60).startMs;
    const live = livePacing(goalPacing(50, 25), [start + 1_000], now, "UTC");
    assert.equal(live.hour.open, true);
    assert.equal(live.hour.used, 1);
    assert.equal(live.hour.remaining, 1);
    assert.match(paceWindowCaption(live.hour), /1 of 2 used/);
  });

  it("ignores puffs from the previous hour", () => {
    const now = new Date("2026-09-02T01:10:00.000Z");
    const start = windowBounds(now, "UTC", 60).startMs;
    assert.equal(countPuffsInWindow([start - 1], start, start + 3_600_000), 0);
    const live = livePacing(goalPacing(50, 25), [start - 1], now, "UTC");
    assert.equal(live.hour.used, 0);
    assert.equal(live.hour.open, true);
  });

  it("splits unused hourly puffs into this hour's 30- and 15-minute rows", () => {
    const hourStart = windowBounds(new Date("2026-09-02T00:10:00.000Z"), "UTC", 60).startMs;
    const nextHour = new Date("2026-09-02T01:05:00.000Z");
    const live = livePacing(goalPacing(50, 25), [hourStart + 1_000], nextHour, "UTC");
    assert.equal(live.hour.allowance, 3);
    assert.equal(live.hour.used, 0);
    assert.equal(live.halfHour.allowance, 2);
    assert.equal(live.quarterHour.allowance, 1);
    assert.doesNotMatch(paceWindowCaption(live.hour), /credit/i);
    const unusedHour = livePacing(goalPacing(50, 25), [], nextHour, "UTC");
    assert.equal(unusedHour.hour.allowance, 4);
    assert.equal(unusedHour.halfHour.allowance, 2);
    assert.equal(unusedHour.quarterHour.allowance, 1);
  });

  it("does not bank unused puffs from every empty hour since midnight", () => {
    const afternoon = new Date("2026-09-02T15:05:00.000Z");
    assert.equal(hourAllowanceAfterUnused([], afternoon, "UTC", 2, 25), 4);
    assert.equal(hourAllowanceAfterUnused([], afternoon, "UTC", 2, 3), 3);
  });

  it("keeps 2 an hour when the previous hour already used 2", () => {
    const previousStart = windowBounds(
      new Date("2026-09-02T00:10:00.000Z"),
      "UTC",
      60,
    ).startMs;
    const now = new Date("2026-09-02T01:05:00.000Z");
    assert.equal(
      hourAllowanceAfterUnused(
        [previousStart + 1_000, previousStart + 2_000],
        now,
        "UTC",
        2,
        25,
      ),
      2,
    );
  });

  it("does not let unused hourly puffs exceed the remaining daily goal", () => {
    const now = new Date("2026-09-02T01:05:00.000Z");
    assert.equal(hourAllowanceAfterUnused([], now, "UTC", 2, 25), 4);
    assert.equal(hourAllowanceAfterUnused([], now, "UTC", 2, 3), 3);
  });

  it("formats a countdown without fractions", () => {
    assert.equal(formatPaceCountdown(90_000), "1:30");
    assert.equal(formatPaceCountdown(0), "0:00");
  });

  it("counts down to 11:59pm when the local day rolls", () => {
    const almostMidnight = new Date("2026-09-01T13:59:00.000Z");
    const justRolled = new Date("2026-09-01T14:00:00.000Z");
    assert.equal(msUntilDayReset(almostMidnight, "Australia/Brisbane"), 60_000);
    assert.equal(formatPaceCountdown(msUntilDayReset(almostMidnight, "Australia/Brisbane")), "1:00");
    assert.equal(
      formatPaceCountdown(msUntilDayReset(justRolled, "Australia/Brisbane")),
      "24:00:00",
    );
  });
});
