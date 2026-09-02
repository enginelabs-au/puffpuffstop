import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  applyDayRollover,
  getDailyLog,
  logPuff,
  resetDailyLog,
  undoPuff,
} from "./daily-log-store";
import { applyTimeZonePreference } from "./time-zone-preference";
import { getProgress, resetProgress } from "./progress-store";
import { resetSettings } from "./settings-store";

describe("daily log store", () => {
  it("logs and undoes puffs on the same local day", () => {
    const now = new Date(2026, 7, 18, 10);
    resetDailyLog(now);
    assert.equal(logPuff(12, now).logged, 1);
    assert.equal(logPuff(12, now).logged, 2);
    assert.equal(undoPuff(12, now).logged, 1);
    assert.equal(undoPuff(12, now).logged, 0);
    assert.equal(undoPuff(12, now).logged, 0);
    assert.deepEqual(getDailyLog().puffAt, []);
  });

  it("stores a timestamp for each logged puff and drops it on undo", () => {
    const now = new Date(2026, 7, 18, 10, 15);
    resetDailyLog(now);
    assert.deepEqual(logPuff(12, now).puffAt, [now.getTime()]);
    const later = new Date(2026, 7, 18, 10, 40);
    assert.deepEqual(logPuff(12, later).puffAt, [now.getTime(), later.getTime()]);
    assert.deepEqual(undoPuff(12, later).puffAt, [now.getTime()]);
  });

  it("recovers only when yesterday stayed at or under the commitment", () => {
    const monday = new Date(2026, 7, 17, 21);
    const tuesday = new Date(2026, 7, 18, 1);
    resetDailyLog(monday);
    resetProgress();
    logPuff(2, monday);
    logPuff(2, monday);
    const mondayKey = getDailyLog().dateKey;
    const recovered = applyDayRollover(2, tuesday);
    assert.equal(recovered.logged, 0);
    assert.equal(recovered.recoveryTicks, 1);
    assert.equal(recovered.dateKey, "2026-08-18");
    const days = getProgress().days;
    assert.equal(days.find((day) => day.dateKey === mondayKey)?.logged, 2);
    assert.equal(days.find((day) => day.dateKey === mondayKey)?.met, true);
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

  it("rolls after 11:59pm in the saved timezone", () => {
    resetSettings();
    applyTimeZonePreference("Australia/Brisbane");
    const stillToday = new Date("2026-09-01T13:59:00.000Z");
    const nextDay = new Date("2026-09-01T14:00:00.000Z");
    resetDailyLog(stillToday);
    logPuff(10, stillToday);
    assert.equal(getDailyLog().logged, 1);
    const rolled = applyDayRollover(10, nextDay);
    assert.equal(rolled.rolled, true);
    assert.equal(rolled.dateKey, "2026-09-02");
    assert.equal(rolled.logged, 0);
  });

  it("keeps today's count when the timezone changes", () => {
    resetSettings();
    applyTimeZonePreference("UTC", new Date("2026-09-01T18:00:00.000Z"));
    resetDailyLog(new Date("2026-09-01T18:00:00.000Z"));
    logPuff(10, new Date("2026-09-01T18:00:00.000Z"));
    applyTimeZonePreference("Pacific/Auckland", new Date("2026-09-01T18:00:00.000Z"));
    assert.equal(getDailyLog().logged, 1);
    assert.equal(getDailyLog().dateKey, "2026-09-02");
  });
});
