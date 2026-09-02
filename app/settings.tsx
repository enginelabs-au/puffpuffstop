import { router } from "expo-router";
import { useMemo, useState } from "react";
import {
  Alert,
  Linking,
  Pressable,
  ScrollView,
  Share,
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
import { applyReminderPreference } from "../src/data/reminders";
import {
  REDO_SETUP_BODY,
  REDO_SETUP_CANCEL,
  REDO_SETUP_CONFIRM,
  REDO_SETUP_TITLE,
  VOICE_EXAMPLE_HINT,
  VOICE_EXAMPLE_LOG,
  VOICE_EXAMPLE_REMOVE,
} from "../src/domain/quick-log";
import { getSettings, updateSettings } from "../src/data/settings-store";
import { applyTimeZonePreference } from "../src/data/time-zone-preference";
import { DAY_RESET_CAPTION, timeZoneOptions } from "../src/domain/timezones";
import { getDailyLog } from "../src/data/daily-log-store";
import { applyPaceReminderPreference } from "../src/data/pace-reminders";
import { INTERVAL_PACING_REMINDER_HELPER } from "../src/domain/pace-reminders";
import { intervalPacingStartsOpen } from "../src/domain/onboarding";
import { summarizePlan } from "../src/domain/plan-summary";
import { GoalPacingBreakdown } from "../src/ui/GoalPacingBreakdown";
import { PacingMeter } from "../src/ui/PacingMeter";
import {
  SAVINGS_DISCLAIMER,
  defaultStakePerPuff,
  formatCurrency,
} from "../src/domain/savings";
import {
  minTapTarget,
  radius,
  scaledInput,
  space,
  THEME_OPTIONS,
  type,
  type ColorTokens,
} from "../src/theme/tokens";
import { AppTabs } from "../src/ui/AppTabs";
import { AppText } from "../src/ui/AppText";
import { HealthConnectControls } from "../src/ui/HealthConnectControls";
import { ChipGroup } from "../src/ui/ChipGroup";
import { SelectField } from "../src/ui/SelectField";
import { useTheme } from "../src/ui/ThemeProvider";
import { useThemedStyles } from "../src/ui/use-themed-styles";

export default function SettingsScreen() {
  const { theme, color, setTheme } = useTheme();
  const styles = useThemedStyles(settingsStyles);
  const [draft, setDraft] = useState(getDraft);
  const [settings, setSettings] = useState(getSettings);
  const [savings, setSavings] = useState(getSavings);
  const [exportText, setExportText] = useState<string | null>(null);
  const hostedPrivacyUrl = readPrivacyPolicyUrl();
  const summary = useMemo(() => summarizePlan(draft), [draft]);
  const zoneOptions = useMemo(() => timeZoneOptions(), []);
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

        <AppText style={styles.section}>Appearance</AppText>
        <ChipGroup
          options={THEME_OPTIONS}
          selected={theme}
          onChange={(value) => {
            setTheme(value);
            setSettings(getSettings());
          }}
        />
        <AppText style={styles.caption}>
          Dark is the default. This only changes how the app looks on this
          device.
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
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Redo setup"
          onPress={() => {
            Alert.alert(REDO_SETUP_TITLE, REDO_SETUP_BODY, [
              { text: REDO_SETUP_CANCEL, style: "cancel" },
              {
                text: REDO_SETUP_CONFIRM,
                onPress: () => router.push("/onboarding/nickname"),
              },
            ]);
          }}
          style={({ pressed }) => [styles.button, pressed ? styles.pressed : null]}
        >
          <AppText style={styles.buttonLabel}>Redo setup</AppText>
        </Pressable>
        <AppText style={styles.caption}>
          Walk through onboarding again to change device, brand, or goals.
          Today’s log and savings stay.
        </AppText>

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
        <GoalPacingBreakdown
          averagePuffsPerDay={summary.puffsPerDay}
          goalPuffsPerDay={summary.commitment}
        />
        <PacingMeter
          averagePuffsPerDay={summary.puffsPerDay}
          goalPuffsPerDay={summary.commitment}
          puffAt={getDailyLog().puffAt}
          logged={getDailyLog().logged}
          timeZone={settings.timeZone}
          defaultOpen={intervalPacingStartsOpen(draft)}
        />
        <AppText style={styles.caption}>Track puffs by the hour?</AppText>
        <ChipGroup
          options={[
            { value: "yes", label: "Yes" },
            { value: "no", label: "No" },
          ]}
          selected={
            draft.intervalPacing === true
              ? "yes"
              : draft.intervalPacing === false
                ? "no"
                : null
          }
          onChange={(value) => {
            if (value === "no") {
              patchDraft({
                intervalPacing: false,
                intervalPacingReminders: false,
              });
              void applyPaceReminderPreference(false);
              return;
            }
            patchDraft({ intervalPacing: true });
          }}
        />
        <AppText style={styles.caption}>
          Yes keeps the hourly pace menu open on Home. No starts it folded.
        </AppText>
        {draft.intervalPacing !== false ? (
          <>
            <AppText style={styles.caption}>
              Lock-screen leftover notice when a slot ends unused?
            </AppText>
            <ChipGroup
              options={[
                { value: "yes", label: "Yes" },
                { value: "no", label: "No" },
              ]}
              selected={
                draft.intervalPacingReminders === true
                  ? "yes"
                  : draft.intervalPacingReminders === false
                    ? "no"
                    : null
              }
              onChange={(value) => {
                void applyPaceReminderPreference(value === "yes").then(
                  (applied) => {
                    setDraft(getDraft());
                    if (value === "yes" && !applied) {
                      patchDraft({ intervalPacingReminders: false });
                    }
                  },
                );
              }}
            />
            <AppText style={styles.caption}>
              {INTERVAL_PACING_REMINDER_HELPER} Permission is asked only if you
              choose Yes.
            </AppText>
          </>
        ) : null}

        <AppText style={styles.section}>Brand</AppText>
        <AppText style={styles.caption}>
          {draft.catalogBrandId ?? (draft.otherBrandName || "Custom / not set")}.
          Change this with Redo setup, or keep estimates here for now.
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

        <AppText style={styles.section}>Day</AppText>
        <SelectField
          label="Timezone"
          value={settings.timeZone}
          options={zoneOptions}
          searchable
          onChange={(timeZone) => {
            applyTimeZonePreference(timeZone);
            setSettings(getSettings());
            void applyPaceReminderPreference(
              getDraft().intervalPacingReminders === true,
            ).then(() => setDraft(getDraft()));
          }}
        />
        <AppText style={styles.caption}>{DAY_RESET_CAPTION}</AppText>

        <AppText style={styles.section}>Reminders</AppText>
        <View style={styles.row}>
          <AppText style={styles.bodyText}>Daily check-in</AppText>
          <Switch
            accessibilityLabel="Daily check-in reminder"
            value={settings.remindersEnabled}
            onValueChange={(remindersEnabled) => {
              setSettings((current) => ({ ...current, remindersEnabled }));
              void applyReminderPreference(remindersEnabled).then((applied) => {
                setSettings(updateSettings({ remindersEnabled: applied }));
              });
            }}
          />
        </View>
        <AppText style={styles.caption}>
          Optional 7pm reminder on this device. We ask for notification
          permission only if you turn this on. No remote or marketing push.
        </AppText>
        {draft.intervalPacing !== false ? (
          <>
            <View style={styles.row}>
              <AppText style={styles.bodyText}>Lock-screen leftover</AppText>
              <Switch
                accessibilityLabel="Lock-screen leftover puff notice"
                value={draft.intervalPacingReminders === true}
                onValueChange={(on) => {
                  void applyPaceReminderPreference(on).then(() => {
                    setDraft(getDraft());
                  });
                }}
              />
            </View>
            <AppText style={styles.caption}>
              Lock-screen leftover count when a 15, 30, or 60 minute slot ends
              unused, with a Log puff action. That is not a prompt to vape.
              Turn off anytime.
            </AppText>
          </>
        ) : null}

        <AppText style={styles.section}>Watch and Fitbit</AppText>
        <HealthConnectControls />

        <AppText style={styles.section}>Voice log</AppText>
        <View style={styles.examples}>
          <AppText style={styles.example}>{VOICE_EXAMPLE_LOG}</AppText>
          <AppText style={styles.example}>{VOICE_EXAMPLE_REMOVE}</AppText>
        </View>
        <AppText style={styles.caption}>{VOICE_EXAMPLE_HINT}</AppText>

        <AppText style={styles.section}>Puff Savings</AppText>
        <AppText style={styles.highlight}>
          {formatCurrency(savings.pot, draft.currencyCode)}
        </AppText>
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
                  setTheme(getSettings().theme);
                  setSavings(getSavings());
                  setExportText(null);
                  router.replace("/onboarding/nickname");
                },
              },
            ]);
          }}
          style={({ pressed }) => [styles.danger, pressed ? styles.pressed : null]}
        >
          <AppText style={styles.dangerLabel}>Delete all local data</AppText>
        </Pressable>

      </ScrollView>
      <AppTabs active="settings" />
    </SafeAreaView>
  );
}

function settingsStyles(color: ColorTokens) {
  return {
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
      fontWeight: "700" as const,
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
    examples: {
      gap: space.lg,
    },
    example: {
      ...type.body,
      color: color.ink,
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
      flexDirection: "row" as const,
      alignItems: "center" as const,
      justifyContent: "space-between" as const,
      minHeight: minTapTarget,
    },
    button: {
      minHeight: minTapTarget,
      borderRadius: radius.pill,
      backgroundColor: color.accentMint,
      alignItems: "center" as const,
      justifyContent: "center" as const,
      marginTop: space.sm,
    },
    buttonLabel: {
      ...type.body,
      fontWeight: "700" as const,
      color: color.ink,
    },
    danger: {
      minHeight: minTapTarget,
      borderRadius: radius.pill,
      alignItems: "center" as const,
      justifyContent: "center" as const,
      marginTop: space.sm,
    },
    dangerLabel: {
      ...type.body,
      color: color.danger,
      textDecorationLine: "underline" as const,
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
      alignItems: "center" as const,
      justifyContent: "center" as const,
      marginTop: space.md,
    },
    linkLabel: {
      ...type.body,
      color: color.accent,
    },
    pressed: {
      opacity: 0.85,
    },
  };
}
