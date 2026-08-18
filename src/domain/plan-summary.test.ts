import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { emptyDraft } from "./onboarding";
import { PLAN_DISCLAIMER, summarizePlan } from "./plan-summary";

describe("plan summary", () => {
  it("derives period totals, commitment, and optional spend", () => {
    const summary = summarizePlan({
      ...emptyDraft(),
      nickname: "Sam",
      durationCount: 2,
      durationPeriod: "years",
      frequencyCount: 70,
      frequencyPeriod: "weeks",
      brandKind: "catalog",
      puffsPerDevice: 350,
      deviceCost: 20,
      cutDownPerDay: 4,
      strictness: "steady",
      motivation: "high",
      quitWindow: "1-month",
    });

    assert.equal(summary.displayName, "Sam");
    assert.equal(summary.puffsPerDay, 10);
    assert.equal(summary.puffsPerWeek, 70);
    assert.equal(summary.puffsPerMonth, 300);
    assert.equal(summary.puffsPerYear, 3650);
    assert.equal(summary.historyDays, 730);
    assert.equal(summary.devicesPerWeek, 0.2);
    assert.equal(summary.spendPerWeek, 4);
    assert.equal(summary.commitment, 6);
    assert.equal(summary.disclaimer, PLAN_DISCLAIMER);
  });

  it("uses custom ml math when a device size is present", () => {
    const summary = summarizePlan({
      ...emptyDraft(),
      frequencyCount: 100,
      frequencyPeriod: "days",
      brandKind: "custom",
      mlPerPuff: 0.05,
      deviceMl: 10,
      cutDownPerDay: 1000,
    });

    assert.equal(summary.devicesPerWeek, 3.5);
    assert.equal(summary.commitment, 0);
  });
});
