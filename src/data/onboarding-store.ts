import { emptyDraft, type OnboardingDraft } from "../domain/onboarding";
import { persistNow } from "./persist-hook";

let draft: OnboardingDraft = emptyDraft();
const listeners = new Set<() => void>();

function notify(): void {
  for (const listener of listeners) listener();
}

export function subscribeDraft(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function getDraft(): OnboardingDraft {
  return { ...draft, triggers: [...draft.triggers] };
}

export function replaceDraft(next: OnboardingDraft): OnboardingDraft {
  draft = {
    ...emptyDraft(),
    ...next,
    triggers: [...next.triggers],
  };
  notify();
  return getDraft();
}

export function updateDraft(partial: Partial<OnboardingDraft>): OnboardingDraft {
  draft = {
    ...draft,
    ...partial,
    triggers: partial.triggers ? [...partial.triggers] : [...draft.triggers],
  };
  persistNow();
  notify();
  return getDraft();
}

export function resetDraft(): OnboardingDraft {
  draft = emptyDraft();
  persistNow();
  notify();
  return getDraft();
}
