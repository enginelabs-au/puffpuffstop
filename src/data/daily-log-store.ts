import { localDateKey } from "../domain/organs";

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

let state: DailyLogState = {
  dateKey: localDateKey(),
  logged: 0,
  recoveryTicks: 0,
};

export function getDailyLog(): DailyLogState {
  return { ...state };
}

export function resetDailyLog(now: Date = new Date()): DailyLogState {
  state = { dateKey: localDateKey(now), logged: 0, recoveryTicks: 0 };
  return getDailyLog();
}

export function applyDayRollover(
  commitment: number,
  now: Date = new Date(),
): RolloverResult {
  const today = localDateKey(now);
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
  return {
    ...getDailyLog(),
    rolled: true,
    previousLogged,
    recovered,
  };
}

export function logPuff(commitment: number, now: Date = new Date()): DailyLogState {
  applyDayRollover(commitment, now);
  state = { ...state, logged: state.logged + 1 };
  return getDailyLog();
}

export function undoPuff(commitment: number, now: Date = new Date()): DailyLogState {
  applyDayRollover(commitment, now);
  state = { ...state, logged: Math.max(0, state.logged - 1) };
  return getDailyLog();
}
