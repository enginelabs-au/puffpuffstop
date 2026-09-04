import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  USAGE_HOUR_MS,
  USAGE_SURGE_MESSAGE,
  dayHourUsageTrend,
  detectUsageEase,
  detectUsageSurge,
  hourUsageTrend,
  isUsageEase,
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

  it("treats a quieter hour as easing usage", () => {
    assert.equal(isUsageEase(1, 3), true);
    assert.equal(isUsageEase(3, 3), false);
    assert.equal(isUsageEase(1, 0), false);
    assert.equal(hourUsageTrend(4, 1), "higher");
    assert.equal(hourUsageTrend(1, 4), "lower");
    const now = new Date("2026-09-02T18:10:00.000Z");
    const nowMs = now.getTime();
    const ease = detectUsageEase(
      [nowMs - USAGE_HOUR_MS - 2_000, nowMs - USAGE_HOUR_MS - 1_000],
      now,
    );
    assert.equal(ease.active, true);
  });

  it("calls the day higher when more clock hours rose than fell", () => {
    const now = new Date("2026-09-02T03:10:00.000Z");
    const start = Date.parse("2026-09-02T00:00:00.000Z");
    const puffAt = [
      start + 1_000,
      start + USAGE_HOUR_MS + 1_000,
      start + USAGE_HOUR_MS + 2_000,
      start + 2 * USAGE_HOUR_MS + 1_000,
      start + 2 * USAGE_HOUR_MS + 2_000,
      start + 2 * USAGE_HOUR_MS + 3_000,
    ];
    const day = dayHourUsageTrend(puffAt, now, "UTC");
    assert.equal(day.trend, "higher");
    assert.ok(day.upHours > day.downHours);
  });
});
