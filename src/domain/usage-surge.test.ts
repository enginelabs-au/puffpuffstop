import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  USAGE_HOUR_MS,
  USAGE_SURGE_MESSAGE,
  detectUsageSurge,
  isUsageSurge,
  usageHourCounts,
} from "./usage-surge";

describe("usage surge", () => {
  it("counts the last hour against the hour before", () => {
    const now = new Date("2026-09-02T18:10:00.000Z");
    const nowMs = now.getTime();
    const counts = usageHourCounts(
      [nowMs - USAGE_HOUR_MS - 1_000, nowMs - 10_000, nowMs - 5_000],
      now,
    );
    assert.equal(counts.previousHour, 1);
    assert.equal(counts.lastHour, 2);
  });

  it("flags a noticeable pickup, not a single log or a steady hour", () => {
    assert.equal(isUsageSurge(1, 0), false);
    assert.equal(isUsageSurge(2, 0), false);
    assert.equal(isUsageSurge(3, 0), true);
    assert.equal(isUsageSurge(4, 2), true);
    assert.equal(isUsageSurge(3, 2), false);
    assert.equal(isUsageSurge(6, 5), false);
    assert.equal(isUsageSurge(10, 4), true);
  });

  it("returns the in-app copy when logs pick up", () => {
    const now = new Date("2026-09-02T18:10:00.000Z");
    const nowMs = now.getTime();
    const quiet = detectUsageSurge([nowMs - 1_000], now);
    assert.equal(quiet.active, false);
    const surge = detectUsageSurge(
      [nowMs - 50_000, nowMs - 20_000, nowMs - 1_000],
      now,
    );
    assert.equal(surge.active, true);
    assert.equal(surge.message, USAGE_SURGE_MESSAGE);
    assert.match(surge.message, /increased in the last hour/);
  });
});
