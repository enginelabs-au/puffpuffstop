import { Pressable, StyleSheet, Text, View } from "react-native";

import { color, minTapTarget, radius, space, type } from "../theme/tokens";

export type ChipOption<T extends string> = {
  value: T;
  label: string;
};

type Props<T extends string> = {
  options: ChipOption<T>[];
  selected: T | T[] | null;
  multiple?: boolean;
  onChange: (value: T) => void;
};

export function ChipGroup<T extends string>({
  options,
  selected,
  multiple = false,
  onChange,
}: Props<T>) {
  return (
    <View style={styles.wrap}>
      {options.map((option) => {
        const isOn = Array.isArray(selected)
          ? selected.includes(option.value)
          : selected === option.value;
        return (
          <Pressable
            key={option.value}
            accessibilityRole={multiple ? "checkbox" : "button"}
            accessibilityState={{ selected: isOn, checked: multiple ? isOn : undefined }}
            accessibilityLabel={option.label}
            onPress={() => onChange(option.value)}
            style={({ pressed }) => [
              styles.chip,
              isOn ? styles.chipOn : null,
              pressed ? styles.pressed : null,
            ]}
          >
            <Text style={[styles.label, isOn ? styles.labelOn : null]}>
              {option.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: space.sm,
  },
  chip: {
    minHeight: minTapTarget,
    borderRadius: radius.pill,
    backgroundColor: color.surface,
    paddingHorizontal: space.md,
    justifyContent: "center",
  },
  chipOn: {
    backgroundColor: color.accent,
  },
  label: {
    ...type.body,
    color: color.ink,
  },
  labelOn: {
    color: color.onAccent,
  },
  pressed: {
    opacity: 0.85,
  },
});
