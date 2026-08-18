export const color = {
  sky: "#00B8F8",
  bg: "#D8F4FC",
  surface: "#FFFFFF",
  ink: "#163047",
  inkMuted: "#4A6A80",
  accent: "#7A6BA8",
  accentMint: "#2EC4A8",
  amber: "#F4B942",
  danger: "#E35D6A",
  blockedBg: "#E4EEF8",
  onAccent: "#FFFFFF",
} as const;

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

export const tokens = { color, space, radius, type, motion, fontScale } as const;

export const minTapTarget = 44;
