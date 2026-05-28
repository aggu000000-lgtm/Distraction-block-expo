/**
 * FocusGuard Auth Layout
 *
 * Unauthenticated flow: welcome, onboarding, sign-in.
 */

import { Stack } from "expo-router";
import { colors } from "@/design/tokens";

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.abyss },
        animation: "slide_from_right",
      }}
    />
  );
}
