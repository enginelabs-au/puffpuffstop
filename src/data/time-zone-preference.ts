import { resolveTimeZone } from "../domain/timezones";
import { retargetDailyLogDateKey } from "./daily-log-store";
import { updateSettings } from "./settings-store";

export function applyTimeZonePreference(
  timeZone: string,
  now: Date = new Date(),
): string {
  const resolved = resolveTimeZone(timeZone);
  updateSettings({ timeZone: resolved });
  retargetDailyLogDateKey(now);
  return resolved;
}
