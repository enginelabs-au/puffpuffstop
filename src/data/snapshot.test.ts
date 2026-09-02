import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { logPuff, resetDailyLog } from "./daily-log-store";
import { resetDraft, updateDraft } from "./onboarding-store";
import {
  createMemoryPersistDriver,
  hydrateFromDriver,
  persistNow,
  resetPersistDriver,
  setPersistDriver,
} from "./persist";
import { setHydrating } from "./persist-hook";
import { addSavings, resetSavings } from "./savings-store";
import { resetSettings, updateSettings } from "./settings-store";
import {
  SNAPSHOT_VERSION,
  captureSnapshot,
  migrateSnapshot,
  parseSnapshot,
  restoreSnapshot,
} from "./snapshot";

describe("snapshot persist", () => {
  it("round-trips stores through a memory driver", async () => {
    resetPersistDriver();
    const store = new Map<string, string>();
    setPersistDriver(createMemoryPersistDriver(store));
    resetDraft();
    resetDailyLog(new Date(2026, 7, 18, 12));
    resetSettings();
    resetSavings();
    updateDraft({ nickname: "Sam", durationCount: 8, frequencyCount: 12 });
    logPuff(10, new Date(2026, 7, 18, 12));
    updateSettings({ remindersEnabled: true, stakePerPuff: 0.2 });
    addSavings(1.4);

    persistNow();
    setHydrating(true);
    resetDraft();
    resetDailyLog(new Date(2026, 7, 18, 12));
    resetSettings();
    resetSavings();
    setHydrating(false);
    assert.equal(captureSnapshot().draft.nickname, "");

    const hydrated = await hydrateFromDriver();
    assert.equal(hydrated, true);
    const next = captureSnapshot();
    assert.equal(next.version, SNAPSHOT_VERSION);
    assert.equal(next.draft.nickname, "Sam");
    assert.equal(next.dailyLog.logged, 1);
    assert.equal(next.dailyLog.puffAt.length, 1);
    assert.equal(next.settings.stakePerPuff, 0.2);
    assert.equal(next.savings.pot, 1.4);
  });

  it("rejects a foreign or incomplete snapshot", () => {
    assert.equal(parseSnapshot({ version: 99, draft: {} }), null);
    assert.equal(restoreSnapshot({ version: SNAPSHOT_VERSION }), false);
  });

  it("upgrades an unversioned snapshot to v1 and rejects unknown versions", () => {
    const current = captureSnapshot();
    const unversioned = {
      draft: current.draft,
      dailyLog: current.dailyLog,
      settings: current.settings,
      savings: current.savings,
    };
    const migrated = migrateSnapshot(unversioned) as { version: number };
    assert.equal(migrated.version, SNAPSHOT_VERSION);
    assert.equal(parseSnapshot(unversioned)?.version, SNAPSHOT_VERSION);
    assert.equal(parseSnapshot({ ...unversioned, version: 99 }), null);
  });

  it("fills a missing timezone from the device", () => {
    const current = captureSnapshot();
    const parsed = parseSnapshot({
      ...current,
      settings: {
        remindersEnabled: current.settings.remindersEnabled,
        stakePerPuff: current.settings.stakePerPuff,
      },
    });
    assert.ok(parsed);
    assert.ok(parsed.settings.timeZone.length > 0);
  });

  it("defaults a missing puff timestamp list to empty", () => {
    const current = captureSnapshot();
    const parsed = parseSnapshot({
      ...current,
      dailyLog: {
        dateKey: current.dailyLog.dateKey,
        logged: 3,
        recoveryTicks: 0,
      },
    });
    assert.ok(parsed);
    assert.equal(parsed.dailyLog.logged, 3);
    assert.deepEqual(parsed.dailyLog.puffAt, []);
  });

  it("defaults missing interval pacing to on for an existing plan", () => {
    const current = captureSnapshot();
    const { intervalPacing: _ignored, ...draft } = current.draft;
    const parsed = parseSnapshot({
      ...current,
      draft: { ...draft, durationCount: 8, frequencyCount: 12 },
    });
    assert.ok(parsed);
    assert.equal(parsed.draft.intervalPacing, true);
  });

  it("defaults missing unused-puff reminders to off for an existing plan", () => {
    const current = captureSnapshot();
    const { intervalPacingReminders: _ignored, ...draft } = current.draft;
    const parsed = parseSnapshot({
      ...current,
      draft: { ...draft, durationCount: 8, frequencyCount: 12 },
    });
    assert.ok(parsed);
    assert.equal(parsed.draft.intervalPacingReminders, false);
  });

  it("keeps interval pacing unanswered on a fresh draft", () => {
    const current = captureSnapshot();
    const parsed = parseSnapshot({
      ...current,
      draft: { nickname: "" },
    });
    assert.ok(parsed);
    assert.equal(parsed.draft.intervalPacing, null);
  });

  it("defaults missing goal history to empty", () => {
    const current = captureSnapshot();
    const { progress: _progress, ...without } = current;
    const parsed = parseSnapshot(without);
    assert.ok(parsed);
    assert.deepEqual(parsed.progress.days, []);
  });

  it("defaults a missing appearance to dark", () => {
    const current = captureSnapshot();
    const parsed = parseSnapshot({
      ...current,
      settings: {
        remindersEnabled: current.settings.remindersEnabled,
        stakePerPuff: current.settings.stakePerPuff,
        timeZone: current.settings.timeZone,
      },
    });
    assert.ok(parsed);
    assert.equal(parsed.settings.theme, "dark");
  });
});
