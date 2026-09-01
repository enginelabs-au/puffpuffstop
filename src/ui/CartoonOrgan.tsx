import { useEffect, useRef, useState } from "react";
import { AccessibilityInfo, Animated, StyleSheet } from "react-native";
import Svg, { Ellipse, Path } from "react-native-svg";

import type { OrganId } from "../domain/organs";
import { color, motion } from "../theme/tokens";

const HEALTHY: Record<OrganId, { fill: string; deep: string; light: string }> = {
  lungs: { fill: "#E38B8B", deep: "#C45C63", light: "#F4B4B4" },
  heart: { fill: "#C43B4A", deep: "#8E1F2E", light: "#E36A74" },
  brain: { fill: "#E3B7C8", deep: "#C48AA0", light: "#F3D4DE" },
  liver: { fill: "#A85A3A", deep: "#7A3A22", light: "#C47A55" },
  mouth: { fill: "#D96B78", deep: "#A83F4D", light: "#F2A3AD" },
};

const SICK: Record<OrganId, { fill: string; deep: string; light: string }> = {
  lungs: { fill: "#8A7A68", deep: "#5C4E40", light: "#B0A090" },
  heart: { fill: "#6A4A4E", deep: "#3F2C30", light: "#8A6A6E" },
  brain: { fill: "#7A7480", deep: "#4E4A54", light: "#A8A2AA" },
  liver: { fill: "#6A5A3A", deep: "#403420", light: "#8A7A55" },
  mouth: { fill: "#8A6A74", deep: "#5A4450", light: "#B09098" },
};

function channel(hex: string, start: number): number {
  return parseInt(hex.slice(start, start + 2), 16);
}

function mixHex(a: string, b: string, t: number): string {
  const amount = Math.min(1, Math.max(0, t));
  const mix = (start: number) =>
    Math.round(channel(a, start) + (channel(b, start) - channel(a, start)) * amount);
  const to = (n: number) => n.toString(16).padStart(2, "0");
  return `#${to(mix(1))}${to(mix(3))}${to(mix(5))}`;
}

function sickness(score: number): number {
  return Math.min(1, Math.max(0, (96 - score) / 46));
}

type Palette = { fill: string; deep: string; light: string };

function paletteFor(id: OrganId, score: number): Palette {
  const t = sickness(score);
  return {
    fill: mixHex(HEALTHY[id].fill, SICK[id].fill, t),
    deep: mixHex(HEALTHY[id].deep, SICK[id].deep, t),
    light: mixHex(HEALTHY[id].light, SICK[id].light, t),
  };
}

type Props = {
  id: OrganId;
  score: number;
  recovering: boolean;
  celebrating?: boolean;
};

export function CartoonOrgan({ id, score, recovering, celebrating = false }: Props) {
  const palette = paletteFor(id, score);
  const weary = sickness(score);
  const pulse = useRef(new Animated.Value(1)).current;
  const bounce = useRef(new Animated.Value(1)).current;
  const sparkle = useRef(new Animated.Value(0)).current;
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
    if (reduceMotion) {
      pulse.setValue(1);
      bounce.setValue(1);
      sparkle.setValue(celebrating ? 1 : 0);
      return undefined;
    }

    const beat = id === "heart" ? 520 + weary * 420 : id === "lungs" ? 1400 + weary * 900 : motion.loop;
    const peak = celebrating ? 1.1 : recovering ? 1.05 : id === "heart" ? 1.07 - weary * 0.03 : 1.04;

    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: peak,
          duration: celebrating ? 360 : beat / 2,
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 1,
          duration: celebrating ? 360 : beat / 2,
          useNativeDriver: true,
        }),
      ]),
    );
    loop.start();

    let party: Animated.CompositeAnimation | undefined;
    if (celebrating) {
      party = Animated.loop(
        Animated.sequence([
          Animated.timing(sparkle, { toValue: 1, duration: 480, useNativeDriver: true }),
          Animated.timing(sparkle, { toValue: 0.2, duration: 480, useNativeDriver: true }),
        ]),
      );
      party.start();
      Animated.sequence([
        Animated.timing(bounce, { toValue: 1.14, duration: 260, useNativeDriver: true }),
        Animated.spring(bounce, { toValue: 1, friction: 4, useNativeDriver: true }),
      ]).start();
    } else {
      bounce.setValue(1);
      sparkle.setValue(0);
    }

    return () => {
      loop.stop();
      party?.stop();
    };
  }, [bounce, celebrating, id, pulse, recovering, reduceMotion, sparkle, weary]);

  const motionStyle =
    id === "lungs"
      ? { transform: [{ scaleY: pulse }, { scale: bounce }] }
      : { transform: [{ scale: Animated.multiply(pulse, bounce) }] };

  return (
    <Animated.View style={[styles.stage, motionStyle]}>
      {celebrating ? (
        <>
          <Animated.View style={[styles.sparkle, styles.sparkleA, { opacity: sparkle }]} />
          <Animated.View style={[styles.sparkle, styles.sparkleB, { opacity: sparkle }]} />
          <Animated.View style={[styles.sparkle, styles.sparkleC, { opacity: sparkle }]} />
        </>
      ) : null}
      <OrganShape id={id} palette={palette} weary={weary} celebrating={celebrating} />
    </Animated.View>
  );
}

function OrganShape({
  id,
  palette,
  weary,
  celebrating,
}: {
  id: OrganId;
  palette: Palette;
  weary: number;
  celebrating: boolean;
}) {
  if (id === "lungs") return <Lungs palette={palette} weary={weary} />;
  if (id === "heart") return <Heart palette={palette} />;
  if (id === "brain") return <Brain palette={palette} />;
  if (id === "liver") return <Liver palette={palette} />;
  return <Mouth palette={palette} weary={weary} celebrating={celebrating} />;
}

function Lungs({ palette, weary }: { palette: Palette; weary: number }) {
  const stain = 0.18 + weary * 0.45;
  return (
    <Svg width={92} height={68} viewBox="0 0 120 96">
      <Path
        d="M58 14 V52"
        stroke={palette.deep}
        strokeWidth={5}
        strokeLinecap="round"
      />
      <Path
        d="M58 28 C48 32 42 40 38 48"
        stroke={palette.deep}
        strokeWidth={3}
        fill="none"
      />
      <Path
        d="M58 28 C68 32 74 40 78 48"
        stroke={palette.deep}
        strokeWidth={3}
        fill="none"
      />
      <Path
        d="M56 18 C28 10 8 28 12 58 C16 84 40 90 54 72 C50 52 54 30 56 18 Z"
        fill={palette.fill}
      />
      <Path
        d="M60 18 C88 10 110 28 106 58 C102 84 78 90 64 72 C68 52 64 30 60 18 Z"
        fill={palette.fill}
      />
      <Path
        d="M34 30 C28 38 26 50 30 62"
        stroke={palette.light}
        strokeWidth={2}
        fill="none"
        opacity={0.7}
      />
      <Path
        d="M86 30 C92 38 94 50 90 62"
        stroke={palette.light}
        strokeWidth={2}
        fill="none"
        opacity={0.7}
      />
      <Ellipse cx={32} cy={58} rx={7} ry={5} fill={palette.deep} opacity={stain} />
      <Ellipse cx={88} cy={54} rx={8} ry={6} fill={palette.deep} opacity={stain} />
      <Ellipse cx={40} cy={70} rx={5} ry={4} fill={palette.deep} opacity={stain * 0.8} />
    </Svg>
  );
}

function Heart({ palette }: { palette: Palette }) {
  return (
    <Svg width={86} height={68} viewBox="0 0 110 100">
      <Path
        d="M54 18 C50 4 36 2 28 12 C18 24 22 40 32 50"
        fill={palette.deep}
      />
      <Path
        d="M56 16 C70 2 90 10 88 28 C86 38 78 42 70 40"
        fill={palette.deep}
      />
      <Path
        d="M22 38 C8 48 10 70 28 84 C40 94 52 98 55 98 C58 98 70 94 84 82 C100 66 104 46 90 36 C80 28 70 34 62 42 C58 36 50 30 40 32 C32 34 26 36 22 38 Z"
        fill={palette.fill}
      />
      <Path
        d="M40 48 C36 58 38 70 48 80"
        stroke={palette.light}
        strokeWidth={2.5}
        fill="none"
        opacity={0.65}
      />
      <Path
        d="M62 46 C70 56 74 68 68 80"
        stroke={palette.deep}
        strokeWidth={2}
        fill="none"
        opacity={0.45}
      />
      <Ellipse cx={48} cy={52} rx={8} ry={5} fill={palette.light} opacity={0.28} />
    </Svg>
  );
}

function Brain({ palette }: { palette: Palette }) {
  return (
    <Svg width={92} height={64} viewBox="0 0 120 90">
      <Path
        d="M22 48 C18 22 40 8 60 10 C84 6 106 22 100 48 C106 70 84 84 60 82 C36 86 16 70 22 48 Z"
        fill={palette.fill}
      />
      <Path
        d="M60 12 V80"
        stroke={palette.deep}
        strokeWidth={2}
        opacity={0.35}
      />
      <Path
        d="M28 36 C40 28 48 36 44 46 C54 40 62 48 56 56"
        stroke={palette.deep}
        strokeWidth={2.2}
        fill="none"
      />
      <Path
        d="M92 36 C80 28 72 36 76 46 C66 40 58 48 64 56"
        stroke={palette.deep}
        strokeWidth={2.2}
        fill="none"
      />
      <Path
        d="M30 58 C42 70 54 64 60 72"
        stroke={palette.light}
        strokeWidth={2}
        fill="none"
      />
      <Path
        d="M90 58 C78 70 66 64 60 72"
        stroke={palette.light}
        strokeWidth={2}
        fill="none"
      />
      <Ellipse cx={60} cy={84} rx={16} ry={6} fill={palette.deep} opacity={0.45} />
    </Svg>
  );
}

function Liver({ palette }: { palette: Palette }) {
  return (
    <Svg width={92} height={60} viewBox="0 0 120 82">
      <Path
        d="M10 36 C12 14 38 8 62 14 C86 8 112 18 110 40 C108 62 88 74 64 72 C40 78 14 66 10 36 Z"
        fill={palette.fill}
      />
      <Path
        d="M62 16 C58 34 60 52 68 70"
        stroke={palette.deep}
        strokeWidth={2}
        fill="none"
        opacity={0.45}
      />
      <Path
        d="M28 28 C36 36 40 50 36 64"
        stroke={palette.light}
        strokeWidth={2}
        fill="none"
        opacity={0.5}
      />
      <Ellipse cx={86} cy={44} rx={16} ry={10} fill={palette.deep} opacity={0.18} />
      <Ellipse cx={40} cy={40} rx={10} ry={6} fill={palette.light} opacity={0.2} />
    </Svg>
  );
}

function Mouth({
  palette,
  weary,
  celebrating,
}: {
  palette: Palette;
  weary: number;
  celebrating: boolean;
}) {
  const smile = celebrating ? 1 : 1 - weary;
  const lip = smile > 0.45
    ? "M28 48 C44 62 76 62 92 48"
    : "M28 54 C44 44 76 44 92 54";
  return (
    <Svg width={92} height={60} viewBox="0 0 120 82">
      <Path
        d="M18 40 C22 18 98 18 102 40 C98 58 22 58 18 40 Z"
        fill={palette.fill}
      />
      <Path
        d="M24 38 C40 28 80 28 96 38 C80 34 40 34 24 38 Z"
        fill={palette.light}
        opacity={0.55}
      />
      <Path d="M34 40 H86 V48 H34 Z" fill="#F4E8D8" />
      <Path d="M46 40 V48 M58 40 V48 M70 40 V48" stroke="#E0D0BE" strokeWidth={2} />
      <Path
        d={lip}
        stroke={palette.deep}
        strokeWidth={5}
        strokeLinecap="round"
        fill="none"
      />
      <Ellipse cx={30} cy={36} rx={5} ry={4} fill={palette.light} opacity={0.45} />
      <Ellipse cx={90} cy={36} rx={5} ry={4} fill={palette.light} opacity={0.45} />
    </Svg>
  );
}

const styles = StyleSheet.create({
  stage: {
    width: 96,
    height: 72,
    alignItems: "center",
    justifyContent: "center",
  },
  sparkle: {
    position: "absolute",
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: color.amber,
    zIndex: 2,
  },
  sparkleA: {
    top: 2,
    left: 10,
  },
  sparkleB: {
    top: 0,
    right: 14,
    backgroundColor: color.accentMint,
  },
  sparkleC: {
    bottom: 6,
    right: 8,
    backgroundColor: color.accent,
    width: 6,
    height: 6,
  },
});
