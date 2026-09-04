import { useState } from "react";
import { Pressable, View } from "react-native";

import { minTapTarget, radius, space, type, type ColorTokens } from "../theme/tokens";
import { AppText } from "./AppText";
import { useThemedStyles } from "./use-themed-styles";

type Props = {
  body: string;
  accessibilityLabel: string;
};

export function InfoTip({ body, accessibilityLabel }: Props) {
  const styles = useThemedStyles(tipStyles);
  const [open, setOpen] = useState(false);

  return (
    <View style={styles.wrap}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel}
        accessibilityState={{ expanded: open }}
        hitSlop={8}
        onPress={() => setOpen((value) => !value)}
        style={({ pressed }) => [styles.hit, pressed ? styles.pressed : null]}
      >
        <View style={styles.dot}>
          <AppText style={styles.mark}>i</AppText>
        </View>
      </Pressable>
      {open ? (
        <View
          accessibilityRole="text"
          accessibilityLabel={body}
          style={styles.card}
        >
          <AppText style={styles.cardText}>{body}</AppText>
        </View>
      ) : null}
    </View>
  );
}

function tipStyles(color: ColorTokens) {
  return {
    wrap: {
      position: "relative" as const,
      zIndex: 4,
    },
    hit: {
      width: minTapTarget,
      height: minTapTarget,
      alignItems: "center" as const,
      justifyContent: "center" as const,
    },
    dot: {
      width: 22,
      height: 22,
      borderRadius: 11,
      backgroundColor: color.sky,
      alignItems: "center" as const,
      justifyContent: "center" as const,
    },
    mark: {
      fontSize: 13,
      lineHeight: 16,
      fontWeight: "800" as const,
      color: color.onAccent,
    },
    card: {
      position: "absolute" as const,
      top: minTapTarget,
      right: 0,
      zIndex: 8,
      width: 280,
      backgroundColor: color.surface,
      borderRadius: radius.md,
      paddingHorizontal: space.md,
      paddingVertical: space.sm,
    },
    cardText: {
      ...type.caption,
      color: color.ink,
    },
    pressed: {
      opacity: 0.85,
    },
  };
}
