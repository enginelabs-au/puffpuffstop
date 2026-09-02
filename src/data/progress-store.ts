import {
  emptyProgress,
  makeProgressDay,
  mergeProgressDays,
  type ProgressDay,
  type ProgressState,
} from "../domain/progress";
import { persistNow } from "./persist-hook";

let state: ProgressState = emptyProgress();

export function getProgress(): ProgressState {
  return {
    lastGoal: state.lastGoal,
    lastUsual: state.lastUsual,
    days: state.days.map((day) => ({ ...day })),
  };
}

export function replaceProgress(next: ProgressState): ProgressState {
  state = {
    lastGoal: Math.max(0, next.lastGoal),
    lastUsual: Math.max(0, next.lastUsual),
    days: next.days.map((day) =>
      makeProgressDay(day.dateKey, day.logged, day.goal, day.usual),
    ),
  };
  return getProgress();
}

export function resetProgress(): ProgressState {
  state = emptyProgress();
  persistNow();
  return getProgress();
}

export function recordProgressDay(day: ProgressDay): ProgressState {
  const next = makeProgressDay(day.dateKey, day.logged, day.goal, day.usual);
  state = {
    lastGoal: next.goal,
    lastUsual: next.usual,
    days: mergeProgressDays(state.days, next),
  };
  persistNow();
  return getProgress();
}

export function parseProgressState(raw: unknown): ProgressState {
  if (!raw || typeof raw !== "object") return emptyProgress();
  const value = raw as Record<string, unknown>;
  const days = Array.isArray(value.days)
    ? value.days.flatMap((item) => {
        if (!item || typeof item !== "object") return [];
        const day = item as Record<string, unknown>;
        if (typeof day.dateKey !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(day.dateKey)) {
          return [];
        }
        const logged = typeof day.logged === "number" && Number.isFinite(day.logged) ? day.logged : 0;
        const goal = typeof day.goal === "number" && Number.isFinite(day.goal) ? day.goal : 0;
        const usual = typeof day.usual === "number" && Number.isFinite(day.usual) ? day.usual : 0;
        return [makeProgressDay(day.dateKey, logged, goal, usual)];
      })
    : [];
  const last = days.at(-1);
  return {
    days,
    lastGoal:
      typeof value.lastGoal === "number" && Number.isFinite(value.lastGoal)
        ? Math.max(0, value.lastGoal)
        : (last?.goal ?? 0),
    lastUsual:
      typeof value.lastUsual === "number" && Number.isFinite(value.lastUsual)
        ? Math.max(0, value.lastUsual)
        : (last?.usual ?? 0),
  };
}
