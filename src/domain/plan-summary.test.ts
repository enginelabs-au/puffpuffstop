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
      quitWindow: "few-months",
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

  it("lowers the next day's goal by the reduce-by amount", () => {
    const summary = summarizePlan(
      {
        ...emptyDraft(),
        frequencyCount: 20,
        frequencyPeriod: "days",
        cutDownPerDay: 1,
        cutDownPeriod: "days",
        cutDownStartDate: "2026-09-01",
        cutDownBase: 20,
      },
      "2026-09-02",
    );
    assert.equal(summary.commitment, 19);
  });

  it("replaces a stale usual-based cap with the daily goal from settings", () => {
    const summary = summarizePlan(
      {
        ...emptyDraft(),
        frequencyCount: 50,
        frequencyPeriod: "days",
        goalCount: 20,
        goalPeriod: "days",
        cutDownPerDay: 1,
        cutDownPeriod: "days",
        cutDownStartDate: "2026-09-01",
        cutDownBase: 50,
      },
      "2026-09-11",
    );
    assert.equal(summary.commitment, 20);
  });

  it("uses a just-set daily goal immediately, before reduce-by steps", () => {
    const summary = summarizePlan({
      ...emptyDraft(),
      frequencyCount: 50,
      frequencyPeriod: "days",
      goalCount: 18,
      goalPeriod: "days",
      cutDownPerDay: 5,
      cutDownPeriod: "days",
    });
    assert.equal(summary.commitment, 18);
  });

  it("uses the daily goal as today's cap from the day they set it", () => {
    const sameDay = summarizePlan(
      {
        ...emptyDraft(),
        frequencyCount: 50,
        frequencyPeriod: "days",
        goalCount: 18,
        goalPeriod: "days",
        cutDownPerDay: 5,
        cutDownPeriod: "days",
        cutDownStartDate: "2026-09-01",
        cutDownBase: 18,
      },
      "2026-09-01",
    );
    assert.equal(sameDay.commitment, 18);

    const nextDay = summarizePlan(
      {
        ...emptyDraft(),
        frequencyCount: 50,
        frequencyPeriod: "days",
        goalCount: 18,
        goalPeriod: "days",
        cutDownPerDay: 5,
        cutDownPeriod: "days",
        cutDownStartDate: "2026-09-01",
        cutDownBase: 18,
      },
      "2026-09-02",
    );
    assert.equal(nextDay.commitment, 13);
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
