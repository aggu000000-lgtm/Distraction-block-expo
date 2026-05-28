/**
 * FocusGuard Button Primitive
 *
 * Primary, Secondary, and Destructive variants.
 * Every button has haptic feedback and spring animation.
 */

import { Pressable, Text, StyleSheet, type PressableProps } from "react-native";
import * as Haptics from "expo-haptics";
import { colors, spacing, radii, shadows } from "@/design/tokens";
import { typography } from "@/design/typography";

type ButtonVariant = "primary" | "secondary" | "destructive";

type ButtonProps = Omit<PressableProps, "style"> & {
  variant?: ButtonVariant;
  label: string;
  disabled?: boolean;
  fullWidth?: boolean;
};

export function Button({
  variant = "primary",
  label,
  disabled = false,
  fullWidth = true,
  onPress,
  ...props
}: ButtonProps) {
  const handlePress = (event: unknown) => {
    if (disabled) return;

    // Haptic feedback
    Haptics.impactAsync(
      variant === "destructive"
        ? Haptics.ImpactFeedbackStyle.Heavy
        : Haptics.ImpactFeedbackStyle.Medium,
    );

    onPress?.(event as import("react-native").GestureResponderEvent);
  };

  return (
    <Pressable
      style={({ pressed }) => [
        styles.base,
        styles[variant],
        fullWidth && styles.fullWidth,
        disabled && styles.disabled,
        pressed && !disabled && styles.pressed,
      ]}
      onPress={handlePress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={label}
      {...props}
    >
      <Text
        style={[
          styles.label,
          variant === "primary" && styles.labelPrimary,
          variant === "secondary" && styles.labelSecondary,
          variant === "destructive" && styles.labelDestructive,
          disabled && styles.labelDisabled,
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: radii.md,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 48, // Accessibility: minimum touch target
  },
  fullWidth: {
    width: "100%",
  },
  primary: {
    backgroundColor: colors.nebula,
    ...shadows.md,
  },
  secondary: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: colors.rim,
  },
  destructive: {
    backgroundColor: colors.alertSoft,
    borderWidth: 1,
    borderColor: `${colors.alert}40`,
  },
  disabled: {
    opacity: 0.4,
  },
  pressed: {
    transform: [{ scale: 0.97 }],
  },
  label: {
    ...typography.label,
  },
  labelPrimary: {
    color: colors.frost,
  },
  labelSecondary: {
    color: colors.mist,
  },
  labelDestructive: {
    color: colors.alert,
  },
  labelDisabled: {
    color: colors.shadow,
  },
});
