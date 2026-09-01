import type { ReactNode } from "react";
import { Pressable, ScrollView, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";

import { color, minTapTarget, radius, space, type, type ColorTokens } from "../theme/tokens";
import { AppText } from "./AppText";
import { useThemedStyles } from "./use-themed-styles";

type Props = {
  title: string;
  helper?: string;
  continueLabel?: string;
  continueDisabled?: boolean;
  onContinue: () => void;
  onBack?: () => void;
  children: ReactNode;
};

export function OnboardingFrame({
  title,
  helper,
  continueLabel = "Continue",
  continueDisabled = false,
  onContinue,
  onBack,
  children,
}: Props) {
  const styles = useThemedStyles(frameStyles);
  const swipeBack = Gesture.Pan()
    .runOnJS(true)
    .activeOffsetX(24)
    .failOffsetY([-32, 32])
    .onEnd((event) => {
      if (onBack && event.translationX > 72 && event.velocityX > 200) {
        onBack();
      }
    });

  return (
    <GestureDetector gesture={swipeBack}>
      <SafeAreaView style={styles.safe}>
        <View style={styles.body}>
          <View style={styles.top}>
            {onBack ? (
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Back"
                onPress={onBack}
                style={({ pressed }) => [styles.back, pressed ? styles.pressed : null]}
              >
                <AppText style={styles.backLabel}>←</AppText>
              </Pressable>
            ) : (
              <View style={styles.backSpacer} />
            )}
          </View>
          <AppText style={styles.title} accessibilityRole="header">
            {title}
          </AppText>
          {helper ? <AppText style={styles.helper}>{helper}</AppText> : null}
          <ScrollView
            style={styles.scroll}
            contentContainerStyle={styles.content}
            keyboardShouldPersistTaps="handled"
          >
            {children}
          </ScrollView>
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
    </GestureDetector>
  );
}

function frameStyles(palette: ColorTokens = color) {
  return {
    safe: {
      flex: 1,
      backgroundColor: palette.bg,
    },
    body: {
      flex: 1,
      paddingHorizontal: space.lg,
      paddingTop: space.sm,
      paddingBottom: space.lg,
      gap: space.md,
    },
    top: {
      minHeight: minTapTarget,
      justifyContent: "center" as const,
    },
    back: {
      minWidth: minTapTarget,
      minHeight: minTapTarget,
      justifyContent: "center" as const,
    },
    backSpacer: {
      minHeight: minTapTarget,
    },
    backLabel: {
      ...type.title,
      color: palette.ink,
    },
    title: {
      ...type.title,
      color: palette.ink,
    },
    helper: {
      ...type.body,
      color: palette.inkMuted,
    },
    scroll: {
      flex: 1,
    },
    content: {
      gap: space.md,
      paddingBottom: space.md,
    },
    primary: {
      minHeight: minTapTarget,
      borderRadius: radius.pill,
      backgroundColor: palette.accentMint,
      alignItems: "center" as const,
      justifyContent: "center" as const,
      paddingHorizontal: space.lg,
    },
    primaryLabel: {
      ...type.body,
      color: palette.ink,
      fontWeight: "700" as const,
    },
    disabled: {
      opacity: 0.4,
    },
    pressed: {
      opacity: 0.85,
    },
  };
}
