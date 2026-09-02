import { useEffect, useState } from "react";
import { Pressable, View } from "react-native";

import {
  ORGAN_IDS,
  formatOrganPercent,
  totalOrganScore,
  type OrganId,
} from "../domain/organs";
import { minTapTarget, space, type, type ColorTokens } from "../theme/tokens";
import { AppText } from "./AppText";
import { OrganCard } from "./OrganCard";
import { useThemedStyles } from "./use-themed-styles";

type Props = {
  scores: Record<OrganId, number>;
  recovering: boolean;
  celebrating: boolean;
  defaultOpen?: boolean;
};

export function OrganFold({
  scores,
  recovering,
  celebrating,
  defaultOpen = true,
}: Props) {
  const styles = useThemedStyles(foldStyles);
  const [open, setOpen] = useState(defaultOpen);
  const total = totalOrganScore(scores);
  const totalLabel = formatOrganPercent(total);

  useEffect(() => {
    setOpen(defaultOpen);
  }, [defaultOpen]);

  return (
    <View style={styles.stack}>
      <Pressable
        accessibilityRole="button"
        accessibilityState={{ expanded: open }}
        accessibilityLabel={
          open
            ? "Hide organs"
            : `Organs, ${totalLabel} percent combined motivational estimate. Show organs`
        }
        onPress={() => setOpen((value) => !value)}
        style={({ pressed }) => [styles.fold, pressed ? styles.pressed : null]}
      >
        <View style={styles.foldMain}>
          <AppText style={styles.foldLabel}>Organs</AppText>
          {open ? null : (
            <AppText style={styles.total}>{totalLabel}%</AppText>
          )}
        </View>
        <AppText style={styles.chevron}>{open ? "▾" : "▸"}</AppText>
      </Pressable>
      {open ? (
        <View style={styles.grid}>
          {ORGAN_IDS.map((id) => (
            <OrganCard
              key={id}
              id={id}
              score={scores[id]}
              recovering={recovering}
              celebrating={celebrating}
            />
          ))}
        </View>
      ) : null}
    </View>
  );
}

function foldStyles(color: ColorTokens) {
  return {
    stack: {
      gap: space.xs,
    },
    fold: {
      minHeight: minTapTarget,
      flexDirection: "row" as const,
      alignItems: "center" as const,
      justifyContent: "space-between" as const,
      gap: space.sm,
    },
    foldMain: {
      flex: 1,
      flexDirection: "row" as const,
      alignItems: "center" as const,
      justifyContent: "space-between" as const,
      gap: space.sm,
    },
    foldLabel: {
      ...type.body,
      fontWeight: "700" as const,
      color: color.ink,
    },
    total: {
      ...type.body,
      fontWeight: "800" as const,
      color: color.ink,
    },
    chevron: {
      ...type.body,
      fontWeight: "700" as const,
      color: color.inkMuted,
    },
    grid: {
      flexDirection: "row" as const,
      flexWrap: "wrap" as const,
      gap: space.sm,
      justifyContent: "flex-start" as const,
    },
    pressed: {
      opacity: 0.85,
    },
  };
}
