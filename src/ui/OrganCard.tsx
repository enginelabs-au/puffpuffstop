import { useEffect, useRef, useState } from "react";
import { AccessibilityInfo, Animated, StyleSheet, View } from "react-native";

import {
  ORGAN_LABELS,
  formatOrganPercent,
  type OrganId,
} from "../domain/organs";
import { color, motion, radius, space, type } from "../theme/tokens";
import { AppText } from "./AppText";

const GLYPH: Record<OrganId, string> = {
  lungs: "Lu",
  heart: "He",
  brain: "Br",
  liver: "Li",
  mouth: "Mo",
};

const TINT: Record<OrganId, string> = {
  lungs: "#B8E6D5",
  heart: "#F5C4C8",
  brain: "#D4CCF7",
  liver: "#F7D9B8",
  mouth: "#F3C9E0",
};

type Props = {
  id: OrganId;
  score: number;
  recovering: boolean;
};

export function OrganCard({ id, score, recovering }: Props) {
  const label = ORGAN_LABELS[id];
  const percent = formatOrganPercent(score);
  const pulse = useRef(new Animated.Value(1)).current;
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    let cancelled = false;
    void AccessibilityInfo.isReduceMotionEnabled()
      .then((enabled) => {
        if (!cancelled) setReduceMotion(enabled);
      })
      .catch(() => {
        if (!cancelled) setReduceMotion(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!recovering || reduceMotion) {
      pulse.setValue(1);
      return undefined;
    }
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 0.94,
          duration: motion.loop / 2,
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 1,
          duration: motion.loop / 2,
          useNativeDriver: true,
        }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [pulse, recovering, reduceMotion]);

  return (
    <Animated.View
      accessibilityLabel={`${label}, ${percent} percent, motivational estimate`}
      style={[
        styles.card,
        recovering ? styles.recovering : null,
        { transform: [{ scale: pulse }] },
      ]}
    >
      <View style={[styles.glyph, { backgroundColor: TINT[id] }]}>
        <AppText style={styles.glyphLabel}>{GLYPH[id]}</AppText>
      </View>
      <AppText style={styles.name}>{label}</AppText>
      <AppText style={styles.percent}>{percent}%</AppText>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    minWidth: "42%",
    backgroundColor: color.surface,
    borderRadius: radius.md,
    padding: space.md,
    gap: space.sm,
  },
  recovering: {
    borderWidth: 2,
    borderColor: color.accentMint,
  },
  glyph: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  glyphLabel: {
    ...type.body,
    fontWeight: "800",
    color: color.ink,
  },
  name: {
    ...type.body,
    color: color.ink,
  },
  percent: {
    ...type.title,
    fontSize: 22,
    color: color.ink,
  },
});
