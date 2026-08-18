import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { BRAND_CATALOG, CATALOG_BRAND_NAMES } from "./brands";

describe("brand catalog", () => {
  it("is empty in phase 0", () => {
    assert.equal(BRAND_CATALOG.length, 0);
    assert.deepEqual(BRAND_CATALOG, []);
  });

  it("reserves catalog brand names without seeding rows", () => {
    assert.deepEqual(CATALOG_BRAND_NAMES, [
      "IGET",
      "Alibarbar",
      "Elf Bar",
      "Lost Mary",
      "Geek Bar",
      "Vuse",
      "JUUL",
      "RELX",
    ]);
  });
});
