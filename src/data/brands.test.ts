import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { BRAND_CATALOG, CATALOG_BRAND_NAMES, catalogBrandById } from "./brands";

describe("brand catalog", () => {
  it("seeds estimation defaults for every reserved name", () => {
    assert.equal(BRAND_CATALOG.length, CATALOG_BRAND_NAMES.length);
    for (const name of CATALOG_BRAND_NAMES) {
      const row = BRAND_CATALOG.find((item) => item.name === name);
      assert.ok(row);
      assert.ok((row.puffsPerStandardDevice ?? 0) > 0);
    }
  });

  it("looks up a catalog row by id", () => {
    assert.equal(catalogBrandById("iget")?.name, "IGET");
    assert.equal(catalogBrandById("missing"), undefined);
  });
});
