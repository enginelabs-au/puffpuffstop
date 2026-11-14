import { useState } from "react";
import { TextInput, type TextInputProps } from "react-native";

import { decimalToNumber, sanitizeDecimalText } from "../domain/decimal-input";

type Props = Omit<TextInputProps, "value" | "onChange" | "onChangeText" | "keyboardType"> & {
  value: number | null;
  onChange: (value: number | null) => void;
};

export function DecimalField({ value, onChange, onFocus, onBlur, ...rest }: Props) {
  const [text, setText] = useState(() => (value == null ? "" : String(value)));
  const [focused, setFocused] = useState(false);
  const shown = focused ? text : value == null ? "" : String(value);

  return (
    <TextInput
      {...rest}
      autoCorrect={false}
      inputMode="decimal"
      keyboardType="decimal-pad"
      value={shown}
      onFocus={(event) => {
        setFocused(true);
        setText(value == null ? "" : String(value));
        onFocus?.(event);
      }}
      onBlur={(event) => {
        setFocused(false);
        onBlur?.(event);
      }}
      onChangeText={(raw) => {
        const next = sanitizeDecimalText(raw);
        setText(next);
        onChange(decimalToNumber(next));
      }}
    />
  );
}
