import {
  commitmentPuffs,
  historyDays,
  puffsPerDay,
} from "./estimation";
import { displayName, type OnboardingDraft } from "./onboarding";

export const PLAN_DISCLAIMER =
  "These numbers and later organ scores are motivational estimates, not a medical diagnosis or treatment plan.";

export type PlanSummary = {
  displayName: string;
  puffsPerDay: number;
  puffsPerWeek: number;
  puffsPerMonth: number;
  puffsPerYear: number;
  historyDays: number;
  devicesPerWeek: number | null;
  spendPerWeek: number | null;
  commitment: number;
  strictness: OnboardingDraft["strictness"];
  motivation: OnboardingDraft["motivation"];
  quitWindow: OnboardingDraft["quitWindow"];
  disclaimer: string;
};

export function impliedPuffsPerDevice(draft: OnboardingDraft): number | null {
  if (draft.brandKind === "custom") {
    if (draft.mlPerPuff && draft.mlPerPuff > 0 && draft.deviceMl && draft.deviceMl > 0) {
      return draft.deviceMl / draft.mlPerPuff;
    }
    return null;
  }
  return draft.puffsPerDevice !== null && draft.puffsPerDevice > 0
    ? draft.puffsPerDevice
    : null;
}

export function summarizePlan(draft: OnboardingDraft): PlanSummary {
  const daily = puffsPerDay(draft.frequencyCount, draft.frequencyPeriod);
  const weekly = daily * 7;
  const perDevice = impliedPuffsPerDevice(draft);
  const devicesPerWeek =
    perDevice !== null && perDevice > 0 ? weekly / perDevice : null;
  const spendPerWeek =
    devicesPerWeek !== null && draft.deviceCost !== null
      ? devicesPerWeek * draft.deviceCost
      : null;

  return {
    displayName: displayName(draft),
    puffsPerDay: daily,
    puffsPerWeek: weekly,
    puffsPerMonth: daily * 30,
    puffsPerYear: daily * 365,
    historyDays: historyDays(draft.durationCount, draft.durationPeriod),
    devicesPerWeek,
    spendPerWeek,
    commitment: commitmentPuffs(daily, draft.cutDownPerDay),
    strictness: draft.strictness,
    motivation: draft.motivation,
    quitWindow: draft.quitWindow,
    disclaimer: PLAN_DISCLAIMER,
  };
}

export function formatCount(value: number): string {
  if (Number.isInteger(value)) return String(value);
  return value.toFixed(1);
}
