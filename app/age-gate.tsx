import { Redirect } from "expo-router";

import { getDraft } from "../src/data/onboarding-store";
import { resumeDestination } from "../src/domain/onboarding";

/** In-app 16+ notice removed. Store rating remains 16+. */
export default function AgeGateScreen() {
  return <Redirect href={resumeDestination(getDraft())} />;
}
