import { router } from "expo-router";
import { useMemo, useState } from "react";
import { Pressable, ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { applyDayCycle, syncOpenProgressDay } from "../src/data/day-cycle";
import { getDailyLog } from "../src/data/daily-log-store";
import { getDraft } from "../src/data/onboarding-store";
import { currentPlan } from "../src/data/plan";
import { getProgress } from "../src/data/progress-store";
import { getSavings } from "../src/data/savings-store";
import { getSettings } from "../src/data/settings-store";
import { localDateKey } from "../src/domain/organs";
import {
  USAGE_TREND_DISCLAIMER,
  dayHourUsageTrend,
  hourlyUsageSeries,
  usageHourCounts,
  usageTrendLabel,
} from "../src/domain/usage-surge";
import {
  PROGRESS_DISCLAIMER,
  summarizeProgress,
  type ProgressRange,
} from "../src/domain/progress";
import { SAVINGS_DISCLAIMER, formatCurrency } from "../src/domain/savings";
import { minTapTarget, radius, space, type, type ColorTokens } from "../src/theme/tokens";
import { AppText } from "../src/ui/AppText";
import { ProgressLines } from "../src/ui/ProgressLines";
import { useTheme } from "../src/ui/ThemeProvider";
import { useThemedStyles } from "../src/ui/use-themed-styles";

const RANGES: { id: ProgressRange; label: string }[] = [
  { id: "7d", label: "7 days" },
  { id: "30d", label: "30 days" },
  { id: "12w", label: "12 weeks" },
];

export default function StatsScreen() {
  const { color } = useTheme();
  const styles = useThemedStyles(statsStyles);
  const draft = getDraft();
  const summary = useMemo(() => currentPlan(), []);
  const [range, setRange] = useState<ProgressRange>("7d");
  const todayKey = localDateKey(new Date(), getSettings().timeZone);
  const totals = useMemo(() => {
    applyDayCycle(summary.commitment);
    syncOpenProgressDay(summary.commitment);
    return summarizeProgress(getProgress().days, todayKey, range);
  }, [range, summary.commitment, todayKey]);
  const rangeLabel =
    range === "7d" ? "last 7 days" : range === "30d" ? "last 30 days" : "last 12 weeks";
  const usageHours = usageHourCounts(getDailyLog().puffAt);
  const hourSeries = hourlyUsageSeries(
    getDailyLog().puffAt,
    new Date(),
    getSettings().timeZone,
  );
  const usageDay = dayHourUsageTrend(
    getDailyLog().puffAt,
    new Date(),
    getSettings().timeZone,
  );
  const pot = getSavings().pot;

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.body}>
        <View style={styles.top}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Back to home"
            onPress={() => {
              if (router.canGoBack()) router.back();
              else router.replace("/home");
            }}
            style={({ pressed }) => [styles.back, pressed ? styles.pressed : null]}
          >
            <AppText style={styles.backLabel}>Back</AppText>
          </Pressable>
          <AppText style={styles.title} accessibilityRole="header">
            Score
          </AppText>
          <View style={styles.back} />
        </View>

        <View style={styles.chips}>
          {RANGES.map((item) => (
            <Pressable
              key={item.id}
              accessibilityRole="button"
              accessibilityState={{ selected: range === item.id }}
              accessibilityLabel={item.label}
              onPress={() => setRange(item.id)}
              style={[styles.chip, range === item.id ? styles.chipOn : null]}
            >
              <AppText style={[styles.chipLabel, range === item.id ? styles.chipLabelOn : null]}>
                {item.label}
              </AppText>
            </Pressable>
          ))}
        </View>

        <View style={styles.hero}>
          <AppText style={styles.score}>
            {totals.counted === 0 ? "—" : `${totals.adherence}`}
          </AppText>
          <AppText style={styles.heroCaption}>
            {totals.counted === 0
              ? "Today starts your score. Stay under your daily goal and this fills in."
              : `${totals.met} of ${totals.counted} goal days ${rangeLabel}`}
          </AppText>
        </View>

        <View style={styles.card}>
          <AppText style={styles.cardTitle}>Hourly usage</AppText>
          <AppText style={styles.cardValue}>
            {`${usageHours.lastHour} this hour · ${usageHours.previousHour} last hour · today ${usageTrendLabel(usageDay.trend)}`}
          </AppText>
          <ProgressLines
            accessibilityLabel="Hourly puff logs today"
            series={[{ values: hourSeries, color: color.sky }]}
          />
          <AppText style={styles.heroCaption}>{USAGE_TREND_DISCLAIMER}</AppText>
        </View>

        <View style={styles.card}>
          <AppText style={styles.cardTitle}>Daily puffs</AppText>
          <AppText style={styles.cardValue}>
            {totals.counted === 0
              ? "No days yet"
              : `${totals.averageLogged} avg · goal ${totals.averageGoal}`}
          </AppText>
          <ProgressLines
            accessibilityLabel="Daily puffs and goal over time"
            series={[
              { values: totals.points.map((point) => point.logged), color: color.accentMint },
              { values: totals.points.map((point) => point.goal), color: color.inkMuted },
            ]}
          />
        </View>

        <View style={styles.card}>
          <AppText style={styles.cardTitle}>Puff Savings</AppText>
          <AppText style={styles.cardValue}>
            {totals.counted === 0 && pot <= 0
              ? "No savings yet"
              : `${formatCurrency(totals.savingsTotal, draft.currencyCode)} ${rangeLabel} · ${formatCurrency(pot, draft.currencyCode)} all time`}
          </AppText>
          <ProgressLines
            accessibilityLabel="Estimated money saved over time"
            series={[
              {
                values: totals.points.map((point) => point.savedCumulative),
                color: color.accent,
              },
            ]}
          />
          <AppText style={styles.heroCaption}>{SAVINGS_DISCLAIMER}</AppText>
        </View>

        <View style={styles.card}>
          <AppText style={styles.cardTitle}>Streak</AppText>
          <AppText style={styles.cardValue}>
            {totals.streak === 0
              ? "No current streak"
              : `${totals.streak} ${totals.streak === 1 ? "day" : "days"} under goal`}
          </AppText>
        </View>

        <View style={styles.card}>
          <AppText style={styles.cardTitle}>Room left unused</AppText>
          <AppText style={styles.cardValue}>
            {totals.underGoal} puffs under the goal {rangeLabel}
          </AppText>
        </View>

        <AppText style={styles.caption}>{PROGRESS_DISCLAIMER}</AppText>
      </ScrollView>
    </SafeAreaView>
  );
}

function statsStyles(color: ColorTokens) {
  return {
    safe: {
      flex: 1,
      backgroundColor: color.bg,
    },
    body: {
      paddingHorizontal: space.lg,
      paddingTop: space.sm,
      paddingBottom: space.xl,
      gap: space.md,
    },
    top: {
      flexDirection: "row" as const,
      alignItems: "center" as const,
      justifyContent: "space-between" as const,
    },
    title: {
      ...type.title,
      color: color.ink,
    },
    back: {
      minHeight: minTapTarget,
      minWidth: 64,
      justifyContent: "center" as const,
    },
    backLabel: {
      ...type.body,
      fontWeight: "700" as const,
      color: color.sky,
    },
    chips: {
      flexDirection: "row" as const,
      gap: space.sm,
    },
    chip: {
      flex: 1,
      minHeight: minTapTarget,
      borderRadius: radius.pill,
      backgroundColor: color.surface,
      alignItems: "center" as const,
      justifyContent: "center" as const,
    },
    chipOn: {
      backgroundColor: color.tabOn,
    },
    chipLabel: {
      ...type.caption,
      fontWeight: "700" as const,
      color: color.ink,
    },
    chipLabelOn: {
      color: color.onAccent,
    },
    hero: {
      backgroundColor: color.surface,
      borderRadius: radius.lg,
      padding: space.lg,
      gap: space.sm,
    },
    score: {
      fontSize: 56,
      fontWeight: "800" as const,
      color: color.ink,
    },
    heroCaption: {
      ...type.body,
      color: color.inkMuted,
    },
    card: {
      backgroundColor: color.surface,
      borderRadius: radius.lg,
      padding: space.md,
      gap: space.sm,
    },
    cardTitle: {
      ...type.caption,
      color: color.inkMuted,
      fontWeight: "700" as const,
    },
    cardValue: {
      ...type.body,
      color: color.ink,
      fontWeight: "700" as const,
    },
    caption: {
      ...type.caption,
      color: color.inkMuted,
    },
    pressed: {
      opacity: 0.85,
    },
  };
}
