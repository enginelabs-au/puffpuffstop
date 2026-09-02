import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { envNames, readAppEnv, readFitbitClientId, readPrivacyPolicyUrl } from "./env";

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

  it("accepts only an https privacy-policy URL", () => {
    assert.equal(envNames.privacyPolicyUrl, "EXPO_PUBLIC_PRIVACY_POLICY_URL");
    assert.equal(readPrivacyPolicyUrl({}), null);
    assert.equal(
      readPrivacyPolicyUrl({
        EXPO_PUBLIC_PRIVACY_POLICY_URL: "http://example.com/privacy",
      }),
      null,
    );
    assert.equal(
      readPrivacyPolicyUrl({
        EXPO_PUBLIC_PRIVACY_POLICY_URL: "https://example.com/privacy",
      }),
      "https://example.com/privacy",
    );
  });

  it("reads an optional Fitbit client id and never requires a secret", () => {
    assert.equal(envNames.fitbitClientId, "EXPO_PUBLIC_FITBIT_CLIENT_ID");
    assert.equal(readFitbitClientId({}), null);
    assert.equal(
      readFitbitClientId({ EXPO_PUBLIC_FITBIT_CLIENT_ID: " fitbit-app " }),
      "fitbit-app",
    );
  });
});
