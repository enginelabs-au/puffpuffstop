import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  BASELINE_MAX,
  BASELINE_MIN,
  LIFETIME_YEARS,
  ORGAN_RECOVERY_IN_HORIZON,
  PUFF_DAMAGE,
  RECOVERY_HORIZON_DAYS,
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
  organDayRecovery,
  organHourEase,
  organScore,
  organScores,
  overCapPuffs,
  totalOrganScore,
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

  it("heals about one to two percent over six abstinent months", () => {
    const sixMonths = RECOVERY_HORIZON_DAYS;
    const lungs = organScore(94, 0, 20, sixMonths, 0, "lungs");
    const heart = organScore(94, 0, 20, sixMonths, 0, "heart");
    assert.ok(Math.abs(lungs - 94 - ORGAN_RECOVERY_IN_HORIZON.lungs) < 1e-9);
    assert.ok(heart - 94 > lungs - 94);
    assert.ok(lungs - 94 <= 2);
    assert.ok(heart - 94 <= 2);
    assert.ok(dayRecovery() < 0.02);
    assert.ok(organDayRecovery("lungs") * sixMonths < 1.1);
    assert.equal(isOnTrack(20, 20), true);
    assert.equal(isOnTrack(21, 20), false);
    assert.equal(isGoalCelebration(1, 0, 20), true);
    assert.equal(isGoalCelebration(0, 0, 20), false);
  });

  it("does not jump from the mid-90s to 100 after one quiet day", () => {
    const afterOneDay = organScore(94.5, 0, 20, 1, 0, "lungs");
    assert.ok(afterOneDay < 95);
    assert.ok(afterOneDay - 94.5 < 0.02);
  });

  it("never hits 0 from ordinary logging", () => {
    assert.equal(clampScore(-20), SCORE_MIN);
    assert.ok(organScore(90, 80, 80, 0) > 89);
  });

  it("heals a little when an hour eases, less than a full goal day", () => {
    const idle = organScore(90, 2, 20, 0, 0, "lungs");
    const eased = organScore(90, 2, 20, 0, 1, "lungs");
    const goalDay = organScore(90, 2, 20, 1, 0, "lungs");
    assert.ok(eased > idle);
    assert.ok(goalDay > eased);
    assert.ok(Math.abs(eased - idle - organHourEase("lungs")) < 1e-9);
  });

  it("recovers only via recovery ticks, not from being over cap", () => {
    const noRecover = organScore(70, 3, 3, 0);
    const recovered = organScore(70, 0, 3, 1);
    assert.ok(recovered > noRecover);
  });

  it("averages organ scores so a log or recovery day moves the total", () => {
    const baselines = organBaselines(365, 20);
    const idle = totalOrganScore(organScores(baselines, 0, 20, 0));
    const afterLog = totalOrganScore(organScores(baselines, 1, 20, 0));
    const afterGoal = totalOrganScore(organScores(baselines, 0, 20, 1));
    assert.ok(afterLog < idle);
    assert.ok(afterGoal > idle);
    assert.equal(formatOrganPercent(idle).length > 0, true);
  });

  it("formats percents finely enough to show a single log", () => {
    assert.equal(formatOrganPercent(70), "70");
    assert.equal(formatOrganPercent(69.15), "69.15");
    assert.equal(formatOrganPercent(94.8), "94.8");
    const key = localDateKey(new Date(2026, 7, 18, 23, 59));
    assert.equal(key, "2026-08-18");
  });
});
