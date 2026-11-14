import { View } from "react-native";

import {
  HEALTH_DISCLAIMER,
  HEALTH_SHIFT_HEADLINE,
  formatHealthDelta,
  formatHealthValue,
  type VisibleLogEffect,
} from "../domain/health";
import { radius, space, type, type ColorTokens } from "../theme/tokens";
import { AppText } from "./AppText";
import { useThemedStyles } from "./use-themed-styles";

type Reading = { key: string; label: string; value: string };

type Props = {
  rows: readonly VisibleLogEffect[];
  readings?: readonly Reading[];
  watching: boolean;
};

export function WatchShiftBanner({ rows, readings = [], watching }: Props) {
  const styles = useThemedStyles(bannerStyles);
  const shifted = rows.length > 0;
  if (!shifted && readings.length === 0) return null;

  const detail = shifted
    ? rows
        .map(
          (row) =>
            `${row.label} ${formatHealthValue(row.key, row.before)} to ${formatHealthValue(row.key, row.after)} (${row.direction === "up" ? "+" : "−"}${formatHealthDelta(row.key, row.delta)})`,
        )
        .join(", ")
    : readings.map((row) => `${row.label} ${row.value}`).join(", ");

  return (
    <View
      style={styles.row}
      accessibilityRole="text"
      accessibilityLabel={
        shifted
          ? `${HEALTH_SHIFT_HEADLINE}. ${detail}. ${HEALTH_DISCLAIMER}`
          : `Watch. ${detail}. ${watching ? "Connected." : ""} ${HEALTH_DISCLAIMER}`
      }
    >
      <AppText style={styles.kicker}>Watch</AppText>
      <AppText style={styles.detail}>{detail}</AppText>
    </View>
  );
}

function bannerStyles(color: ColorTokens) {
  return {
    row: {
      flexDirection: "row" as const,
      alignItems: "center" as const,
      gap: space.sm,
      borderRadius: radius.sm,
      paddingVertical: space.xs,
      paddingHorizontal: space.sm,
      backgroundColor: color.surface,
    },
    kicker: {
      ...type.caption,
      color: color.inkMuted,
      fontWeight: "700" as const,
    },
    detail: {
      ...type.caption,
      flex: 1,
      color: color.ink,
    },
  };
}
