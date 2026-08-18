import { Redirect, router } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
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
  organBaselines,
  organScores,
} from "../src/domain/organs";
import { PLAN_DISCLAIMER, summarizePlan } from "../src/domain/plan-summary";
import { formatMoney } from "../src/domain/savings";
import { color, minTapTarget, radius, space, type } from "../src/theme/tokens";
import { playLogHaptic, playUndoHaptic } from "../src/ui/haptics";
import { OrganCard } from "../src/ui/OrganCard";

const UNDO_MS = 5000;

export default function HomeScreen() {
  const draft = getDraft();
  const summary = useMemo(() => summarizePlan(draft), [draft]);
  const baselines = useMemo(
    () => organBaselines(summary.historyDays, summary.puffsPerDay),
    [summary.historyDays, summary.puffsPerDay],
  );

  const [log, setLog] = useState<DailyLogState>(() => {
    applyDayCycle(summary.commitment);
    return getDailyLog();
  });
  const [snackVisible, setSnackVisible] = useState(false);
  const [pot, setPot] = useState(() => getSavings().pot);

  useEffect(() => {
    applyDayCycle(summary.commitment);
    setLog(getDailyLog());
    setPot(getSavings().pot);
  }, [summary.commitment]);

  useEffect(() => {
    if (!snackVisible) return undefined;
    const timer = setTimeout(() => setSnackVisible(false), UNDO_MS);
    return () => clearTimeout(timer);
  }, [snackVisible, log.logged]);

  if (!canShowHome(draft)) {
    return <Redirect href="/age-gate" />;
  }

  const scores = organScores(
    baselines,
    log.logged,
    summary.commitment,
    log.recoveryTicks,
  );
  const overCap = log.logged > summary.commitment;
  const recovering = log.recoveryTicks > 0 && !overCap && log.logged === 0;

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
      <View style={styles.stage}>
        <View style={styles.top}>
          <Text style={styles.hello} accessibilityRole="header">
            Hey {summary.displayName}
          </Text>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Settings"
            onPress={() => router.push("/settings")}
            style={styles.settings}
          >
            <Text style={styles.settingsLabel}>Settings</Text>
          </Pressable>
        </View>
        <Text
          style={[styles.strip, overCap ? styles.stripOver : null]}
          accessibilityLabel={`${log.logged} of ${summary.commitment} puffs today`}
        >
          {log.logged} / {summary.commitment}
        </Text>
        <View style={styles.grid}>
          {ORGAN_IDS.map((id) => (
            <OrganCard
              key={id}
              id={id}
              score={scores[id]}
              recovering={recovering}
            />
          ))}
        </View>
        {pot > 0 ? (
          <Text style={styles.caption}>Puff Savings ${formatMoney(pot)}</Text>
        ) : null}
        <Text style={styles.caption}>{PLAN_DISCLAIMER}</Text>
      </View>

      {snackVisible ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Undo last puff"
          onPress={onUndo}
          style={styles.snack}
        >
          <Text style={styles.snackText}>Puff logged. Undo</Text>
        </Pressable>
      ) : null}

      <View style={styles.dock}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Log one puff"
          accessibilityHint="Long press to undo"
          onPress={onLog}
          onLongPress={onUndo}
          style={({ pressed }) => [styles.log, pressed ? styles.pressed : null]}
        >
          <Text style={styles.logLabel}>Log</Text>
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
  stage: {
    flex: 1,
    paddingHorizontal: space.lg,
    paddingTop: space.md,
    gap: space.md,
  },
  top: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: space.sm,
  },
  hello: {
    ...type.title,
    color: color.ink,
    flex: 1,
  },
  settings: {
    minHeight: minTapTarget,
    justifyContent: "center",
  },
  settingsLabel: {
    ...type.body,
    color: color.accent,
  },
  strip: {
    ...type.body,
    color: color.ink,
    fontWeight: "700",
  },
  stripOver: {
    color: color.amber,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: space.sm,
  },
  caption: {
    ...type.caption,
    color: color.inkMuted,
  },
  dock: {
    alignItems: "center",
    paddingBottom: space.lg,
  },
  log: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: color.accent,
    alignItems: "center",
    justifyContent: "center",
    minWidth: minTapTarget,
    minHeight: minTapTarget,
  },
  logLabel: {
    ...type.title,
    fontSize: 20,
    color: color.onAccent,
  },
  snack: {
    alignSelf: "center",
    backgroundColor: color.ink,
    borderRadius: radius.pill,
    paddingHorizontal: space.lg,
    minHeight: minTapTarget,
    justifyContent: "center",
    marginBottom: space.sm,
  },
  snackText: {
    ...type.body,
    color: color.onAccent,
  },
  pressed: {
    opacity: 0.85,
  },
});
