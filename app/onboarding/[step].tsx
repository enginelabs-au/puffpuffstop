import { Redirect, router, useLocalSearchParams } from "expo-router";
import { useMemo, useState } from "react";
import { StyleSheet, Text, TextInput } from "react-native";

import { BRAND_CATALOG, catalogBrandById } from "../../src/data/brands";
import { getDraft, updateDraft } from "../../src/data/onboarding-store";
import type { Period } from "../../src/domain/estimation";
import {
  canContinue,
  isOnboardingStep,
  nextStep,
  type BrandKind,
  type DeviceType,
  type Motivation,
  type OnboardingDraft,
  type OnboardingStep,
  type QuitWindow,
  type Strictness,
  type Trigger,
} from "../../src/domain/onboarding";
import { color, radius, space, type } from "../../src/theme/tokens";
import { ChipGroup } from "../../src/ui/ChipGroup";
import { OnboardingFrame } from "../../src/ui/OnboardingFrame";
import { RotaryDial } from "../../src/ui/RotaryDial";

const PERIODS: { value: Period; label: string }[] = [
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

const NICOTINE = ["0", "3", "5", "20", "50", "Other"];

const TRIGGERS: { value: Trigger; label: string }[] = [
  { value: "morning", label: "Morning" },
  { value: "school-work", label: "School / work" },
  { value: "evenings", label: "Evenings" },
  { value: "stressed", label: "When stressed" },
  { value: "bored", label: "Bored" },
  { value: "social", label: "Social" },
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
  { value: "2-weeks", label: "2 weeks" },
  { value: "1-month", label: "1 month" },
  { value: "3-months", label: "3 months" },
  { value: "6-months", label: "6 months" },
  { value: "unsure", label: "I’m not sure" },
];

function goNext(step: OnboardingStep) {
  const destination = nextStep(step);
  if (destination === "plan") {
    router.push("/plan");
    return;
  }
  router.push(`/onboarding/${destination}`);
}

export default function OnboardingStepScreen() {
  const params = useLocalSearchParams<{ step: string }>();
  const step = params.step ?? "";
  const [draft, setDraft] = useState<OnboardingDraft>(() => getDraft());

  const brandOptions = useMemo(
    () => [
      ...BRAND_CATALOG.map((row) => ({ value: row.id, label: row.name })),
      { value: "other", label: "Other" },
      { value: "custom", label: "Custom" },
    ],
    [],
  );

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

  return (
    <OnboardingFrame
      title={titleFor(step)}
      helper={helperFor(step)}
      continueDisabled={disabled}
      onContinue={() => goNext(step)}
    >
      {step === "nickname" ? (
        <TextInput
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
            options={PERIODS}
            selected={draft.durationPeriod}
            onChange={(durationPeriod) => patch({ durationPeriod })}
          />
        </>
      ) : null}

      {step === "frequency" ? (
        <>
          <RotaryDial
            accessibilityLabel="How often you vape, in puffs"
            value={draft.frequencyCount}
            onChange={(frequencyCount) => patch({ frequencyCount })}
          />
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
                  puffsPerDevice: null,
                });
                return;
              }
              if (value === "custom") {
                patch({
                  brandKind: "custom",
                  catalogBrandId: null,
                  puffsPerDevice: null,
                });
                return;
              }
              const row = catalogBrandById(value);
              patch({
                brandKind: "catalog" satisfies BrandKind,
                catalogBrandId: value,
                otherBrandName: "",
                puffsPerDevice: row?.puffsPerStandardDevice ?? null,
                deviceType: row?.deviceType ?? draft.deviceType,
              });
            }}
          />
          {draft.brandKind === "other" ? (
            <TextInput
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
          <Text style={styles.caption}>ml per puff (estimate)</Text>
          <TextInput
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
          <Text style={styles.caption}>Optional device size (ml)</Text>
          <TextInput
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
          <Text style={styles.caption}>Puffs in a standard device (editable)</Text>
          <RotaryDial
            accessibilityLabel="Puffs per standard device"
            value={draft.puffsPerDevice ?? 0}
            onChange={(puffsPerDevice) => patch({ puffsPerDevice })}
          />
        </>
      ) : null}

      {step === "nicotine" ? (
        <>
          <ChipGroup
            options={NICOTINE.map((label) => ({ value: label, label }))}
            selected={
              ["0", "3", "5", "20", "50"].includes(draft.nicotineLabel)
                ? draft.nicotineLabel
                : draft.nicotineLabel.length > 0
                  ? "Other"
                  : null
            }
            onChange={(label) => {
              if (label === "Other") {
                patch({
                  nicotineLabel: ["0", "3", "5", "20", "50"].includes(
                    draft.nicotineLabel,
                  )
                    ? " "
                    : draft.nicotineLabel || " ",
                });
                return;
              }
              patch({ nicotineLabel: label });
            }}
          />
          {draft.nicotineLabel.length > 0 &&
          !["0", "3", "5", "20", "50"].includes(draft.nicotineLabel) ? (
            <TextInput
              accessibilityLabel="Other nicotine strength"
              placeholder="e.g. 10 mg/ml"
              placeholderTextColor={color.inkMuted}
              value={draft.nicotineLabel}
              onChangeText={(nicotineLabel) => patch({ nicotineLabel })}
              style={styles.input}
            />
          ) : null}
        </>
      ) : null}

      {step === "cost" ? (
        <TextInput
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
        <ChipGroup
          options={QUIT}
          selected={draft.quitWindow}
          onChange={(quitWindow) => patch({ quitWindow })}
        />
      ) : null}

      {step === "cut-down" ? (
        <RotaryDial
          accessibilityLabel="Puffs to cut down each day"
          value={draft.cutDownPerDay}
          onChange={(cutDownPerDay) => patch({ cutDownPerDay })}
        />
      ) : null}
    </OnboardingFrame>
  );
}

function titleFor(step: OnboardingStep): string {
  switch (step) {
    case "nickname":
      return "What should we call you?";
    case "duration":
      return "How long have you been vaping?";
    case "frequency":
      return "How often do you vape?";
    case "device":
      return "What do you use most?";
    case "brand":
      return "What brand do you use most?";
    case "device-math":
      return draftBrandMathTitle();
    case "nicotine":
      return "What nicotine strength?";
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
  }
}

function draftBrandMathTitle(): string {
  const draft = getDraft();
  return draft.brandKind === "custom"
    ? "How many ml per puff?"
    : "How many puffs in a standard device?";
}

function helperFor(step: OnboardingStep): string | undefined {
  switch (step) {
    case "nickname":
      return "Optional. We’ll say friend if you skip.";
    case "duration":
    case "frequency":
      return "An estimate is fine. Spin the number, then pick a period.";
    case "brand":
      return "Used only to estimate usage — not a shop.";
    case "cost":
      return "Optional. Helps later savings math. We never charge a card.";
    case "triggers":
      return "Pick any that fit. You can skip.";
    case "strictness":
      return "This sets how firm reminders and the daily cap will feel.";
    case "cut-down":
      return "We’ll subtract this from your estimated daily puffs.";
    default:
      return undefined;
  }
}

const styles = StyleSheet.create({
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
});
