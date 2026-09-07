import { daysIn, puffsPerDay, type Period } from "./estimation";
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

export function dailyDeviceSpend(cost: number | null, period: Period): number {
  if (cost === null || !(cost > 0)) return 0;
  return cost / daysIn(period);
}

export function unusedUsageFraction(logged: number, usual: number): number {
  if (!(usual > 0)) return 0;
  return Math.max(0, 1 - Math.max(0, logged) / usual);
}

export function purchaseDaySavings(
  logged: number,
  usual: number,
  cost: number | null,
  period: Period,
): number {
  return dailyDeviceSpend(cost, period) * unusedUsageFraction(logged, usual);
}

export function defaultStakePerPuff(draft: OnboardingDraft): number {
  const perDevice = impliedPuffsPerDevice(draft);
  if (perDevice && perDevice > 0 && draft.deviceCost && draft.deviceCost > 0) {
    return draft.deviceCost / perDevice;
  }
  return DEFAULT_STAKE;
}

export function estimateDaySavings(
  draft: OnboardingDraft,
  logged: number,
  commitment: number,
  stakePerPuff: number,
): number {
  const usual = puffsPerDay(draft.frequencyCount, draft.frequencyPeriod);
  const purchase = purchaseDaySavings(
    logged,
    usual,
    draft.deviceCost,
    draft.deviceCostPeriod,
  );
  if (draft.deviceCost !== null && draft.deviceCost > 0 && usual > 0) {
    return purchase;
  }
  return creditAmount(puffsSaved(logged, commitment), stakePerPuff);
}

export function formatMoney(value: number): string {
  return value.toFixed(2);
}

export function formatCurrency(value: number, currencyCode = "AUD"): string {
  try {
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency: currencyCode,
    }).format(value);
  } catch {
    return `${currencyCode} ${formatMoney(value)}`;
  }
}
