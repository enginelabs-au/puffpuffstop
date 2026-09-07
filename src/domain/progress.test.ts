import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  daysInRange,
  goalStreak,
  makeProgressDay,
  mergeProgressDays,
  profileScore,
  summarizeProgress,
} from "./progress";

describe("progress totals", () => {
  it("scores only real goal days in the selected range", () => {
    const days = [
      makeProgressDay("2026-08-26", 10, 25, 50),
      makeProgressDay("2026-09-01", 20, 25, 50),
      makeProgressDay("2026-09-02", 30, 25, 50),
    ];
    const week = summarizeProgress(days, "2026-09-02", "7d");
    assert.equal(week.counted, 2);
    assert.equal(week.met, 1);
    assert.equal(week.adherence, 50);
    assert.equal(week.averageLogged, 25);
    assert.equal(week.underGoal, 5);
    assert.equal(week.savingsTotal, 0);
    assert.ok(week.points.length >= 2);
    assert.equal(profileScore(days, "2026-09-02"), 50);
    assert.equal(daysInRange(days, "2026-09-02", "7d").length, 2);
  });

  it("keeps a streak through today or yesterday", () => {
    const days = [
      makeProgressDay("2026-08-31", 10, 25, 50),
      makeProgressDay("2026-09-01", 12, 25, 50),
      makeProgressDay("2026-09-02", 8, 25, 50),
    ];
    assert.equal(goalStreak(days, "2026-09-02"), 3);
    assert.equal(
      goalStreak(
        [makeProgressDay("2026-09-01", 10, 25, 50), makeProgressDay("2026-09-02", 40, 25, 50)],
        "2026-09-02",
      ),
      1,
    );
  });

  it("replaces the same date instead of inventing a second day", () => {
    const first = makeProgressDay("2026-09-02", 2, 25, 50);
    const next = mergeProgressDays([first], makeProgressDay("2026-09-02", 7, 25, 50));
    assert.equal(next.length, 1);
    assert.equal(next[0]?.logged, 7);
    assert.equal(next[0]?.met, true);
  });

  it("tracks money saved over the selected range", () => {
    const days = [
      makeProgressDay("2026-09-01", 5, 10, 20, 2.5),
      makeProgressDay("2026-09-02", 0, 9, 20, 5.71),
    ];
    const week = summarizeProgress(days, "2026-09-02", "7d");
    assert.equal(week.savingsTotal, 8.21);
    assert.equal(week.points.at(-1)?.savedCumulative, 8.21);
  });
});
