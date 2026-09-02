import { View } from "react-native";

import {
  PACING_TRACKER_DISCLAIMER,
  goalPacing,
  goalPacingCaption,
} from "../domain/pacing";
import { radius, space, type, type ColorTokens } from "../theme/tokens";
import { AppText } from "./AppText";
import { useThemedStyles } from "./use-themed-styles";

type Props = {
  averagePuffsPerDay: number;
  goalPuffsPerDay: number;
};

export function GoalPacingBreakdown({
  averagePuffsPerDay,
  goalPuffsPerDay,
}: Props) {
  const styles = useThemedStyles(breakdownStyles);
  const pacing = goalPacing(averagePuffsPerDay, goalPuffsPerDay);
  if (!pacing.applies) return null;

  return (
    <View
      style={styles.card}
      accessibilityRole="text"
      accessibilityLabel={goalPacingCaption(pacing)}
    >
      <AppText style={styles.line}>
        Goal {pacing.goalPuffsPerDay} · {pacing.perHour} an hour ·{" "}
        {pacing.per30Minutes} / 30 min · {pacing.per15Minutes} / 15 min
      </AppText>
      <AppText style={styles.caption}>
        Usual day is about {pacing.averagePuffsPerDay}.{" "}
        {PACING_TRACKER_DISCLAIMER}
      </AppText>
    </View>
  );
}

function breakdownStyles(color: ColorTokens) {
  return {
    card: {
      backgroundColor: color.surface,
      borderRadius: radius.lg,
      padding: space.md,
      gap: space.xs,
    },
    line: {
      ...type.body,
      color: color.ink,
      fontWeight: "700" as const,
    },
    caption: {
      ...type.caption,
      color: color.inkMuted,
    },
  };
}
