import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { readSyncStatus, syncStatusLabel } from "./sync";

describe("sync status", () => {
  it("stays offline when no Supabase URL is present", () => {
    assert.equal(readSyncStatus({}), "offline-local");
    assert.match(syncStatusLabel("offline-local"), /stays on this device/);
  });

  it("does not connect when only the URL name is populated", () => {
    assert.equal(
      readSyncStatus({ EXPO_PUBLIC_SUPABASE_URL: "https://example.supabase.co" }),
      "env-present-not-connected",
    );
    assert.match(syncStatusLabel("env-present-not-connected"), /not connected/);
  });
});
