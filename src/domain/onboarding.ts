import type { Period } from "./estimation";

export const ONBOARDING_STEPS = [
  "nickname",
  "timezone",
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
  "quick-log",
] as const;

export type OnboardingStep = (typeof ONBOARDING_STEPS)[number];

export type DeviceType = "disposable" | "pod" | "refillable";
export type BrandKind = "catalog" | "other" | "custom";
export type Strictness = "chill" | "steady" | "strict";
export type Motivation = "low" | "medium" | "high" | "all-in";
export type QuitWindow =
  | "few-days"
  | "few-weeks"
  | "few-months"
  | "exact-date"
  | "other"
  | "unsure";
export type Trigger =
  | "wake-up"
  | "during-day"
  | "evening"
  | "sleep"
  | "social"
  | "often"
  | "rarely"
  | "frequently";

export const TRIGGERS: readonly Trigger[] = [
  "wake-up",
  "during-day",
  "evening",
  "sleep",
  "social",
  "often",
  "rarely",
  "frequently",
];

export const QUIT_WINDOWS: readonly QuitWindow[] = [
  "few-days",
  "few-weeks",
  "few-months",
  "exact-date",
  "other",
  "unsure",
];

export const DEFAULT_NICKNAME = "friend";
export const DIAL_MAX = 999;
export const PUFF_DIAL_MAX = 999_999;
export const DEFAULT_CURRENCY = "AUD";

export type OnboardingDraft = {
  nickname: string;
  durationCount: number;
  durationPeriod: Period;
  frequencyCount: number;
  frequencyPeriod: Period;
  deviceType: DeviceType | null;
  brandKind: BrandKind | null;
  catalogBrandId: string | null;
  catalogProductId: string | null;
  otherBrandName: string;
  puffsPerDevice: number | null;
  mlPerPuff: number | null;
  deviceMl: number | null;
  nicotineLabel: string;
  deviceCost: number | null;
  currencyCode: string;
  triggers: Trigger[];
  strictness: Strictness | null;
  motivation: Motivation | null;
  quitWindow: QuitWindow | null;
  quitOtherCount: number;
  quitOtherPeriod: Period;
  quitExactDate: string;
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
    catalogProductId: null,
    otherBrandName: "",
    puffsPerDevice: null,
    mlPerPuff: null,
    deviceMl: null,
    nicotineLabel: "",
    deviceCost: null,
    currencyCode: DEFAULT_CURRENCY,
    triggers: [],
    strictness: null,
    motivation: null,
    quitWindow: null,
    quitOtherCount: 0,
    quitOtherPeriod: "weeks",
    quitExactDate: "",
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

export function resumeDestination(
  draft: OnboardingDraft,
): "/home" | "/onboarding/nickname" {
  return canShowHome(draft) ? "/home" : "/onboarding/nickname";
}

/** @deprecated Age-gate screen removed; store rating is 16+. */
export function resumeAfterAgeGate(
  draft: OnboardingDraft,
): "/home" | "/onboarding/nickname" {
  return resumeDestination(draft);
}

export function clampDial(value: number, max: number = DIAL_MAX): number {
  if (!Number.isFinite(value)) return 0;
  return Math.min(max, Math.max(0, Math.round(value)));
}

export function dialTicks(max: number): number[] {
  const ticks = [0];
  for (let exp = 0; 10 ** exp <= max; exp += 1) {
    for (const marker of [1, 2, 5]) {
      const value = marker * 10 ** exp;
      if (value > 0 && value < max) ticks.push(value);
    }
  }
  ticks.push(max);
  return [...new Set(ticks)].sort((a, b) => a - b);
}

export function periodLabel(period: Period): "day" | "week" | "month" | "year" {
  switch (period) {
    case "days":
      return "day";
    case "weeks":
      return "week";
    case "months":
      return "month";
    case "years":
      return "year";
  }
}

export function formatAuDateInput(raw: string): string {
  const digits = raw.replace(/\D/g, "").slice(0, 8);
  if (digits.length <= 2) return digits;
  if (digits.length <= 4) return `${digits.slice(0, 2)}-${digits.slice(2)}`;
  return `${digits.slice(0, 2)}-${digits.slice(2, 4)}-${digits.slice(4)}`;
}

export function isValidCalendarDate(day: number, month: number, year: number): boolean {
  if (year < 1900 || year > 2100) return false;
  const date = new Date(year, month - 1, day);
  return (
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day
  );
}

export function isValidAuDate(value: string): boolean {
  const au = /^(\d{2})-(\d{2})-(\d{4})$/.exec(value);
  if (au) {
    return isValidCalendarDate(Number(au[1]), Number(au[2]), Number(au[3]));
  }
  const iso = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (iso) {
    return isValidCalendarDate(Number(iso[3]), Number(iso[2]), Number(iso[1]));
  }
  return false;
}

export function puffWord(count: number): "puff" | "puffs" {
  return count === 1 ? "puff" : "puffs";
}

export function frequencyCaption(count: number, period: Period): string {
  return `${count} ${puffWord(count)} a ${periodLabel(period)}`;
}

export function isOnboardingStep(value: string): value is OnboardingStep {
  return (ONBOARDING_STEPS as readonly string[]).includes(value);
}

export function nextStep(step: OnboardingStep): OnboardingStep | "plan" {
  const index = ONBOARDING_STEPS.indexOf(step);
  const following = ONBOARDING_STEPS[index + 1];
  return following ?? "plan";
}

export function previousStep(step: OnboardingStep): OnboardingStep | null {
  const index = ONBOARDING_STEPS.indexOf(step);
  if (index <= 0) return null;
  return ONBOARDING_STEPS[index - 1] ?? null;
}

export function canContinue(step: OnboardingStep, draft: OnboardingDraft): boolean {
  switch (step) {
    case "nickname":
    case "timezone":
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
      if (draft.brandKind === "catalog") {
        return draft.catalogBrandId !== null && draft.catalogProductId !== null;
      }
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
      if (draft.quitWindow === "exact-date") {
        return isValidAuDate(draft.quitExactDate);
      }
      if (draft.quitWindow === "other") {
        return draft.quitOtherCount > 0;
      }
      return draft.quitWindow !== null;
    case "cut-down":
    case "quick-log":
      return true;
  }
}
