import { LinearGradient } from "expo-linear-gradient";
import { View } from "react-native";

import {
  ORGAN_LABELS,
  formatOrganPercent,
  type OrganId,
} from "../domain/organs";
import { radius, space, type, type ColorTokens } from "../theme/tokens";
import { AppText } from "./AppText";
import { CartoonOrgan } from "./CartoonOrgan";
import { useTheme } from "./ThemeProvider";
import { useThemedStyles } from "./use-themed-styles";

type Props = {
  id: OrganId;
  score: number;
  recovering: boolean;
  celebrating?: boolean;
};

export function OrganCard({ id, score, recovering, celebrating = false }: Props) {
  const { color } = useTheme();
  const styles = useThemedStyles(organStyles);
  const label = ORGAN_LABELS[id];
  const percent = formatOrganPercent(score);

  return (
    <View
      accessibilityLabel={`${label}, ${percent} percent, motivational estimate`}
      style={[
        styles.card,
        recovering ? styles.recovering : null,
        celebrating ? styles.celebrating : null,
      ]}
    >
      <LinearGradient
        colors={[color.sheen, "rgba(255,255,255,0)"]}
        style={styles.sheen}
      />
      <CartoonOrgan
        id={id}
        score={score}
        recovering={recovering}
        celebrating={celebrating}
      />
      <AppText style={styles.name}>{label}</AppText>
      <AppText style={styles.percent}>{percent}%</AppText>
    </View>
  );
}

function organStyles(color: ColorTokens) {
  return {
    card: {
      width: "48%" as const,
      flexGrow: 0,
      backgroundColor: color.surface,
      borderRadius: radius.lg,
      paddingVertical: space.sm,
      paddingHorizontal: space.sm,
      gap: 2,
      alignItems: "center" as const,
      overflow: "hidden" as const,
    },
    sheen: {
      position: "absolute" as const,
      top: 0,
      left: 0,
      right: 0,
      height: 36,
    },
    recovering: {
      borderWidth: 3,
      borderColor: color.accentMint,
    },
    celebrating: {
      borderWidth: 3,
      borderColor: color.amber,
      shadowColor: color.accentMint,
      shadowOpacity: 0.35,
      shadowRadius: 8,
      shadowOffset: { width: 0, height: 2 },
    },
    name: {
      ...type.body,
      color: color.ink,
      fontWeight: "700" as const,
    },
    percent: {
      ...type.title,
      fontSize: 18,
      color: color.ink,
    },
  };
}
