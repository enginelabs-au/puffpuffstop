import { Pressable, View } from "react-native";

import { color, minTapTarget, radius, space, type, type ColorTokens } from "../theme/tokens";
import { AppText } from "./AppText";
import { useThemedStyles } from "./use-themed-styles";

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
  const styles = useThemedStyles(chipStyles);
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
            <AppText style={[styles.label, isOn ? styles.labelOn : null]}>
              {option.label}
            </AppText>
          </Pressable>
        );
      })}
    </View>
  );
}

function chipStyles(palette: ColorTokens = color) {
  return {
    wrap: {
      flexDirection: "row" as const,
      flexWrap: "wrap" as const,
      gap: space.sm,
    },
    chip: {
      minHeight: minTapTarget,
      borderRadius: radius.pill,
      backgroundColor: palette.surface,
      paddingHorizontal: space.md,
      justifyContent: "center" as const,
    },
    chipOn: {
      backgroundColor: palette.accent,
    },
    label: {
      ...type.body,
      color: palette.ink,
    },
    labelOn: {
      color: palette.onAccent,
    },
    pressed: {
      opacity: 0.85,
    },
  };
}
