import { localDateKey } from "../domain/organs";
import { summarizePlan } from "../domain/plan-summary";
import { persistNow } from "./persist-hook";
import { getDraft } from "./onboarding-store";
import { recordProgressDay } from "./progress-store";
import { getSettings } from "./settings-store";

export type DailyLogState = {
  dateKey: string;
  logged: number;
  recoveryTicks: number;
  puffAt: number[];
};

export type RolloverResult = DailyLogState & {
  rolled: boolean;
  previousLogged: number;
  recovered: boolean;
};

function todayKey(now: Date = new Date()): string {
  return localDateKey(now, getSettings().timeZone);
}

function normalizePuffAt(logged: number, puffAt?: readonly number[]): number[] {
  if (logged <= 0) return [];
  const times = (puffAt ?? []).filter((at) => Number.isFinite(at) && at > 0);
  return times.length > logged ? times.slice(-logged) : times;
}

let state: DailyLogState = {
  dateKey: todayKey(),
  logged: 0,
  recoveryTicks: 0,
  puffAt: [],
};

export function getDailyLog(): DailyLogState {
  return { ...state, puffAt: [...state.puffAt] };
}

export function replaceDailyLog(next: DailyLogState): DailyLogState {
  state = {
    dateKey: next.dateKey,
    logged: Math.max(0, next.logged),
    recoveryTicks: Math.max(0, next.recoveryTicks),
    puffAt: normalizePuffAt(next.logged, next.puffAt),
  };
  return getDailyLog();
}

export function resetDailyLog(now: Date = new Date()): DailyLogState {
  state = { dateKey: todayKey(now), logged: 0, recoveryTicks: 0, puffAt: [] };
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
  const usual = summarizePlan(getDraft()).puffsPerDay;
  recordProgressDay({
    dateKey: state.dateKey,
    logged: previousLogged,
    goal: commitment,
    usual,
    met: recovered && commitment > 0,
  });
  state = {
    dateKey: today,
    logged: 0,
    recoveryTicks: state.recoveryTicks + (recovered ? 1 : 0),
    puffAt: [],
  };
  recordProgressDay({
    dateKey: today,
    logged: 0,
    goal: commitment,
    usual,
    met: commitment > 0,
  });
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
  const logged = Math.max(0, state.logged + next);
  let puffAt = [...state.puffAt];
  if (next > 0) {
    const at = now.getTime();
    for (let i = 0; i < next; i += 1) puffAt.push(at);
  } else if (next < 0) {
    puffAt = puffAt.slice(0, Math.max(0, puffAt.length + next));
  }
  state = { ...state, logged, puffAt: normalizePuffAt(logged, puffAt) };
  const usual = summarizePlan(getDraft()).puffsPerDay;
  recordProgressDay({
    dateKey: state.dateKey,
    logged,
    goal: commitment,
    usual,
    met: commitment > 0 && logged <= commitment,
  });
  persistNow();
  return getDailyLog();
}

export function clearTodayPuffs(
  commitment: number,
  now: Date = new Date(),
): DailyLogState {
  applyDayRollover(commitment, now);
  state = { ...state, logged: 0, puffAt: [] };
  recordProgressDay({
    dateKey: state.dateKey,
    logged: 0,
    goal: commitment,
    usual: summarizePlan(getDraft()).puffsPerDay,
    met: commitment > 0,
  });
  persistNow();
  return getDailyLog();
}
