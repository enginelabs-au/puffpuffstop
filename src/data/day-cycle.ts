import { applyDayRollover, getDailyLog, type RolloverResult } from "./daily-log-store";
import { getDraft } from "./onboarding-store";
import { currentPlan } from "./plan";
import { recordProgressDay } from "./progress-store";
import { addSavings } from "./savings-store";
import { getSettings } from "./settings-store";
import { defaultStakePerPuff, estimateDaySavings } from "../domain/savings";

export function applyDayCycle(
  commitment: number,
  now: Date = new Date(),
): RolloverResult {
  const result = applyDayRollover(commitment, now);
  if (result.rolled) {
    const draft = getDraft();
    const stake = getSettings().stakePerPuff ?? defaultStakePerPuff(draft);
    addSavings(
      estimateDaySavings(draft, result.previousLogged, commitment, stake),
    );
  }
  syncOpenProgressDay(commitment);
  return result;
}

export function syncOpenProgressDay(commitment: number): void {
  const log = getDailyLog();
  recordProgressDay({
    dateKey: log.dateKey,
    logged: log.logged,
    goal: commitment,
    usual: currentPlan().puffsPerDay,
    met: commitment > 0 && log.logged <= commitment,
  });
}
