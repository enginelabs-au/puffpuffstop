import { Pressable, View } from "react-native";

import { minTapTarget, type, type ColorTokens } from "../theme/tokens";
import { AppText } from "./AppText";
import { useThemedStyles } from "./use-themed-styles";

type Props = {
  score: number | null;
  onPress: () => void;
};

export function ProfileScoreButton({ score, onPress }: Props) {
  const styles = useThemedStyles(buttonStyles);
  const label = score === null ? "Score" : `${score} percent score`;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${label}. Opens your stats`}
      onPress={onPress}
      style={({ pressed }) => [styles.hit, pressed ? styles.pressed : null]}
    >
      <View style={[styles.circle, score !== null && score >= 70 ? styles.good : styles.wait]}>
        <AppText style={styles.value}>{score === null ? "—" : String(score)}</AppText>
      </View>
    </Pressable>
  );
}

function buttonStyles(color: ColorTokens) {
  return {
    hit: {
      minWidth: minTapTarget,
      minHeight: minTapTarget,
      alignItems: "center" as const,
      justifyContent: "center" as const,
    },
    circle: {
      width: 40,
      height: 40,
      borderRadius: 20,
      alignItems: "center" as const,
      justifyContent: "center" as const,
    },
    good: {
      backgroundColor: color.accentMint,
    },
    wait: {
      backgroundColor: color.amber,
    },
    value: {
      ...type.caption,
      fontWeight: "800" as const,
      color: color.onAccent,
    },
    pressed: {
      opacity: 0.85,
    },
  };
}
