import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  BASELINE_MAX,
  BASELINE_MIN,
  GOAL_BONUS,
  LIFETIME_YEARS,
  PUFF_DAMAGE,
  SCORE_MIN,
  clampScore,
  coreBaseline,
  dayRecovery,
  formatOrganPercent,
  isGoalCelebration,
  isOnTrack,
  localDateKey,
  organBaseline,
  organBaselines,
  organScore,
  overCapPuffs,
} from "./organs";

describe("organs", () => {
  it("keeps a few years of vaping high on a 50-year horizon", () => {
    const twoYears = 2 * 365;
    const lungs = organBaseline("lungs", twoYears, 20);
    assert.ok(lungs >= 90);
    assert.ok(lungs <= BASELINE_MAX);
    assert.equal(LIFETIME_YEARS, 50);
  });

  it("only approaches the floor after a full heavy lifetime", () => {
    const fiftyYears = 50 * 365;
    const lungs = organBaseline("lungs", fiftyYears, 400);
    assert.ok(lungs >= BASELINE_MIN);
    assert.ok(lungs <= 55);
    assert.ok(organBaseline("liver", fiftyYears, 400) > lungs);
  });

  it("keeps the core baseline inside the lifetime band", () => {
    assert.ok(coreBaseline(0, 0) <= BASELINE_MAX);
    assert.ok(coreBaseline(0, 0) >= BASELINE_MIN);
    assert.ok(coreBaseline(4000, 80) >= BASELINE_MIN);
    assert.ok(coreBaseline(4000, 80) <= BASELINE_MAX);
  });

  it("ranks lungs lower than brain and liver for the same history", () => {
    const set = organBaselines(200, 20);
    for (const value of Object.values(set)) {
      assert.ok(value >= BASELINE_MIN && value <= BASELINE_MAX);
    }
    assert.ok(set.lungs <= set.brain);
    assert.ok(set.liver >= set.brain);
  });

  it("makes one log a tiny measurable dip", () => {
    const before = organScore(94.85, 0, 20, 0);
    const after = organScore(94.85, 1, 20, 0);
    assert.ok(Math.abs(before - after - PUFF_DAMAGE) < 1e-9);
    assert.equal(PUFF_DAMAGE, 0.01);
    assert.equal(formatOrganPercent(after), "94.84");
  });

  it("damages more when a puff is over the commitment", () => {
    const under = organScore(70, 5, 12, 0);
    const over = organScore(70, 13, 12, 0);
    assert.ok(over < under);
    assert.equal(overCapPuffs(13, 12), 1);
    assert.equal(organScore(70, 1, 10, 0), clampScore(70 - PUFF_DAMAGE));
  });

  it("heals more for a met goal than a typical day's logs", () => {
    const commitment = 20;
    const afterLogs = organScore(90, commitment, commitment, 0);
    const afterGoal = organScore(90, 0, commitment, 1);
    assert.ok(dayRecovery(commitment) > commitment * PUFF_DAMAGE);
    assert.ok(afterGoal - 90 > 90 - afterLogs);
    assert.equal(dayRecovery(commitment), commitment * PUFF_DAMAGE + GOAL_BONUS);
    assert.equal(isOnTrack(20, 20), true);
    assert.equal(isOnTrack(21, 20), false);
    assert.equal(isGoalCelebration(1, 0, 20), true);
    assert.equal(isGoalCelebration(0, 0, 20), false);
  });

  it("never hits 0 from ordinary logging", () => {
    assert.equal(clampScore(-20), SCORE_MIN);
    assert.ok(organScore(90, 80, 80, 0) > 89);
  });

  it("recovers only via recovery ticks, not from being over cap", () => {
    const noRecover = organScore(70, 3, 3, 0);
    const recovered = organScore(70, 0, 3, 1);
    assert.ok(recovered > noRecover);
  });

  it("formats percents finely enough to show a single log", () => {
    assert.equal(formatOrganPercent(70), "70");
    assert.equal(formatOrganPercent(69.15), "69.15");
    assert.equal(formatOrganPercent(94.8), "94.8");
    const key = localDateKey(new Date(2026, 7, 18, 23, 59));
    assert.equal(key, "2026-08-18");
  });
});
