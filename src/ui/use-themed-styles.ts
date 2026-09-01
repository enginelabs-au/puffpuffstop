import { useMemo } from "react";
import { StyleSheet, type ImageStyle, type TextStyle, type ViewStyle } from "react-native";

import type { ColorTokens } from "../theme/tokens";
import { useTheme } from "./ThemeProvider";

type NamedStyles<T> = { [P in keyof T]: ViewStyle | TextStyle | ImageStyle };

export function useThemedStyles<T extends NamedStyles<T>>(
  factory: (palette: ColorTokens) => T,
): T {
  const theme = useTheme();
  const palette = theme.color;
  return useMemo(() => StyleSheet.create(factory(palette)), [factory, palette]);
}
