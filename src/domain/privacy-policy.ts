export const PRIVACY_POLICY_TITLE = "Privacy";

export const PRIVACY_POLICY_SECTIONS = [
  {
    heading: "Who this app is for",
    body: "PuffPuffStop is a 16+ wellness habit coach. It is not a kids app, not for anyone under 16, and not a medical device. Organ scores are motivational estimates, not diagnoses.",
  },
  {
    heading: "What we store",
    body: "Your nickname, plan answers, daily puff log, settings, and estimated puff savings stay on this device as a local snapshot. This build does not upload that data.",
  },
  {
    heading: "What we do not do",
    body: "We do not show ads, process cards, hold money, or create an account in this version. Cloud sync stays off unless a later owner-approved build connects it.",
  },
  {
    heading: "Your choices",
    body: "You can export a JSON copy of your local data or delete everything from Settings. Choosing under 16 at the age gate also clears local data and does not start a profile.",
  },
] as const;
