export const envNames = {
  appEnv: "EXPO_PUBLIC_APP_ENV",
  supabaseUrl: "EXPO_PUBLIC_SUPABASE_URL",
  supabaseAnonKey: "EXPO_PUBLIC_SUPABASE_ANON_KEY",
  supabaseProjectRef: "SUPABASE_PROJECT_REF",
  easProjectId: "EAS_PROJECT_ID",
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
