import {
  commitmentPuffs,
  puffsPerDay,
  type Period,
} from "../domain/estimation";
import { canShowHome, clampDial, PUFF_DIAL_MAX } from "../domain/onboarding";
import { getDraft, updateDraft } from "./onboarding-store";

export function ensureCutDownSchedule(todayKey: string): ReturnType<typeof getDraft> {
  const draft = getDraft();
  if (!canShowHome(draft) || draft.cutDownStartDate) return draft;
  const usual = puffsPerDay(draft.frequencyCount, draft.frequencyPeriod);
  const legacy = commitmentPuffs(usual, draft.cutDownPerDay);
  return updateDraft({
    cutDownStartDate: todayKey,
    cutDownBase: draft.cutDownPerDay > 0 ? legacy : usual,
    cutDownPeriod: draft.cutDownPeriod || "days",
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
