import { emptyDraft, type OnboardingDraft } from "../domain/onboarding";
import { persistNow } from "./persist-hook";

let draft: OnboardingDraft = emptyDraft();

export function getDraft(): OnboardingDraft {
  return { ...draft, triggers: [...draft.triggers] };
}

export function replaceDraft(next: OnboardingDraft): OnboardingDraft {
  draft = {
    ...emptyDraft(),
    ...next,
    triggers: [...next.triggers],
  };
  return getDraft();
}

export function updateDraft(partial: Partial<OnboardingDraft>): OnboardingDraft {
  draft = {
    ...draft,
    ...partial,
    triggers: partial.triggers ? [...partial.triggers] : [...draft.triggers],
  };
  persistNow();
  return getDraft();
}

export function resetDraft(): OnboardingDraft {
  draft = emptyDraft();
  persistNow();
  return getDraft();
}
