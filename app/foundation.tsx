import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { readAppEnv } from "../src/config/env";
import { BRAND_CATALOG } from "../src/data/brands";
import { space, type, type ColorTokens } from "../src/theme/tokens";
import { AppText } from "../src/ui/AppText";
import { useThemedStyles } from "../src/ui/use-themed-styles";

export default function FoundationScreen() {
  const styles = useThemedStyles(foundationStyles);
  const appEnv = readAppEnv();

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.body}>
        <AppText style={styles.title} accessibilityRole="header">
          You’re in. Onboarding comes next.
        </AppText>
        <AppText style={styles.bodyText}>
          Phase 0 foundation only. Home, organs, and the Log button are not
          built yet.
        </AppText>
        <AppText style={styles.caption}>
          Brand catalog rows: {BRAND_CATALOG.length}. Environment: {appEnv}.
        </AppText>
        <AppText style={styles.caption}>
          These organ percentages will be motivational estimates, not medical
          measurements or diagnoses.
        </AppText>
      </View>
    </SafeAreaView>
  );
}

function foundationStyles(color: ColorTokens) {
  return {
    safe: {
      flex: 1,
      backgroundColor: color.bg,
    },
    body: {
      flex: 1,
      justifyContent: "center" as const,
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
  };
}
