const fs = require("fs");
const path = require("path");
const {
  AndroidConfig,
  withAndroidManifest,
  withAppDelegate,
  withDangerousMod,
  withStringsXml,
  withXcodeProject,
} = require("expo/config-plugins");

const SWIFT_FILES = ["VoiceSnapshot.swift", "PuffCountChoice.swift", "LogPuffIntent.swift"];
const KT_FILES = ["VoiceSnapshot.kt", "VoiceLogActivity.kt"];

function copyPluginFile(fromName, toPath) {
  fs.mkdirSync(path.dirname(toPath), { recursive: true });
  fs.copyFileSync(path.join(__dirname, "quick-log", fromName), toPath);
}

function withIosShortcutBootstrap(config) {
  return withAppDelegate(config, (mod) => {
    if (mod.modResults.language !== "swift") return mod;
    let src = mod.modResults.contents;
    if (!src.includes("import AppIntents")) {
      src = src.replace("internal import Expo\n", "internal import Expo\nimport AppIntents\n");
    }
    if (!src.includes("updateAppShortcutParameters")) {
      src = src.replace(
        "return super.application(application, didFinishLaunchingWithOptions: launchOptions)",
        "if #available(iOS 16.0, *) {\n      PuffPuffStopShortcuts.updateAppShortcutParameters()\n    }\n\n    return super.application(application, didFinishLaunchingWithOptions: launchOptions)",
      );
    }
    mod.modResults.contents = src;
    return mod;
  });
}

function withIosIntents(config) {
  config = withDangerousMod(config, [
    "ios",
    async (mod) => {
      const appDir = path.join(
        mod.modRequest.platformProjectRoot,
        "PuffPuffStop",
      );
      for (const name of SWIFT_FILES) {
        copyPluginFile(name, path.join(appDir, name));
      }
      return mod;
    },
  ]);

  return withXcodeProject(config, (mod) => {
    const project = mod.modResults;
    const group = project.getFirstProject().firstProject.mainGroup;
    for (const name of SWIFT_FILES) {
      const filePath = `PuffPuffStop/${name}`;
      if (!project.hasFile(filePath)) {
        project.addSourceFile(filePath, null, group);
      }
    }
    return mod;
  });
}

function withAndroidVoiceLog(config) {
  config = withDangerousMod(config, [
    "android",
    async (mod) => {
      const javaDir = path.join(
        mod.modRequest.platformProjectRoot,
        "app/src/main/java/au/com/enginelabs/puffpuffstop",
      );
      for (const name of KT_FILES) {
        copyPluginFile(name, path.join(javaDir, name));
      }
      copyPluginFile(
        "shortcuts.xml",
        path.join(
          mod.modRequest.platformProjectRoot,
          "app/src/main/res/xml/shortcuts.xml",
        ),
      );
      copyPluginFile(
        "voice_log_queries.xml",
        path.join(
          mod.modRequest.platformProjectRoot,
          "app/src/main/res/values/voice_log_queries.xml",
        ),
      );
      const staleTile = path.join(javaDir, "QuickLogTileService.kt");
      if (fs.existsSync(staleTile)) {
        fs.unlinkSync(staleTile);
      }
      return mod;
    },
  ]);

  config = withStringsXml(config, (mod) => {
    mod.modResults = AndroidConfig.Strings.setStringItem(
      [
        { $: { name: "voice_log_short" }, _: "Log puff" },
        { $: { name: "voice_log_long" }, _: "Log a puff in PuffPuffStop" },
        { $: { name: "voice_undo_short" }, _: "Undo puff" },
        { $: { name: "voice_undo_long" }, _: "Remove a puff in PuffPuffStop" },
        { $: { name: "voice_undo_all_short" }, _: "Reset today" },
        { $: { name: "voice_undo_all_long" }, _: "Reset today's log in PuffPuffStop" },
      ],
      mod.modResults,
    );
    return mod;
  });

  return withAndroidManifest(config, (mod) => {
    const manifest = mod.modResults;
    const app = AndroidConfig.Manifest.getMainApplicationOrThrow(manifest);
    app.$["android:shortcuts"] = "@xml/shortcuts";
    app.activity = app.activity ?? [];
    app.service = (app.service ?? []).filter(
      (service) => service.$?.["android:name"] !== ".QuickLogTileService",
    );
    const exists = app.activity.some(
      (activity) => activity.$?.["android:name"] === ".VoiceLogActivity",
    );
    if (!exists) {
      app.activity.push({
        $: {
          "android:name": ".VoiceLogActivity",
          "android:exported": "true",
          "android:excludeFromRecents": "true",
          "android:noHistory": "true",
          "android:taskAffinity": "",
          "android:theme": "@android:style/Theme.Translucent.NoTitleBar",
          "android:showWhenLocked": "true",
          "android:turnScreenOn": "true",
        },
        "intent-filter": [
          {
            action: [
              {
                $: {
                  "android:name": "au.com.enginelabs.puffpuffstop.LOG_PUFF",
                },
              },
            ],
            category: [
              { $: { "android:name": "android.intent.category.DEFAULT" } },
            ],
          },
          {
            action: [
              {
                $: {
                  "android:name": "au.com.enginelabs.puffpuffstop.UNDO_PUFF",
                },
              },
            ],
            category: [
              { $: { "android:name": "android.intent.category.DEFAULT" } },
            ],
          },
          {
            action: [
              {
                $: {
                  "android:name": "au.com.enginelabs.puffpuffstop.CLEAR_PUFFS",
                },
              },
            ],
            category: [
              { $: { "android:name": "android.intent.category.DEFAULT" } },
            ],
          },
        ],
      });
    }
    return mod;
  });
}

module.exports = function withQuickLog(config) {
  config = withIosIntents(config);
  config = withIosShortcutBootstrap(config);
  config = withAndroidVoiceLog(config);
  return config;
};
