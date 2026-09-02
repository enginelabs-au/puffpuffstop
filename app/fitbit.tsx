import { Redirect, useLocalSearchParams } from "expo-router";
import { useRef } from "react";

import { handleFitbitUrl } from "../src/data/health-sync";
import { getDraft } from "../src/data/onboarding-store";
import { resumeDestination } from "../src/domain/onboarding";

function firstParam(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

export default function FitbitCallbackScreen() {
  const params = useLocalSearchParams<{
    code?: string | string[];
    error?: string | string[];
  }>();
  const code = firstParam(params.code);
  const error = firstParam(params.error);
  const applied = useRef<string | null>(null);
  const key = code ?? error ?? "empty";
  if (applied.current !== key) {
    applied.current = key;
    if (code) {
      void handleFitbitUrl(
        `puffpuffstop://fitbit?code=${encodeURIComponent(code)}`,
      );
    }
  }
  return <Redirect href={resumeDestination(getDraft())} />;
}
