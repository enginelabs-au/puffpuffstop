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

function withoutLaunchShortcutUpdate(src) {
  return src
    .replace(
      /\n[ \t]*if #available\(iOS 16\.0, \*\) \{\n[ \t]*PuffPuffStopShortcuts\.updateAppShortcutParameters\(\)\n[ \t]*\}\n/g,
      "\n",
    )
    .replace("import AppIntents\n", "");
}

function withIosShortcutBootstrap(config) {
  return withAppDelegate(config, (mod) => {
    if (mod.modResults.language !== "swift") return mod;
    // Static shortcuts are discovered from AppShortcutsProvider. Calling
    // updateAppShortcutParameters() before launch returns makes a clean
    // App Store install abort while App Intents validates phrases.
    mod.modResults.contents = withoutLaunchShortcutUpdate(mod.modResults.contents);
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
    app["meta-data"] = app["meta-data"] ?? [];
    const shortcutMetadata = app["meta-data"].find(
      (item) => item.$?.["android:name"] === "android.app.shortcuts",
    );
    if (shortcutMetadata) {
      shortcutMetadata.$["android:resource"] = "@xml/shortcuts";
    } else {
      app["meta-data"].push({
        $: {
          "android:name": "android.app.shortcuts",
          "android:resource": "@xml/shortcuts",
        },
      });
    }
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
          "android:exported": "false",
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
    const voiceLogActivity = app.activity.find(
      (activity) => activity.$?.["android:name"] === ".VoiceLogActivity",
    );
    if (voiceLogActivity) {
      voiceLogActivity.$ = {
        ...voiceLogActivity.$,
        "android:exported": "false",
      };
    }
    return mod;
  });
}

function withQuickLog(config) {
  config = withIosIntents(config);
  config = withIosShortcutBootstrap(config);
  config = withAndroidVoiceLog(config);
  return config;
}

module.exports = withQuickLog;
module.exports.withoutLaunchShortcutUpdate = withoutLaunchShortcutUpdate;
