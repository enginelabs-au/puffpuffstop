import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { color, space, type } from "../src/theme/tokens";
import { AppText } from "../src/ui/AppText";

export default function BlockedScreen() {
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.body}>
        <AppText style={styles.title} accessibilityRole="header">
          PuffPuffStop isn’t available yet for you.
        </AppText>
        <AppText
          style={styles.bodyText}
          accessibilityLabel="If you are under 16, we will not track anything or start a profile."
        >
          If you are under 16, we won’t track anything or start a profile.
        </AppText>
        <AppText style={styles.bodyText}>
          Talk with a trusted adult. If you need to talk to someone now, contact
          local youth support or emergency services in your area.
        </AppText>
        <AppText style={styles.caption}>
          No analytics, puff logs, or profile data are collected on this screen.
        </AppText>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: color.blockedBg,
  },
  body: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: space.lg,
    gap: space.md,
  },
  title: {
    ...type.title,
    color: color.ink,
  },
  bodyText: {
    ...type.body,
    color: color.ink,
  },
  caption: {
    ...type.caption,
    color: color.inkMuted,
  },
});
