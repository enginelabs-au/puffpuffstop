import assert from "node:assert/strict";
import test from "node:test";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const { withoutLaunchShortcutUpdate } = require("./with-quick-log.js");

test("shortcut bootstrap does not register phrases during launch", () => {
  const source = `internal import Expo
import AppIntents
import React

    factory.startReactNative(
      withModuleName: "main",
      in: window,
      launchOptions: launchOptions)

    if #available(iOS 16.0, *) {
      PuffPuffStopShortcuts.updateAppShortcutParameters()
    }

    return super.application(application, didFinishLaunchingWithOptions: launchOptions)
`;

  const next = withoutLaunchShortcutUpdate(source);
  assert.equal(next.includes("updateAppShortcutParameters"), false);
  assert.equal(next.includes("import AppIntents"), false);
  assert.equal(
    next.includes("return super.application(application, didFinishLaunchingWithOptions: launchOptions)"),
    true,
  );
});
