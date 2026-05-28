/**
 * FocusGuard Modals Layout
 *
 * Modal screens for friction, breaks, and milestones.
 */

import { Stack } from "expo-router";
import { colors } from "@/design/tokens";

export default function ModalsLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        presentation: "modal",
        contentStyle: { backgroundColor: colors.void },
        animation: "slide_from_bottom",
      }}
    />
  );
}
