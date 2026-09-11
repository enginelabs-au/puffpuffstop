import { TextInput, View } from "react-native";

import { PERIOD_CHOICES, PUFF_DIAL_MAX, clampDial } from "../domain/onboarding";
import type { Period } from "../domain/estimation";
import { scaledInput, space, type ColorTokens } from "../theme/tokens";
import { AppText } from "./AppText";
import { ChipGroup } from "./ChipGroup";
import { useTheme } from "./ThemeProvider";
import { useThemedStyles } from "./use-themed-styles";

type Props = {
  count: number;
  period: Period;
  onChange: (count: number, period: Period) => void;
};

export function ReduceByField({ count, period, onChange }: Props) {
  const { color } = useTheme();
  const styles = useThemedStyles(fieldStyles);
  return (
    <View style={styles.stack}>
      <TextInput
        {...scaledInput}
        accessibilityLabel="Puffs to reduce by"
        keyboardType="number-pad"
        value={count === 0 ? "" : String(count)}
        placeholder="How many puffs"
        placeholderTextColor={color.inkMuted}
        onChangeText={(text) => {
          const parsed = Number(text);
          onChange(
            text === "" || Number.isNaN(parsed)
              ? 0
              : clampDial(parsed, PUFF_DIAL_MAX),
            period,
          );
        }}
        style={styles.input}
      />
      <AppText style={styles.caption}>Each</AppText>
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
    input: {
      ...scaledInput,
      color: color.ink,
      borderColor: color.inkMuted,
    },
    caption: {
      color: color.inkMuted,
    },
  };
}
