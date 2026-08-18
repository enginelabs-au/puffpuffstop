import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { evaluateAgeGate } from "./age-gate";

describe("evaluateAgeGate", () => {
  it("allows 16+ users to continue", () => {
    assert.deepEqual(evaluateAgeGate(true), {
      status: "allowed",
      trackingAllowed: true,
      profileWriteAllowed: true,
    });
  });

  it("hard-stops under-16 users with no tracking or profile writes", () => {
    assert.deepEqual(evaluateAgeGate(false), {
      status: "blocked",
      trackingAllowed: false,
      profileWriteAllowed: false,
    });
  });
});
