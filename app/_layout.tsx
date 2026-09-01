import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { AppState, Linking, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import { bootPersist } from "../src/data/persist";
import { handleQuickLogUrl, syncVoiceLogFromDisk } from "../src/data/quick-log";
import { parseQuickLogUrl } from "../src/domain/quick-log";
import { consumePendingVoiceLog } from "../src/data/voice-pending";
import { bootReminders } from "../src/data/reminders";
import { color as tokenColor, darkColor } from "../src/theme/tokens";
import { ThemeProvider, useTheme } from "../src/ui/ThemeProvider";

function useVoiceLogSync() {
  useEffect(() => {
    const pull = () => {
      void syncVoiceLogFromDisk().then(() => consumePendingVoiceLog());
    };
    pull();
    const timer = setInterval(pull, 2000);
    const appState = AppState.addEventListener("change", (next) => {
      if (next === "active") pull();
    });
    return () => {
      clearInterval(timer);
      appState.remove();
    };
  }, []);
}

function useVoiceLogUrl(ready: boolean) {
  useEffect(() => {
    if (!ready) return;
    const applyUrl = (url: string | null, source: "initial" | "event") => {
      if (!url) return;
      const parsed = parseQuickLogUrl(url);
      if (!parsed) return;
      // Tokenless cold-start URLs are iOS replaying the last open. Skip those.
      if (source === "initial" && !parsed.token) return;
      handleQuickLogUrl(url);
    };
    void Linking.getInitialURL().then((url) => applyUrl(url, "initial"));
    const subscription = Linking.addEventListener("url", ({ url }) =>
      applyUrl(url, "event"),
    );
    return () => {
      subscription.remove();
    };
  }, [ready]);
}

export default function RootLayout() {
  const [ready, setReady] = useState(false);
  useVoiceLogSync();
  useVoiceLogUrl(ready);

  useEffect(() => {
    let cancelled = false;
    void bootPersist()
      .then(() => consumePendingVoiceLog())
      .then(() => bootReminders())
      .finally(() => {
        if (!cancelled) setReady(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (!ready) {
    return (
      <>
        <StatusBar style="light" />
        <View style={{ flex: 1, backgroundColor: darkColor.bg }} />
      </>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider>
        <ThemedStack />
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}

function ThemedStack() {
  const { theme, color } = useTheme();
  return (
    <>
      <StatusBar style={theme === "dark" ? "light" : "dark"} />
      <Stack
        screenOptions={{
          headerShown: false,
          gestureEnabled: true,
          fullScreenGestureEnabled: true,
          contentStyle: { backgroundColor: color.bg ?? tokenColor.bg },
        }}
      />
    </>
  );
}
