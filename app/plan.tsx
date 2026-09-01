import { router } from "expo-router";
import { Pressable, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { getDraft } from "../src/data/onboarding-store";
import { formatCount, summarizePlan } from "../src/domain/plan-summary";
import { minTapTarget, radius, space, type, type ColorTokens } from "../src/theme/tokens";
import { AppText } from "../src/ui/AppText";
import { useThemedStyles } from "../src/ui/use-themed-styles";

const STRICTNESS_COPY = {
  chill: "We’ll keep things gentle.",
  steady: "We’ll keep a steady daily cap.",
  strict: "We’ll be firm about the daily cap.",
} as const;

const WINDOW_COPY = {
  "few-days": "a few days",
  "few-weeks": "a few weeks",
  "few-months": "a few months",
  "exact-date": "an exact stop date",
  other: "a custom timeline",
  unsure: "an open timeline",
} as const;

export default function PlanScreen() {
  const styles = useThemedStyles(planStyles);
  const summary = summarizePlan(getDraft());
  const tone = summary.strictness
    ? STRICTNESS_COPY[summary.strictness]
    : "We’ll follow your pace.";
  const window = summary.quitWindow
    ? WINDOW_COPY[summary.quitWindow]
    : "your own timeline";

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.body}>
        <AppText style={styles.title} accessibilityRole="header">
          Your plan, {summary.displayName}
        </AppText>
        <AppText style={styles.bodyText}>
          You vape about {formatCount(summary.puffsPerDay)} puffs a day.
        </AppText>
        <AppText style={styles.bodyText}>
          That’s about {formatCount(summary.puffsPerWeek)} a week,{" "}
          {formatCount(summary.puffsPerMonth)} a month, and{" "}
          {formatCount(summary.puffsPerYear)} a year.
        </AppText>
        {summary.devicesPerWeek !== null ? (
          <AppText style={styles.bodyText}>
            About {formatCount(summary.devicesPerWeek)} devices a week
            {summary.spendPerWeek !== null
              ? `, around ${formatCount(summary.spendPerWeek)} if prices stay similar`
              : ""}
            .
          </AppText>
        ) : null}
        <AppText style={styles.highlight}>
          We’ll aim for {formatCount(summary.commitment)} puffs today.
        </AppText>
        <AppText style={styles.bodyText}>
          {tone} You’re aiming for {window}.
        </AppText>
        <AppText style={styles.caption}>{summary.disclaimer}</AppText>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="See my organs"
          onPress={() => router.replace("/home")}
          style={({ pressed }) => [styles.primary, pressed ? styles.pressed : null]}
        >
          <AppText style={styles.primaryLabel}>See my organs</AppText>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

function planStyles(color: ColorTokens) {
  return {
    safe: {
      flex: 1,
      backgroundColor: color.bg,
    },
    body: {
      flex: 1,
      justifyContent: "center" as const,
      paddingHorizontal: space.lg,
      gap: space.md,
    },
    title: {
      ...type.title,
      color: color.ink,
    },
    bodyText: {
      ...type.body,
      color: color.inkMuted,
    },
    highlight: {
      ...type.title,
      fontSize: 22,
      color: color.ink,
    },
    caption: {
      ...type.caption,
      color: color.inkMuted,
    },
    primary: {
      minHeight: minTapTarget,
      borderRadius: radius.pill,
      backgroundColor: color.accentMint,
      alignItems: "center" as const,
      justifyContent: "center" as const,
      paddingHorizontal: space.lg,
      marginTop: space.sm,
    },
    primaryLabel: {
      ...type.body,
      color: color.ink,
      fontWeight: "700" as const,
    },
    pressed: {
      opacity: 0.85,
    },
  };
}
