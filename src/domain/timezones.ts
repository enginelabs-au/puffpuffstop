export const DEFAULT_TIME_ZONE = "UTC";
export const DAY_RESET_CAPTION =
  "Your day resets at 11:59pm in this timezone. We start from the clock on your phone.";

const FALLBACK_TIME_ZONES = [
  "UTC",
  "Pacific/Auckland",
  "Australia/Sydney",
  "Australia/Melbourne",
  "Australia/Brisbane",
  "Australia/Adelaide",
  "Australia/Perth",
  "Asia/Tokyo",
  "Asia/Singapore",
  "Asia/Kolkata",
  "Europe/London",
  "Europe/Paris",
  "America/New_York",
  "America/Chicago",
  "America/Denver",
  "America/Los_Angeles",
] as const;

export function isTimeZone(value: string): boolean {
  if (!value) return false;
  try {
    Intl.DateTimeFormat("en-US", { timeZone: value }).format(new Date());
    return true;
  } catch {
    return false;
  }
}

export function deviceTimeZone(): string {
  const detected = Intl.DateTimeFormat().resolvedOptions().timeZone;
  return detected && isTimeZone(detected) ? detected : DEFAULT_TIME_ZONE;
}

export function resolveTimeZone(value?: string | null): string {
  if (value && isTimeZone(value)) return value;
  return deviceTimeZone();
}

export function listTimeZones(): string[] {
  const supported =
    typeof Intl.supportedValuesOf === "function"
      ? Intl.supportedValuesOf("timeZone")
      : [];
  const zones = new Set<string>([
    deviceTimeZone(),
    ...(supported.length > 0 ? supported : FALLBACK_TIME_ZONES),
  ]);
  return [...zones];
}

export function formatTimeZoneLabel(timeZone: string, now: Date = new Date()): string {
  const resolved = resolveTimeZone(timeZone);
  const city = resolved.split("/").pop()?.replace(/_/g, " ") ?? resolved;
  try {
    const offset = new Intl.DateTimeFormat("en-US", {
      timeZone: resolved,
      timeZoneName: "shortOffset",
    })
      .formatToParts(now)
      .find((part) => part.type === "timeZoneName")?.value;
    return offset ? `${city} · ${offset}` : city;
  } catch {
    return city;
  }
}

export function timeZoneOptions(): { value: string; label: string }[] {
  const device = deviceTimeZone();
  return listTimeZones().map((value) => ({
    value,
    label:
      value === device
        ? `${formatTimeZoneLabel(value)} · on this phone`
        : formatTimeZoneLabel(value),
  }));
}
