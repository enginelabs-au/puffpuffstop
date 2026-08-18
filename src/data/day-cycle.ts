import { applyDayRollover, type RolloverResult } from "./daily-log-store";
import { getDraft } from "./onboarding-store";
import { addSavings } from "./savings-store";
import { getSettings } from "./settings-store";
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
  return result;
}
