import { Linking, Pressable, ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { SCIENCE_DISCLAIMER, SCIENCE_SOURCES } from "../src/data/science";
import { ORGAN_LABELS } from "../src/domain/organs";
import { minTapTarget, radius, space, type, type ColorTokens } from "../src/theme/tokens";
import { AppTabs } from "../src/ui/AppTabs";
import { AppText } from "../src/ui/AppText";
import { useThemedStyles } from "../src/ui/use-themed-styles";

export default function ScienceScreen() {
  const styles = useThemedStyles(scienceStyles);
  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.body}>
        <AppText style={styles.title} accessibilityRole="header">
          Science
        </AppText>
        <AppText style={styles.lede}>
          Organ faces on Home are cartoon estimates on a 50-year heavy-use
          horizon. A few years of vaping should not look ruined. Read the papers
          yourself.
        </AppText>
        <AppText style={styles.caption}>{SCIENCE_DISCLAIMER}</AppText>
        {SCIENCE_SOURCES.map((source) => (
          <View key={source.id} style={styles.card}>
            <AppText style={styles.cardTitle}>{source.title}</AppText>
            <AppText style={styles.meta}>
              {source.authors} · {source.year} · {source.venue}
            </AppText>
            <AppText style={styles.meta}>
              {source.organs.map((id) => ORGAN_LABELS[id]).join(" · ")}
            </AppText>
            <AppText style={styles.summary}>{source.summary}</AppText>
            <Pressable
              accessibilityRole="link"
              accessibilityLabel={`Open ${source.title}`}
              onPress={() => {
                void Linking.openURL(source.url);
              }}
              style={({ pressed }) => [styles.link, pressed ? styles.pressed : null]}
            >
              <AppText style={styles.linkLabel}>Read the paper</AppText>
            </Pressable>
          </View>
        ))}
      </ScrollView>
      <AppTabs active="science" />
    </SafeAreaView>
  );
}

function scienceStyles(color: ColorTokens) {
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
    lede: {
      ...type.body,
      color: color.ink,
    },
    caption: {
      ...type.caption,
      color: color.inkMuted,
    },
    card: {
      backgroundColor: color.surface,
      borderRadius: radius.lg,
      padding: space.md,
      gap: space.sm,
    },
    cardTitle: {
      ...type.body,
      fontWeight: "800" as const,
      color: color.ink,
    },
    meta: {
      ...type.caption,
      color: color.inkMuted,
    },
    summary: {
      ...type.body,
      color: color.ink,
    },
    link: {
      minHeight: minTapTarget,
      justifyContent: "center" as const,
    },
    linkLabel: {
      ...type.body,
      color: color.accent,
      fontWeight: "700" as const,
    },
    pressed: {
      opacity: 0.85,
    },
  };
}
