import { useEffect } from "react";
import { AppState } from "react-native";

import { getDailyLog } from "../data/daily-log-store";
import { intervalPacingRemindersEnabled } from "../domain/onboarding";
import { getDraft } from "../data/onboarding-store";
import { getSettings } from "../data/settings-store";
import { goalPacing, livePacing, shouldVibrateOnPaceLapse } from "../domain/pacing";
import { summarizePlan } from "../domain/plan-summary";
import { playPaceResetHaptic } from "./haptics";

const TICK_MS = 1000;

export function usePaceResetHaptic(ready: boolean): void {
  useEffect(() => {
    if (!ready) return;
    let previous = null as ReturnType<typeof livePacing> | null;
    const tick = () => {
      const draft = getDraft();
      const summary = summarizePlan(draft);
      const pacing = goalPacing(summary.puffsPerDay, summary.commitment);
      if (!pacing.applies) {
        previous = null;
        return;
      }
      const log = getDailyLog();
      const next = livePacing(
        pacing,
        log.puffAt,
        new Date(),
        getSettings().timeZone,
        log.logged,
      );
      if (
        AppState.currentState === "active" &&
        intervalPacingRemindersEnabled(draft) &&
        shouldVibrateOnPaceLapse(previous, next)
      ) {
        void playPaceResetHaptic();
      }
      previous = next;
    };
    const timer = setInterval(tick, TICK_MS);
    return () => clearInterval(timer);
  }, [ready]);
}
