import type { Period } from "./estimation";

export const ONBOARDING_STEPS = [
  "nickname",
  "duration",
  "frequency",
  "device",
  "brand",
  "device-math",
  "nicotine",
  "cost",
  "triggers",
  "strictness",
  "motivation",
  "quit-window",
  "cut-down",
] as const;

export type OnboardingStep = (typeof ONBOARDING_STEPS)[number];

export type DeviceType = "disposable" | "pod" | "refillable";
export type BrandKind = "catalog" | "other" | "custom";
export type Strictness = "chill" | "steady" | "strict";
export type Motivation = "low" | "medium" | "high" | "all-in";
export type QuitWindow =
  | "2-weeks"
  | "1-month"
  | "3-months"
  | "6-months"
  | "unsure";
export type Trigger =
  | "morning"
  | "school-work"
  | "evenings"
  | "stressed"
  | "bored"
  | "social";

export const DEFAULT_NICKNAME = "friend";
export const DIAL_MAX = 999;

export type OnboardingDraft = {
  nickname: string;
  durationCount: number;
  durationPeriod: Period;
  frequencyCount: number;
  frequencyPeriod: Period;
  deviceType: DeviceType | null;
  brandKind: BrandKind | null;
  catalogBrandId: string | null;
  otherBrandName: string;
  puffsPerDevice: number | null;
  mlPerPuff: number | null;
  deviceMl: number | null;
  nicotineLabel: string;
  deviceCost: number | null;
  triggers: Trigger[];
  strictness: Strictness | null;
  motivation: Motivation | null;
  quitWindow: QuitWindow | null;
  cutDownPerDay: number;
};

export function emptyDraft(): OnboardingDraft {
  return {
    nickname: "",
    durationCount: 0,
    durationPeriod: "months",
    frequencyCount: 0,
    frequencyPeriod: "days",
    deviceType: null,
    brandKind: null,
    catalogBrandId: null,
    otherBrandName: "",
    puffsPerDevice: null,
    mlPerPuff: null,
    deviceMl: null,
    nicotineLabel: "",
    deviceCost: null,
    triggers: [],
    strictness: null,
    motivation: null,
    quitWindow: null,
    cutDownPerDay: 0,
  };
}

export function displayName(draft: OnboardingDraft): string {
  const trimmed = draft.nickname.trim();
  return trimmed.length > 0 ? trimmed : DEFAULT_NICKNAME;
}

export function canShowHome(draft: OnboardingDraft): boolean {
  return draft.durationCount > 0 && draft.frequencyCount > 0;
}

export function clampDial(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.min(DIAL_MAX, Math.max(0, Math.round(value)));
}

export function isOnboardingStep(value: string): value is OnboardingStep {
  return (ONBOARDING_STEPS as readonly string[]).includes(value);
}

export function nextStep(step: OnboardingStep): OnboardingStep | "plan" {
  const index = ONBOARDING_STEPS.indexOf(step);
  const following = ONBOARDING_STEPS[index + 1];
  return following ?? "plan";
}

export function canContinue(step: OnboardingStep, draft: OnboardingDraft): boolean {
  switch (step) {
    case "nickname":
    case "cost":
    case "triggers":
    case "device":
    case "nicotine":
      return true;
    case "duration":
      return draft.durationCount > 0;
    case "frequency":
      return draft.frequencyCount > 0;
    case "brand":
      if (draft.brandKind === "catalog") return draft.catalogBrandId !== null;
      if (draft.brandKind === "other") return draft.otherBrandName.trim().length > 0;
      if (draft.brandKind === "custom") return true;
      return false;
    case "device-math":
      if (draft.brandKind === "custom") {
        return draft.mlPerPuff !== null && draft.mlPerPuff > 0;
      }
      return draft.puffsPerDevice !== null && draft.puffsPerDevice > 0;
    case "strictness":
      return draft.strictness !== null;
    case "motivation":
      return draft.motivation !== null;
    case "quit-window":
      return draft.quitWindow !== null;
    case "cut-down":
      return true;
  }
}
