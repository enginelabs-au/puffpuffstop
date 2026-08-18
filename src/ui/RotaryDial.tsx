import { Pressable, StyleSheet, Text, View } from "react-native";

import { clampDial, DIAL_MAX } from "../domain/onboarding";
import { color, minTapTarget, radius, space, type } from "../theme/tokens";

type Props = {
  value: number;
  onChange: (value: number) => void;
  accessibilityLabel: string;
};

export function RotaryDial({ value, onChange, accessibilityLabel }: Props) {
  return (
    <View
      accessibilityLabel={accessibilityLabel}
      style={styles.row}
    >
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Decrease"
        onPress={() => onChange(clampDial(value - 1))}
        style={({ pressed }) => [styles.step, pressed ? styles.pressed : null]}
      >
        <Text style={styles.stepLabel}>−</Text>
      </Pressable>
      <Text style={styles.value} accessibilityRole="text">
        {clampDial(value)}
      </Text>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Increase"
        onPress={() => onChange(clampDial(value + 1))}
        style={({ pressed }) => [styles.step, pressed ? styles.pressed : null]}
      >
        <Text style={styles.stepLabel}>+</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: space.lg,
  },
  step: {
    minWidth: minTapTarget,
    minHeight: minTapTarget,
    borderRadius: radius.pill,
    backgroundColor: color.surface,
    alignItems: "center",
    justifyContent: "center",
  },
  stepLabel: {
    ...type.title,
    color: color.accent,
  },
  value: {
    fontSize: 56,
    fontWeight: "800",
    color: color.ink,
    minWidth: 120,
    textAlign: "center",
  },
  pressed: {
    opacity: 0.8,
  },
});

export const rotaryDialMax = DIAL_MAX;
