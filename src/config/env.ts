export const envNames = {
  appEnv: "EXPO_PUBLIC_APP_ENV",
  supabaseUrl: "EXPO_PUBLIC_SUPABASE_URL",
  supabaseAnonKey: "EXPO_PUBLIC_SUPABASE_ANON_KEY",
  supabaseProjectRef: "SUPABASE_PROJECT_REF",
  easProjectId: "EAS_PROJECT_ID",
  privacyPolicyUrl: "EXPO_PUBLIC_PRIVACY_POLICY_URL",
} as const;

export function readAppEnv(
  env: Record<string, string | undefined> = process.env,
): "local" | "preview" | "production" {
  const value = env[envNames.appEnv];
  if (value === "preview" || value === "production") {
    return value;
  }
  return "local";
}

export function readPrivacyPolicyUrl(
  env: Record<string, string | undefined> = process.env,
): string | null {
  const value = env[envNames.privacyPolicyUrl]?.trim();
  if (!value) return null;
  try {
    const parsed = new URL(value);
    return parsed.protocol === "https:" ? value : null;
  } catch {
    return null;
  }
}
