import { View } from "react-native";

import { PERIOD_CHOICES, PUFF_DIAL_MAX, frequencyCaption } from "../domain/onboarding";
import type { Period } from "../domain/estimation";
import { space, type ColorTokens } from "../theme/tokens";
import { AppText } from "./AppText";
import { ChipGroup } from "./ChipGroup";
import { RotaryDial } from "./RotaryDial";
import { useThemedStyles } from "./use-themed-styles";

type Props = {
  count: number;
  period: Period;
  onChange: (count: number, period: Period) => void;
};

export function GoalField({ count, period, onChange }: Props) {
  const styles = useThemedStyles(fieldStyles);
  return (
    <View style={styles.stack}>
      <RotaryDial
        accessibilityLabel="Puff goal"
        value={count}
        onChange={(next) => onChange(next, period)}
        max={PUFF_DIAL_MAX}
      />
      <AppText style={styles.caption}>{frequencyCaption(count, period)}</AppText>
      <ChipGroup
        options={PERIOD_CHOICES}
        selected={period}
        onChange={(next) => onChange(count, next)}
      />
    </View>
  );
}

function fieldStyles(color: ColorTokens) {
  return {
    stack: {
      gap: space.sm,
    },
    caption: {
      color: color.inkMuted,
    },
  };
}
