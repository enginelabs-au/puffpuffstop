import { useMemo, useState } from "react";
import {
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  TextInput,
  View,
} from "react-native";

import { minTapTarget, radius, scaledInput, space, type, type ColorTokens } from "../theme/tokens";
import { AppText } from "./AppText";
import { useTheme } from "./ThemeProvider";
import { useThemedStyles } from "./use-themed-styles";

export type SelectOption<T extends string> = {
  value: T;
  label: string;
};

type Props<T extends string> = {
  label: string;
  value: T | null;
  options: SelectOption<T>[];
  onChange: (value: T) => void;
  searchable?: boolean;
  placeholder?: string;
};

export function SelectField<T extends string>({
  label,
  value,
  options,
  onChange,
  searchable = false,
  placeholder = "Select",
}: Props<T>) {
  const { color } = useTheme();
  const styles = useThemedStyles(selectStyles);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const selected = options.find((row) => row.value === value);
  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return options;
    return options.filter(
      (row) =>
        row.label.toLowerCase().includes(needle) ||
        row.value.toLowerCase().includes(needle),
    );
  }, [options, query]);

  return (
    <View style={styles.wrap}>
      <AppText style={styles.caption}>{label}</AppText>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={label}
        onPress={() => setOpen(true)}
        style={({ pressed }) => [styles.field, pressed ? styles.pressed : null]}
      >
        <AppText style={styles.fieldLabel}>
          {selected?.label ?? placeholder}
        </AppText>
      </Pressable>
      <Modal visible={open} animationType="slide" onRequestClose={() => setOpen(false)}>
        <View style={styles.modal}>
          <AppText style={styles.title}>{label}</AppText>
          {searchable ? (
            <TextInput
              {...scaledInput}
              accessibilityLabel={`Search ${label}`}
              placeholder="Search"
              placeholderTextColor={color.inkMuted}
              value={query}
              onChangeText={setQuery}
              style={styles.input}
            />
          ) : null}
          <FlatList
            data={filtered}
            keyExtractor={(item) => item.value}
            keyboardShouldPersistTaps="handled"
            renderItem={({ item }) => (
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={item.label}
                onPress={() => {
                  onChange(item.value);
                  setOpen(false);
                  setQuery("");
                }}
                style={styles.row}
              >
                <AppText style={styles.rowLabel}>{item.label}</AppText>
              </Pressable>
            )}
          />
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Close"
            onPress={() => setOpen(false)}
            style={styles.close}
          >
            <AppText style={styles.closeLabel}>Close</AppText>
          </Pressable>
        </View>
      </Modal>
    </View>
  );
}

function selectStyles(color: ColorTokens) {
  return {
    wrap: {
      gap: space.sm,
    },
    caption: {
      ...type.caption,
      color: color.inkMuted,
    },
    field: {
      minHeight: minTapTarget,
      borderRadius: radius.md,
      backgroundColor: color.surface,
      paddingHorizontal: space.md,
      justifyContent: "center" as const,
    },
    fieldLabel: {
      ...type.body,
      color: color.ink,
    },
    modal: {
      flex: 1,
      backgroundColor: color.bg,
      paddingTop: 64,
      paddingHorizontal: space.lg,
      gap: space.sm,
    },
    title: {
      ...type.title,
      color: color.ink,
    },
    input: {
      minHeight: 48,
      borderRadius: radius.md,
      backgroundColor: color.surface,
      paddingHorizontal: space.md,
      ...type.body,
      color: color.ink,
    },
    row: {
      minHeight: minTapTarget,
      justifyContent: "center" as const,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: color.inkMuted,
    },
    rowLabel: {
      ...type.body,
      color: color.ink,
    },
    close: {
      minHeight: minTapTarget,
      alignItems: "center" as const,
      justifyContent: "center" as const,
      marginBottom: space.lg,
    },
    closeLabel: {
      ...type.body,
      color: color.accent,
      fontWeight: "700" as const,
    },
    pressed: {
      opacity: 0.85,
    },
  };
}
