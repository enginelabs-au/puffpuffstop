import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { parseProgressState, recordProgressDay, resetProgress } from "./progress-store";

describe("progress store", () => {
  it("parses persisted days and ignores junk rows", () => {
    resetProgress();
    recordProgressDay({
      dateKey: "2026-09-02",
      logged: 7,
      goal: 25,
      usual: 50,
      met: true,
    });
    const parsed = parseProgressState({
      lastGoal: 25,
      lastUsual: 50,
      days: [
        { dateKey: "nope", logged: 1, goal: 2, usual: 3 },
        { dateKey: "2026-09-01", logged: 4, goal: 25, usual: 50 },
      ],
    });
    assert.equal(parsed.days.length, 1);
    assert.equal(parsed.days[0]?.dateKey, "2026-09-01");
    assert.equal(parsed.lastGoal, 25);
  });
});
