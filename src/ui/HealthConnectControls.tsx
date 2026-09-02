import { useEffect, useState } from "react";
import { Platform, Pressable, Switch, View } from "react-native";

import {
  canConnectFitbitDirect,
  connectFitbitAccount,
  connectPhoneHealth,
  disconnectFitbitAccount,
  disconnectPhoneHealth,
  subscribeHealth,
} from "../data/health-sync";
import { getHealth, updateHealth } from "../data/health-store";
import {
  HEALTH_DISCLAIMER,
  HEALTH_READ_LIST,
  healthPlatformLabel,
  healthWatchPathHelper,
  type HealthState,
} from "../domain/health";
import { minTapTarget, radius, space, type, type ColorTokens } from "../theme/tokens";
import { AppText } from "./AppText";
import { useThemedStyles } from "./use-themed-styles";

type Props = {
  showReadings?: boolean;
};

function statusLine(health: HealthState): string {
  const phone = healthPlatformLabel(Platform.OS);
  if (health.healthStatus === "pending" || health.fitbitStatus === "pending") {
    return "Asking for access…";
  }
  if (health.healthEnabled && health.fitbitEnabled) {
    return `${phone} and Fitbit connected.`;
  }
  if (health.healthEnabled) {
    return Platform.OS === "android"
      ? `${phone} connected. A Wear or Fitbit watch still needs to share heart rate into Health Connect.`
      : `${phone} connected. A Fitbit still needs Google Health to share heart rate into Apple Health.`;
  }
  if (health.fitbitEnabled) return "Fitbit connected.";
  if (health.healthStatus === "denied") return `${phone} permission was denied.`;
  if (health.healthStatus === "unavailable") {
    return `${phone} is not available on this device.`;
  }
  if (!canConnectFitbitDirect() && health.fitbitStatus === "unavailable") {
    return Platform.OS === "android"
      ? "Direct Fitbit login is off in this build. Share Fitbit data through Health Connect instead."
      : "Direct Fitbit login is off in this build. Share Fitbit data through Apple Health instead.";
  }
  return Platform.OS === "android"
    ? `Connect ${phone} so a Wear, Pixel, or Fitbit watch can share heart rate through Health Connect.`
    : `Connect ${phone} so a Fitbit in Google Health can share heart rate through Apple Health.`;
}

export function HealthConnectControls({ showReadings = true }: Props) {
  const styles = useThemedStyles(healthStyles);
  const [health, setHealth] = useState(getHealth);

  useEffect(() => subscribeHealth(() => setHealth(getHealth())), []);

  const phone = healthPlatformLabel(Platform.OS);

  return (
    <View style={styles.wrap}>
      <View style={styles.row}>
        <AppText style={styles.status}>Show watch metrics</AppText>
        <Switch
          accessibilityLabel="Show watch metrics on Home"
          value={health.watchMetricsEnabled !== false}
          onValueChange={(watchMetricsEnabled) => {
            updateHealth({ watchMetricsEnabled });
            setHealth(getHealth());
          }}
        />
      </View>
      <AppText style={styles.caption}>
        When this is off, Home hides heart, oxygen, and breathing. Connect and
        disconnect still work.
      </AppText>
      <AppText style={styles.status}>{statusLine(health)}</AppText>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={health.healthEnabled ? `Sync ${phone}` : `Connect ${phone}`}
        onPress={() => {
          void connectPhoneHealth();
        }}
        style={({ pressed }) => [styles.button, pressed ? styles.pressed : null]}
      >
        <AppText style={styles.buttonLabel}>
          {health.healthEnabled ? `Sync ${phone}` : `Connect ${phone}`}
        </AppText>
      </Pressable>
      {health.healthEnabled ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Disconnect ${phone}`}
          onPress={() => {
            disconnectPhoneHealth();
            setHealth(getHealth());
          }}
          style={({ pressed }) => [styles.link, pressed ? styles.pressed : null]}
        >
          <AppText style={styles.linkLabel}>Disconnect {phone}</AppText>
        </Pressable>
      ) : null}
      {canConnectFitbitDirect() ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={health.fitbitEnabled ? "Sync Fitbit" : "Connect Fitbit"}
          onPress={() => {
            void connectFitbitAccount();
          }}
          style={({ pressed }) => [styles.button, pressed ? styles.pressed : null]}
        >
          <AppText style={styles.buttonLabel}>
            {health.fitbitEnabled ? "Sync Fitbit" : "Connect Fitbit"}
          </AppText>
        </Pressable>
      ) : null}
      {health.fitbitEnabled ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Disconnect Fitbit"
          onPress={() => {
            disconnectFitbitAccount();
            setHealth(getHealth());
          }}
          style={({ pressed }) => [styles.link, pressed ? styles.pressed : null]}
        >
          <AppText style={styles.linkLabel}>Disconnect Fitbit</AppText>
        </Pressable>
      ) : null}
      <AppText style={styles.caption}>{healthWatchPathHelper(Platform.OS)}</AppText>
      <AppText style={styles.caption}>{HEALTH_READ_LIST}</AppText>
      <AppText style={styles.caption}>{HEALTH_DISCLAIMER}</AppText>
      {showReadings ? (
        <AppText style={styles.caption}>
          Home only shows a heart, oxygen, or breathing shift when a log lines up with a watch change.
        </AppText>
      ) : null}
    </View>
  );
}

function healthStyles(color: ColorTokens) {
  const ink = color?.ink;
  return {
    wrap: {
      gap: space.sm,
    },
    row: {
      flexDirection: "row" as const,
      alignItems: "center" as const,
      justifyContent: "space-between" as const,
      gap: space.sm,
    },
    status: {
      ...type.body,
      color: ink,
    },
    caption: {
      ...type.caption,
      color: color?.inkMuted,
    },
    button: {
      minHeight: minTapTarget,
      borderRadius: radius.pill,
      backgroundColor: color?.accentMint,
      alignItems: "center" as const,
      justifyContent: "center" as const,
    },
    buttonLabel: {
      ...type.body,
      fontWeight: "700" as const,
      color: ink,
    },
    link: {
      minHeight: minTapTarget,
      alignItems: "center" as const,
      justifyContent: "center" as const,
    },
    linkLabel: {
      ...type.body,
      color: color?.accent,
    },
    pressed: {
      opacity: 0.85,
    },
  };
}
