# 2026-11-14

Apple rejected 0.0.1 (51) for a Google Play badge in the App Store creatives and an unresponsive onboarding Continue button. The owner asked for a new Apple and Play build.

- App Store banner and search image keep the App Store badge and no longer show Google Play.
- Continue sits outside the onboarding swipe gesture, and chips and the select opener use the gesture-handler pressable.
- Decimal fields keep a trailing point while typing, including ml per puff, device size, device cost, and stake.
- `setupComplete` stays true after both puff counts have been set, so clearing one count in Settings does not send the user back through onboarding.
- Watch metrics render as one compact line.
- Visible health and support copy names only the health app on this phone, or the current platform's health app.
