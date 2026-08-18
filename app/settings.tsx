import { router } from "expo-router";
import { useMemo, useState } from "react";
import {
  Alert,
  Linking,
  Pressable,
  ScrollView,
  Share,
  StyleSheet,
  Switch,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { readPrivacyPolicyUrl } from "../src/config/env";
import { readSyncStatus, syncStatusLabel } from "../src/config/sync";
import { getDraft, resetDraft, updateDraft } from "../src/data/onboarding-store";
import {
  DELETE_LOCAL_BODY,
  DELETE_LOCAL_CONFIRM,
  DELETE_LOCAL_KEEP,
  DELETE_LOCAL_TITLE,
  deleteLocalData,
  formatLocalExport,
} from "../src/data/privacy";
import { getSavings } from "../src/data/savings-store";
import { getSettings, updateSettings } from "../src/data/settings-store";
import { summarizePlan } from "../src/domain/plan-summary";
import {
  SAVINGS_DISCLAIMER,
  defaultStakePerPuff,
  formatMoney,
} from "../src/domain/savings";
import { color, minTapTarget, radius, scaledInput, space, type } from "../src/theme/tokens";
import { AppText } from "../src/ui/AppText";

export default function SettingsScreen() {
  const [draft, setDraft] = useState(getDraft);
  const [settings, setSettings] = useState(getSettings);
  const [savings, setSavings] = useState(getSavings);
  const [exportText, setExportText] = useState<string | null>(null);
  const hostedPrivacyUrl = readPrivacyPolicyUrl();
  const summary = useMemo(() => summarizePlan(draft), [draft]);
  const stake = settings.stakePerPuff ?? defaultStakePerPuff(draft);

  function patchDraft(partial: Parameters<typeof updateDraft>[0]) {
    setDraft(updateDraft(partial));
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.body}>
        <AppText style={styles.title} accessibilityRole="header">
          Settings
        </AppText>

        <AppText style={styles.section}>Profile</AppText>
        <TextInput
          {...scaledInput}
          accessibilityLabel="Nickname"
          value={draft.nickname}
          placeholder="Friend"
          placeholderTextColor={color.inkMuted}
          onChangeText={(nickname) => patchDraft({ nickname })}
          style={styles.input}
        />

        <AppText style={styles.section}>Goals</AppText>
        <AppText style={styles.caption}>
          Daily commitment is {summary.commitment} puffs. Cut down by:
        </AppText>
        <TextInput
          {...scaledInput}
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

        <AppText style={styles.section}>Brand</AppText>
        <AppText style={styles.caption}>
          {draft.catalogBrandId ?? (draft.otherBrandName || "Custom / not set")}.
          Change this by restarting onboarding after delete, or keep estimates
          here for now.
        </AppText>
        <TextInput
          {...scaledInput}
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

        <AppText style={styles.section}>Reminders</AppText>
        <View style={styles.row}>
          <AppText style={styles.bodyText}>Local reminder flag</AppText>
          <Switch
            accessibilityLabel="Local reminder flag"
            value={settings.remindersEnabled}
            onValueChange={(remindersEnabled) =>
              setSettings(updateSettings({ remindersEnabled }))
            }
          />
        </View>
        <AppText style={styles.caption}>
          Stored on this device only. We do not send notifications yet.
        </AppText>

        <AppText style={styles.section}>Puff Savings</AppText>
        <AppText style={styles.highlight}>${formatMoney(savings.pot)}</AppText>
        <AppText style={styles.caption}>
          Stake per puff you stay under your cap (estimate).
        </AppText>
        <TextInput
          {...scaledInput}
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
        <AppText style={styles.caption}>{SAVINGS_DISCLAIMER}</AppText>

        <AppText style={styles.section}>Cloud sync</AppText>
        <AppText style={styles.caption}>{syncStatusLabel(readSyncStatus())}</AppText>

        <AppText style={styles.section}>Privacy</AppText>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Read privacy policy"
          onPress={() => router.push("/privacy")}
          style={({ pressed }) => [styles.button, pressed ? styles.pressed : null]}
        >
          <AppText style={styles.buttonLabel}>Privacy policy</AppText>
        </Pressable>
        {hostedPrivacyUrl ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Open hosted privacy policy"
            onPress={() => {
              void Linking.openURL(hostedPrivacyUrl);
            }}
            style={({ pressed }) => [styles.button, pressed ? styles.pressed : null]}
          >
            <AppText style={styles.buttonLabel}>Open hosted privacy policy</AppText>
          </Pressable>
        ) : null}
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Export local data"
          onPress={() => {
            const payload = formatLocalExport();
            void Share.share({
              message: payload,
              title: "PuffPuffStop local data",
            }).catch(() => {
              setExportText(payload);
            });
          }}
          style={({ pressed }) => [styles.button, pressed ? styles.pressed : null]}
        >
          <AppText style={styles.buttonLabel}>Export local data</AppText>
        </Pressable>
        {exportText ? <AppText selectable style={styles.export}>{exportText}</AppText> : null}
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Delete all local data"
          onPress={() => {
            Alert.alert(DELETE_LOCAL_TITLE, DELETE_LOCAL_BODY, [
              { text: DELETE_LOCAL_KEEP, style: "cancel" },
              {
                text: DELETE_LOCAL_CONFIRM,
                style: "destructive",
                onPress: () => {
                  deleteLocalData();
                  setDraft(resetDraft());
                  setSettings(getSettings());
                  setSavings(getSavings());
                  setExportText(null);
                  router.replace("/age-gate");
                },
              },
            ]);
          }}
          style={({ pressed }) => [styles.danger, pressed ? styles.pressed : null]}
        >
          <AppText style={styles.dangerLabel}>Delete all local data</AppText>
        </Pressable>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Back to home"
          onPress={() => router.back()}
          style={styles.link}
        >
          <AppText style={styles.linkLabel}>Back</AppText>
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
