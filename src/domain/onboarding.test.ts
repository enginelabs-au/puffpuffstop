import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  canContinue,
  canShowHome,
  clampDial,
  intervalPacingRemindersEnabled,
  intervalPacingStartsOpen,
  frequencyCaption,
  previousStep,
  PUFF_DIAL_MAX,
  resumeAfterAgeGate,
  displayName,
  emptyDraft,
  formatAuDateInput,
  isOnboardingStep,
  isValidAuDate,
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

  it("clamps the rotary dial to 0–999 by default and 999,999 for puffs", () => {
    assert.equal(clampDial(-4), 0);
    assert.equal(clampDial(1500), 999);
    assert.equal(clampDial(12.6), 13);
    assert.equal(clampDial(2_000_000, PUFF_DIAL_MAX), 999_999);
  });

  it("walks steps toward the plan", () => {
    assert.equal(isOnboardingStep("nickname"), true);
    assert.equal(isOnboardingStep("home"), false);
    assert.equal(nextStep("nickname"), "timezone");
    assert.equal(nextStep("timezone"), "duration");
    assert.equal(nextStep("cut-down"), "interval-pacing");
    assert.equal(nextStep("interval-pacing"), "quick-log");
    assert.equal(nextStep("quick-log"), "wearables");
    assert.equal(nextStep("wearables"), "plan");
    assert.equal(canContinue("wearables", emptyDraft()), true);
    assert.equal(previousStep("nickname"), null);
    assert.equal(previousStep("timezone"), "nickname");
    assert.equal(previousStep("duration"), "timezone");
    assert.equal(canContinue("timezone", emptyDraft()), true);
    assert.equal(frequencyCaption(1, "days"), "1 puff a day");
    assert.equal(frequencyCaption(12, "weeks"), "12 puffs a week");
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
      canContinue("brand", { ...draft, brandKind: "catalog", catalogBrandId: "iget" }),
      false,
    );
    assert.equal(
      canContinue("brand", {
        ...draft,
        brandKind: "catalog",
        catalogBrandId: "iget",
        catalogProductId: "iget-bar-3500",
      }),
      true,
    );
    assert.equal(
      canContinue("device-math", {
        ...draft,
        brandKind: "custom",
        mlPerPuff: 0.05,
      }),
      true,
    );
    assert.equal(canContinue("interval-pacing", draft), false);
    assert.equal(
      canContinue("interval-pacing", { ...draft, intervalPacing: true }),
      false,
    );
    assert.equal(
      canContinue("interval-pacing", {
        ...draft,
        intervalPacing: true,
        intervalPacingReminders: false,
      }),
      true,
    );
    assert.equal(
      canContinue("interval-pacing", { ...draft, intervalPacing: false }),
      true,
    );
    assert.equal(intervalPacingStartsOpen(draft), true);
    assert.equal(intervalPacingRemindersEnabled(draft), false);
    assert.equal(
      intervalPacingRemindersEnabled({
        ...draft,
        intervalPacing: true,
        intervalPacingReminders: true,
      }),
      true,
    );
    assert.equal(
      intervalPacingStartsOpen({ ...draft, intervalPacing: false }),
      false,
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

  it("formats and validates Australian day-month-year dates", () => {
    assert.equal(formatAuDateInput("1908"), "19-08");
    assert.equal(formatAuDateInput("19082026"), "19-08-2026");
    assert.equal(isValidAuDate("19-08-2026"), true);
    assert.equal(isValidAuDate("31-02-2026"), false);
    assert.equal(
      canContinue("quit-window", {
        ...emptyDraft(),
        quitWindow: "exact-date",
        quitExactDate: "19-08-2026",
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
