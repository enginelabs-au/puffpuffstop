import { Redirect, router } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { Pressable, ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import {
  applyUsageEaseRecovery,
  getDailyLog,
  logPuff,
  undoPuff,
  type DailyLogState,
} from "../src/data/daily-log-store";
import { applyDayCycle, syncOpenProgressDay } from "../src/data/day-cycle";
import { getProgress } from "../src/data/progress-store";
import { syncPaceReminders } from "../src/data/pace-reminders";
import { getSettings, updateSettings } from "../src/data/settings-store";
import { getSavings } from "../src/data/savings-store";
import { canShowHome, intervalPacingStartsOpen } from "../src/domain/onboarding";
import {
  isGoalCelebration,
  isOnTrack,
  isOrganRecovering,
  localDateKey,
  organBaselines,
  organScores,
} from "../src/domain/organs";
import {
  USAGE_EASE_MESSAGE,
  detectUsageEase,
  detectUsageSurge,
} from "../src/domain/usage-surge";
import { PLAN_DISCLAIMER } from "../src/domain/plan-summary";
import {
  shouldPromptEasierCutDown,
  struggleWindowKey,
} from "../src/domain/cut-down-coach";
import { profileScore } from "../src/domain/progress";
import { formatCurrency } from "../src/domain/savings";
import { minTapTarget, radius, space, type, type ColorTokens } from "../src/theme/tokens";
import { useThemedStyles } from "../src/ui/use-themed-styles";
import { playLogHaptic, playSuccessHaptic, playUndoHaptic } from "../src/ui/haptics";
import { subscribeQuickLog } from "../src/data/quick-log";
import { getHealth } from "../src/data/health-store";
import { subscribeHealth, syncHealthFromDisk } from "../src/data/health-sync";
import {
  HEALTH_LIVE_BURST_MS,
  HEALTH_LIVE_POLL_MS,
  isWatchFeedLive,
  isWatchLiveWindow,
  visibleHealthRows,
  visibleLogEffects,
} from "../src/domain/health";
import { refreshHealthAfterLog } from "../src/data/health-sync";
import { AppTabs } from "../src/ui/AppTabs";
import { AppText } from "../src/ui/AppText";
import { OrganFold } from "../src/ui/OrganFold";
import { PacingMeter } from "../src/ui/PacingMeter";
import { ProfileScoreButton } from "../src/ui/ProfileScoreButton";
import { CutDownCoachBanner } from "../src/ui/CutDownCoachBanner";
import { UsageSurgeBanner } from "../src/ui/UsageSurgeBanner";
import { WatchShiftBanner } from "../src/ui/WatchShiftBanner";
import { useCurrentPlan } from "../src/ui/use-current-plan";

const UNDO_MS = 5000;

export default function HomeScreen() {
  const styles = useThemedStyles(homeStyles);
  const { draft, summary } = useCurrentPlan();
  const baselines = useMemo(
    () => organBaselines(summary.historyDays, summary.puffsPerDay),
    [summary.historyDays, summary.puffsPerDay],
  );

  const [boot] = useState(() => {
    const result = applyDayCycle(summary.commitment);
    syncOpenProgressDay(summary.commitment);
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
  const [health, setHealth] = useState(getHealth);
  const [dismissedSurgeKey, setDismissedSurgeKey] = useState<string | null>(null);
  const [coachKey, setCoachKey] = useState(getSettings().cutDownCoachKey);

  useEffect(() => {
    const result = applyDayCycle(summary.commitment);
    syncOpenProgressDay(summary.commitment);
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

  useEffect(() => {
    const surge = detectUsageSurge(log.puffAt);
    if (!surge.active || dismissedSurgeKey === surge.key) return undefined;
    const timer = setTimeout(() => setDismissedSurgeKey(surge.key), 8000);
    return () => clearTimeout(timer);
  }, [log.puffAt, dismissedSurgeKey]);

  useEffect(() => {
    const tick = () => {
      if (applyUsageEaseRecovery()) setLog(getDailyLog());
    };
    tick();
    const timer = setInterval(tick, 15_000);
    return () => clearInterval(timer);
  }, [log.puffAt]);

  useEffect(() => {
    void syncHealthFromDisk().then(() => setHealth(getHealth()));
    return subscribeHealth(() => setHealth(getHealth()));
  }, []);

  useEffect(() => {
    const last = log.puffAt.at(-1);
    if (
      !isWatchLiveWindow(last) ||
      !health.watchMetricsEnabled ||
      !(health.healthEnabled || health.fitbitEnabled)
    ) {
      return undefined;
    }
    const started = Date.now();
    const tick = () => {
      void refreshHealthAfterLog().then(() => setHealth(getHealth()));
    };
    tick();
    const timer = setInterval(() => {
      if (Date.now() - started > HEALTH_LIVE_BURST_MS) {
        clearInterval(timer);
        return;
      }
      tick();
    }, HEALTH_LIVE_POLL_MS);
    return () => clearInterval(timer);
  }, [log.puffAt, health.healthEnabled, health.fitbitEnabled, health.watchMetricsEnabled]);

  if (!canShowHome(draft)) {
    return <Redirect href="/onboarding/nickname" />;
  }

  const scores = organScores(
    baselines,
    log.logged,
    summary.commitment,
    log.recoveryTicks,
    log.easeTicks,
  );
  const overCap = !isOnTrack(log.logged, summary.commitment);
  const celebrating = isGoalCelebration(
    log.recoveryTicks,
    log.logged,
    summary.commitment,
  );
  const ease = detectUsageEase(log.puffAt);
  const recovering = isOrganRecovering(
    ease.active,
    log.recoveryTicks,
    log.logged,
    summary.commitment,
  );
  const lastPuffAt = log.puffAt.at(-1);
  const healthEffectRows = visibleLogEffects(health.effects, lastPuffAt);
  const watchFeedLive = isWatchFeedLive(health);
  const watchReadings = watchFeedLive ? visibleHealthRows(health.summary) : [];
  const surge = detectUsageSurge(log.puffAt);
  const todayKey = localDateKey(new Date(), getSettings().timeZone);
  const showSurge = surge.active && dismissedSurgeKey !== surge.key;
  const coachWindow = struggleWindowKey(getProgress().days, todayKey);
  const showCoach = shouldPromptEasierCutDown(
    getProgress().days,
    todayKey,
    draft.cutDownPerDay,
    coachKey,
  );

  function onLog() {
    setLog(logPuff(summary.commitment));
    setSnackVisible(true);
    void playLogHaptic();
    void syncPaceReminders();
    void refreshHealthAfterLog().then(() => setHealth(getHealth()));
  }

  function onUndo() {
    setLog(undoPuff(summary.commitment));
    setSnackVisible(false);
    void playUndoHaptic();
    void syncPaceReminders();
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
          <ProfileScoreButton
            score={profileScore(
              getProgress().days,
              localDateKey(new Date(), getSettings().timeZone),
            )}
            onPress={() => router.push("/stats")}
          />
        </View>
        <PacingMeter
          averagePuffsPerDay={summary.puffsPerDay}
          goalPuffsPerDay={summary.commitment}
          puffAt={log.puffAt}
          logged={log.logged}
          timeZone={getSettings().timeZone}
          showGoal
          overCap={overCap}
          defaultOpen={intervalPacingStartsOpen(draft)}
        />
        {showSurge ? (
          <UsageSurgeBanner onDismiss={() => setDismissedSurgeKey(surge.key)} />
        ) : null}
        {showCoach ? (
          <CutDownCoachBanner
            onKeep={() => {
              const next = coachWindow;
              setCoachKey(next);
              updateSettings({ cutDownCoachKey: next });
            }}
            onChange={() => {
              const next = coachWindow;
              setCoachKey(next);
              updateSettings({ cutDownCoachKey: next });
              router.push("/settings");
            }}
          />
        ) : null}
        {watchFeedLive || healthEffectRows.length > 0 ? (
          <WatchShiftBanner
            rows={healthEffectRows}
            readings={watchReadings}
            watching={watchFeedLive && isWatchLiveWindow(lastPuffAt)}
          />
        ) : null}
        <OrganFold
          scores={scores}
          recovering={recovering}
          celebrating={celebrating}
        />
        {celebrating || justSucceeded ? (
          <AppText style={styles.success} accessibilityLiveRegion="polite">
            {justSucceeded
              ? "You stayed under yesterday. Recovery still takes months."
              : "Goal streak on. Healing is slow, and that is the point."}
          </AppText>
        ) : ease.active ? (
          <AppText style={styles.success} accessibilityLiveRegion="polite">
            {USAGE_EASE_MESSAGE}
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
