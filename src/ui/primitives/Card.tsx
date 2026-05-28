/**
 * FocusGuard Card Primitive
 *
 * Standard card component with consistent styling.
 */

import { View, StyleSheet, type ViewProps } from "react-native";
import { colors, spacing, radii } from "@/design/tokens";

type CardVariant = "default" | "elevated" | "interactive";

type CardProps = ViewProps & {
  variant?: CardVariant;
  padding?: keyof typeof spacing;
};

export function Card({
  variant = "default",
  padding = "md",
  style,
  children,
  ...props
}: CardProps) {
  return (
    <View
      style={[
        styles.base,
        styles[variant],
        { padding: spacing[padding] },
        style,
      ]}
      {...props}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: radii.md,
    borderWidth: 1,
  },
  default: {
    backgroundColor: colors.depth,
    borderColor: colors.rim,
  },
  elevated: {
    backgroundColor: colors.surface,
    borderColor: colors.rim,
  },
  interactive: {
    backgroundColor: colors.depth,
    borderColor: colors.rim,
  },
});
