import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  emptyHealthState,
  effectsAroundPuff,
  fitbitAuthorizeUrl,
  formatHealthValue,
  hasHealthReadings,
  isWatchFeedLive,
  healthAccessUrl,
  parseFitbitCallback,
  parseHealthFile,
  redactHealthSecrets,
  visibleHealthRows,
  visibleLogEffects,
  formatHealthDelta,
  healthRefreshUrl,
  healthWatchPathHelper,
  isWatchLiveWindow,
  HEALTH_GOOGLE_VIA_APPLE,
  HEALTH_GOOGLE_VIA_CONNECT,
} from "./health";

describe("health context", () => {
  it("parses a native health file and formats visible rows", () => {
    const parsed = parseHealthFile({
      status: "ok",
      source: "healthkit",
      syncedAt: "2026-09-01T12:00:00.000Z",
      dateKey: "2026-09-01",
      heartRateBpm: 74,
      steps: 1200,
      sleepMinutes: 390,
    });
    assert.equal(parsed.status, "ok");
    assert.equal(parsed.source, "healthkit");
    assert.equal(parsed.summary.heartRateBpm, 74);
    assert.equal(hasHealthReadings(parsed.summary), true);
    assert.equal(
      isWatchFeedLive({
        ...emptyHealthState(),
        healthEnabled: true,
        healthStatus: "ok",
        summary: parsed.summary,
      }),
      true,
    );
    assert.equal(
      isWatchFeedLive({
        ...emptyHealthState(),
        healthEnabled: true,
        healthStatus: "ok",
      }),
      false,
    );
    assert.equal(
      isWatchFeedLive({
        ...emptyHealthState(),
        healthEnabled: true,
        watchMetricsEnabled: false,
        healthStatus: "ok",
        summary: parsed.summary,
      }),
      false,
    );
    assert.equal(formatHealthValue("heartRateBpm", 74), "74 bpm");
    assert.equal(formatHealthValue("sleepMinutes", 390), "6h 30m");
    assert.equal(visibleHealthRows(parsed.summary).length, 1);
    assert.deepEqual(
      visibleLogEffects(
        [
          { key: "heartRateBpm", before: 74, after: 82, puffAt: 1_000 },
          { key: "spo2Percent", before: 97, after: 97, puffAt: 1_000 },
        ],
        1_000,
      ).map((row) => row.key),
      ["heartRateBpm"],
    );
    const visible = visibleLogEffects(
      [{ key: "heartRateBpm", before: 74, after: 82, puffAt: 1_000 }],
      1_000,
    );
    assert.equal(visible[0]?.delta, 8);
    assert.equal(visible[0]?.direction, "up");
    assert.equal(formatHealthDelta("heartRateBpm", 8), "+8 bpm");
    assert.equal(isWatchLiveWindow(Date.now() - 60_000), true);
    assert.equal(isWatchLiveWindow(Date.now() - 21 * 60 * 1000), false);
    assert.deepEqual(visibleLogEffects([{ key: "heartRateBpm", before: 74, after: 82, puffAt: 1_000 }], undefined), []);
    const around = effectsAroundPuff(
      [
        { at: 800, value: 70 },
        { at: 1_200, value: 84 },
      ],
      1_000,
      "heartRateBpm",
    );
    assert.deepEqual(around, {
      key: "heartRateBpm",
      before: 70,
      after: 84,
      puffAt: 1_000,
    });
  });

  it("builds Health and Fitbit URLs and redacts tokens", () => {
    assert.equal(healthAccessUrl(), "puffpuffstop://health-access");
    assert.equal(healthRefreshUrl(), "puffpuffstop://health-refresh");
    assert.match(healthWatchPathHelper("android"), /Health Connect/);
    assert.match(HEALTH_GOOGLE_VIA_CONNECT, /Wear/);
    assert.match(healthWatchPathHelper("ios"), /Apple Health/);
    const authorize = fitbitAuthorizeUrl({
      clientId: "abc",
      redirectUri: "puffpuffstop://fitbit",
      codeChallenge: "challenge",
      state: "state-1",
    });
    assert.match(authorize, /fitbit\.com\/oauth2\/authorize/);
    assert.match(authorize, /client_id=abc/);
    assert.match(authorize, /code_challenge=challenge/);
    assert.deepEqual(parseFitbitCallback("puffpuffstop://fitbit?code=xyz"), {
      code: "xyz",
    });
    assert.deepEqual(parseFitbitCallback("puffpuffstop:///fitbit?code=xyz"), {
      code: "xyz",
    });
    assert.equal(parseFitbitCallback("puffpuffstop://quick-log?action=up"), null);
    const redacted = redactHealthSecrets({
      ...emptyHealthState(),
      fitbitAccessToken: "secret-token",
      fitbitRefreshToken: "refresh",
      fitbitCodeVerifier: "verifier",
    });
    assert.equal(redacted.fitbitAccessToken, null);
    assert.equal(redacted.fitbitRefreshToken, null);
    assert.match(HEALTH_GOOGLE_VIA_APPLE, /Google Health/);
    assert.match(HEALTH_GOOGLE_VIA_APPLE, /Apple Health/);
  });
});
