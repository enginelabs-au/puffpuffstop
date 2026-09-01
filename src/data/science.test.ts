import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { ORGAN_IDS } from "../domain/organs";
import { SCIENCE_SOURCES, scienceSourcesFor } from "./science";

describe("science sources", () => {
  it("covers every organ with a peer-reviewed https link", () => {
    for (const organ of ORGAN_IDS) {
      assert.ok(scienceSourcesFor(organ).length > 0, organ);
    }
    for (const source of SCIENCE_SOURCES) {
      assert.match(source.url, /^https:\/\//);
      assert.ok(source.year >= 2020);
      assert.ok(source.organs.length > 0);
    }
  });
});
