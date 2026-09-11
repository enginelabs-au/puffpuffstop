import { puffsPerDay, type Period } from "../domain/estimation";
import {
  canShowHome,
  clampDial,
  dailyGoalPuffs,
  PUFF_DIAL_MAX,
} from "../domain/onboarding";
import { staleCutDownBase } from "../domain/plan-summary";
import { getDraft, updateDraft } from "./onboarding-store";

export function ensureCutDownSchedule(todayKey: string): ReturnType<typeof getDraft> {
  const draft = getDraft();
  if (!canShowHome(draft)) return draft;
  const usual = puffsPerDay(draft.frequencyCount, draft.frequencyPeriod);
  const dailyGoal = dailyGoalPuffs(draft);
  if (!draft.cutDownStartDate) {
    return updateDraft({
      cutDownStartDate: todayKey,
      cutDownBase: dailyGoal > 0 ? dailyGoal : usual,
      cutDownPeriod: draft.cutDownPeriod || "days",
    });
  }
  if (staleCutDownBase(draft)) {
    return updateDraft({
      cutDownStartDate: todayKey,
      cutDownBase: dailyGoal,
    });
  }
  return draft;
}

export function applyUsualChange(
  count: number,
  period: Period,
  todayKey: string,
): ReturnType<typeof getDraft> {
  const frequencyCount = clampDial(count, PUFF_DIAL_MAX);
  const next = {
    ...getDraft(),
    frequencyCount,
    frequencyPeriod: period,
  };
  if (dailyGoalPuffs(next) > 0) {
    return updateDraft({ frequencyCount, frequencyPeriod: period });
  }
  return updateDraft({
    frequencyCount,
    frequencyPeriod: period,
    cutDownStartDate: todayKey,
    cutDownBase: puffsPerDay(frequencyCount, period),
  });
}

export function applyGoalChange(
  count: number,
  period: Period,
  todayKey: string,
): ReturnType<typeof getDraft> {
  const goalCount = clampDial(count, PUFF_DIAL_MAX);
  return updateDraft({
    goalCount,
    goalPeriod: period,
    cutDownStartDate: todayKey,
    cutDownBase: puffsPerDay(goalCount, period),
  });
}

export function applyCutDownChange(
  count: number,
  period: Period,
  todayKey: string,
  currentGoal: number,
): ReturnType<typeof getDraft> {
  return updateDraft({
    cutDownPerDay: clampDial(count, PUFF_DIAL_MAX),
    cutDownPeriod: period,
    cutDownStartDate: todayKey,
    cutDownBase: Math.max(0, currentGoal),
  });
}
