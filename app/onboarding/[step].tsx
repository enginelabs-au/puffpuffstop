import { Redirect, router, useLocalSearchParams } from "expo-router";
import { useMemo, useState } from "react";
import { TextInput, View } from "react-native";

import {
  BRAND_CATALOG,
  catalogBrandById,
  catalogProductById,
  productsForBrand,
} from "../../src/data/brands";
import { CURRENCIES } from "../../src/data/currencies";
import { getDraft, updateDraft } from "../../src/data/onboarding-store";
import { getSettings } from "../../src/data/settings-store";
import { applyTimeZonePreference } from "../../src/data/time-zone-preference";
import { timeZoneOptions } from "../../src/domain/timezones";
import { HEALTH_ONBOARDING_HELPER } from "../../src/domain/health";
import {
  VOICE_EXAMPLE_HINT,
  VOICE_EXAMPLE_LOG,
  VOICE_EXAMPLE_REMOVE,
} from "../../src/domain/quick-log";
import { HealthConnectControls } from "../../src/ui/HealthConnectControls";
import { commitmentPuffs, puffsPerDay, type Period } from "../../src/domain/estimation";
import { INTERVAL_PACING_REMINDER_HELPER } from "../../src/domain/pace-reminders";
import { INTERVAL_PACING_HELPER } from "../../src/domain/pacing";
import { applyPaceReminderPreference } from "../../src/data/pace-reminders";
import { GoalPacingBreakdown } from "../../src/ui/GoalPacingBreakdown";
import {
  PUFF_DIAL_MAX,
  canContinue,
  formatAuDateInput,
  frequencyCaption,
  isOnboardingStep,
  nextStep,
  previousStep,
  type BrandKind,
  type DeviceType,
  type Motivation,
  type OnboardingDraft,
  type OnboardingStep,
  type QuitWindow,
  type Strictness,
  type Trigger,
} from "../../src/domain/onboarding";
import { radius, scaledInput, space, type, type ColorTokens } from "../../src/theme/tokens";
import { AppText } from "../../src/ui/AppText";
import { ChipGroup } from "../../src/ui/ChipGroup";
import { OnboardingFrame } from "../../src/ui/OnboardingFrame";
import { RotaryDial } from "../../src/ui/RotaryDial";
import { SelectField } from "../../src/ui/SelectField";
import { useTheme } from "../../src/ui/ThemeProvider";
import { useThemedStyles } from "../../src/ui/use-themed-styles";

const PERIODS: { value: Period; label: string }[] = [
  { value: "days", label: "day" },
  { value: "weeks", label: "week" },
  { value: "months", label: "month" },
  { value: "years", label: "year" },
];

const DURATION_PERIODS: { value: Period; label: string }[] = [
  { value: "days", label: "days" },
  { value: "weeks", label: "weeks" },
  { value: "months", label: "months" },
  { value: "years", label: "years" },
];

const DEVICES: { value: DeviceType; label: string }[] = [
  { value: "disposable", label: "Disposable" },
  { value: "pod", label: "Pod" },
  { value: "refillable", label: "Refillable" },
];

const INTERVAL_PACING_CHOICES: { value: "yes" | "no"; label: string }[] = [
  { value: "yes", label: "Yes" },
  { value: "no", label: "No" },
];

const TRIGGERS: { value: Trigger; label: string }[] = [
  { value: "wake-up", label: "When I wake up" },
  { value: "during-day", label: "During the day" },
  { value: "evening", label: "In the evening" },
  { value: "sleep", label: "When I go to sleep" },
  { value: "social", label: "Socially" },
  { value: "often", label: "Often" },
  { value: "rarely", label: "Rarely" },
  { value: "frequently", label: "Frequently" },
];

const STRICTNESS: { value: Strictness; label: string }[] = [
  { value: "chill", label: "Chill" },
  { value: "steady", label: "Steady" },
  { value: "strict", label: "Strict" },
];

const MOTIVATION: { value: Motivation; label: string }[] = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
  { value: "all-in", label: "All-in" },
];

const QUIT: { value: QuitWindow; label: string }[] = [
  { value: "few-days", label: "A few days" },
  { value: "few-weeks", label: "A few weeks" },
  { value: "few-months", label: "A few months" },
  { value: "exact-date", label: "Exact date" },
  { value: "other", label: "Other" },
  { value: "unsure", label: "I'm not sure" },
];

function goNext(step: OnboardingStep) {
  const destination = nextStep(step);
  if (destination === "plan") {
    router.push("/plan");
    return;
  }
  router.push(`/onboarding/${destination}`);
}

function goBack(step: OnboardingStep) {
  const previous = previousStep(step);
  if (!previous) return;
  router.replace(`/onboarding/${previous}`);
}

export default function OnboardingStepScreen() {
  const { color } = useTheme();
  const styles = useThemedStyles(stepStyles);
  const params = useLocalSearchParams<{ step: string }>();
  const step = params.step ?? "";
  const [draft, setDraft] = useState<OnboardingDraft>(() => getDraft());
  const [timeZone, setTimeZone] = useState(() => getSettings().timeZone);
  const zoneOptions = useMemo(() => timeZoneOptions(), []);

  const brandOptions = useMemo(
    () => [
      ...BRAND_CATALOG.map((row) => ({ value: row.id, label: row.name })),
      { value: "other", label: "Other" },
      { value: "custom", label: "Custom" },
    ],
    [],
  );

  const productOptions = useMemo(() => {
    if (!draft.catalogBrandId) return [];
    return productsForBrand(draft.catalogBrandId).map((row) => ({
      value: row.id,
      label: `${row.name} · up to ${row.claimedPuffs.toLocaleString()} puffs`,
    }));
  }, [draft.catalogBrandId]);

  const selectedProduct = draft.catalogProductId
    ? catalogProductById(draft.catalogProductId)
    : undefined;
  const nicotineOptions = selectedProduct?.confirmedNicotineMgMl ?? [];

  if (!isOnboardingStep(step)) {
    return <Redirect href="/onboarding/nickname" />;
  }

  function patch(partial: Partial<OnboardingDraft>) {
    setDraft(updateDraft(partial));
  }

  const disabled = !canContinue(step, draft);
  const selectedBrand =
    draft.brandKind === "other"
      ? "other"
      : draft.brandKind === "custom"
        ? "custom"
        : draft.catalogBrandId;
  const back = previousStep(step) ? () => goBack(step) : undefined;

  return (
    <OnboardingFrame
      title={titleFor(step)}
      helper={helperFor(step, draft)}
      continueLabel="Continue"
      continueDisabled={disabled}
      onContinue={() => {
        goNext(step);
      }}
      onBack={back}
    >
      {step === "nickname" ? (
        <TextInput
          {...scaledInput}
          accessibilityLabel="Nickname"
          placeholder="Friend"
          placeholderTextColor={color.inkMuted}
          value={draft.nickname}
          onChangeText={(nickname) => patch({ nickname })}
          style={styles.input}
        />
      ) : null}

      {step === "duration" ? (
        <>
          <RotaryDial
            accessibilityLabel="How long you have been vaping"
            value={draft.durationCount}
            onChange={(durationCount) => patch({ durationCount })}
          />
          <ChipGroup
            options={DURATION_PERIODS}
            selected={draft.durationPeriod}
            onChange={(durationPeriod) => patch({ durationPeriod })}
          />
        </>
      ) : null}

      {step === "frequency" ? (
        <>
          <RotaryDial
            accessibilityLabel="How much you vape, in puffs"
            value={draft.frequencyCount}
            onChange={(frequencyCount) => patch({ frequencyCount })}
          />
          <AppText style={styles.caption}>
            {frequencyCaption(draft.frequencyCount, draft.frequencyPeriod)}
          </AppText>
          <ChipGroup
            options={PERIODS}
            selected={draft.frequencyPeriod}
            onChange={(frequencyPeriod) => patch({ frequencyPeriod })}
          />
        </>
      ) : null}

      {step === "device" ? (
        <ChipGroup
          options={DEVICES}
          selected={draft.deviceType}
          onChange={(deviceType) => patch({ deviceType })}
        />
      ) : null}

      {step === "brand" ? (
        <>
          <ChipGroup
            options={brandOptions}
            selected={selectedBrand}
            onChange={(value) => {
              if (value === "other") {
                patch({
                  brandKind: "other",
                  catalogBrandId: null,
                  catalogProductId: null,
                  puffsPerDevice: null,
                  nicotineLabel: "",
                });
                return;
              }
              if (value === "custom") {
                patch({
                  brandKind: "custom",
                  catalogBrandId: null,
                  catalogProductId: null,
                  puffsPerDevice: null,
                  nicotineLabel: "",
                });
                return;
              }
              const row = catalogBrandById(value);
              patch({
                brandKind: "catalog" satisfies BrandKind,
                catalogBrandId: value,
                catalogProductId: null,
                otherBrandName: "",
                puffsPerDevice: row?.puffsPerStandardDevice ?? null,
                deviceType: row?.deviceType ?? draft.deviceType,
                nicotineLabel: "",
              });
            }}
          />
          {draft.brandKind === "catalog" && productOptions.length > 0 ? (
            <>
              <AppText style={styles.caption}>Which product?</AppText>
              <ChipGroup
                options={productOptions}
                selected={draft.catalogProductId}
                onChange={(productId) => {
                  const product = catalogProductById(productId);
                  patch({
                    catalogProductId: productId,
                    puffsPerDevice: product?.claimedPuffs ?? draft.puffsPerDevice,
                    deviceType: product?.deviceType ?? draft.deviceType,
                    nicotineLabel:
                      product?.confirmedNicotineMgMl.length === 1
                        ? String(product.confirmedNicotineMgMl[0])
                        : "",
                  });
                }}
              />
            </>
          ) : null}
          {draft.brandKind === "other" ? (
            <TextInput
              {...scaledInput}
              accessibilityLabel="Other brand name"
              placeholder="Brand name"
              placeholderTextColor={color.inkMuted}
              value={draft.otherBrandName}
              onChangeText={(otherBrandName) => patch({ otherBrandName })}
              style={styles.input}
            />
          ) : null}
        </>
      ) : null}

      {step === "device-math" && draft.brandKind === "custom" ? (
        <>
          <AppText style={styles.caption}>ml per puff (estimate)</AppText>
          <TextInput
            {...scaledInput}
            accessibilityLabel="Millilitres per puff"
            keyboardType="decimal-pad"
            placeholder="0.05"
            placeholderTextColor={color.inkMuted}
            value={draft.mlPerPuff === null ? "" : String(draft.mlPerPuff)}
            onChangeText={(text) => {
              const parsed = Number(text);
              patch({ mlPerPuff: text === "" || Number.isNaN(parsed) ? null : parsed });
            }}
            style={styles.input}
          />
          <AppText style={styles.caption}>Optional device size (ml)</AppText>
          <TextInput
            {...scaledInput}
            accessibilityLabel="Device millilitres"
            keyboardType="decimal-pad"
            placeholder="10"
            placeholderTextColor={color.inkMuted}
            value={draft.deviceMl === null ? "" : String(draft.deviceMl)}
            onChangeText={(text) => {
              const parsed = Number(text);
              patch({ deviceMl: text === "" || Number.isNaN(parsed) ? null : parsed });
            }}
            style={styles.input}
          />
        </>
      ) : null}

      {step === "device-math" && draft.brandKind !== "custom" ? (
        <>
          <AppText style={styles.caption}>
            {selectedProduct
              ? `${selectedProduct.name} is listed at up to ${selectedProduct.claimedPuffs.toLocaleString()} puffs. Rotate or type if yours is different.`
              : "Puffs in that vape"}
          </AppText>
          <RotaryDial
            accessibilityLabel="How many puffs that vape has"
            value={draft.puffsPerDevice ?? 0}
            max={PUFF_DIAL_MAX}
            onChange={(puffsPerDevice) => patch({ puffsPerDevice })}
          />
        </>
      ) : null}

      {step === "nicotine" ? (
        nicotineOptions.length > 0 ? (
          <ChipGroup
            options={nicotineOptions.map((mg) => ({
              value: String(mg),
              label: `${mg} mg/ml`,
            }))}
            selected={draft.nicotineLabel || null}
            onChange={(nicotineLabel) => patch({ nicotineLabel })}
          />
        ) : (
          <AppText style={styles.caption}>
            We only show nicotine strengths we can confirm for a listed product.
            Skip this if yours is unknown.
          </AppText>
        )
      ) : null}

      {step === "cost" ? (
        <>
          <SelectField
            label="Currency"
            searchable
            value={draft.currencyCode}
            options={CURRENCIES.map((row) => ({
              value: row.code,
              label: `${row.code} · ${row.name}`,
            }))}
            onChange={(currencyCode) => patch({ currencyCode })}
          />
          <TextInput
            {...scaledInput}
            accessibilityLabel="Typical device cost"
            keyboardType="decimal-pad"
            placeholder="Skip if you prefer"
            placeholderTextColor={color.inkMuted}
            value={draft.deviceCost === null ? "" : String(draft.deviceCost)}
            onChangeText={(text) => {
              const parsed = Number(text);
              patch({ deviceCost: text === "" || Number.isNaN(parsed) ? null : parsed });
            }}
            style={styles.input}
          />
        </>
      ) : null}

      {step === "triggers" ? (
        <ChipGroup
          multiple
          options={TRIGGERS}
          selected={draft.triggers}
          onChange={(value) => {
            const next = draft.triggers.includes(value)
              ? draft.triggers.filter((item) => item !== value)
              : [...draft.triggers, value];
            patch({ triggers: next });
          }}
        />
      ) : null}

      {step === "strictness" ? (
        <ChipGroup
          options={STRICTNESS}
          selected={draft.strictness}
          onChange={(strictness) => patch({ strictness })}
        />
      ) : null}

      {step === "motivation" ? (
        <ChipGroup
          options={MOTIVATION}
          selected={draft.motivation}
          onChange={(motivation) => patch({ motivation })}
        />
      ) : null}

      {step === "quit-window" ? (
        <>
          <SelectField
            label="How long until you’ve completely stopped"
            value={draft.quitWindow}
            options={QUIT}
            onChange={(quitWindow) => patch({ quitWindow })}
          />
          {draft.quitWindow === "exact-date" ? (
            <>
              <TextInput
                {...scaledInput}
                accessibilityLabel="Exact stop date, day month year"
                keyboardType="number-pad"
                placeholder="DD-MM-YYYY"
                placeholderTextColor={color.inkMuted}
                maxLength={10}
                value={draft.quitExactDate}
                onChangeText={(text) => patch({ quitExactDate: formatAuDateInput(text) })}
                style={styles.input}
              />
              <AppText style={styles.caption}>
                Day, month, year. Dashes fill in as you type.
              </AppText>
            </>
          ) : null}
          {draft.quitWindow === "other" ? (
            <>
              <RotaryDial
                accessibilityLabel="Custom stop number"
                value={draft.quitOtherCount}
                onChange={(quitOtherCount) => patch({ quitOtherCount })}
              />
              <ChipGroup
                options={PERIODS}
                selected={draft.quitOtherPeriod}
                onChange={(quitOtherPeriod) => patch({ quitOtherPeriod })}
              />
            </>
          ) : null}
        </>
      ) : null}

      {step === "timezone" ? (
        <SelectField
          label="Timezone"
          value={timeZone}
          options={zoneOptions}
          searchable
          onChange={(next) => {
            setTimeZone(applyTimeZonePreference(next));
          }}
        />
      ) : null}

      {step === "cut-down" ? (
        <>
          <RotaryDial
            accessibilityLabel="Puffs to cut down each day"
            value={draft.cutDownPerDay}
            onChange={(cutDownPerDay) => patch({ cutDownPerDay })}
          />
          <GoalPacingBreakdown
            averagePuffsPerDay={puffsPerDay(
              draft.frequencyCount,
              draft.frequencyPeriod,
            )}
            goalPuffsPerDay={commitmentPuffs(
              puffsPerDay(draft.frequencyCount, draft.frequencyPeriod),
              draft.cutDownPerDay,
            )}
          />
        </>
      ) : null}

      {step === "interval-pacing" ? (
        <>
          <GoalPacingBreakdown
            averagePuffsPerDay={puffsPerDay(
              draft.frequencyCount,
              draft.frequencyPeriod,
            )}
            goalPuffsPerDay={commitmentPuffs(
              puffsPerDay(draft.frequencyCount, draft.frequencyPeriod),
              draft.cutDownPerDay,
            )}
          />
          <ChipGroup
            options={INTERVAL_PACING_CHOICES}
            selected={
              draft.intervalPacing === true
                ? "yes"
                : draft.intervalPacing === false
                  ? "no"
                  : null
            }
            onChange={(value) => {
              if (value === "no") {
                patch({
                  intervalPacing: false,
                  intervalPacingReminders: false,
                });
                void applyPaceReminderPreference(false);
                return;
              }
              patch({ intervalPacing: true });
            }}
          />
          {draft.intervalPacing === true ? (
            <>
              <AppText style={styles.caption}>
                Lock-screen leftover notice when a slot ends unused?
              </AppText>
              <AppText style={styles.caption}>
                {INTERVAL_PACING_REMINDER_HELPER}
              </AppText>
              <ChipGroup
                options={INTERVAL_PACING_CHOICES}
                selected={
                  draft.intervalPacingReminders === true
                    ? "yes"
                    : draft.intervalPacingReminders === false
                      ? "no"
                      : null
                }
                onChange={(value) => {
                  if (value === "no") {
                    patch({ intervalPacingReminders: false });
                    void applyPaceReminderPreference(false);
                    return;
                  }
                  void applyPaceReminderPreference(true).then((applied) => {
                    patch({ intervalPacingReminders: applied });
                  });
                }}
              />
            </>
          ) : null}
        </>
      ) : null}

      {step === "quick-log" ? (
        <View style={styles.examples}>
          <AppText style={styles.example}>{VOICE_EXAMPLE_LOG}</AppText>
          <AppText style={styles.example}>{VOICE_EXAMPLE_REMOVE}</AppText>
        </View>
      ) : null}

      {step === "wearables" ? <HealthConnectControls /> : null}
    </OnboardingFrame>
  );
}

function titleFor(step: OnboardingStep): string {
  switch (step) {
    case "nickname":
      return "What should we call you?";
    case "timezone":
      return "When should a new day start?";
    case "duration":
      return "How long have you been vaping?";
    case "frequency":
      return "How much do you vape?";
    case "device":
      return "What do you use most?";
    case "brand":
      return "What vape do you use most?";
    case "device-math":
      return draftBrandMathTitle();
    case "nicotine":
      return "Confirmed nicotine strength";
    case "cost":
      return "What does one device usually cost?";
    case "triggers":
      return "When do you vape most?";
    case "strictness":
      return "How strict should we be?";
    case "motivation":
      return "How motivated are you to stop?";
    case "quit-window":
      return "How long until you’ve completely stopped?";
    case "cut-down":
      return "By how many puffs will you cut down a day?";
    case "interval-pacing":
      return "Track puffs by the hour?";
    case "quick-log":
      return "Log a puff with your voice?";
    case "wearables":
      return "Connect a watch?";
  }
}

function draftBrandMathTitle(): string {
  const draft = getDraft();
  return draft.brandKind === "custom"
    ? "How many ml per puff?"
    : "How many puffs does that vape have?";
}

function helperFor(step: OnboardingStep, draft: OnboardingDraft): string | undefined {
  switch (step) {
    case "nickname":
      return "Optional. We’ll say friend if you skip.";
    case "timezone":
      return "Your puff log resets at 11:59pm here. We picked the timezone on this phone.";
    case "duration":
      return "Rotate the dial, or tap the number to type. Pick days, weeks, months, or years.";
    case "frequency":
      return `${frequencyCaption(draft.frequencyCount, draft.frequencyPeriod)}. Rotate or type the number.`;
    case "brand":
      return "Pick a listed product so puff counts stay accurate. Not a shop.";
    case "device-math":
      return draft.brandKind === "custom"
        ? undefined
        : "This dial goes up to 999,999. Tap the number to type.";
    case "nicotine":
      return "Only strengths confirmed for the selected product.";
    case "cost":
      return "Optional. Helps later savings math. We never charge a card.";
    case "triggers":
      return "Pick any that fit. You can skip.";
    case "strictness":
      return "This sets how firm reminders and the daily cap will feel.";
    case "quit-window":
      return "Choose a listed option, an exact date, or Other.";
    case "cut-down":
      return "We’ll subtract this from your estimated daily puffs. If the goal is lower, you’ll see an hourly pace. That only tracks logs — it does not ask you to vape.";
    case "interval-pacing":
      return INTERVAL_PACING_HELPER;
    case "quick-log":
      return `${VOICE_EXAMPLE_HINT} You can read this again in Settings.`;
    case "wearables":
      return HEALTH_ONBOARDING_HELPER;
    default:
      return undefined;
  }
}

function stepStyles(color: ColorTokens) {
  return {
    input: {
      minHeight: 48,
      borderRadius: radius.md,
      backgroundColor: color.surface,
      paddingHorizontal: space.md,
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
  };
}
