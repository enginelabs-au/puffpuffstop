import { persistNow } from "./persist-hook";

export type SettingsState = {
  remindersEnabled: boolean;
  stakePerPuff: number | null;
};

let settings: SettingsState = {
  remindersEnabled: false,
  stakePerPuff: null,
};

export function getSettings(): SettingsState {
  return { ...settings };
}

export function replaceSettings(next: SettingsState): SettingsState {
  settings = { ...next };
  return getSettings();
}

export function updateSettings(partial: Partial<SettingsState>): SettingsState {
  settings = { ...settings, ...partial };
  persistNow();
  return getSettings();
}

export function resetSettings(): SettingsState {
  settings = { remindersEnabled: false, stakePerPuff: null };
  persistNow();
  return getSettings();
}
