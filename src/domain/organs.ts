export const ORGAN_IDS = ["lungs", "heart", "brain", "liver", "mouth"] as const;

export type OrganId = (typeof ORGAN_IDS)[number];

export const ORGAN_LABELS: Record<OrganId, string> = {
  lungs: "Lungs",
  heart: "Heart",
  brain: "Brain",
  liver: "Liver",
  mouth: "Mouth",
};

export const PUFF_DAMAGE = 0.15;
export const OVER_CAP_EXTRA = 0.05;
export const DAY_RECOVERY = 0.08;
export const SCORE_MIN = 1;
export const SCORE_MAX = 100;
export const BASELINE_MIN = 35;
export const BASELINE_MAX = 85;

const ORGAN_OFFSET: Record<OrganId, number> = {
  lungs: -4,
  heart: -2,
  brain: 0,
  mouth: 2,
  liver: 4,
};

export function clampScore(value: number): number {
  if (!Number.isFinite(value)) return SCORE_MIN;
  return Math.min(SCORE_MAX, Math.max(SCORE_MIN, value));
}

export function clampBaseline(value: number): number {
  return Math.min(BASELINE_MAX, Math.max(BASELINE_MIN, value));
}

export function coreBaseline(historyDays: number, puffsPerDay: number): number {
  const historyPenalty = Math.min(25, (Math.max(0, historyDays) / 365) * 18);
  const usagePenalty = Math.min(25, (Math.max(0, puffsPerDay) / 40) * 25);
  return clampBaseline(85 - historyPenalty - usagePenalty);
}

export function organBaselines(
  historyDays: number,
  puffsPerDay: number,
): Record<OrganId, number> {
  const core = coreBaseline(historyDays, puffsPerDay);
  return {
    lungs: clampBaseline(core + ORGAN_OFFSET.lungs),
    heart: clampBaseline(core + ORGAN_OFFSET.heart),
    brain: clampBaseline(core + ORGAN_OFFSET.brain),
    liver: clampBaseline(core + ORGAN_OFFSET.liver),
    mouth: clampBaseline(core + ORGAN_OFFSET.mouth),
  };
}

export function overCapPuffs(logged: number, commitment: number): number {
  return Math.max(0, logged - Math.max(0, commitment));
}

export function organScore(
  baseline: number,
  logged: number,
  commitment: number,
  recoveryTicks: number,
): number {
  const extra = overCapPuffs(logged, commitment);
  const damage = logged * PUFF_DAMAGE + extra * OVER_CAP_EXTRA;
  const recover = recoveryTicks * DAY_RECOVERY;
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
  const rounded = Math.round(value * 10) / 10;
  return Number.isInteger(rounded) ? `${rounded}` : rounded.toFixed(1);
}

export function localDateKey(now: Date = new Date()): string {
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}
