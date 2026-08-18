import { router } from "expo-router";
import { Pressable, ScrollView, StyleSheet, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import {
  PRIVACY_POLICY_SECTIONS,
  PRIVACY_POLICY_TITLE,
} from "../src/domain/privacy-policy";
import { color, minTapTarget, space, type } from "../src/theme/tokens";

export default function PrivacyScreen() {
  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.body}>
        <Text style={styles.title} accessibilityRole="header">
          {PRIVACY_POLICY_TITLE}
        </Text>
        {PRIVACY_POLICY_SECTIONS.map((section) => (
          <Text key={section.heading} style={styles.section}>
            <Text style={styles.heading}>{section.heading}. </Text>
            {section.body}
          </Text>
        ))}
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Back"
          onPress={() => router.back()}
          style={styles.link}
        >
          <Text style={styles.linkLabel}>Back</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
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
    fontWeight: "700",
    color: color.ink,
  },
  link: {
    minHeight: minTapTarget,
    alignItems: "center",
    justifyContent: "center",
    marginTop: space.md,
  },
  linkLabel: {
    ...type.body,
    color: color.accent,
  },
});
