import { Redirect } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { Pressable, ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import {
  getDailyLog,
  logPuff,
  undoPuff,
  type DailyLogState,
} from "../src/data/daily-log-store";
import { applyDayCycle } from "../src/data/day-cycle";
import { getDraft } from "../src/data/onboarding-store";
import { getSavings } from "../src/data/savings-store";
import { canShowHome } from "../src/domain/onboarding";
import {
  ORGAN_IDS,
  isGoalCelebration,
  isOnTrack,
  organBaselines,
  organScores,
} from "../src/domain/organs";
import { PLAN_DISCLAIMER, summarizePlan } from "../src/domain/plan-summary";
import { formatCurrency } from "../src/domain/savings";
import { minTapTarget, radius, space, type, type ColorTokens } from "../src/theme/tokens";
import { useThemedStyles } from "../src/ui/use-themed-styles";
import { playLogHaptic, playSuccessHaptic, playUndoHaptic } from "../src/ui/haptics";
import { subscribeQuickLog } from "../src/data/quick-log";
import { AppTabs } from "../src/ui/AppTabs";
import { AppText } from "../src/ui/AppText";
import { OrganCard } from "../src/ui/OrganCard";

const UNDO_MS = 5000;

export default function HomeScreen() {
  const styles = useThemedStyles(homeStyles);
  const draft = getDraft();
  const summary = useMemo(() => summarizePlan(draft), [draft]);
  const baselines = useMemo(
    () => organBaselines(summary.historyDays, summary.puffsPerDay),
    [summary.historyDays, summary.puffsPerDay],
  );

  const [boot] = useState(() => {
    const result = applyDayCycle(summary.commitment);
    return {
      log: getDailyLog(),
      pot: getSavings().pot,
      justSucceeded: result.rolled && result.recovered,
    };
  });
  const [log, setLog] = useState<DailyLogState>(boot.log);
  const [snackVisible, setSnackVisible] = useState(false);
  const [justSucceeded, setJustSucceeded] = useState(boot.justSucceeded);
  const [pot, setPot] = useState(boot.pot);

  useEffect(() => {
    const result = applyDayCycle(summary.commitment);
    setLog(getDailyLog());
    setPot(getSavings().pot);
    if (result.rolled && result.recovered) {
      setJustSucceeded(true);
    }
  }, [summary.commitment]);

  useEffect(() => {
    if (justSucceeded) void playSuccessHaptic();
  }, [justSucceeded]);

  useEffect(() => {
    if (!snackVisible) return undefined;
    const timer = setTimeout(() => setSnackVisible(false), UNDO_MS);
    return () => clearTimeout(timer);
  }, [snackVisible, log.logged]);

  useEffect(() => {
    return subscribeQuickLog(() => {
      setLog(getDailyLog());
    });
  }, []);

  if (!canShowHome(draft)) {
    return <Redirect href="/onboarding/nickname" />;
  }

  const scores = organScores(
    baselines,
    log.logged,
    summary.commitment,
    log.recoveryTicks,
  );
  const overCap = !isOnTrack(log.logged, summary.commitment);
  const celebrating = isGoalCelebration(
    log.recoveryTicks,
    log.logged,
    summary.commitment,
  );
  const recovering = celebrating;

  function onLog() {
    setLog(logPuff(summary.commitment));
    setSnackVisible(true);
    void playLogHaptic();
  }

  function onUndo() {
    setLog(undoPuff(summary.commitment));
    setSnackVisible(false);
    void playUndoHaptic();
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        style={styles.stage}
        contentContainerStyle={styles.stageContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.top}>
          <AppText style={styles.hello} accessibilityRole="header">
            Hey {summary.displayName}
          </AppText>
        </View>
        <AppText
          style={[styles.strip, overCap ? styles.stripOver : null]}
          accessibilityLabel={`${log.logged} of ${summary.commitment} puffs today`}
        >
          {log.logged} / {summary.commitment}
        </AppText>
        <View style={styles.grid}>
          {ORGAN_IDS.map((id) => (
            <OrganCard
              key={id}
              id={id}
              score={scores[id]}
              recovering={recovering}
              celebrating={celebrating}
            />
          ))}
        </View>
        {celebrating || justSucceeded ? (
          <AppText style={styles.success} accessibilityLiveRegion="polite">
            {justSucceeded
              ? "You stayed under yesterday. Your organs are cheering."
              : "Goal streak on. Your organs are perking up."}
          </AppText>
        ) : null}
        {pot > 0 ? (
          <AppText style={styles.caption}>
            Puff Savings {formatCurrency(pot, draft.currencyCode)}
          </AppText>
        ) : null}
        <AppText style={styles.caption}>{PLAN_DISCLAIMER}</AppText>
      </ScrollView>

      <View style={styles.footer}>
        {snackVisible ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Undo last puff"
            onPress={onUndo}
            style={styles.snack}
          >
            <AppText style={styles.snackText}>Puff logged. Undo</AppText>
          </Pressable>
        ) : null}
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Log one puff"
          accessibilityHint="Long press to undo"
          onPress={onLog}
          onLongPress={onUndo}
          style={({ pressed }) => [styles.log, pressed ? styles.pressed : null]}
        >
          <AppText style={styles.logLabel}>Log</AppText>
        </Pressable>
        <AppTabs active="home" />
      </View>
    </SafeAreaView>
  );
}

function homeStyles(color: ColorTokens) {
  return {
    safe: {
      flex: 1,
      backgroundColor: color.bg,
    },
    stage: {
      flex: 1,
    },
    stageContent: {
      paddingHorizontal: space.lg,
      paddingTop: space.sm,
      paddingBottom: space.sm,
      gap: space.sm,
    },
    footer: {
      backgroundColor: color.bg,
      alignItems: "center" as const,
      paddingTop: space.sm,
      gap: space.sm,
    },
    log: {
      width: 72,
      height: 72,
      borderRadius: 36,
      backgroundColor: color.accent,
      alignItems: "center" as const,
      justifyContent: "center" as const,
    },
    logLabel: {
      ...type.body,
      fontWeight: "800" as const,
      color: color.onAccent,
    },
    top: {
      flexDirection: "row" as const,
      alignItems: "center" as const,
      justifyContent: "space-between" as const,
      gap: space.sm,
    },
    hello: {
      ...type.title,
      color: color.ink,
      flex: 1,
    },
    strip: {
      ...type.body,
      color: color.ink,
      fontWeight: "700" as const,
    },
    stripOver: {
      color: color.amber,
    },
    grid: {
      flexDirection: "row" as const,
      flexWrap: "wrap" as const,
      gap: space.sm,
      justifyContent: "flex-start" as const,
    },
    caption: {
      ...type.caption,
      color: color.inkMuted,
    },
    success: {
      ...type.body,
      color: color.ink,
      fontWeight: "700" as const,
      backgroundColor: color.surface,
      borderRadius: radius.lg,
      padding: space.md,
      overflow: "hidden" as const,
    },
    snack: {
      alignSelf: "center" as const,
      backgroundColor: color.tabOn,
      borderRadius: radius.pill,
      paddingHorizontal: space.lg,
      minHeight: minTapTarget,
      justifyContent: "center" as const,
      marginBottom: space.sm,
    },
    snackText: {
      ...type.body,
      color: color.onAccent,
    },
    pressed: {
      opacity: 0.85,
    },
  };
}
