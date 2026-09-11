import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { emptyDraft } from "./onboarding";
import {
  DEFAULT_STAKE,
  creditAmount,
  dailyDeviceSpend,
  defaultStakePerPuff,
  estimateDaySavings,
  formatCurrency,
  formatMoney,
  purchaseDaySavings,
  puffsSaved,
} from "./savings";

describe("savings", () => {
  it("credits only puffs left under the commitment", () => {
    assert.equal(puffsSaved(4, 12), 8);
    assert.equal(puffsSaved(12, 12), 0);
    assert.equal(puffsSaved(15, 12), 0);
    assert.equal(creditAmount(8, 0.25), 2);
    assert.equal(creditAmount(8, 0), 0);
  });

  it("defaults stake from device cost when possible", () => {
    assert.equal(defaultStakePerPuff(emptyDraft()), DEFAULT_STAKE);
    assert.equal(
      defaultStakePerPuff({
        ...emptyDraft(),
        brandKind: "catalog",
        puffsPerDevice: 200,
        deviceCost: 20,
      }),
      0.1,
    );
    assert.equal(formatMoney(2), "2.00");
    assert.match(formatCurrency(2, "AUD"), /2/);
  });

  it("turns a device cost and buy period into a daily savings estimate", () => {
    assert.ok(Math.abs(dailyDeviceSpend(40, "weeks") - 40 / 7) < 1e-9);
    assert.ok(Math.abs(purchaseDaySavings(0, 10, 40, "weeks") - 40 / 7) < 1e-9);
    assert.ok(Math.abs(purchaseDaySavings(5, 10, 40, "weeks") - 20 / 7) < 1e-9);
    assert.equal(purchaseDaySavings(10, 10, 40, "weeks"), 0);
    assert.equal(purchaseDaySavings(12, 10, 40, "weeks"), 0);
    const draft = {
      ...emptyDraft(),
      frequencyCount: 10,
      frequencyPeriod: "days" as const,
      deviceCost: 40,
      deviceCostPeriod: "weeks" as const,
    };
    assert.ok(Math.abs(estimateDaySavings(draft, 0, 8, 0.5) - 40 / 7) < 1e-9);
    assert.ok(Math.abs(estimateDaySavings(draft, 5, 8, 0.5) - 20 / 7) < 1e-9);
  });
});
