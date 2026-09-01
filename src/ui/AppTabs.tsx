import { router } from "expo-router";
import { Pressable, StyleSheet, View } from "react-native";

import { color, minTapTarget, radius, space, type, type ColorTokens } from "../theme/tokens";
import { AppText } from "./AppText";
import { useThemedStyles } from "./use-themed-styles";

export type AppTab = "home" | "science" | "settings";

const TABS: { id: AppTab; label: string; href: "/home" | "/science" | "/settings" }[] = [
  { id: "home", label: "Home", href: "/home" },
  { id: "science", label: "Science", href: "/science" },
  { id: "settings", label: "Settings", href: "/settings" },
];

type Props = {
  active: AppTab;
};

export function AppTabs({ active }: Props) {
  const styles = useThemedStyles(tabStyles);
  return (
    <View style={styles.bar}>
      {TABS.map((tab) => (
        <TabButton key={tab.id} tab={tab} active={active} />
      ))}
    </View>
  );
}

function TabButton({
  tab,
  active,
}: {
  tab: (typeof TABS)[number];
  active: AppTab;
}) {
  const styles = useThemedStyles(tabStyles);
  const on = tab.id === active;
  return (
    <Pressable
      accessibilityRole="tab"
      accessibilityState={{ selected: on }}
      accessibilityLabel={tab.label}
      onPress={() => {
        if (!on) router.replace(tab.href);
      }}
      style={({ pressed }) => [
        styles.tab,
        on ? styles.tabOn : null,
        pressed ? styles.pressed : null,
      ]}
    >
      <AppText style={[styles.label, on ? styles.labelOn : null]}>
        {tab.label}
      </AppText>
    </Pressable>
  );
}

function tabStyles(palette: ColorTokens = color) {
  return {
    bar: {
      flexDirection: "row" as const,
      alignItems: "center" as const,
      gap: space.sm,
      paddingHorizontal: space.md,
      paddingBottom: space.md,
      paddingTop: space.sm,
      borderTopWidth: StyleSheet.hairlineWidth,
      borderTopColor: palette.inkMuted,
    },
    tab: {
      flex: 1,
      minHeight: minTapTarget,
      borderRadius: radius.pill,
      backgroundColor: palette.surface,
      alignItems: "center" as const,
      justifyContent: "center" as const,
    },
    tabOn: {
      backgroundColor: palette.tabOn,
    },
    label: {
      ...type.body,
      fontWeight: "700" as const,
      color: palette.ink,
    },
    labelOn: {
      color: palette.onAccent,
    },
    pressed: {
      opacity: 0.85,
    },
  };
}
