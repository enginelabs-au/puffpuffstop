import { Pressable } from "react-native";

import { USAGE_SURGE_MESSAGE } from "../domain/usage-surge";
import { lightColor, radius, space, type, type ColorTokens } from "../theme/tokens";
import { AppText } from "./AppText";
import { useThemedStyles } from "./use-themed-styles";

type Props = {
  onDismiss: () => void;
};

export function UsageSurgeBanner({ onDismiss }: Props) {
  const styles = useThemedStyles(bannerStyles);
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLiveRegion="polite"
      accessibilityLabel={USAGE_SURGE_MESSAGE}
      onPress={onDismiss}
      style={({ pressed }) => [styles.card, pressed ? styles.pressed : null]}
    >
      <AppText style={styles.message}>{USAGE_SURGE_MESSAGE}</AppText>
    </Pressable>
  );
}

function bannerStyles(color: ColorTokens) {
  return {
    card: {
      backgroundColor: color.amber,
      borderRadius: radius.lg,
      padding: space.md,
    },
    message: {
      ...type.body,
      fontWeight: "700" as const,
      color: lightColor.ink,
    },
    pressed: {
      opacity: 0.85,
    },
  };
}
