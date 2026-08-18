import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";

import { APP_IDENTITY } from "./app-id";

describe("app identity", () => {
  it("locks bundle IDs used by Expo", () => {
    const app = JSON.parse(readFileSync("app.json", "utf8")) as {
      expo: {
        ios?: { bundleIdentifier?: string };
        android?: { package?: string };
        scheme?: string;
      };
    };
    assert.equal(APP_IDENTITY.iosBundleId, "au.com.enginelabs.puffpuffstop");
    assert.equal(app.expo.ios?.bundleIdentifier, APP_IDENTITY.iosBundleId);
    assert.equal(app.expo.android?.package, APP_IDENTITY.androidPackage);
    assert.equal(app.expo.scheme, APP_IDENTITY.scheme);
  });
});
