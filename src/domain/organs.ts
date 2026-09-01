export const ORGAN_IDS = ["lungs", "heart", "brain", "liver", "mouth"] as const;

export type OrganId = (typeof ORGAN_IDS)[number];

export const ORGAN_LABELS: Record<OrganId, string> = {
  lungs: "Lungs",
  heart: "Heart",
  brain: "Brain",
  liver: "Liver",
  mouth: "Mouth",
};

/**
 * Daily nudges sit on a 50-year horizon. One puff is a hundredth of a
 * percent — measurable at two decimals, tiny against a lifetime baseline.
 * Beating the daily cap heals more than that day's puffs plus a visible bonus.
 */
export const PUFF_DAMAGE = 0.01;
export const OVER_CAP_EXTRA = 0.004;
export const GOAL_BONUS = 1.2;
export const DAY_RECOVERY = GOAL_BONUS;
export const SCORE_MIN = 1;
export const SCORE_MAX = 100;

/** Never-user start. A few years of vaping stay high on a 50-year horizon. */
export const NEVER_USER_BASE = 96;
export const LIFETIME_YEARS = 50;
export const HEAVY_PUFFS_PER_DAY = 400;
export const BASELINE_MIN = 50;
export const BASELINE_MAX = 98;

/**
 * Lifetime drop if someone vaped heavily for 50 years.
 * Relative weights follow where reviews report stronger human vs preclinical evidence.
 */
export const ORGAN_LIFETIME_DROP: Record<OrganId, number> = {
  lungs: 45,
  heart: 35,
  mouth: 30,
  brain: 25,
  liver: 20,
};

export function clampScore(value: number): number {
  if (!Number.isFinite(value)) return SCORE_MIN;
  return Math.min(SCORE_MAX, Math.max(SCORE_MIN, value));
}

export function clampBaseline(value: number): number {
  return Math.min(BASELINE_MAX, Math.max(BASELINE_MIN, value));
}

export function exposureFraction(historyDays: number): number {
  const years = Math.max(0, historyDays) / 365;
  return Math.min(1, years / LIFETIME_YEARS);
}

export function intensityFraction(puffsPerDay: number): number {
  return Math.min(1, Math.max(0, puffsPerDay) / HEAVY_PUFFS_PER_DAY);
}

export function organLifetimeDrop(
  id: OrganId,
  historyDays: number,
  puffsPerDay: number,
): number {
  const exposure = exposureFraction(historyDays);
  const intensity = intensityFraction(puffsPerDay);
  return ORGAN_LIFETIME_DROP[id] * exposure * (0.4 + 0.6 * intensity);
}

export function organBaseline(
  id: OrganId,
  historyDays: number,
  puffsPerDay: number,
): number {
  return clampBaseline(
    NEVER_USER_BASE - organLifetimeDrop(id, historyDays, puffsPerDay),
  );
}

export function coreBaseline(historyDays: number, puffsPerDay: number): number {
  return organBaseline("brain", historyDays, puffsPerDay);
}

export function organBaselines(
  historyDays: number,
  puffsPerDay: number,
): Record<OrganId, number> {
  return {
    lungs: organBaseline("lungs", historyDays, puffsPerDay),
    heart: organBaseline("heart", historyDays, puffsPerDay),
    brain: organBaseline("brain", historyDays, puffsPerDay),
    liver: organBaseline("liver", historyDays, puffsPerDay),
    mouth: organBaseline("mouth", historyDays, puffsPerDay),
  };
}

export function overCapPuffs(logged: number, commitment: number): number {
  return Math.max(0, logged - Math.max(0, commitment));
}

export function isOnTrack(logged: number, commitment: number): boolean {
  return logged <= Math.max(0, commitment);
}

export function isGoalCelebration(
  recoveryTicks: number,
  logged: number,
  commitment: number,
): boolean {
  return recoveryTicks > 0 && isOnTrack(logged, commitment);
}

/** One successful day undoes that day's puffs and then some. */
export function dayRecovery(commitment: number): number {
  return Math.max(0, commitment) * PUFF_DAMAGE + GOAL_BONUS;
}

export function organScore(
  baseline: number,
  logged: number,
  commitment: number,
  recoveryTicks: number,
): number {
  const extra = overCapPuffs(logged, commitment);
  const damage = logged * PUFF_DAMAGE + extra * OVER_CAP_EXTRA;
  const recover = recoveryTicks * dayRecovery(commitment);
  return clampScore(baseline - damage + recover);
}

export function organScores(
  baselines: Record<OrganId, number>,
  logged: number,
  commitment: number,
  recoveryTicks: number,
): Record<OrganId, number> {
  return {
    lungs: organScore(baselines.lungs, logged, commitment, recoveryTicks),
    heart: organScore(baselines.heart, logged, commitment, recoveryTicks),
    brain: organScore(baselines.brain, logged, commitment, recoveryTicks),
    liver: organScore(baselines.liver, logged, commitment, recoveryTicks),
    mouth: organScore(baselines.mouth, logged, commitment, recoveryTicks),
  };
}

export function formatOrganPercent(value: number): string {
  const hundredths = Math.round(value * 100) / 100;
  if (Number.isInteger(hundredths)) return `${hundredths}`;
  const tenths = Math.round(value * 10) / 10;
  if (Math.abs(hundredths - tenths) < 0.001) return tenths.toFixed(1);
  return hundredths.toFixed(2);
}

export function localDateKey(now: Date = new Date(), timeZone?: string): string {
  const zone = timeZone?.trim();
  if (zone) {
    try {
      const parts = new Intl.DateTimeFormat("en-US", {
        timeZone: zone,
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      }).formatToParts(now);
      const year = parts.find((part) => part.type === "year")?.value;
      const month = parts.find((part) => part.type === "month")?.value;
      const day = parts.find((part) => part.type === "day")?.value;
      if (year && month && day) return `${year}-${month}-${day}`;
    } catch {
      // Fall through to the runtime calendar.
    }
  }
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}
