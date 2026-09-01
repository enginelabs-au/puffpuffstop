import { localDateKey } from "../domain/organs";
import { persistNow } from "./persist-hook";
import { getSettings } from "./settings-store";

export type DailyLogState = {
  dateKey: string;
  logged: number;
  recoveryTicks: number;
};

export type RolloverResult = DailyLogState & {
  rolled: boolean;
  previousLogged: number;
  recovered: boolean;
};

function todayKey(now: Date = new Date()): string {
  return localDateKey(now, getSettings().timeZone);
}

let state: DailyLogState = {
  dateKey: todayKey(),
  logged: 0,
  recoveryTicks: 0,
};

export function getDailyLog(): DailyLogState {
  return { ...state };
}

export function replaceDailyLog(next: DailyLogState): DailyLogState {
  state = { ...next };
  return getDailyLog();
}

export function resetDailyLog(now: Date = new Date()): DailyLogState {
  state = { dateKey: todayKey(now), logged: 0, recoveryTicks: 0 };
  persistNow();
  return getDailyLog();
}

export function retargetDailyLogDateKey(now: Date = new Date()): DailyLogState {
  const today = todayKey(now);
  if (state.dateKey === today) return getDailyLog();
  state = { ...state, dateKey: today };
  persistNow();
  return getDailyLog();
}

export function applyDayRollover(
  commitment: number,
  now: Date = new Date(),
): RolloverResult {
  const today = todayKey(now);
  if (state.dateKey === today) {
    return {
      ...getDailyLog(),
      rolled: false,
      previousLogged: state.logged,
      recovered: false,
    };
  }

  const previousLogged = state.logged;
  const recovered = previousLogged <= commitment;
  state = {
    dateKey: today,
    logged: 0,
    recoveryTicks: state.recoveryTicks + (recovered ? 1 : 0),
  };
  persistNow();
  return {
    ...getDailyLog(),
    rolled: true,
    previousLogged,
    recovered,
  };
}

export function logPuff(commitment: number, now: Date = new Date()): DailyLogState {
  return adjustPuffs(commitment, 1, now);
}

export function undoPuff(commitment: number, now: Date = new Date()): DailyLogState {
  return adjustPuffs(commitment, -1, now);
}

export function adjustPuffs(
  commitment: number,
  delta: number,
  now: Date = new Date(),
): DailyLogState {
  applyDayRollover(commitment, now);
  const next = Number.isFinite(delta) ? Math.round(delta) : 0;
  state = { ...state, logged: Math.max(0, state.logged + next) };
  persistNow();
  return getDailyLog();
}

export function clearTodayPuffs(
  commitment: number,
  now: Date = new Date(),
): DailyLogState {
  applyDayRollover(commitment, now);
  state = { ...state, logged: 0 };
  persistNow();
  return getDailyLog();
}
