import { View } from "react-native";

import { radius, space, type ColorTokens } from "../theme/tokens";
import { useThemedStyles } from "./use-themed-styles";

type Bar = {
  key: string;
  logged: number;
  goal: number;
  met: boolean;
};

type Props = {
  bars: readonly Bar[];
};

export function ProgressBars({ bars }: Props) {
  const styles = useThemedStyles(barStyles);
  const peak = Math.max(1, ...bars.map((bar) => Math.max(bar.logged, bar.goal)));
  if (bars.length === 0) return null;
  return (
    <View style={styles.row} accessibilityRole="image" accessibilityLabel="Puffs by day">
      {bars.map((bar) => (
        <View key={bar.key} style={styles.col}>
          <View style={styles.track}>
            <View
              style={[
                styles.fill,
                bar.met ? styles.met : styles.over,
                { height: `${Math.round((bar.logged / peak) * 100)}%` as `${number}%` },
              ]}
            />
          </View>
        </View>
      ))}
    </View>
  );
}

function barStyles(color: ColorTokens) {
  return {
    row: {
      flexDirection: "row" as const,
      alignItems: "flex-end" as const,
      gap: 3,
      height: 88,
    },
    col: {
      flex: 1,
      height: "100%" as const,
      justifyContent: "flex-end" as const,
    },
    track: {
      flex: 1,
      justifyContent: "flex-end" as const,
      backgroundColor: color.bg,
      borderRadius: radius.sm,
      overflow: "hidden" as const,
    },
    fill: {
      width: "100%" as const,
      minHeight: space.xs,
      borderRadius: radius.sm,
    },
    met: {
      backgroundColor: color.accentMint,
    },
    over: {
      backgroundColor: color.amber,
    },
  };
}
