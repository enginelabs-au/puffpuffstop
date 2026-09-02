import { useEffect, useState } from "react";
import { Pressable, View } from "react-native";

import {
  PACING_FOLD_HINT,
  formatPaceCountdown,
  goalPacing,
  livePacing,
  paceWindowCaption,
  type PaceWindow,
} from "../domain/pacing";
import {
  lightColor,
  minTapTarget,
  radius,
  space,
  type,
  type ColorTokens,
} from "../theme/tokens";
import { AppText } from "./AppText";
import { GoalResetRow } from "./GoalResetRow";
import { useThemedStyles } from "./use-themed-styles";

type Props = {
  averagePuffsPerDay: number;
  goalPuffsPerDay: number;
  puffAt: readonly number[];
  timeZone: string;
  logged?: number;
  showGoal?: boolean;
  overCap?: boolean;
  defaultOpen?: boolean;
};

const TICK_MS = 1000;

function windowLabel(window: PaceWindow): string {
  if (window.kind === "hour") return "1 Hour";
  if (window.kind === "30 minutes") return "30 Min";
  return "15 Min";
}

export function PacingMeter({
  averagePuffsPerDay,
  goalPuffsPerDay,
  puffAt,
  timeZone,
  logged = puffAt.length,
  showGoal = false,
  overCap = false,
  defaultOpen = true,
}: Props) {
  const styles = useThemedStyles(meterStyles);
  const [now, setNow] = useState(() => new Date());
  const [open, setOpen] = useState(defaultOpen);

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), TICK_MS);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    setOpen(defaultOpen);
  }, [defaultOpen]);

  const pacing = goalPacing(averagePuffsPerDay, goalPuffsPerDay);
  const live = pacing.applies
    ? livePacing(pacing, puffAt, now, timeZone, logged)
    : null;
  const windows = live
    ? [live.hour, live.halfHour, live.quarterHour]
    : [];

  const header = showGoal ? (
    <GoalResetRow
      logged={logged}
      goalPuffsPerDay={goalPuffsPerDay}
      timeZone={timeZone}
      overCap={overCap}
    />
  ) : (
    <AppText style={styles.foldLabel}>Pace</AppText>
  );

  if (!pacing.applies) {
    return showGoal ? header : null;
  }

  return (
    <View style={styles.stack}>
      <Pressable
        accessibilityRole="button"
        accessibilityState={{ expanded: open }}
        accessibilityLabel={
          showGoal
            ? `${logged} of ${goalPuffsPerDay} today. ${open ? "Hide" : "Show"} pace intervals`
            : `${open ? "Hide" : "Show"} pace intervals`
        }
        onPress={() => setOpen((value) => !value)}
        style={({ pressed }) => [styles.fold, pressed ? styles.pressed : null]}
      >
        <View style={styles.foldMain}>{header}</View>
        <AppText style={styles.chevron}>{open ? "▾" : "▸"}</AppText>
      </Pressable>
      {open ? (
        <View
          accessibilityRole="text"
          accessibilityLabel={`${PACING_FOLD_HINT} ${windows.map(paceWindowCaption).join(". ")}`}
          style={styles.detail}
        >
          <AppText style={styles.hint}>{PACING_FOLD_HINT}</AppText>
          {windows.map((window) => (
            <View
              key={window.kind}
              style={[
                styles.chip,
                window.open
                  ? styles.open
                  : window.over
                    ? styles.over
                    : styles.wait,
              ]}
            >
              <View style={styles.chipCopy}>
                <AppText style={styles.chipName}>{windowLabel(window)}</AppText>
                <AppText style={styles.chipCounts}>
                  (used) {window.used}/{window.allowance} (unused)
                </AppText>
              </View>
              <AppText style={styles.chipTime}>
                ({formatPaceCountdown(window.msUntilReset)})
              </AppText>
            </View>
          ))}
        </View>
      ) : null}
    </View>
  );
}

function meterStyles(color: ColorTokens) {
  return {
    stack: {
      gap: space.xs,
    },
    fold: {
      minHeight: minTapTarget,
      flexDirection: "row" as const,
      alignItems: "center" as const,
      justifyContent: "space-between" as const,
      gap: space.sm,
    },
    foldMain: {
      flex: 1,
    },
    foldLabel: {
      ...type.body,
      fontWeight: "700" as const,
      color: color.ink,
    },
    chevron: {
      ...type.body,
      fontWeight: "700" as const,
      color: color.inkMuted,
    },
    detail: {
      gap: space.xs,
    },
    hint: {
      ...type.caption,
      color: color.inkMuted,
    },
    chip: {
      borderRadius: radius.sm,
      paddingHorizontal: space.md,
      paddingVertical: space.sm,
      flexDirection: "row" as const,
      alignItems: "center" as const,
      justifyContent: "space-between" as const,
      gap: space.sm,
    },
    open: {
      backgroundColor: color.accentMint,
    },
    wait: {
      backgroundColor: color.amber,
    },
    over: {
      backgroundColor: color.danger,
    },
    chipCopy: {
      flex: 1,
      gap: 2,
    },
    chipName: {
      ...type.body,
      fontWeight: "700" as const,
      color: lightColor.ink,
    },
    chipCounts: {
      ...type.caption,
      fontWeight: "700" as const,
      color: lightColor.ink,
    },
    chipTime: {
      ...type.body,
      fontWeight: "700" as const,
      color: lightColor.ink,
    },
    pressed: {
      opacity: 0.85,
    },
  };
}
