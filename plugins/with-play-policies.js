const { AndroidConfig, withAndroidManifest, withAndroidStyles, withMainActivity } = require("expo/config-plugins");

const DEPRECATED_BAR_ATTRS = new Set([
  "android:statusBarColor",
  "android:navigationBarColor",
  "android:navigationBarDividerColor",
]);

const COMPACT_PORTRAIT = `
  private fun applyCompactPortrait() {
    requestedOrientation = if (resources.configuration.smallestScreenWidthDp < 600) {
      android.content.pm.ActivityInfo.SCREEN_ORIENTATION_PORTRAIT
    } else {
      android.content.pm.ActivityInfo.SCREEN_ORIENTATION_UNSPECIFIED
    }
  }

  override fun onConfigurationChanged(newConfig: android.content.res.Configuration) {
    super.onConfigurationChanged(newConfig)
    applyCompactPortrait()
  }
`;

function stripDeprecatedSystemBarStyles(styles) {
  const groups = styles?.resources?.style ?? [];
  for (const group of groups) {
    if (!Array.isArray(group.item)) continue;
    group.item = group.item.filter((item) => !DEPRECATED_BAR_ATTRS.has(item.$?.name));
  }
  return styles;
}

function stripOrientationRestrictions(manifest) {
  const app = AndroidConfig.Manifest.getMainApplicationOrThrow(manifest);
  for (const activity of app.activity ?? []) {
    if (!activity.$) continue;
    delete activity.$["android:screenOrientation"];
    if (activity.$["android:resizeableActivity"] === "false") {
      delete activity.$["android:resizeableActivity"];
    }
  }
  return manifest;
}

function insertCompactPortrait(source) {
  if (source.includes("applyCompactPortrait")) return source;
  let next = source.replace(
    "class MainActivity : ReactActivity() {",
    `class MainActivity : ReactActivity() {${COMPACT_PORTRAIT}`,
  );
  next = next.replace("super.onCreate(null)", "super.onCreate(null)\n    applyCompactPortrait()");
  return next;
}

function withPlayPolicies(config) {
  config = withAndroidStyles(config, (mod) => {
    mod.modResults = stripDeprecatedSystemBarStyles(mod.modResults);
    return mod;
  });
  config = withAndroidManifest(config, (mod) => {
    mod.modResults = stripOrientationRestrictions(mod.modResults);
    return mod;
  });
  config = withMainActivity(config, (mod) => {
    if (mod.modResults.language !== "kt") return mod;
    mod.modResults.contents = insertCompactPortrait(mod.modResults.contents);
    return mod;
  });
  return config;
}

module.exports = withPlayPolicies;
module.exports.stripDeprecatedSystemBarStyles = stripDeprecatedSystemBarStyles;
module.exports.stripOrientationRestrictions = stripOrientationRestrictions;
module.exports.insertCompactPortrait = insertCompactPortrait;
