import { View } from "react-native";
import Svg, { Circle } from "react-native-svg";

import {
  formatNextWindowIn,
  paceRingFill,
  type PaceWindow,
} from "../domain/pacing";
import { type, type ColorTokens } from "../theme/tokens";
import { AppText } from "./AppText";
import { useTheme } from "./ThemeProvider";
import { useThemedStyles } from "./use-themed-styles";

type Props = {
  window: PaceWindow;
  label: string;
};

const SIZE = 84;
const STROKE = 8;
const RADIUS = (SIZE - STROKE) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export function PaceRing({ window, label }: Props) {
  const { color } = useTheme();
  const styles = useThemedStyles(ringStyles);
  const fill = paceRingFill(window.used, window.allowance);
  const stroke = window.over
    ? color.danger
    : window.open
      ? color.accentMint
      : color.amber;
  const offset = CIRCUMFERENCE * (1 - fill);

  return (
    <View style={styles.item}>
      <AppText style={styles.label}>{label}</AppText>
      <View style={styles.ring}>
        <Svg width={SIZE} height={SIZE} style={styles.svg}>
          <Circle
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={RADIUS}
            stroke={color.surface}
            strokeWidth={STROKE}
            fill="none"
          />
          <Circle
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={RADIUS}
            stroke={stroke}
            strokeWidth={STROKE}
            fill="none"
            strokeDasharray={`${CIRCUMFERENCE} ${CIRCUMFERENCE}`}
            strokeDashoffset={offset}
            strokeLinecap="round"
          />
        </Svg>
        <View style={styles.center} pointerEvents="none">
          <AppText style={styles.count}>
            {window.used}/{window.allowance}
          </AppText>
        </View>
      </View>
      <AppText style={styles.next}>{formatNextWindowIn(window.msUntilReset)}</AppText>
    </View>
  );
}

function ringStyles(color: ColorTokens) {
  return {
    item: {
      flex: 1,
      alignItems: "center" as const,
      gap: 6,
      minWidth: 96,
    },
    label: {
      ...type.caption,
      fontWeight: "700" as const,
      color: color.ink,
    },
    ring: {
      width: SIZE,
      height: SIZE,
      alignItems: "center" as const,
      justifyContent: "center" as const,
    },
    svg: {
      transform: [{ rotate: "-90deg" }],
    },
    center: {
      position: "absolute" as const,
      alignItems: "center" as const,
      justifyContent: "center" as const,
    },
    count: {
      ...type.body,
      fontWeight: "800" as const,
      color: color.ink,
    },
    next: {
      ...type.caption,
      color: color.inkMuted,
      textAlign: "center" as const,
    },
  };
}
