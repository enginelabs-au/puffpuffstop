import type { ReactNode } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { color, minTapTarget, radius, space, type } from "../theme/tokens";
import { AppText } from "./AppText";

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
        <AppText style={styles.title} accessibilityRole="header">
          {title}
        </AppText>
        {helper ? <AppText style={styles.helper}>{helper}</AppText> : null}
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
          <AppText style={styles.primaryLabel}>{continueLabel}</AppText>
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
