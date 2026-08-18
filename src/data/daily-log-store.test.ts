import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  applyDayRollover,
  logPuff,
  resetDailyLog,
  undoPuff,
} from "./daily-log-store";

describe("daily log store", () => {
  it("logs and undoes puffs on the same local day", () => {
    const now = new Date(2026, 7, 18, 10);
    resetDailyLog(now);
    assert.equal(logPuff(12, now).logged, 1);
    assert.equal(logPuff(12, now).logged, 2);
    assert.equal(undoPuff(12, now).logged, 1);
    assert.equal(undoPuff(12, now).logged, 0);
    assert.equal(undoPuff(12, now).logged, 0);
  });

  it("recovers only when yesterday stayed at or under the commitment", () => {
    const monday = new Date(2026, 7, 17, 21);
    const tuesday = new Date(2026, 7, 18, 1);
    resetDailyLog(monday);
    logPuff(2, monday);
    logPuff(2, monday);
    const recovered = applyDayRollover(2, tuesday);
    assert.equal(recovered.logged, 0);
    assert.equal(recovered.recoveryTicks, 1);
    assert.equal(recovered.dateKey, "2026-08-18");
  });

  it("skips recovery when yesterday went over the cap", () => {
    const monday = new Date(2026, 7, 17, 21);
    const tuesday = new Date(2026, 7, 18, 1);
    resetDailyLog(monday);
    logPuff(1, monday);
    logPuff(1, monday);
    const next = applyDayRollover(1, tuesday);
    assert.equal(next.recoveryTicks, 0);
  });
});
