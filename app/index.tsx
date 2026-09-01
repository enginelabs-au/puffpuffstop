import { Redirect } from "expo-router";

import { getDraft } from "../src/data/onboarding-store";
import { resumeDestination } from "../src/domain/onboarding";

export default function Index() {
  return <Redirect href={resumeDestination(getDraft())} />;
}
