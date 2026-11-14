import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { decimalToNumber, sanitizeDecimalText } from "./decimal-input";

describe("decimal input", () => {
  it("keeps a trailing decimal point while typing", () => {
    assert.equal(sanitizeDecimalText("0."), "0.");
    assert.equal(sanitizeDecimalText("0.05"), "0.05");
    assert.equal(sanitizeDecimalText("1.2.3"), "1.23");
    assert.equal(sanitizeDecimalText("ml 2"), "2");
    assert.equal(decimalToNumber("0."), null);
    assert.equal(decimalToNumber("0.05"), 0.05);
    assert.equal(decimalToNumber(".5"), 0.5);
    assert.equal(decimalToNumber(""), null);
  });
});
