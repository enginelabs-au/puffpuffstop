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
});
