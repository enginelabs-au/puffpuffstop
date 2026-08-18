import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { PRIVACY_POLICY_SECTIONS } from "./privacy-policy";

describe("privacy policy copy", () => {
  it("states 16+, not medical, local-only, and no ads", () => {
    const text = PRIVACY_POLICY_SECTIONS.map((section) => section.body).join(" ");
    assert.match(text, /16\+/);
    assert.match(text, /not a medical device/i);
    assert.match(text, /not a kids app/i);
    assert.match(text, /this device/i);
    assert.match(text, /do not show ads/i);
  });
});
