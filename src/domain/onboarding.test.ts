import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  canContinue,
  canShowHome,
  clampDial,
  resumeAfterAgeGate,
  displayName,
  emptyDraft,
  isOnboardingStep,
  nextStep,
} from "./onboarding";

describe("onboarding", () => {
  it("defaults an empty nickname to friend", () => {
    assert.equal(displayName(emptyDraft()), "friend");
    assert.equal(
      displayName({ ...emptyDraft(), nickname: "  Cam  " }),
      "Cam",
    );
  });

  it("clamps the rotary dial to 0–999", () => {
    assert.equal(clampDial(-4), 0);
    assert.equal(clampDial(1500), 999);
    assert.equal(clampDial(12.6), 13);
  });

  it("walks steps toward the plan", () => {
    assert.equal(isOnboardingStep("nickname"), true);
    assert.equal(isOnboardingStep("home"), false);
    assert.equal(nextStep("nickname"), "duration");
    assert.equal(nextStep("cut-down"), "plan");
  });

  it("requires core answers before continue", () => {
    const draft = emptyDraft();
    assert.equal(canContinue("duration", draft), false);
    assert.equal(canContinue("nickname", draft), true);
    assert.equal(
      canContinue("duration", { ...draft, durationCount: 8 }),
      true,
    );
    assert.equal(canContinue("brand", { ...draft, brandKind: "custom" }), true);
    assert.equal(
      canContinue("device-math", {
        ...draft,
        brandKind: "custom",
        mlPerPuff: 0.05,
      }),
      true,
    );
  });

  it("requires duration and frequency before home", () => {
    assert.equal(canShowHome(emptyDraft()), false);
    assert.equal(
      canShowHome({
        ...emptyDraft(),
        durationCount: 8,
        frequencyCount: 12,
      }),
      true,
    );
  });

  it("resumes home after age-gate when a plan already exists", () => {
    assert.equal(resumeAfterAgeGate(emptyDraft()), "/onboarding/nickname");
    assert.equal(
      resumeAfterAgeGate({
        ...emptyDraft(),
        durationCount: 8,
        frequencyCount: 12,
      }),
      "/home",
    );
  });
});
