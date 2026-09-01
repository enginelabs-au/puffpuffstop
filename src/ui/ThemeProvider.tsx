import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { Appearance } from "react-native";

import { getSettings, updateSettings } from "../data/settings-store";
import {
  colorsFor,
  type ColorTokens,
  type ThemeName,
} from "../theme/tokens";

export type ThemeContextValue = {
  theme: ThemeName;
  color: ColorTokens;
  setTheme: (theme: ThemeName) => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<ThemeName>(() => getSettings().theme);
  const color = colorsFor(theme);

  useEffect(() => {
    Appearance.setColorScheme(theme);
  }, [theme]);

  const value = useMemo<ThemeContextValue>(
    () => ({
      theme,
      color,
      setTheme: (next) => {
        setThemeState(next);
        updateSettings({ theme: next });
      },
    }),
    [theme, color],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (ctx) return ctx;
  const theme = getSettings().theme;
  return {
    theme,
    color: colorsFor(theme),
    setTheme: (next) => {
      updateSettings({ theme: next });
    },
  };
}
