import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  BASELINE_MAX,
  BASELINE_MIN,
  DAY_RECOVERY,
  PUFF_DAMAGE,
  SCORE_MIN,
  clampScore,
  coreBaseline,
  formatOrganPercent,
  localDateKey,
  organBaselines,
  organScore,
  overCapPuffs,
} from "./organs";

describe("organs", () => {
  it("keeps the core baseline inside 35–85", () => {
    assert.ok(coreBaseline(0, 0) <= BASELINE_MAX);
    assert.ok(coreBaseline(0, 0) >= BASELINE_MIN);
    assert.ok(coreBaseline(4000, 80) >= BASELINE_MIN);
    assert.ok(coreBaseline(4000, 80) <= BASELINE_MAX);
  });

  it("offsets organs around the same core without leaving the band", () => {
    const set = organBaselines(200, 20);
    for (const value of Object.values(set)) {
      assert.ok(value >= BASELINE_MIN && value <= BASELINE_MAX);
    }
    assert.ok(set.lungs <= set.brain);
    assert.ok(set.liver >= set.brain);
  });

  it("damages more when a puff is over the commitment", () => {
    const under = organScore(70, 5, 12, 0);
    const over = organScore(70, 13, 12, 0);
    assert.ok(over < under);
    assert.equal(overCapPuffs(13, 12), 1);
    assert.equal(
      organScore(70, 1, 10, 0),
      clampScore(70 - PUFF_DAMAGE),
    );
  });

  it("recovers less than one puff of damage and never hits 0", () => {
    assert.ok(DAY_RECOVERY < PUFF_DAMAGE);
    assert.equal(clampScore(-20), SCORE_MIN);
    assert.equal(organScore(2, 80, 0, 0), SCORE_MIN);
  });

  it("recovers only via recovery ticks, not from being over cap", () => {
    const noRecover = organScore(70, 3, 3, 0);
    const recovered = organScore(70, 0, 3, 1);
    assert.ok(recovered > noRecover);
  });

  it("formats percents and local date keys", () => {
    assert.equal(formatOrganPercent(70), "70");
    assert.equal(formatOrganPercent(69.15), "69.2");
    const key = localDateKey(new Date(2026, 7, 18, 23, 59));
    assert.equal(key, "2026-08-18");
  });
});
