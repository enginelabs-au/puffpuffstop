export const STORE_LISTING = {
  name: "PuffPuffStop",
  subtitle: "Break the cycle, reclaim your lungs.",
  ageRating: "16+",
  category: "Health & Fitness",
  shortDescription:
    "A 16+ wellness habit coach for cutting down vaping. Tap Log, keep a daily commitment, and watch cute organ estimates recover. Not a kids app. Not a medical device.",
  fullDescription: [
    "PuffPuffStop is a 16+ wellness habit coach for teens and young adults who want to cut down vaping.",
    "Answer a few questions, set a daily puff commitment, and tap one circular Log button. Cute organ cards show motivational percent estimates—not diagnoses.",
    "Stay under your commitment and a local Puff Savings pot can grow as an estimate of money not spent. This version does not take cards or pay out money.",
    "This is not a kids app, not for anyone under 16, and not a medical device. Organ scores are motivational estimates.",
  ].join("\n\n"),
  keywords: "vape,quit vaping,habit tracker,wellness,16+",
} as const;

export const STORE_FORBIDDEN_PHRASES = [
  "for kids",
  "for children",
  "kids category",
  "under 13",
  "medical device",
  "clinical diagnosis",
  "guaranteed quit",
  "cash-out",
  "wallet",
] as const;

export function listingViolatesForbiddenClaims(text: string): string[] {
  const lower = text.toLowerCase();
  return STORE_FORBIDDEN_PHRASES.filter((phrase) => {
    if (!lower.includes(phrase)) return false;
    if (phrase === "medical device") return !/not a medical device/.test(lower);
    if (phrase === "wallet") return !/no wallet/.test(lower);
    if (phrase === "cash-out") return !/no cash-out/.test(lower);
    if (phrase === "kids category") {
      return !/kids category:\s*no/.test(lower) && !/no kids category/.test(lower);
    }
    return true;
  });
}
