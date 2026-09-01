export type ThemeName = "light" | "dark";

export const DEFAULT_THEME: ThemeName = "dark";

export const THEME_OPTIONS: { value: ThemeName; label: string }[] = [
  { value: "dark", label: "Dark" },
  { value: "light", label: "Light" },
];

export const lightColor = {
  sky: "#00B8F8",
  bg: "#D8F4FC",
  surface: "#FFF7EC",
  ink: "#163047",
  inkMuted: "#4A6A80",
  accent: "#FF7A9A",
  accentMint: "#5FE0B7",
  amber: "#F4B942",
  danger: "#E35D6A",
  blockedBg: "#E4EEF8",
  onAccent: "#FFFFFF",
  cream: "#FFF7EC",
  sheen: "rgba(255,255,255,0.55)",
  tabOn: "#163047",
} as const;

export const darkColor = {
  sky: "#00B8F8",
  bg: "#0E2230",
  surface: "#1A3546",
  ink: "#E8F6FC",
  inkMuted: "#8AA8B8",
  accent: "#FF7A9A",
  accentMint: "#5FE0B7",
  amber: "#F4B942",
  danger: "#FF7A86",
  blockedBg: "#132838",
  onAccent: "#0E2230",
  cream: "#1A3546",
  sheen: "rgba(255,255,255,0.08)",
  tabOn: "#00B8F8",
} as const;

export type ColorTokens = { [K in keyof typeof lightColor]: string };

/** Light palette. Screens should use `colorsFor(theme)` or `useTheme()`. */
export const color = lightColor;

export function resolveTheme(value: unknown): ThemeName {
  return value === "light" || value === "dark" ? value : DEFAULT_THEME;
}

export function colorsFor(theme: ThemeName): ColorTokens {
  return theme === "light" ? lightColor : darkColor;
}

export const space = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 40,
} as const;

export const radius = {
  sm: 12,
  md: 20,
  lg: 28,
  pill: 999,
} as const;

export const type = {
  title: { fontSize: 28, fontWeight: "800" as const },
  body: { fontSize: 17, fontWeight: "500" as const },
  caption: { fontSize: 13, fontWeight: "500" as const },
} as const;

export const motion = {
  fast: 160,
  loop: 2400,
} as const;

export const fontScale = {
  allowFontScaling: true,
  maxFontSizeMultiplier: 1.4,
} as const;

export const scaledInput = {
  allowFontScaling: fontScale.allowFontScaling,
  maxFontSizeMultiplier: fontScale.maxFontSizeMultiplier,
} as const;

export const tokens = {
  color,
  darkColor,
  lightColor,
  space,
  radius,
  type,
  motion,
  fontScale,
} as const;

export const minTapTarget = 44;
