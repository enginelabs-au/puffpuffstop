import { emptyDraft, type OnboardingDraft } from "../domain/onboarding";

let draft: OnboardingDraft = emptyDraft();

export function getDraft(): OnboardingDraft {
  return { ...draft, triggers: [...draft.triggers] };
}

export function updateDraft(partial: Partial<OnboardingDraft>): OnboardingDraft {
  draft = {
    ...draft,
    ...partial,
    triggers: partial.triggers ? [...partial.triggers] : [...draft.triggers],
  };
  return getDraft();
}

export function resetDraft(): OnboardingDraft {
  draft = emptyDraft();
  return getDraft();
}
