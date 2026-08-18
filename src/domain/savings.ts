import { impliedPuffsPerDevice } from "./plan-summary";
import type { OnboardingDraft } from "./onboarding";

export const SAVINGS_DISCLAIMER =
  "Puff Savings is an estimate of money not spent. Nothing is charged, held, or paid out.";

export const DEFAULT_STAKE = 0.1;

export function puffsSaved(logged: number, commitment: number): number {
  return Math.max(0, Math.max(0, commitment) - Math.max(0, logged));
}

export function creditAmount(savedPuffs: number, stakePerPuff: number): number {
  if (savedPuffs <= 0 || stakePerPuff <= 0) return 0;
  return savedPuffs * stakePerPuff;
}

export function defaultStakePerPuff(draft: OnboardingDraft): number {
  const perDevice = impliedPuffsPerDevice(draft);
  if (perDevice && perDevice > 0 && draft.deviceCost && draft.deviceCost > 0) {
    return draft.deviceCost / perDevice;
  }
  return DEFAULT_STAKE;
}

export function formatMoney(value: number): string {
  return value.toFixed(2);
}
