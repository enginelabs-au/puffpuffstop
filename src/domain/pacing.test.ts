import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  PACING_FOLD_HINT,
  PACING_LENIENT_TIP,
  allowanceAfterUnused,
  countPuffsInWindow,
  formatNextWindowIn,
  formatPaceCountdown,
  paceRingFill,
  goalPacing,
  goalPacingCaption,
  hourAllowanceAfterUnused,
  livePacing,
  msUntilDayReset,
  paceWindowCaption,
  shouldVibrateOnPaceLapse,
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
    assert.match(PACING_FOLD_HINT, /Unused puffs roll to the next slot/);
    assert.match(PACING_LENIENT_TIP, /banked for upcoming windows/);
    assert.match(PACING_LENIENT_TIP, /borrowed from the next window/);
    assert.match(PACING_LENIENT_TIP, /long-term cut-down/);
    assert.match(PACING_LENIENT_TIP, /does not ask you to vape/);
  });

  it("still paces when the goal matches the usual day", () => {
    const pacing = goalPacing(25, 25);
    assert.equal(pacing.applies, true);
    assert.equal(pacing.perHour, 2);
    assert.equal(goalPacing(10, 0).applies, false);
    assert.equal(goalPacingCaption(goalPacing(10, 0)), "");
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
    assert.equal(live.hour.over, false);
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

  it("adds unused leftover from the previous window, not invented logs", () => {
    const pacing = goalPacing(50, 25);
    const first15 = new Date("2026-09-02T00:10:00.000Z");
    const second15 = new Date("2026-09-02T00:16:00.000Z");
    const first = livePacing(pacing, [], first15, "UTC");
    const rolled = livePacing(pacing, [], second15, "UTC");
    assert.equal(first.quarterHour.used, 0);
    assert.equal(first.quarterHour.allowance, 1);
    assert.equal(rolled.quarterHour.used, 0);
    assert.equal(rolled.quarterHour.allowance, 2);
    assert.doesNotMatch(paceWindowCaption(rolled.quarterHour), /credit/i);

    const first30 = new Date("2026-09-02T00:10:00.000Z");
    const third30 = new Date("2026-09-02T01:10:00.000Z");
    assert.equal(livePacing(pacing, [], first30, "UTC").halfHour.allowance, 1);
    assert.equal(livePacing(pacing, [], third30, "UTC").halfHour.allowance, 3);

    const hourStart = windowBounds(first15, "UTC", 60).startMs;
    const atFour = new Date("2026-09-02T01:05:00.000Z");
    const atFive = new Date("2026-09-02T02:05:00.000Z");
    const oneOfFour = livePacing(pacing, [hourStart + 3_600_000 + 1_000], atFour, "UTC");
    assert.equal(oneOfFour.hour.used, 1);
    assert.equal(oneOfFour.hour.allowance, 4);
    const afterHourLapse = livePacing(
      pacing,
      [hourStart + 3_600_000 + 1_000],
      atFive,
      "UTC",
    );
    assert.equal(afterHourLapse.hour.used, 0);
    assert.equal(afterHourLapse.hour.allowance, 5);
  });

  it("does not bank unused puffs from every empty hour since midnight", () => {
    const afternoon = new Date("2026-09-02T15:05:00.000Z");
    assert.equal(hourAllowanceAfterUnused([], afternoon, "UTC", 2, 25), 8);
    assert.equal(hourAllowanceAfterUnused([], afternoon, "UTC", 2, 3), 3);
    assert.equal(allowanceAfterUnused([], afternoon, "UTC", 15, 1, 25), 4);
  });

  it("cuts the next hour when the previous hour went over, and does not roll extra as credit", () => {
    const previousStart = windowBounds(
      new Date("2026-09-02T00:10:00.000Z"),
      "UTC",
      60,
    ).startMs;
    const nextHour = new Date("2026-09-02T01:05:00.000Z");
    const overByOne = [
      previousStart + 1_000,
      previousStart + 2_000,
      previousStart + 3_000,
    ];
    assert.equal(
      hourAllowanceAfterUnused(overByOne, nextHour, "UTC", 2, 25),
      1,
    );
    const live = livePacing(goalPacing(50, 25), overByOne, nextHour, "UTC");
    assert.equal(live.hour.used, 0);
    assert.equal(live.hour.allowance, 1);
    assert.equal(live.hour.over, false);

    const overByThree = [
      ...overByOne,
      previousStart + 4_000,
      previousStart + 5_000,
    ];
    assert.equal(
      hourAllowanceAfterUnused(overByThree, nextHour, "UTC", 2, 25),
      0,
    );
    const zeroHour = livePacing(
      goalPacing(50, 25),
      overByThree,
      nextHour,
      "UTC",
    );
    assert.equal(zeroHour.hour.allowance, 0);
    assert.equal(zeroHour.hour.open, false);
    assert.equal(zeroHour.hour.over, false);
  });

  it("marks a window over when this slot or the daily goal is exceeded", () => {
    const now = new Date("2026-09-02T00:10:00.000Z");
    const start = windowBounds(now, "UTC", 60).startMs;
    const overSlot = livePacing(
      goalPacing(50, 25),
      [start + 1_000, start + 2_000, start + 3_000],
      now,
      "UTC",
    );
    assert.equal(overSlot.hour.used, 3);
    assert.equal(overSlot.hour.allowance, 2);
    assert.equal(overSlot.hour.over, true);
    assert.equal(overSlot.hour.open, false);
    assert.equal(overSlot.quarterHour.over, true);

    const daily = Array.from({ length: 26 }, (_, index) => start + index * 100);
    const overDay = livePacing(goalPacing(50, 25), daily, now, "UTC", 26);
    assert.equal(overDay.hour.over, true);
    assert.equal(overDay.halfHour.over, true);
    assert.equal(overDay.quarterHour.over, true);
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

  it("keeps 15- and 30-minute leftovers inside the hour that is still open", () => {
    const pacing = goalPacing(50, 25);
    const start = windowBounds(new Date("2026-09-02T00:10:00.000Z"), "UTC", 60).startMs;
    const live = livePacing(
      pacing,
      [start + 1_000, start + 2_000],
      new Date("2026-09-02T00:16:00.000Z"),
      "UTC",
    );
    assert.equal(live.hour.open, false);
    assert.equal(live.quarterHour.allowance, 0);
    assert.equal(live.quarterHour.open, false);
  });

  it("vibrates when a lapsed window turns or stays green", () => {
    const pacing = goalPacing(50, 25);
    const usedFifteen = [
      windowBounds(new Date("2026-09-02T00:10:00.000Z"), "UTC", 15).startMs + 1_000,
    ];
    const yellow = livePacing(
      pacing,
      usedFifteen,
      new Date("2026-09-02T00:14:50.000Z"),
      "UTC",
    );
    const yellowToGreen = livePacing(
      pacing,
      usedFifteen,
      new Date("2026-09-02T00:15:01.000Z"),
      "UTC",
    );
    assert.equal(yellow.quarterHour.open, false);
    assert.equal(yellowToGreen.quarterHour.open, true);
    assert.equal(shouldVibrateOnPaceLapse(yellow, yellowToGreen), true);

    const green = livePacing(
      pacing,
      [],
      new Date("2026-09-02T00:14:50.000Z"),
      "UTC",
    );
    const stillGreen = livePacing(
      pacing,
      [],
      new Date("2026-09-02T00:15:01.000Z"),
      "UTC",
    );
    assert.equal(green.quarterHour.open, true);
    assert.equal(stillGreen.quarterHour.open, true);
    assert.equal(shouldVibrateOnPaceLapse(green, stillGreen), true);
  });

  it("does not vibrate when a window stays closed or only a log changes color", () => {
    const tight = goalPacing(20, 1);
    const dayPuff = [
      windowBounds(new Date("2026-09-02T00:10:00.000Z"), "UTC", 60).startMs + 1_000,
    ];
    const closed = livePacing(
      tight,
      dayPuff,
      new Date("2026-09-02T00:59:50.000Z"),
      "UTC",
    );
    const stillClosed = livePacing(
      tight,
      dayPuff,
      new Date("2026-09-02T01:00:01.000Z"),
      "UTC",
    );
    assert.equal(closed.hour.open, false);
    assert.equal(stillClosed.hour.open, false);
    assert.equal(shouldVibrateOnPaceLapse(closed, stillClosed), false);
    assert.equal(shouldVibrateOnPaceLapse(null, stillClosed), false);

    const pacing = goalPacing(50, 25);
    const start =
      windowBounds(new Date("2026-09-02T00:10:00.000Z"), "UTC", 60).startMs;
    const now = new Date("2026-09-02T00:10:00.000Z");
    const open = livePacing(pacing, [start + 1_000], now, "UTC");
    const used = livePacing(pacing, [start + 1_000, start + 2_000], now, "UTC");
    assert.equal(open.hour.open, true);
    assert.equal(used.hour.open, false);
    assert.equal(shouldVibrateOnPaceLapse(open, used), false);
  });

  it("formats a countdown without fractions", () => {
    assert.equal(formatPaceCountdown(90_000), "1:30");
    assert.equal(formatPaceCountdown(0), "0:00");
    assert.equal(formatNextWindowIn(90_000), "Next window in: 1:30");
    assert.equal(paceRingFill(1, 2), 0.5);
    assert.equal(paceRingFill(3, 2), 1);
    assert.equal(paceRingFill(0, 2), 0);
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
