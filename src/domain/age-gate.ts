export type AgeGateStatus = "allowed" | "blocked";

export type AgeGateDecision = {
  status: AgeGateStatus;
  trackingAllowed: boolean;
  profileWriteAllowed: boolean;
};

export function evaluateAgeGate(isSixteenOrOlder: boolean): AgeGateDecision {
  if (isSixteenOrOlder) {
    return {
      status: "allowed",
      trackingAllowed: true,
      profileWriteAllowed: true,
    };
  }

  return {
    status: "blocked",
    trackingAllowed: false,
    profileWriteAllowed: false,
  };
}
