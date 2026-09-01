import { Redirect, useLocalSearchParams } from "expo-router";
import { useRef } from "react";

import { getDraft } from "../src/data/onboarding-store";
import { handleQuickLogUrl } from "../src/data/quick-log";
import { resumeDestination } from "../src/domain/onboarding";

function firstParam(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

export default function QuickLogScreen() {
  const params = useLocalSearchParams<{
    action?: string | string[];
    count?: string | string[];
    t?: string | string[];
  }>();
  const action = firstParam(params.action) ?? "up";
  const count = firstParam(params.count);
  const token = firstParam(params.t);
  const url = `puffpuffstop://quick-log?action=${encodeURIComponent(action)}${
    count ? `&count=${encodeURIComponent(count)}` : ""
  }${token ? `&t=${encodeURIComponent(token)}` : ""}`;
  const applied = useRef<string | null>(null);
  if (applied.current !== url) {
    applied.current = url;
    handleQuickLogUrl(url);
  }
  return <Redirect href={resumeDestination(getDraft())} />;
}
