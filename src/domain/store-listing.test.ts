import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";

import {
  STORE_LISTING,
  listingViolatesForbiddenClaims,
} from "./store-listing";

describe("store listing copy", () => {
  it("states 16+ and forbids kids, medical, and wallet claims", () => {
    const text = [
      STORE_LISTING.shortDescription,
      STORE_LISTING.fullDescription,
      STORE_LISTING.ageRating,
    ].join("\n");
    assert.match(text, /16\+/);
    assert.match(text, /not a kids app/i);
    assert.match(text, /not a medical device/i);
    assert.deepEqual(listingViolatesForbiddenClaims(text), []);
  });

  it("flags a kids-app claim", () => {
    assert.ok(
      listingViolatesForbiddenClaims("A quit app for kids").includes("for kids"),
    );
  });

  it("keeps the unpublished listing drafts inside the same constraints", () => {
    const ios = readFileSync("docs/store/ios-listing.md", "utf8");
    const android = readFileSync("docs/store/android-listing.md", "utf8");
    assert.deepEqual(listingViolatesForbiddenClaims(ios), []);
    assert.deepEqual(listingViolatesForbiddenClaims(android), []);
  });
});
