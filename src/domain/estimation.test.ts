import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  commitmentPuffs,
  daysIn,
  historyDays,
  periodsElapsed,
  puffsPerDay,
  steppedDailyGoal,
} from "./estimation";

describe("estimation", () => {
  it("converts periods to days", () => {
    assert.equal(daysIn("days"), 1);
    assert.equal(daysIn("weeks"), 7);
    assert.equal(daysIn("months"), 30);
    assert.equal(daysIn("years"), 365);
  });

  it("computes puffs per day from a frequency period", () => {
    assert.equal(puffsPerDay(70, "weeks"), 10);
    assert.equal(puffsPerDay(0, "days"), 0);
  });

  it("computes history days from a duration period", () => {
    assert.equal(historyDays(2, "months"), 60);
    assert.equal(historyDays(1, "years"), 365);
  });

  it("computes a non-negative daily commitment", () => {
    assert.equal(commitmentPuffs(20, 5), 15);
    assert.equal(commitmentPuffs(3, 10), 0);
  });

  it("steps the next day's goal by the chosen amount and period", () => {
    assert.equal(periodsElapsed("2026-09-01", "2026-09-01", "days"), 0);
    assert.equal(periodsElapsed("2026-09-01", "2026-09-02", "days"), 1);
    assert.equal(periodsElapsed("2026-09-01", "2026-09-08", "weeks"), 1);
    assert.equal(
      steppedDailyGoal({
        usual: 20,
        reduceCount: 1,
        reducePeriod: "days",
        startDateKey: "2026-09-01",
        todayKey: "2026-09-01",
        baseGoal: 20,
      }),
      20,
    );
    assert.equal(
      steppedDailyGoal({
        usual: 20,
        reduceCount: 1,
        reducePeriod: "days",
        startDateKey: "2026-09-01",
        todayKey: "2026-09-02",
        baseGoal: 20,
      }),
      19,
    );
    assert.equal(
      steppedDailyGoal({
        usual: 20,
        reduceCount: 7,
        reducePeriod: "weeks",
        startDateKey: "2026-09-01",
        todayKey: "2026-09-08",
        baseGoal: 20,
      }),
      13,
    );
    assert.equal(
      steppedDailyGoal({
        usual: 20,
        reduceCount: 4,
        reducePeriod: "days",
        startDateKey: null,
        todayKey: "2026-09-02",
      }),
      16,
    );
    assert.equal(
      steppedDailyGoal({
        usual: 20,
        reduceCount: 4,
        reducePeriod: "days",
        startDateKey: null,
        todayKey: "2026-09-02",
        baseGoal: 18,
      }),
      18,
    );
  });
});
