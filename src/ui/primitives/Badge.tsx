/**
 * FocusGuard Badge Primitive
 *
 * Small label component for status indicators.
 */

import { View, Text, StyleSheet, type ViewProps } from "react-native";
import { colors, spacing, radii } from "@/design/tokens";
import { typography } from "@/design/typography";

type BadgeVariant = "default" | "success" | "warning" | "danger" | "info";

type BadgeProps = ViewProps & {
  variant?: BadgeVariant;
  label: string;
};

export function Badge({ variant = "default", label, style, ...props }: BadgeProps) {
  return (
    <View style={[styles.base, styles[variant], style]} {...props}>
      <Text style={[styles.label, styles[`label_${variant}`]]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radii.xs,
    alignSelf: "flex-start",
  },
  default: {
    backgroundColor: colors.fog,
  },
  success: {
    backgroundColor: colors.pulseSoft,
  },
  warning: {
    backgroundColor: colors.amberSoft,
  },
  danger: {
    backgroundColor: colors.alertSoft,
  },
  info: {
    backgroundColor: colors.nebulaGlow,
  },
  label: {
    ...typography.caption,
    fontWeight: "600",
  },
  label_default: {
    color: colors.mist,
  },
  label_success: {
    color: colors.pulse,
  },
  label_warning: {
    color: colors.amber,
  },
  label_danger: {
    color: colors.alert,
  },
  label_info: {
    color: colors.nebula,
  },
});
