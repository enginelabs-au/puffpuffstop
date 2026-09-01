import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { parseVoicePending } from "./voice-pending";

describe("voice pending", () => {
  it("parses log, undo, and reset payloads", () => {
    assert.deepEqual(parseVoicePending({ action: "up", count: 40, t: "1" }), {
      action: "up",
      count: 40,
      token: "1",
      applied: false,
    });
    assert.deepEqual(parseVoicePending({ action: "down", count: 3, t: "2" }), {
      action: "down",
      count: 3,
      token: "2",
      applied: false,
    });
    assert.deepEqual(parseVoicePending({ action: "clear", count: 0, t: "3" }), {
      action: "clear",
      count: 0,
      token: "3",
      applied: false,
    });
    assert.deepEqual(parseVoicePending({ action: "undo", count: "all" }), {
      action: "clear",
      count: 0,
      token: "",
      applied: false,
    });
    assert.deepEqual(
      parseVoicePending({ action: "up", count: "all", t: "4", applied: true }),
      {
        action: "up",
        count: 1,
        token: "4",
        applied: true,
      },
    );
    assert.equal(parseVoicePending(null), null);
  });
});
