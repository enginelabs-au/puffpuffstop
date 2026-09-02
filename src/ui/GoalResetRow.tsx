import { useEffect, useState } from "react";
import { View } from "react-native";

import { formatPaceCountdown, msUntilDayReset } from "../domain/pacing";
import { space, type, type ColorTokens } from "../theme/tokens";
import { AppText } from "./AppText";
import { useThemedStyles } from "./use-themed-styles";

type Props = {
  logged: number;
  goalPuffsPerDay: number;
  timeZone: string;
  overCap?: boolean;
};

const TICK_MS = 1000;

export function GoalResetRow({
  logged,
  goalPuffsPerDay,
  timeZone,
  overCap = false,
}: Props) {
  const styles = useThemedStyles(rowStyles);
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), TICK_MS);
    return () => clearInterval(timer);
  }, []);

  const left = formatPaceCountdown(msUntilDayReset(now, timeZone));

  return (
    <View
      style={styles.row}
      accessibilityRole="text"
      accessibilityLabel={`${logged} of ${goalPuffsPerDay} puffs today. ${left} until the day resets at 11:59pm`}
    >
      <AppText style={[styles.goal, overCap ? styles.goalOver : null]}>
        {logged}/{goalPuffsPerDay}
      </AppText>
      <AppText style={styles.time}>({left})</AppText>
    </View>
  );
}

function rowStyles(color: ColorTokens) {
  return {
    row: {
      flexDirection: "row" as const,
      alignItems: "baseline" as const,
      gap: space.sm,
    },
    goal: {
      ...type.body,
      fontWeight: "700" as const,
      color: color.ink,
    },
    goalOver: {
      color: color.amber,
    },
    time: {
      ...type.body,
      fontWeight: "700" as const,
      color: color.inkMuted,
    },
  };
}
