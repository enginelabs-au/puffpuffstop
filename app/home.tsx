import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { color, space, type } from "../src/theme/tokens";

export default function HomePlaceholderScreen() {
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.body}>
        <Text style={styles.title} accessibilityRole="header">
          Your organs are next
        </Text>
        <Text style={styles.bodyText}>
          Phase 1 stops at your plan. Cute organ scores and the Log button
          arrive in the next phase.
        </Text>
        <Text style={styles.caption}>
          Those percentages will be motivational estimates, not medical
          measurements.
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: color.bg,
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
    color: color.inkMuted,
  },
  caption: {
    ...type.caption,
    color: color.inkMuted,
  },
});
