import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { envNames, readAppEnv } from "./env";

describe("env wiring", () => {
  it("registers public environment-variable names", () => {
    assert.equal(envNames.appEnv, "EXPO_PUBLIC_APP_ENV");
    assert.equal(envNames.supabaseUrl, "EXPO_PUBLIC_SUPABASE_URL");
    assert.equal(envNames.supabaseAnonKey, "EXPO_PUBLIC_SUPABASE_ANON_KEY");
  });

  it("defaults to local when a value is missing", () => {
    assert.equal(readAppEnv({}), "local");
    assert.equal(readAppEnv({ EXPO_PUBLIC_APP_ENV: "preview" }), "preview");
  });
});
