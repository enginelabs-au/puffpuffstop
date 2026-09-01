import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { localDateKey } from "./organs";
import {
  DAY_RESET_CAPTION,
  deviceTimeZone,
  formatTimeZoneLabel,
  isTimeZone,
  resolveTimeZone,
  timeZoneOptions,
} from "./timezones";

describe("timezones", () => {
  it("detects the device zone and rejects invented ids", () => {
    assert.equal(isTimeZone("Australia/Sydney"), true);
    assert.equal(isTimeZone("Not/AZone"), false);
    assert.equal(isTimeZone(deviceTimeZone()), true);
    assert.equal(resolveTimeZone("bogus"), deviceTimeZone());
    assert.equal(resolveTimeZone("Pacific/Auckland"), "Pacific/Auckland");
    assert.match(DAY_RESET_CAPTION, /11:59pm/);
    assert.match(formatTimeZoneLabel("Australia/Sydney"), /Sydney/);
    assert.ok(timeZoneOptions().some((row) => row.value === deviceTimeZone()));
  });

  it("keeps a day until 11:59pm in the chosen timezone", () => {
    const stillToday = new Date("2026-09-01T13:59:00.000Z");
    const nextDay = new Date("2026-09-01T14:00:00.000Z");
    assert.equal(localDateKey(stillToday, "Australia/Brisbane"), "2026-09-01");
    assert.equal(localDateKey(nextDay, "Australia/Brisbane"), "2026-09-02");

    const laStill = new Date("2026-09-02T06:59:00.000Z");
    const laNext = new Date("2026-09-02T07:00:00.000Z");
    assert.equal(localDateKey(laStill, "America/Los_Angeles"), "2026-09-01");
    assert.equal(localDateKey(laNext, "America/Los_Angeles"), "2026-09-02");
  });
});
