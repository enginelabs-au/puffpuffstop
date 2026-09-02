import { applyDayRollover, getDailyLog, type RolloverResult } from "./daily-log-store";
import { getDraft } from "./onboarding-store";
import { recordProgressDay } from "./progress-store";
import { addSavings } from "./savings-store";
import { getSettings } from "./settings-store";
import { summarizePlan } from "../domain/plan-summary";
import { creditAmount, defaultStakePerPuff, puffsSaved } from "../domain/savings";

export function applyDayCycle(
  commitment: number,
  now: Date = new Date(),
): RolloverResult {
  const result = applyDayRollover(commitment, now);
  if (result.rolled && result.recovered) {
    const stake = getSettings().stakePerPuff ?? defaultStakePerPuff(getDraft());
    addSavings(creditAmount(puffsSaved(result.previousLogged, commitment), stake));
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
    usual: summarizePlan(getDraft()).puffsPerDay,
    met: commitment > 0 && log.logged <= commitment,
  });
}
