import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";

import { privacyPolicyHtml } from "./privacy-html";

describe("hosted privacy html", () => {
  it("repeats 16+, not medical, and local-only rules", () => {
    const html = privacyPolicyHtml();
    assert.match(html, /16\+/);
    assert.match(html, /not a medical device/i);
    assert.match(html, /not a kids app/i);
    assert.match(html, /this device/i);
    const published = readFileSync("docs/legal/privacy.html", "utf8");
    assert.match(published, /16\+/);
    assert.match(published, /not a medical device/i);
  });
});
