import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { createFilePersistDriver } from "./file-driver";

describe("file persist driver", () => {
  it("stays unused in Node when no document directory exists", async () => {
    const driver = await createFilePersistDriver();
    assert.equal(driver, null);
  });
});
