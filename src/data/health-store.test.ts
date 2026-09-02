import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { emptyHealthSummary } from "../domain/health";
import {
  getHealth,
  mergeHealthSummary,
  parseHealthState,
  resetHealth,
  updateHealth,
} from "./health-store";
import { setHydrating } from "./persist-hook";

describe("health store", () => {
  it("merges a HealthKit summary and parses persisted state", () => {
    setHydrating(true);
    resetHealth();
    mergeHealthSummary(
      { ...emptyHealthSummary(), heartRateBpm: 80, steps: 4000 },
      {
        status: "ok",
        source: "healthkit",
        syncedAt: "2026-09-01T01:00:00.000Z",
        dateKey: "2026-09-01",
        enabledKey: "healthEnabled",
      },
    );
    const state = getHealth();
    assert.equal(state.healthEnabled, true);
    assert.equal(state.healthStatus, "ok");
    assert.deepEqual(state.sources, ["healthkit"]);
    assert.equal(state.summary.steps, 4000);
    const parsed = parseHealthState({
      healthEnabled: true,
      fitbitEnabled: false,
      healthStatus: "ok",
      sources: ["healthkit"],
      summary: { heartRateBpm: 70 },
    });
    assert.equal(parsed.summary.heartRateBpm, 70);
    assert.equal(parsed.summary.steps, null);
    updateHealth({ healthEnabled: false, watchMetricsEnabled: false });
    assert.equal(getHealth().healthEnabled, false);
    assert.equal(getHealth().watchMetricsEnabled, false);
    mergeHealthSummary(
      { ...emptyHealthSummary(), heartRateBpm: 90 },
      { status: "ok", source: "healthkit" },
    );
    assert.equal(getHealth().healthEnabled, false);
    resetHealth();
    setHydrating(false);
    assert.equal(getHealth().healthEnabled, false);
  });
});
