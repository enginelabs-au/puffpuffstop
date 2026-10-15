import assert from "node:assert/strict";
import test from "node:test";

import {
  insertCompactPortrait,
  stripDeprecatedSystemBarStyles,
  stripOrientationRestrictions,
} from "./with-play-policies.js";

test("removes deprecated edge-to-edge theme colors", () => {
  const styles = {
    resources: {
      style: [
        {
          $: { name: "AppTheme" },
          item: [
            { $: { name: "colorPrimary" }, _: "@color/colorPrimary" },
            { $: { name: "android:statusBarColor" }, _: "@android:color/transparent" },
            { $: { name: "android:navigationBarColor" }, _: "@android:color/transparent" },
          ],
        },
      ],
    },
  };
  stripDeprecatedSystemBarStyles(styles);
  assert.deepEqual(
    styles.resources.style[0].item.map((item) => item.$.name),
    ["colorPrimary"],
  );
});

test("removes portrait and resizability locks from every activity", () => {
  const manifest = {
    manifest: {
      application: [
        {
          $: { "android:name": ".MainApplication" },
          activity: [
            {
              $: {
                "android:name": ".MainActivity",
                "android:screenOrientation": "portrait",
                "android:resizeableActivity": "false",
              },
            },
            {
              $: {
                "android:name": ".VoiceLogActivity",
                "android:exported": "false",
              },
            },
          ],
        },
      ],
    },
  };
  stripOrientationRestrictions(manifest);
  assert.equal(manifest.manifest.application[0].activity[0].$["android:screenOrientation"], undefined);
  assert.equal(manifest.manifest.application[0].activity[0].$["android:resizeableActivity"], undefined);
  assert.equal(manifest.manifest.application[0].activity[1].$["android:exported"], "false");
});

test("locks portrait only on compact screens and stays idempotent", () => {
  const source = `class MainActivity : ReactActivity() {\n  override fun onCreate(savedInstanceState: Bundle?) {\n    super.onCreate(null)\n  }\n}\n`;
  const once = insertCompactPortrait(source);
  const twice = insertCompactPortrait(once);
  assert.equal(once, twice);
  assert.match(once, /smallestScreenWidthDp < 600/);
  assert.match(once, /SCREEN_ORIENTATION_UNSPECIFIED/);
  assert.match(once, /super\.onCreate\(null\)\n    applyCompactPortrait\(\)/);
});
