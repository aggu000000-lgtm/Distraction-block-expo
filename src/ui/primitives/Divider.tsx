/**
 * FocusGuard Divider Primitive
 *
 * Simple horizontal divider line.
 */

import { View, StyleSheet, type ViewProps } from "react-native";
import { colors, spacing } from "@/design/tokens";

type DividerProps = ViewProps & {
  color?: string;
  spacing?: keyof typeof import("@/design/tokens").spacing;
};

export function Divider({
  color = colors.rim,
  spacing: spacingKey = "md",
  style,
  ...props
}: DividerProps) {
  return (
    <View
      style={[
        styles.base,
        { backgroundColor: color, marginVertical: spacing[spacingKey] },
        style,
      ]}
      {...props}
    />
  );
}

const styles = StyleSheet.create({
  base: {
    height: 1,
    width: "100%",
  },
});
