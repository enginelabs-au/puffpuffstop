import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { readAppEnv } from "../src/config/env";
import { BRAND_CATALOG } from "../src/data/brands";
import { color, space, type } from "../src/theme/tokens";

export default function FoundationScreen() {
  const appEnv = readAppEnv();

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.body}>
        <Text style={styles.title} accessibilityRole="header">
          You’re in. Onboarding comes next.
        </Text>
        <Text style={styles.bodyText}>
          Phase 0 foundation only. Home, organs, and the Log button are not
          built yet.
        </Text>
        <Text style={styles.caption}>
          Brand catalog rows: {BRAND_CATALOG.length}. Environment: {appEnv}.
        </Text>
        <Text style={styles.caption}>
          These organ percentages will be motivational estimates, not medical
          measurements or diagnoses.
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
