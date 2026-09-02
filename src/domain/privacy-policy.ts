export const PRIVACY_POLICY_TITLE = "Privacy";

export const PRIVACY_POLICY_SECTIONS = [
  {
    heading: "Who this app is for",
    body: "PuffPuffStop is a 16+ wellness habit coach. It is not a kids app, not for anyone under 16, and not a medical device. Organ scores are motivational estimates, not diagnoses.",
  },
  {
    heading: "What we store",
    body: "Your nickname, plan answers, daily puff log (counts and local log times), settings, and estimated puff savings stay on this device as a local snapshot. If you connect Apple Health, Health Connect, or Fitbit, we keep heart rate, HRV, breathing rate, and blood oxygen around a puff log when the watch shares them. This build does not upload that data.",
  },
  {
    heading: "Health and watches",
    body: "Watch data is optional wellness context, not a diagnosis. We only read Health types you approve. We do not write vape events into Health. A direct Fitbit login stays on this device and is removed from exports.",
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
