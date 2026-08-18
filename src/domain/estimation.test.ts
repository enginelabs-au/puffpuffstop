import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  commitmentPuffs,
  daysIn,
  historyDays,
  puffsPerDay,
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
});
