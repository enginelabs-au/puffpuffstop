import { useState } from "react";
import { View } from "react-native";
import Svg, { Circle, Polyline } from "react-native-svg";

import type { ColorTokens } from "../theme/tokens";
import { useThemedStyles } from "./use-themed-styles";

export type ProgressSeries = {
  values: number[];
  color: string;
};

type Props = {
  series: readonly ProgressSeries[];
  accessibilityLabel: string;
};

const HEIGHT = 88;
const PAD = 6;

export function ProgressLines({ series, accessibilityLabel }: Props) {
  const styles = useThemedStyles(lineStyles);
  const [width, setWidth] = useState(0);
  const values = series.flatMap((item) => item.values);
  if (values.length === 0) return null;
  const peak = Math.max(1, ...values);
  const count = Math.max(...series.map((item) => item.values.length), 1);

  return (
    <View
      accessibilityRole="image"
      accessibilityLabel={accessibilityLabel}
      style={styles.frame}
      onLayout={(event) => setWidth(event.nativeEvent.layout.width)}
    >
      {width > 0 ? (
        <Svg width={width} height={HEIGHT}>
          {series.map((item, index) => {
            const points = item.values.map((value, at) => {
              const x =
                count === 1
                  ? width / 2
                  : PAD + (at / (count - 1)) * (width - PAD * 2);
              const y =
                HEIGHT - PAD - (value / peak) * (HEIGHT - PAD * 2);
              return `${x},${y}`;
            });
            return (
              <Polyline
                key={`${item.color}-${index}`}
                points={points.join(" ")}
                fill="none"
                stroke={item.color}
                strokeWidth={2.5}
                strokeLinejoin="round"
                strokeLinecap="round"
              />
            );
          })}
          {series.map((item, index) => {
            const last = item.values.length - 1;
            if (last < 0) return null;
            const x =
              count === 1
                ? width / 2
                : PAD + (last / Math.max(1, count - 1)) * (width - PAD * 2);
            const y =
              HEIGHT -
              PAD -
              ((item.values[last] ?? 0) / peak) * (HEIGHT - PAD * 2);
            return (
              <Circle
                key={`dot-${item.color}-${index}`}
                cx={x}
                cy={y}
                r={3.5}
                fill={item.color}
              />
            );
          })}
        </Svg>
      ) : null}
    </View>
  );
}

function lineStyles(_color: ColorTokens) {
  return {
    frame: {
      height: HEIGHT,
      width: "100%" as const,
    },
  };
}
