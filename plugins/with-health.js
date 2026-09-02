const fs = require("fs");
const path = require("path");
const {
  AndroidConfig,
  withAndroidManifest,
  withAppBuildGradle,
  withAppDelegate,
  withDangerousMod,
  withEntitlementsPlist,
  withInfoPlist,
  withXcodeProject,
} = require("expo/config-plugins");

const USAGE =
  "PuffPuffStop reads heart rate, HRV, oxygen, and breathing around a puff log you approve. This is wellness context, not medical advice.";

function copyPluginFile(fromName, toPath) {
  fs.mkdirSync(path.dirname(toPath), { recursive: true });
  fs.copyFileSync(path.join(__dirname, "health", fromName), toPath);
}

function withIosHealth(config) {
  config = withInfoPlist(config, (mod) => {
    mod.modResults.NSHealthShareUsageDescription = USAGE;
    mod.modResults.NSHealthUpdateUsageDescription =
      "PuffPuffStop does not write workout or vape data to Apple Health.";
    return mod;
  });

  config = withEntitlementsPlist(config, (mod) => {
    mod.modResults["com.apple.developer.healthkit"] = true;
    return mod;
  });

  config = withDangerousMod(config, [
    "ios",
    async (mod) => {
      copyPluginFile(
        "HealthSnapshot.swift",
        path.join(mod.modRequest.platformProjectRoot, "PuffPuffStop", "HealthSnapshot.swift"),
      );
      return mod;
    },
  ]);

  config = withXcodeProject(config, (mod) => {
    const project = mod.modResults;
    const group = project.getFirstProject().firstProject.mainGroup;
    const filePath = "PuffPuffStop/HealthSnapshot.swift";
    if (!project.hasFile(filePath)) {
      project.addSourceFile(filePath, null, group);
    }
    return mod;
  });

  return withAppDelegate(config, (mod) => {
    if (mod.modResults.language !== "swift") return mod;
    let src = mod.modResults.contents;
    if (!src.includes("HealthSnapshot.requestAndWrite")) {
      src = src.replace(
        "return super.application(app, open: url, options: options) || RCTLinkingManager.application(app, open: url, options: options)",
        'if url.host == "health-access" || url.host == "health-refresh" {\n      HealthSnapshot.requestAndWrite()\n      if url.host == "health-refresh" { return true }\n    }\n    return super.application(app, open: url, options: options) || RCTLinkingManager.application(app, open: url, options: options)',
      );
    } else if (
      src.includes('url.host == "health-refresh"') &&
      !src.includes("if url.host == \"health-refresh\" { return true }")
    ) {
      src = src.replace(
        'if url.host == "health-access" || url.host == "health-refresh" {\n      HealthSnapshot.requestAndWrite()\n    }',
        'if url.host == "health-access" || url.host == "health-refresh" {\n      HealthSnapshot.requestAndWrite()\n      if url.host == "health-refresh" { return true }\n    }',
      );
    }
    mod.modResults.contents = src;
    return mod;
  });
}

function healthConnectViewFilter() {
  return {
    action: [{ $: { "android:name": "android.intent.action.VIEW" } }],
    category: [
      { $: { "android:name": "android.intent.category.DEFAULT" } },
      { $: { "android:name": "android.intent.category.BROWSABLE" } },
    ],
    data: [
      { $: { "android:scheme": "puffpuffstop", "android:host": "health-access" } },
      { $: { "android:scheme": "puffpuffstop", "android:host": "health-refresh" } },
    ],
  };
}

function ensureHealthConnectActivity(app) {
  const activities = app.activity ?? [];
  let activity = activities.find((item) =>
    item.$?.["android:name"]?.includes("HealthConnectActivity"),
  );
  if (!activity) {
    activity = {
      $: {
        "android:name": ".HealthConnectActivity",
        "android:exported": "true",
        "android:theme": "@android:style/Theme.Translucent.NoTitleBar",
      },
    };
    activities.push(activity);
  }
  activity["intent-filter"] = [healthConnectViewFilter()];
  app.activity = activities;
}

function withAndroidHealth(config) {
  config = withDangerousMod(config, [
    "android",
    async (mod) => {
      copyPluginFile(
        "HealthConnectActivity.kt",
        path.join(
          mod.modRequest.platformProjectRoot,
          "app/src/main/java/au/com/enginelabs/puffpuffstop/HealthConnectActivity.kt",
        ),
      );
      return mod;
    },
  ]);

  config = withAppBuildGradle(config, (mod) => {
    if (!mod.modResults.contents.includes("androidx.health.connect:connect-client")) {
      mod.modResults.contents = mod.modResults.contents.replace(
        /dependencies \{/,
        'dependencies {\n    implementation "androidx.health.connect:connect-client:1.1.0-alpha12"',
      );
    }
    return mod;
  });

  return withAndroidManifest(config, (mod) => {
    const manifest = mod.modResults;
    const app = AndroidConfig.Manifest.getMainApplicationOrThrow(manifest);
    if (!manifest.manifest.$) manifest.manifest.$ = {};
    manifest.manifest.$["xmlns:tools"] = "http://schemas.android.com/tools";
    const permissions = [
      "android.permission.health.READ_HEART_RATE",
      "android.permission.health.READ_HEART_RATE_VARIABILITY",
      "android.permission.health.READ_RESPIRATORY_RATE",
      "android.permission.health.READ_OXYGEN_SATURATION",
    ];
    const existing = new Set(
      (manifest.manifest["uses-permission"] ?? []).map((item) => item.$?.["android:name"]),
    );
    for (const name of permissions) {
      if (!existing.has(name)) {
        manifest.manifest["uses-permission"] = manifest.manifest["uses-permission"] ?? [];
        manifest.manifest["uses-permission"].push({ $: { "android:name": name } });
      }
    }
    const queries = manifest.manifest.queries ?? [];
    const hasHealthConnectQuery = queries.some((item) =>
      (item.package ?? []).some(
        (pkg) => pkg.$?.["android:name"] === "com.google.android.apps.healthdata",
      ),
    );
    if (!hasHealthConnectQuery) {
      queries.push({
        package: [{ $: { "android:name": "com.google.android.apps.healthdata" } }],
      });
      manifest.manifest.queries = queries;
    }
    ensureHealthConnectActivity(app);
    return mod;
  });
}

module.exports = function withHealth(config) {
  config = withIosHealth(config);
  return withAndroidHealth(config);
};
