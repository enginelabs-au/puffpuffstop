import { useEffect, useState } from "react";
import { View } from "react-native";

import {
  HEALTH_DISCLAIMER,
  HEALTH_SHIFT_HEADLINE,
  HEALTH_WATCHING_HEADLINE,
  formatHealthDelta,
  formatHealthValue,
  type VisibleLogEffect,
} from "../domain/health";
import { lightColor, radius, space, type, type ColorTokens } from "../theme/tokens";
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
  const [pulse, setPulse] = useState(true);

  useEffect(() => {
    if (rows.length > 0 || !watching) return undefined;
    const timer = setInterval(() => setPulse((current) => !current), 700);
    return () => clearInterval(timer);
  }, [rows.length, watching]);

  if (rows.length === 0 && !watching && readings.length === 0) return null;

  const shifted = rows.length > 0;

  return (
    <View
      style={[styles.card, shifted ? styles.shifted : styles.watching, !shifted && !pulse ? styles.dim : null]}
      accessibilityRole="text"
      accessibilityLiveRegion="polite"
      accessibilityLabel={
        shifted
          ? `${HEALTH_SHIFT_HEADLINE}. ${rows.map((row) => row.line).join(". ")}. ${HEALTH_DISCLAIMER}`
          : `${HEALTH_WATCHING_HEADLINE}. Looking for a heart, oxygen, or breathing change around that log.`
      }
    >
      <AppText style={styles.kicker}>
        {shifted ? HEALTH_SHIFT_HEADLINE : watching ? HEALTH_WATCHING_HEADLINE : "From the watch"}
      </AppText>
      {shifted
        ? rows.map((row) => (
            <View key={row.key} style={styles.row}>
              <AppText style={styles.label}>{row.label}</AppText>
              <AppText style={styles.value}>
                {formatHealthValue(row.key, row.before)} → {formatHealthValue(row.key, row.after)}
              </AppText>
              <AppText style={styles.delta}>
                {row.direction === "up" ? "▲" : "▼"} {formatHealthDelta(row.key, row.delta)}
              </AppText>
            </View>
          ))
        : readings.length > 0
          ? readings.map((row) => (
              <View key={row.key} style={styles.row}>
                <AppText style={styles.label}>{row.label}</AppText>
                <AppText style={styles.value}>{row.value}</AppText>
              </View>
            ))
          : watching
            ? (
              <AppText style={styles.waiting}>
                Looking for heart, oxygen, or breathing movement around that log.
              </AppText>
            )
            : null}
      <AppText style={styles.disclaimer}>{HEALTH_DISCLAIMER}</AppText>
    </View>
  );
}

function bannerStyles(color: ColorTokens) {
  return {
    card: {
      borderRadius: radius.lg,
      padding: space.md,
      gap: space.sm,
    },
    shifted: {
      backgroundColor: color.amber,
    },
    watching: {
      backgroundColor: color.accentMint,
    },
    dim: {
      opacity: 0.72,
    },
    kicker: {
      ...type.title,
      color: lightColor.ink,
    },
    row: {
      gap: space.xs,
    },
    label: {
      ...type.body,
      fontWeight: "800" as const,
      color: lightColor.ink,
    },
    value: {
      ...type.title,
      color: lightColor.ink,
    },
    delta: {
      ...type.body,
      fontWeight: "800" as const,
      color: lightColor.ink,
    },
    waiting: {
      ...type.body,
      fontWeight: "700" as const,
      color: lightColor.ink,
    },
    disclaimer: {
      ...type.caption,
      color: lightColor.ink,
    },
  };
}
