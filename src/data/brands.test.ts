import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  BRAND_CATALOG,
  CATALOG_BRAND_NAMES,
  VAPE_PRODUCTS,
  catalogBrandById,
  catalogProductById,
  productsForBrand,
} from "./brands";

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

  it("lists confirmed products and nicotine only when sourced", () => {
    assert.ok(VAPE_PRODUCTS.length >= CATALOG_BRAND_NAMES.length);
    for (const brand of BRAND_CATALOG) {
      const products = productsForBrand(brand.id);
      assert.ok(products.length > 0, brand.id);
      for (const product of products) {
        assert.ok(product.claimedPuffs > 0);
        assert.ok(product.confirmedNicotineMgMl.length > 0);
        assert.ok(product.sourceNote.length > 0);
      }
    }
    assert.equal(catalogProductById("juul-pod")?.claimedPuffs, 200);
    assert.deepEqual(catalogProductById("juul-pod")?.confirmedNicotineMgMl, [35, 59]);
  });
});
