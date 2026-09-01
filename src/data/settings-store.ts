import { DEFAULT_THEME, resolveTheme, type ThemeName } from "../theme/tokens";
import { deviceTimeZone, resolveTimeZone } from "../domain/timezones";
import { persistNow } from "./persist-hook";

export type SettingsState = {
  remindersEnabled: boolean;
  stakePerPuff: number | null;
  timeZone: string;
  theme: ThemeName;
};

function emptySettings(): SettingsState {
  return {
    remindersEnabled: false,
    stakePerPuff: null,
    timeZone: deviceTimeZone(),
    theme: DEFAULT_THEME,
  };
}

let settings: SettingsState = emptySettings();

export function getSettings(): SettingsState {
  return {
    ...settings,
    timeZone: resolveTimeZone(settings.timeZone),
    theme: resolveTheme(settings.theme),
  };
}

export function replaceSettings(next: SettingsState): SettingsState {
  settings = {
    ...next,
    timeZone: resolveTimeZone(next.timeZone),
    theme: resolveTheme(next.theme),
  };
  return getSettings();
}

export function updateSettings(partial: Partial<SettingsState>): SettingsState {
  settings = {
    ...settings,
    ...partial,
    timeZone: resolveTimeZone(partial.timeZone ?? settings.timeZone),
    theme: resolveTheme(partial.theme ?? settings.theme),
  };
  persistNow();
  return getSettings();
}

export function resetSettings(): SettingsState {
  settings = emptySettings();
  persistNow();
  return getSettings();
}
