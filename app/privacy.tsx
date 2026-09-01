import { router } from "expo-router";
import { Pressable, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import {
  PRIVACY_POLICY_SECTIONS,
  PRIVACY_POLICY_TITLE,
} from "../src/domain/privacy-policy";
import { minTapTarget, space, type, type ColorTokens } from "../src/theme/tokens";
import { AppText } from "../src/ui/AppText";
import { useThemedStyles } from "../src/ui/use-themed-styles";

export default function PrivacyScreen() {
  const styles = useThemedStyles(privacyStyles);
  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.body}>
        <AppText style={styles.title} accessibilityRole="header">
          {PRIVACY_POLICY_TITLE}
        </AppText>
        {PRIVACY_POLICY_SECTIONS.map((section) => (
          <AppText key={section.heading} style={styles.section}>
            <AppText style={styles.heading}>{section.heading}. </AppText>
            {section.body}
          </AppText>
        ))}
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Back"
          onPress={() => router.back()}
          style={styles.link}
        >
          <AppText style={styles.linkLabel}>Back</AppText>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

function privacyStyles(color: ColorTokens) {
  return {
    safe: {
      flex: 1,
      backgroundColor: color.bg,
    },
    body: {
      padding: space.lg,
      gap: space.md,
      paddingBottom: space.xl,
    },
    title: {
      ...type.title,
      color: color.ink,
    },
    section: {
      ...type.body,
      color: color.inkMuted,
    },
    heading: {
      ...type.body,
      fontWeight: "700" as const,
      color: color.ink,
    },
    link: {
      minHeight: minTapTarget,
      alignItems: "center" as const,
      justifyContent: "center" as const,
      marginTop: space.md,
    },
    linkLabel: {
      ...type.body,
      color: color.accent,
    },
  };
}
