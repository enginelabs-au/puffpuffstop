import { useEffect, useState } from "react";
import { Pressable, View } from "react-native";

import {
  PACING_FOLD_HINT,
  PACING_INTERVALS_TITLE,
  PACING_LENIENT_TIP,
  goalPacing,
  livePacing,
  paceWindowCaption,
  type PaceWindow,
} from "../domain/pacing";
import { minTapTarget, space, type, type ColorTokens } from "../theme/tokens";
import { AppText } from "./AppText";
import { GoalResetRow } from "./GoalResetRow";
import { InfoTip } from "./InfoTip";
import { PaceRing } from "./PaceRing";
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
      <View style={styles.fold}>
        <Pressable
          accessibilityRole="button"
          accessibilityState={{ expanded: open }}
          accessibilityLabel={
            showGoal
              ? `${logged} of ${goalPuffsPerDay} today. ${open ? "Hide" : "Show"} pace intervals`
              : `${open ? "Hide" : "Show"} pace intervals`
          }
          onPress={() => setOpen((value) => !value)}
          style={({ pressed }) => [styles.foldMain, pressed ? styles.pressed : null]}
        >
          {header}
        </Pressable>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={open ? "Hide pace intervals" : "Show pace intervals"}
          onPress={() => setOpen((value) => !value)}
          style={({ pressed }) => [styles.chevronHit, pressed ? styles.pressed : null]}
        >
          <AppText style={styles.chevron}>{open ? "▾" : "▸"}</AppText>
        </Pressable>
      </View>
      {open ? (
        <View
          accessibilityRole="text"
          accessibilityLabel={`${PACING_FOLD_HINT} ${windows.map(paceWindowCaption).join(". ")}`}
          style={styles.detail}
        >
          <View style={styles.sectionHead}>
            <AppText style={styles.sectionTitle}>{PACING_INTERVALS_TITLE}</AppText>
            <InfoTip
              body={PACING_LENIENT_TIP}
              accessibilityLabel="How pacing leftover and borrowed puffs work"
            />
          </View>
          <View style={styles.rings}>
            {windows.map((window) => (
              <PaceRing
                key={window.kind}
                window={window}
                label={windowLabel(window)}
              />
            ))}
          </View>
        </View>
      ) : null}
    </View>
  );
}

function meterStyles(color: ColorTokens) {
  return {
    stack: {
      gap: space.xs,
      overflow: "visible" as const,
      zIndex: 2,
    },
    fold: {
      minHeight: minTapTarget,
      flexDirection: "row" as const,
      alignItems: "center" as const,
      justifyContent: "space-between" as const,
      gap: space.xs,
      overflow: "visible" as const,
      zIndex: 3,
    },
    foldMain: {
      flex: 1,
      minHeight: minTapTarget,
      justifyContent: "center" as const,
    },
    foldLabel: {
      ...type.body,
      fontWeight: "700" as const,
      color: color.ink,
    },
    chevronHit: {
      minWidth: minTapTarget,
      minHeight: minTapTarget,
      alignItems: "center" as const,
      justifyContent: "center" as const,
    },
    chevron: {
      ...type.body,
      fontWeight: "700" as const,
      color: color.inkMuted,
    },
    detail: {
      gap: space.sm,
      overflow: "visible" as const,
    },
    sectionHead: {
      flexDirection: "row" as const,
      alignItems: "center" as const,
      justifyContent: "space-between" as const,
      zIndex: 2,
    },
    sectionTitle: {
      ...type.body,
      fontWeight: "700" as const,
      color: color.ink,
    },
    rings: {
      flexDirection: "row" as const,
      alignItems: "flex-start" as const,
      justifyContent: "space-between" as const,
      gap: space.xs,
    },
    pressed: {
      opacity: 0.85,
    },
  };
}
