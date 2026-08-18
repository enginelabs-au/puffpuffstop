import { router } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { resetDraft } from "../src/data/onboarding-store";
import { evaluateAgeGate } from "../src/domain/age-gate";
import { color, minTapTarget, radius, space, type } from "../src/theme/tokens";

export default function AgeGateScreen() {
  function onConfirmSixteenOrOlder() {
    const decision = evaluateAgeGate(true);
    if (decision.status === "allowed") {
      router.replace("/onboarding/nickname");
    }
  }

  function onUnderSixteen() {
    const decision = evaluateAgeGate(false);
    if (decision.status === "blocked" && !decision.trackingAllowed) {
      resetDraft();
      router.replace("/blocked");
    }
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.body}>
        <Text style={styles.wordmark} accessibilityRole="header">
          PuffPuffStop
        </Text>
        <Text style={styles.tagline}>Break the cycle, reclaim your lungs.</Text>
        <Text style={styles.question}>Are you 16 or older?</Text>
        <Text style={styles.helper}>
          This wellness coach is for teens and young adults. It is not a kids
          app and not a medical device.
        </Text>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Yes, I am 16 or older"
          onPress={onConfirmSixteenOrOlder}
          style={({ pressed }) => [
            styles.primary,
            pressed ? styles.pressed : null,
          ]}
        >
          <Text style={styles.primaryLabel}>Yes, I’m 16+</Text>
        </Pressable>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="No, I am under 16"
          onPress={onUnderSixteen}
          style={({ pressed }) => [
            styles.secondary,
            pressed ? styles.pressed : null,
          ]}
        >
          <Text style={styles.secondaryLabel}>No, I’m under 16</Text>
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
    justifyContent: "center",
    paddingHorizontal: space.lg,
    gap: space.md,
  },
  wordmark: {
    ...type.title,
    color: color.ink,
  },
  tagline: {
    ...type.caption,
    color: color.inkMuted,
  },
  question: {
    ...type.title,
    color: color.ink,
    marginTop: space.sm,
  },
  helper: {
    ...type.body,
    color: color.inkMuted,
  },
  primary: {
    minHeight: minTapTarget,
    borderRadius: radius.pill,
    backgroundColor: color.accentMint,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: space.lg,
    marginTop: space.md,
  },
  primaryLabel: {
    ...type.body,
    color: color.ink,
    fontWeight: "700",
  },
  secondary: {
    minHeight: minTapTarget,
    borderRadius: radius.pill,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: space.lg,
  },
  secondaryLabel: {
    ...type.body,
    color: color.ink,
    textDecorationLine: "underline",
  },
  pressed: {
    opacity: 0.85,
  },
});
