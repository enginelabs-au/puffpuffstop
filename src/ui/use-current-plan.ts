import { useCallback, useEffect, useState } from "react";
import { useFocusEffect } from "expo-router";

import { getDraft, subscribeDraft } from "../data/onboarding-store";
import { currentPlan } from "../data/plan";

export function useCurrentPlan() {
  const [draft, setDraft] = useState(getDraft);
  const [summary, setSummary] = useState(currentPlan);

  const refresh = useCallback(() => {
    setDraft(getDraft());
    setSummary(currentPlan());
  }, []);

  useFocusEffect(
    useCallback(() => {
      refresh();
    }, [refresh]),
  );

  useEffect(() => subscribeDraft(refresh), [refresh]);

  return { draft, summary, refresh };
}
