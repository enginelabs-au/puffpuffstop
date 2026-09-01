import { useRef, useState } from "react";
import { Pressable, TextInput, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";

import { clampDial, dialTicks } from "../domain/onboarding";
import { minTapTarget, radius, scaledInput, space, type ColorTokens } from "../theme/tokens";
import { AppText } from "./AppText";
import { useThemedStyles } from "./use-themed-styles";

type Props = {
  value: number;
  onChange: (value: number) => void;
  accessibilityLabel: string;
  max?: number;
};

function valueFromTurn(turn: number, max: number): number {
  const t = Math.min(1, Math.max(0, turn));
  if (t <= 0) return 0;
  return clampDial((max + 1) ** t - 1, max);
}

function turnFromValue(value: number, max: number): number {
  const clamped = clampDial(value, max);
  if (clamped <= 0) return 0;
  return Math.log(clamped + 1) / Math.log(max + 1);
}

export function RotaryDial({
  value,
  onChange,
  accessibilityLabel,
  max = 999,
}: Props) {
  const styles = useThemedStyles(dialStyles);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(String(clampDial(value, max)));
  const startTurn = useRef(turnFromValue(value, max));

  function commitTyped(text: string) {
    const parsed = Number(text.replace(/[^\d]/g, ""));
    onChange(clampDial(Number.isFinite(parsed) ? parsed : 0, max));
    setEditing(false);
  }

  const gesture = Gesture.Pan()
    .runOnJS(true)
    .onBegin(() => {
      startTurn.current = turnFromValue(value, max);
    })
    .onUpdate((event) => {
      const delta = event.translationX / 280 + event.translationY / 420;
      onChange(valueFromTurn(startTurn.current + delta, max));
    });

  const ticks = dialTicks(max);
  const turn = turnFromValue(value, max);
  const rotation = `${turn * 270 - 135}deg`;

  return (
    <View style={styles.wrap}>
      <GestureDetector gesture={gesture}>
        <View
          accessibilityLabel={accessibilityLabel}
          accessibilityHint="Rotate the dial or tap the number to type"
          style={styles.face}
        >
          {ticks.map((tick) => {
            const angle = turnFromValue(tick, max) * 270 - 135;
            const mark = 10 + Math.min(18, Math.log10(tick + 1) * 8);
            return (
              <View
                key={tick}
                style={[
                  styles.tick,
                  {
                    height: mark,
                    transform: [{ rotate: `${angle}deg` }, { translateY: -86 }],
                  },
                ]}
              />
            );
          })}
          <View style={[styles.knob, { transform: [{ rotate: rotation }] }]}>
            <View style={styles.pointer} />
          </View>
        </View>
      </GestureDetector>
      {editing ? (
        <TextInput
          {...scaledInput}
          autoFocus
          accessibilityLabel={`${accessibilityLabel} typed value`}
          keyboardType="number-pad"
          value={draft}
          onChangeText={setDraft}
          onBlur={() => commitTyped(draft)}
          onSubmitEditing={() => commitTyped(draft)}
          style={styles.input}
        />
      ) : (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`${accessibilityLabel}, ${clampDial(value, max)}. Double tap to type`}
          onPress={() => {
            setDraft(String(clampDial(value, max)));
            setEditing(true);
          }}
        >
          <AppText style={styles.value}>{clampDial(value, max)}</AppText>
        </Pressable>
      )}
    </View>
  );
}

function dialStyles(color: ColorTokens) {
  return {
    wrap: {
      alignItems: "center" as const,
      gap: space.md,
    },
    face: {
      width: 200,
      height: 200,
      borderRadius: 100,
      backgroundColor: color.surface,
      borderWidth: 8,
      borderColor: color.ink,
      alignItems: "center" as const,
      justifyContent: "center" as const,
    },
    tick: {
      position: "absolute" as const,
      width: 3,
      backgroundColor: color.ink,
      borderRadius: 2,
    },
    knob: {
      width: 88,
      height: 88,
      borderRadius: 44,
      backgroundColor: color.accent,
      alignItems: "center" as const,
    },
    pointer: {
      width: 10,
      height: 28,
      marginTop: 8,
      borderRadius: radius.pill,
      backgroundColor: color.onAccent,
    },
    value: {
      fontSize: 48,
      fontWeight: "800" as const,
      color: color.ink,
      minWidth: minTapTarget,
      textAlign: "center" as const,
    },
    input: {
      minWidth: 140,
      minHeight: 56,
      borderRadius: radius.md,
      backgroundColor: color.surface,
      textAlign: "center" as const,
      fontSize: 40,
      fontWeight: "800" as const,
      color: color.ink,
    },
  };
}

export const rotaryDialMax = 999;
