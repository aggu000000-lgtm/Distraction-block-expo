/**
 * FocusGuard Onboarding Layout
 *
 * Step progress layout with back navigation.
 */

import { Stack } from "expo-router";
import { colors } from "@/design/tokens";

export default function OnboardingLayout() {
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
