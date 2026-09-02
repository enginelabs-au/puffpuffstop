import {
  emptyHealthState,
  isHealthSource,
  isHealthStatus,
  parseHealthEffects,
  parseHealthSummary,
  type HealthEffect,
  type HealthSource,
  type HealthState,
  type HealthStatus,
  type HealthSummary,
} from "../domain/health";
import { persistNow } from "./persist-hook";

let health: HealthState = emptyHealthState();

export function getHealth(): HealthState {
  return {
    ...health,
    sources: [...health.sources],
    summary: { ...health.summary },
    effects: health.effects.map((effect) => ({ ...effect })),
  };
}

export function replaceHealth(next: HealthState): HealthState {
  health = {
    ...next,
    sources: uniqueSources(next.sources),
    summary: { ...next.summary },
    effects: (next.effects ?? []).map((effect) => ({ ...effect })),
  };
  return getHealth();
}

export function updateHealth(partial: Partial<HealthState>): HealthState {
  const next = replaceHealth({
    ...health,
    ...partial,
    sources: uniqueSources(partial.sources ?? health.sources),
    summary: partial.summary ? { ...partial.summary } : { ...health.summary },
    effects: partial.effects ?? health.effects,
  });
  persistNow();
  return next;
}

export function mergeHealthSummary(
  summary: HealthSummary,
  extras: {
    status?: HealthStatus;
    source?: HealthSource | null;
    syncedAt?: string | null;
    dateKey?: string | null;
    enabledKey?: "healthEnabled" | "fitbitEnabled";
    effects?: HealthEffect[];
  } = {},
): HealthState {
  const sources = extras.source
    ? uniqueSources([...health.sources, extras.source])
    : health.sources;
  const next = replaceHealth({
    ...health,
    healthEnabled:
      extras.enabledKey === "healthEnabled" ? extras.status === "ok" : health.healthEnabled,
    fitbitEnabled:
      extras.enabledKey === "fitbitEnabled" ? extras.status === "ok" : health.fitbitEnabled,
    healthStatus:
      extras.enabledKey === "healthEnabled" && extras.status
        ? extras.status
        : health.healthStatus,
    fitbitStatus:
      extras.enabledKey === "fitbitEnabled" && extras.status
        ? extras.status
        : health.fitbitStatus,
    lastSyncedAt: extras.syncedAt ?? health.lastSyncedAt,
    dateKey: extras.dateKey ?? health.dateKey,
    sources,
    summary: { ...health.summary, ...summary },
    effects: extras.effects ?? health.effects,
  });
  persistNow();
  return next;
}

export function resetHealth(): HealthState {
  health = emptyHealthState();
  persistNow();
  return getHealth();
}

export function parseHealthState(raw: unknown): HealthState {
  if (!raw || typeof raw !== "object") return emptyHealthState();
  const value = raw as Record<string, unknown>;
  const sources = Array.isArray(value.sources)
    ? uniqueSources(value.sources.filter(isHealthSource))
    : [];
  return {
    ...emptyHealthState(),
    healthEnabled: value.healthEnabled === true,
    fitbitEnabled: value.fitbitEnabled === true,
    watchMetricsEnabled: value.watchMetricsEnabled !== false,
    healthStatus: isHealthStatus(value.healthStatus) ? value.healthStatus : "idle",
    fitbitStatus: isHealthStatus(value.fitbitStatus) ? value.fitbitStatus : "idle",
    lastSyncedAt: typeof value.lastSyncedAt === "string" ? value.lastSyncedAt : null,
    dateKey: typeof value.dateKey === "string" ? value.dateKey : null,
    sources,
    summary: parseHealthSummary(value.summary ?? value),
    effects: parseHealthEffects(value.effects),
    fitbitAccessToken:
      typeof value.fitbitAccessToken === "string" ? value.fitbitAccessToken : null,
    fitbitRefreshToken:
      typeof value.fitbitRefreshToken === "string" ? value.fitbitRefreshToken : null,
    fitbitCodeVerifier:
      typeof value.fitbitCodeVerifier === "string" ? value.fitbitCodeVerifier : null,
  };
}

function uniqueSources(sources: HealthSource[]): HealthSource[] {
  return [...new Set(sources)];
}
