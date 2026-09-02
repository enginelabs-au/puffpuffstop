export const HEALTH_ACCESS_PATH = "health-access";
export const FITBIT_CALLBACK_PATH = "fitbit";
export const HEALTH_FILE_NAME = "puffpuffstop-health.json";

export const HEALTH_SIGNALS = [
  "heartRateBpm",
  "restingHeartRateBpm",
  "hrvMs",
  "respiratoryRate",
  "spo2Percent",
  "sleepMinutes",
  "sleepAwakenings",
  "steps",
  "activeEnergyKcal",
  "exerciseMinutes",
  "vo2Max",
  "wristTempC",
] as const;

export const VAPING_SIGNALS = [
  "heartRateBpm",
  "hrvMs",
  "spo2Percent",
  "respiratoryRate",
] as const;

export type HealthSignal = (typeof HEALTH_SIGNALS)[number];
export type VapingSignal = (typeof VAPING_SIGNALS)[number];

export const EFFECT_WINDOW_MS = 20 * 60 * 1000;
export const EFFECT_THRESHOLDS: Record<VapingSignal, number> = {
  heartRateBpm: 3,
  hrvMs: 3,
  spo2Percent: 1,
  respiratoryRate: 1,
};

export type HealthEffect = {
  key: VapingSignal;
  before: number;
  after: number;
  puffAt: number;
};

export type HealthSource = "healthkit" | "healthconnect" | "fitbit";

export type HealthStatus =
  | "idle"
  | "ok"
  | "denied"
  | "unavailable"
  | "failed"
  | "pending";

export type HealthSummary = {
  heartRateBpm: number | null;
  restingHeartRateBpm: number | null;
  hrvMs: number | null;
  respiratoryRate: number | null;
  spo2Percent: number | null;
  sleepMinutes: number | null;
  sleepAwakenings: number | null;
  steps: number | null;
  activeEnergyKcal: number | null;
  exerciseMinutes: number | null;
  vo2Max: number | null;
  wristTempC: number | null;
};

export type HealthState = {
  healthEnabled: boolean;
  fitbitEnabled: boolean;
  watchMetricsEnabled: boolean;
  healthStatus: HealthStatus;
  fitbitStatus: HealthStatus;
  lastSyncedAt: string | null;
  dateKey: string | null;
  sources: HealthSource[];
  summary: HealthSummary;
  effects: HealthEffect[];
  fitbitAccessToken: string | null;
  fitbitRefreshToken: string | null;
  fitbitCodeVerifier: string | null;
};

export const HEALTH_DISCLAIMER =
  "Around a log, from the watch. Not a diagnosis, and not proof a puff caused it.";

export const HEALTH_ONBOARDING_HELPER =
  "Apple Watch, Fitbit (via Google Health), and most Wear watches reach this app through Apple Health or Health Connect. We only look at heart rate, HRV, oxygen, and breathing around a puff log. You can skip and do this in Settings.";

export const HEALTH_READ_LIST =
  "Heart rate, heart-rate variability, blood oxygen, and breathing rate around a puff log, when the watch shares them.";

export const HEALTH_WAITING_AROUND_LOG =
  "Watch has not shown a heart, oxygen, or breathing shift around that log yet.";

export const HEALTH_GOOGLE_VIA_APPLE =
  "Being logged into Google Health or Fitbit is not a login to this app. On iPhone, open Google Health → profile → Partner apps → Apple Health, and allow heart rate, blood oxygen, and breathing. Then tap Sync Apple Health here and log a puff.";

export const HEALTH_GOOGLE_VIA_CONNECT =
  "A Pixel Watch, Wear watch, or Fitbit reaches this app through Health Connect. In Google Health or Fitbit, share heart rate, blood oxygen, and breathing to Health Connect. Then tap Connect Health Connect here and log a puff.";

export const HEALTH_SHIFT_HEADLINE = "Around that log";
export const HEALTH_WATCHING_HEADLINE = "Watching this log";
export const HEALTH_LIVE_POLL_MS = 10_000;
export const HEALTH_LIVE_BURST_MS = 3 * 60_000;

export function healthWatchPathHelper(os: "ios" | "android" | "web" | string): string {
  return os === "android" ? HEALTH_GOOGLE_VIA_CONNECT : HEALTH_GOOGLE_VIA_APPLE;
}

export function isWatchLiveWindow(
  puffAt: number | undefined,
  now: number = Date.now(),
): boolean {
  return Boolean(puffAt && now - puffAt >= 0 && now - puffAt <= EFFECT_WINDOW_MS);
}

export function formatHealthDelta(key: VapingSignal, delta: number): string {
  const sign = delta > 0 ? "+" : "";
  return `${sign}${formatHealthValue(key, delta)}`;
}

export type VisibleLogEffect = {
  key: VapingSignal;
  label: string;
  line: string;
  before: number;
  after: number;
  delta: number;
  direction: "up" | "down";
};

export const SIGNAL_LABELS: Record<HealthSignal, string> = {
  heartRateBpm: "Heart rate",
  restingHeartRateBpm: "Resting heart rate",
  hrvMs: "Heart-rate variability",
  respiratoryRate: "Breathing rate",
  spo2Percent: "Blood oxygen",
  sleepMinutes: "Sleep",
  sleepAwakenings: "Awakenings",
  steps: "Steps",
  activeEnergyKcal: "Active energy",
  exerciseMinutes: "Exercise",
  vo2Max: "VO2 max",
  wristTempC: "Wrist temperature",
};

export function emptyHealthSummary(): HealthSummary {
  return {
    heartRateBpm: null,
    restingHeartRateBpm: null,
    hrvMs: null,
    respiratoryRate: null,
    spo2Percent: null,
    sleepMinutes: null,
    sleepAwakenings: null,
    steps: null,
    activeEnergyKcal: null,
    exerciseMinutes: null,
    vo2Max: null,
    wristTempC: null,
  };
}

export function emptyHealthState(): HealthState {
  return {
    healthEnabled: false,
    fitbitEnabled: false,
    watchMetricsEnabled: true,
    healthStatus: "idle",
    fitbitStatus: "idle",
    lastSyncedAt: null,
    dateKey: null,
    sources: [],
    summary: emptyHealthSummary(),
    effects: [],
    fitbitAccessToken: null,
    fitbitRefreshToken: null,
    fitbitCodeVerifier: null,
  };
}

export function isHealthStatus(value: unknown): value is HealthStatus {
  return (
    value === "idle" ||
    value === "ok" ||
    value === "denied" ||
    value === "unavailable" ||
    value === "failed" ||
    value === "pending"
  );
}

export function isHealthSource(value: unknown): value is HealthSource {
  return value === "healthkit" || value === "healthconnect" || value === "fitbit";
}

function asNullNumber(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim() !== "") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
}

export function parseHealthSummary(raw: unknown): HealthSummary {
  const value = raw && typeof raw === "object" ? (raw as Record<string, unknown>) : {};
  const summary = emptyHealthSummary();
  for (const key of HEALTH_SIGNALS) {
    summary[key] = asNullNumber(value[key]);
  }
  return summary;
}

export function parseHealthFile(raw: unknown): {
  status: HealthStatus;
  source: HealthSource | null;
  syncedAt: string | null;
  dateKey: string | null;
  summary: HealthSummary;
  effects: HealthEffect[];
} {
  const value = raw && typeof raw === "object" ? (raw as Record<string, unknown>) : {};
  const status = isHealthStatus(value.status) ? value.status : "failed";
  const source = isHealthSource(value.source) ? value.source : null;
  return {
    status,
    source,
    syncedAt: typeof value.syncedAt === "string" ? value.syncedAt : null,
    dateKey: typeof value.dateKey === "string" ? value.dateKey : null,
    summary: parseHealthSummary(value),
    effects: parseHealthEffects(value.effects),
  };
}

export function isVapingSignal(value: unknown): value is VapingSignal {
  return VAPING_SIGNALS.includes(value as VapingSignal);
}

export function parseHealthEffects(raw: unknown): HealthEffect[] {
  if (!Array.isArray(raw)) return [];
  const effects: HealthEffect[] = [];
  for (const item of raw) {
    if (!item || typeof item !== "object") continue;
    const value = item as Record<string, unknown>;
    if (!isVapingSignal(value.key)) continue;
    const before = asNullNumber(value.before);
    const after = asNullNumber(value.after);
    const puffAt = asNullNumber(value.puffAt);
    if (before == null || after == null || puffAt == null || puffAt <= 0) continue;
    effects.push({ key: value.key, before, after, puffAt });
  }
  return effects;
}

export function hasHealthReadings(summary: HealthSummary): boolean {
  return VAPING_SIGNALS.some((key) => summary[key] !== null);
}

export function isWatchFeedLive(health: HealthState): boolean {
  return (
    health.watchMetricsEnabled !== false &&
    (health.healthEnabled || health.fitbitEnabled) &&
    health.healthStatus !== "denied" &&
    health.healthStatus !== "unavailable" &&
    health.healthStatus !== "failed" &&
    hasHealthReadings(health.summary)
  );
}

export function formatHealthValue(key: HealthSignal, value: number): string {
  switch (key) {
    case "heartRateBpm":
    case "restingHeartRateBpm":
      return `${Math.round(value)} bpm`;
    case "hrvMs":
      return `${Math.round(value)} ms`;
    case "respiratoryRate":
      return `${Math.round(value)} / min`;
    case "spo2Percent":
      return `${Math.round(value)}%`;
    case "sleepMinutes": {
      const hours = Math.floor(value / 60);
      const minutes = Math.round(value % 60);
      return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
    }
    case "sleepAwakenings":
      return String(Math.round(value));
    case "steps":
      return String(Math.round(value));
    case "activeEnergyKcal":
      return `${Math.round(value)} kcal`;
    case "exerciseMinutes":
      return `${Math.round(value)} min`;
    case "vo2Max":
      return `${Math.round(value)}`;
    case "wristTempC":
      return `${value.toFixed(1)}°C`;
  }
}

export function visibleHealthRows(
  summary: HealthSummary,
): { key: HealthSignal; label: string; value: string }[] {
  return VAPING_SIGNALS.flatMap((key) => {
    const value = summary[key];
    if (value === null) return [];
    return [{ key, label: SIGNAL_LABELS[key], value: formatHealthValue(key, value) }];
  });
}

export function visibleLogEffects(
  effects: readonly HealthEffect[],
  lastPuffAt: number | undefined,
): VisibleLogEffect[] {
  if (!lastPuffAt) return [];
  return effects.flatMap((effect) => {
    if (Math.abs(effect.puffAt - lastPuffAt) > 2000) return [];
    const delta = effect.after - effect.before;
    if (Math.abs(delta) < EFFECT_THRESHOLDS[effect.key]) return [];
    const label = SIGNAL_LABELS[effect.key];
    return [
      {
        key: effect.key,
        label,
        before: effect.before,
        after: effect.after,
        delta,
        direction: delta > 0 ? "up" : "down",
        line: `${label} ${formatHealthValue(effect.key, effect.before)} → ${formatHealthValue(effect.key, effect.after)} around that log`,
      },
    ];
  });
}

export function effectsAroundPuff(
  samples: readonly { at: number; value: number }[],
  puffAt: number,
  key: VapingSignal,
): HealthEffect | null {
  if (!puffAt || samples.length === 0) return null;
  const before = samples.filter(
    (sample) => sample.at >= puffAt - EFFECT_WINDOW_MS && sample.at < puffAt,
  );
  const after = samples.filter(
    (sample) => sample.at >= puffAt && sample.at <= puffAt + EFFECT_WINDOW_MS,
  );
  const beforeValue = before.at(-1)?.value;
  const afterValue = after.at(-1)?.value;
  if (beforeValue == null || afterValue == null) return null;
  return { key, before: beforeValue, after: afterValue, puffAt };
}

export function healthPlatformLabel(os: "ios" | "android" | "web" | string): string {
  if (os === "ios") return "Apple Health";
  if (os === "android") return "Health Connect";
  return "Health";
}

export function healthAccessUrl(scheme = "puffpuffstop"): string {
  return `${scheme}://${HEALTH_ACCESS_PATH}`;
}

export function healthRefreshUrl(scheme = "puffpuffstop"): string {
  return `${scheme}://health-refresh`;
}

export function parseFitbitCallback(url: string): { code: string } | null {
  try {
    const parsed = new URL(url);
    const path = parsed.pathname.replace(/\/+$/, "") || parsed.hostname;
    if (parsed.hostname !== FITBIT_CALLBACK_PATH && path !== FITBIT_CALLBACK_PATH && path !== `/${FITBIT_CALLBACK_PATH}`) {
      return null;
    }
    const code = parsed.searchParams.get("code")?.trim();
    return code ? { code } : null;
  } catch {
    return null;
  }
}

export function fitbitAuthorizeUrl(input: {
  clientId: string;
  redirectUri: string;
  codeChallenge: string;
  state: string;
}): string {
  const scopes = ["heartrate", "oxygen_saturation", "respiratory_rate"];
  const params = new URLSearchParams({
    response_type: "code",
    client_id: input.clientId,
    redirect_uri: input.redirectUri,
    scope: scopes.join(" "),
    code_challenge: input.codeChallenge,
    code_challenge_method: "S256",
    state: input.state,
  });
  return `https://www.fitbit.com/oauth2/authorize?${params.toString()}`;
}

export function redactHealthSecrets(state: HealthState): Omit<
  HealthState,
  "fitbitAccessToken" | "fitbitRefreshToken" | "fitbitCodeVerifier"
> & {
  fitbitAccessToken: null;
  fitbitRefreshToken: null;
  fitbitCodeVerifier: null;
} {
  return {
    ...state,
    fitbitAccessToken: null,
    fitbitRefreshToken: null,
    fitbitCodeVerifier: null,
  };
}
