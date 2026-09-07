import { Pressable, View } from "react-native";

import { CUT_DOWN_COACH_MESSAGE } from "../domain/cut-down-coach";
import { radius, space, type, type ColorTokens } from "../theme/tokens";
import { AppText } from "./AppText";
import { useThemedStyles } from "./use-themed-styles";

type Props = {
  onKeep: () => void;
  onChange: () => void;
};

export function CutDownCoachBanner({ onKeep, onChange }: Props) {
  const styles = useThemedStyles(bannerStyles);
  return (
    <View
      accessibilityLiveRegion="polite"
      accessibilityLabel={CUT_DOWN_COACH_MESSAGE}
      style={styles.card}
    >
      <AppText style={styles.message}>{CUT_DOWN_COACH_MESSAGE}</AppText>
      <View style={styles.row}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Keep this reduce-by pace"
          onPress={onKeep}
          style={({ pressed }) => [styles.button, pressed ? styles.pressed : null]}
        >
          <AppText style={styles.buttonLabel}>Keep going</AppText>
        </Pressable>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Change how many puffs to reduce by"
          onPress={onChange}
          style={({ pressed }) => [styles.button, pressed ? styles.pressed : null]}
        >
          <AppText style={styles.buttonLabel}>Change reduce-by</AppText>
        </Pressable>
      </View>
    </View>
  );
}

function bannerStyles(color: ColorTokens) {
  return {
    card: {
      backgroundColor: color.surface,
      borderRadius: radius.lg,
      padding: space.md,
      gap: space.sm,
    },
    message: {
      ...type.body,
      color: color.ink,
    },
    row: {
      flexDirection: "row" as const,
      gap: space.sm,
    },
    button: {
      flex: 1,
      backgroundColor: color.accentMint,
      borderRadius: radius.md,
      paddingVertical: space.sm,
      alignItems: "center" as const,
    },
    buttonLabel: {
      ...type.body,
      fontWeight: "700" as const,
      color: color.onAccent,
    },
    pressed: {
      opacity: 0.85,
    },
  };
}
