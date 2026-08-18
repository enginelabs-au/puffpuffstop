import { Text, type TextProps } from "react-native";

import { fontScale } from "../theme/tokens";

export function AppText(props: TextProps) {
  return (
    <Text
      allowFontScaling={fontScale.allowFontScaling}
      maxFontSizeMultiplier={fontScale.maxFontSizeMultiplier}
      {...props}
    />
  );
}
