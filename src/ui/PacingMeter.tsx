import { useEffect, useState } from "react";
import { View } from "react-native";

import {
  formatPaceCountdown,
  goalPacing,
  livePacing,
  paceWindowCaption,
  type PaceWindow,
} from "../domain/pacing";
import { lightColor, radius, space, type, type ColorTokens } from "../theme/tokens";
import { AppText } from "./AppText";
import { useThemedStyles } from "./use-themed-styles";

type Props = {
  averagePuffsPerDay: number;
  goalPuffsPerDay: number;
  puffAt: readonly number[];
  timeZone: string;
};

const TICK_MS = 1000;

function windowLabel(window: PaceWindow): string {
  if (window.kind === "hour") return "Hour";
  if (window.kind === "30 minutes") return "30 Min";
  return "15 Min";
}

export function PacingMeter({
  averagePuffsPerDay,
  goalPuffsPerDay,
  puffAt,
  timeZone,
}: Props) {
  const styles = useThemedStyles(meterStyles);
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), TICK_MS);
    return () => clearInterval(timer);
  }, []);

  const pacing = goalPacing(averagePuffsPerDay, goalPuffsPerDay);
  if (!pacing.applies) return null;
  const live = livePacing(pacing, puffAt, now, timeZone);
  const windows = [live.hour, live.halfHour, live.quarterHour];

  return (
    <View
      style={styles.stack}
      accessibilityRole="text"
      accessibilityLabel={windows.map(paceWindowCaption).join(". ")}
    >
      {windows.map((window) => (
        <View
          key={window.kind}
          style={[styles.chip, window.open ? styles.open : styles.wait]}
        >
          <AppText style={styles.chipLabel}>
            {windowLabel(window)}: {window.used}/{window.allowance}
          </AppText>
          <AppText style={styles.chipTime}>
            ({formatPaceCountdown(window.msUntilReset)})
          </AppText>
        </View>
      ))}
    </View>
  );
}

function meterStyles(color: ColorTokens) {
  return {
    stack: {
      gap: space.xs,
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
    chipLabel: {
      ...type.body,
      fontWeight: "700" as const,
      color: lightColor.ink,
      flexShrink: 1,
    },
    chipTime: {
      ...type.body,
      fontWeight: "700" as const,
      color: lightColor.ink,
    },
  };
}
