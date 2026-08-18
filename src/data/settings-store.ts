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

export function updateSettings(partial: Partial<SettingsState>): SettingsState {
  settings = { ...settings, ...partial };
  return getSettings();
}

export function resetSettings(): SettingsState {
  settings = { remindersEnabled: false, stakePerPuff: null };
  return getSettings();
}
