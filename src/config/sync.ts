import { envNames } from "./env";

export type SyncStatus = "offline-local" | "env-present-not-connected";

export function readSyncStatus(
  env: Record<string, string | undefined> = process.env,
): SyncStatus {
  const url = env[envNames.supabaseUrl]?.trim();
  return url ? "env-present-not-connected" : "offline-local";
}

export function syncStatusLabel(status: SyncStatus): string {
  if (status === "env-present-not-connected") {
    return "Cloud sync is not connected. Names are wired; this build stays local.";
  }
  return "Cloud sync is off. Data stays on this device.";
}
