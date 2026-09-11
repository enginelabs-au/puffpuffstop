import { localDateKey } from "../domain/organs";
import { summarizePlan, type PlanSummary } from "../domain/plan-summary";
import { ensureCutDownSchedule } from "./cut-down-schedule";
import { getDraft } from "./onboarding-store";
import { getSettings } from "./settings-store";

export function planTodayKey(now: Date = new Date()): string {
  return localDateKey(now, getSettings().timeZone);
}

export function currentPlan(now: Date = new Date()): PlanSummary {
  const todayKey = planTodayKey(now);
  ensureCutDownSchedule(todayKey);
  return summarizePlan(getDraft(), todayKey);
}
