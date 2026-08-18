import { emptyDraft, type OnboardingDraft, type Trigger } from "../domain/onboarding";
import { getDailyLog, replaceDailyLog, type DailyLogState } from "./daily-log-store";
import { getDraft, replaceDraft } from "./onboarding-store";
import { getSavings, replaceSavings, type SavingsState } from "./savings-store";
import { getSettings, replaceSettings, type SettingsState } from "./settings-store";

export const SNAPSHOT_VERSION = 1;

export type AppSnapshot = {
  version: typeof SNAPSHOT_VERSION;
  draft: OnboardingDraft;
  dailyLog: DailyLogState;
  settings: SettingsState;
  savings: SavingsState;
};

const TRIGGERS: readonly Trigger[] = [
  "morning",
  "school-work",
  "evenings",
  "stressed",
  "bored",
  "social",
];

function asFiniteNumber(value: unknown, fallback: number): number {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

function asString(value: unknown, fallback: string): string {
  return typeof value === "string" ? value : fallback;
}

function asNullNumber(value: unknown): number | null {
  if (value === null) return null;
  if (typeof value === "number" && Number.isFinite(value)) return value;
  return null;
}

function parseDraft(raw: unknown): OnboardingDraft | null {
  if (!raw || typeof raw !== "object") return null;
  const value = raw as Record<string, unknown>;
  const base = emptyDraft();
  const triggers = Array.isArray(value.triggers)
    ? value.triggers.filter((item): item is Trigger =>
        TRIGGERS.includes(item as Trigger),
      )
    : [];
  return {
    ...base,
    nickname: asString(value.nickname, base.nickname),
    durationCount: asFiniteNumber(value.durationCount, base.durationCount),
    durationPeriod:
      value.durationPeriod === "days" ||
      value.durationPeriod === "weeks" ||
      value.durationPeriod === "months" ||
      value.durationPeriod === "years"
        ? value.durationPeriod
        : base.durationPeriod,
    frequencyCount: asFiniteNumber(value.frequencyCount, base.frequencyCount),
    frequencyPeriod:
      value.frequencyPeriod === "days" ||
      value.frequencyPeriod === "weeks" ||
      value.frequencyPeriod === "months" ||
      value.frequencyPeriod === "years"
        ? value.frequencyPeriod
        : base.frequencyPeriod,
    deviceType:
      value.deviceType === "disposable" ||
      value.deviceType === "pod" ||
      value.deviceType === "refillable"
        ? value.deviceType
        : null,
    brandKind:
      value.brandKind === "catalog" ||
      value.brandKind === "other" ||
      value.brandKind === "custom"
        ? value.brandKind
        : null,
    catalogBrandId: asString(value.catalogBrandId ?? "", "") || null,
    otherBrandName: asString(value.otherBrandName, ""),
    puffsPerDevice: asNullNumber(value.puffsPerDevice),
    mlPerPuff: asNullNumber(value.mlPerPuff),
    deviceMl: asNullNumber(value.deviceMl),
    nicotineLabel: asString(value.nicotineLabel, ""),
    deviceCost: asNullNumber(value.deviceCost),
    triggers,
    strictness:
      value.strictness === "chill" ||
      value.strictness === "steady" ||
      value.strictness === "strict"
        ? value.strictness
        : null,
    motivation:
      value.motivation === "low" ||
      value.motivation === "medium" ||
      value.motivation === "high" ||
      value.motivation === "all-in"
        ? value.motivation
        : null,
    quitWindow:
      value.quitWindow === "2-weeks" ||
      value.quitWindow === "1-month" ||
      value.quitWindow === "3-months" ||
      value.quitWindow === "6-months" ||
      value.quitWindow === "unsure"
        ? value.quitWindow
        : null,
    cutDownPerDay: asFiniteNumber(value.cutDownPerDay, 0),
  };
}

function parseDailyLog(raw: unknown): DailyLogState | null {
  if (!raw || typeof raw !== "object") return null;
  const value = raw as Record<string, unknown>;
  if (typeof value.dateKey !== "string") return null;
  return {
    dateKey: value.dateKey,
    logged: Math.max(0, asFiniteNumber(value.logged, 0)),
    recoveryTicks: Math.max(0, asFiniteNumber(value.recoveryTicks, 0)),
  };
}

function parseSettings(raw: unknown): SettingsState | null {
  if (!raw || typeof raw !== "object") return null;
  const value = raw as Record<string, unknown>;
  if (typeof value.remindersEnabled !== "boolean") return null;
  return {
    remindersEnabled: value.remindersEnabled,
    stakePerPuff: asNullNumber(value.stakePerPuff),
  };
}

function parseSavings(raw: unknown): SavingsState | null {
  if (!raw || typeof raw !== "object") return null;
  const value = raw as Record<string, unknown>;
  return { pot: Math.max(0, asFiniteNumber(value.pot, 0)) };
}

export function captureSnapshot(): AppSnapshot {
  return {
    version: SNAPSHOT_VERSION,
    draft: getDraft(),
    dailyLog: getDailyLog(),
    settings: getSettings(),
    savings: getSavings(),
  };
}

export function migrateSnapshot(raw: unknown): unknown {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return raw;
  const value = { ...(raw as Record<string, unknown>) };
  if (value.version === SNAPSHOT_VERSION) return value;
  if (
    value.version == null &&
    value.draft &&
    value.dailyLog &&
    value.settings &&
    value.savings
  ) {
    return { ...value, version: SNAPSHOT_VERSION };
  }
  return value;
}

export function parseSnapshot(raw: unknown): AppSnapshot | null {
  const migrated = migrateSnapshot(raw);
  if (!migrated || typeof migrated !== "object") return null;
  const value = migrated as Record<string, unknown>;
  if (value.version !== SNAPSHOT_VERSION) return null;
  const draft = parseDraft(value.draft);
  const dailyLog = parseDailyLog(value.dailyLog);
  const settings = parseSettings(value.settings);
  const savings = parseSavings(value.savings);
  if (!draft || !dailyLog || !settings || !savings) return null;
  return { version: SNAPSHOT_VERSION, draft, dailyLog, settings, savings };
}

export function restoreSnapshot(raw: unknown): boolean {
  const parsed = parseSnapshot(raw);
  if (!parsed) return false;
  replaceDraft(parsed.draft);
  replaceDailyLog(parsed.dailyLog);
  replaceSettings(parsed.settings);
  replaceSavings(parsed.savings);
  return true;
}
