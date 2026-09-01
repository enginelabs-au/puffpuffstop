import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  CURRENCIES,
  DEFAULT_CURRENCY,
  filterCurrencies,
  isCurrencyCode,
} from "./currencies";

describe("currencies", () => {
  it("includes a searchable ISO set with an AUD default", () => {
    assert.equal(DEFAULT_CURRENCY, "AUD");
    assert.ok(CURRENCIES.length > 140);
    assert.equal(isCurrencyCode("AUD"), true);
    assert.equal(isCurrencyCode("ZZZ"), false);
    assert.ok(filterCurrencies("dollar").some((row) => row.code === "USD"));
    assert.equal(new Set(CURRENCIES.map((row) => row.code)).size, CURRENCIES.length);
  });
});
