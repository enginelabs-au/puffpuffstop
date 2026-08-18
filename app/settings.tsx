import { router } from "expo-router";
import { useMemo, useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { readSyncStatus, syncStatusLabel } from "../src/config/sync";
import { getDraft, resetDraft, updateDraft } from "../src/data/onboarding-store";
import { deleteLocalData, exportLocalData } from "../src/data/privacy";
import { getSavings } from "../src/data/savings-store";
import { getSettings, updateSettings } from "../src/data/settings-store";
import { summarizePlan } from "../src/domain/plan-summary";
import {
  SAVINGS_DISCLAIMER,
  defaultStakePerPuff,
  formatMoney,
} from "../src/domain/savings";
import { color, minTapTarget, radius, space, type } from "../src/theme/tokens";

export default function SettingsScreen() {
  const [draft, setDraft] = useState(getDraft);
  const [settings, setSettings] = useState(getSettings);
  const [savings, setSavings] = useState(getSavings);
  const [exportText, setExportText] = useState<string | null>(null);
  const summary = useMemo(() => summarizePlan(draft), [draft]);
  const stake = settings.stakePerPuff ?? defaultStakePerPuff(draft);

  function patchDraft(partial: Parameters<typeof updateDraft>[0]) {
    setDraft(updateDraft(partial));
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.body}>
        <Text style={styles.title} accessibilityRole="header">
          Settings
        </Text>

        <Text style={styles.section}>Profile</Text>
        <TextInput
          accessibilityLabel="Nickname"
          value={draft.nickname}
          placeholder="Friend"
          placeholderTextColor={color.inkMuted}
          onChangeText={(nickname) => patchDraft({ nickname })}
          style={styles.input}
        />

        <Text style={styles.section}>Goals</Text>
        <Text style={styles.caption}>
          Daily commitment is {summary.commitment} puffs. Cut down by:
        </Text>
        <TextInput
          accessibilityLabel="Puffs to cut down each day"
          keyboardType="number-pad"
          value={String(draft.cutDownPerDay)}
          onChangeText={(text) => {
            const parsed = Number(text);
            patchDraft({
              cutDownPerDay: text === "" || Number.isNaN(parsed) ? 0 : parsed,
            });
          }}
          style={styles.input}
        />

        <Text style={styles.section}>Brand</Text>
        <Text style={styles.caption}>
          {draft.catalogBrandId ?? (draft.otherBrandName || "Custom / not set")}.
          Change this by restarting onboarding after delete, or keep estimates
          here for now.
        </Text>
        <TextInput
          accessibilityLabel="Typical device cost"
          keyboardType="decimal-pad"
          placeholder="Device cost"
          placeholderTextColor={color.inkMuted}
          value={draft.deviceCost === null ? "" : String(draft.deviceCost)}
          onChangeText={(text) => {
            const parsed = Number(text);
            patchDraft({
              deviceCost: text === "" || Number.isNaN(parsed) ? null : parsed,
            });
          }}
          style={styles.input}
        />

        <Text style={styles.section}>Reminders</Text>
        <View style={styles.row}>
          <Text style={styles.bodyText}>Local reminder flag</Text>
          <Switch
            accessibilityLabel="Local reminder flag"
            value={settings.remindersEnabled}
            onValueChange={(remindersEnabled) =>
              setSettings(updateSettings({ remindersEnabled }))
            }
          />
        </View>
        <Text style={styles.caption}>
          Stored on this device only. We do not send notifications yet.
        </Text>

        <Text style={styles.section}>Puff Savings</Text>
        <Text style={styles.highlight}>${formatMoney(savings.pot)}</Text>
        <Text style={styles.caption}>
          Stake per puff you stay under your cap (estimate).
        </Text>
        <TextInput
          accessibilityLabel="Stake per puff"
          keyboardType="decimal-pad"
          value={String(stake)}
          onChangeText={(text) => {
            const parsed = Number(text);
            setSettings(
              updateSettings({
                stakePerPuff: text === "" || Number.isNaN(parsed) ? null : parsed,
              }),
            );
          }}
          style={styles.input}
        />
        <Text style={styles.caption}>{SAVINGS_DISCLAIMER}</Text>

        <Text style={styles.section}>Cloud sync</Text>
        <Text style={styles.caption}>{syncStatusLabel(readSyncStatus())}</Text>

        <Text style={styles.section}>Privacy</Text>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Read privacy policy"
          onPress={() => router.push("/privacy")}
          style={({ pressed }) => [styles.button, pressed ? styles.pressed : null]}
        >
          <Text style={styles.buttonLabel}>Privacy policy</Text>
        </Pressable>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Export local data"
          onPress={() => setExportText(JSON.stringify(exportLocalData(), null, 2))}
          style={({ pressed }) => [styles.button, pressed ? styles.pressed : null]}
        >
          <Text style={styles.buttonLabel}>Export local data</Text>
        </Pressable>
        {exportText ? <Text selectable style={styles.export}>{exportText}</Text> : null}
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Delete all local data"
          onPress={() => {
            deleteLocalData();
            setDraft(resetDraft());
            setSettings(getSettings());
            setSavings(getSavings());
            setExportText(null);
            router.replace("/age-gate");
          }}
          style={({ pressed }) => [styles.danger, pressed ? styles.pressed : null]}
        >
          <Text style={styles.dangerLabel}>Delete all local data</Text>
        </Pressable>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Back to home"
          onPress={() => router.back()}
          style={styles.link}
        >
          <Text style={styles.linkLabel}>Back</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: color.bg,
  },
  body: {
    padding: space.lg,
    gap: space.sm,
    paddingBottom: space.xl,
  },
  title: {
    ...type.title,
    color: color.ink,
    marginBottom: space.sm,
  },
  section: {
    ...type.body,
    fontWeight: "700",
    color: color.ink,
    marginTop: space.md,
  },
  bodyText: {
    ...type.body,
    color: color.ink,
  },
  caption: {
    ...type.caption,
    color: color.inkMuted,
  },
  highlight: {
    ...type.title,
    fontSize: 24,
    color: color.ink,
  },
  input: {
    minHeight: 48,
    borderRadius: radius.md,
    backgroundColor: color.surface,
    paddingHorizontal: space.md,
    ...type.body,
    color: color.ink,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    minHeight: minTapTarget,
  },
  button: {
    minHeight: minTapTarget,
    borderRadius: radius.pill,
    backgroundColor: color.accentMint,
    alignItems: "center",
    justifyContent: "center",
    marginTop: space.sm,
  },
  buttonLabel: {
    ...type.body,
    fontWeight: "700",
    color: color.ink,
  },
  danger: {
    minHeight: minTapTarget,
    borderRadius: radius.pill,
    alignItems: "center",
    justifyContent: "center",
    marginTop: space.sm,
  },
  dangerLabel: {
    ...type.body,
    color: color.danger,
    textDecorationLine: "underline",
  },
  export: {
    ...type.caption,
    color: color.ink,
    backgroundColor: color.surface,
    padding: space.sm,
    borderRadius: radius.sm,
  },
  link: {
    minHeight: minTapTarget,
    alignItems: "center",
    justifyContent: "center",
    marginTop: space.md,
  },
  linkLabel: {
    ...type.body,
    color: color.accent,
  },
  pressed: {
    opacity: 0.85,
  },
});
