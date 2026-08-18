import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { playLogHaptic, playUndoHaptic } from "./haptics";

describe("haptics", () => {
  it("no-ops in Node instead of throwing", async () => {
    await assert.doesNotReject(() => playLogHaptic());
    await assert.doesNotReject(() => playUndoHaptic());
  });
});
