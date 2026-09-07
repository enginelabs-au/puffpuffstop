import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { makeProgressDay } from "./progress";
import {
  CUT_DOWN_COACH_MESSAGE,
  shouldPromptEasierCutDown,
  struggleWindowKey,
} from "./cut-down-coach";

describe("cut-down coach", () => {
  it("prompts after a few consecutive missed days", () => {
    const days = [
      makeProgressDay("2026-09-04", 12, 10, 20),
      makeProgressDay("2026-09-05", 11, 9, 20),
      makeProgressDay("2026-09-06", 10, 8, 20),
    ];
    assert.equal(shouldPromptEasierCutDown(days, "2026-09-07", 1, null), true);
    assert.match(CUT_DOWN_COACH_MESSAGE, /doing great/i);
    const key = struggleWindowKey(days, "2026-09-07");
    assert.equal(shouldPromptEasierCutDown(days, "2026-09-07", 1, key), false);
    assert.equal(shouldPromptEasierCutDown(days, "2026-09-07", 0, null), false);
  });

  it("does not prompt after one miss", () => {
    const days = [makeProgressDay("2026-09-06", 12, 10, 20)];
    assert.equal(shouldPromptEasierCutDown(days, "2026-09-07", 1, null), false);
  });
});
