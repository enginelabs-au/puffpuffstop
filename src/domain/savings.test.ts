import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { emptyDraft } from "./onboarding";
import {
  DEFAULT_STAKE,
  creditAmount,
  defaultStakePerPuff,
  formatMoney,
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
  });
});
