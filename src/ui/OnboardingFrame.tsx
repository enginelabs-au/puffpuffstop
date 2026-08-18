import type { ReactNode } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { color, minTapTarget, radius, space, type } from "../theme/tokens";

type Props = {
  title: string;
  helper?: string;
  continueLabel?: string;
  continueDisabled?: boolean;
  onContinue: () => void;
  children: ReactNode;
};

export function OnboardingFrame({
  title,
  helper,
  continueLabel = "Continue",
  continueDisabled = false,
  onContinue,
  children,
}: Props) {
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.body}>
        <Text style={styles.title} accessibilityRole="header">
          {title}
        </Text>
        {helper ? <Text style={styles.helper}>{helper}</Text> : null}
        <View style={styles.content}>{children}</View>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={continueLabel}
          accessibilityState={{ disabled: continueDisabled }}
          disabled={continueDisabled}
          onPress={onContinue}
          style={({ pressed }) => [
            styles.primary,
            continueDisabled ? styles.disabled : null,
            pressed && !continueDisabled ? styles.pressed : null,
          ]}
        >
          <Text style={styles.primaryLabel}>{continueLabel}</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: color.bg,
  },
  body: {
    flex: 1,
    paddingHorizontal: space.lg,
    paddingTop: space.xl,
    paddingBottom: space.lg,
    gap: space.md,
  },
  title: {
    ...type.title,
    color: color.ink,
  },
  helper: {
    ...type.body,
    color: color.inkMuted,
  },
  content: {
    flex: 1,
    gap: space.md,
  },
  primary: {
    minHeight: minTapTarget,
    borderRadius: radius.pill,
    backgroundColor: color.accentMint,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: space.lg,
  },
  primaryLabel: {
    ...type.body,
    color: color.ink,
    fontWeight: "700",
  },
  disabled: {
    opacity: 0.4,
  },
  pressed: {
    opacity: 0.85,
  },
});
