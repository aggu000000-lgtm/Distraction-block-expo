/**
 * FocusGuard Root Layout
 *
 * Font loading, providers, and global setup.
 */

import { useEffect } from "react";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { View } from "react-native";
import { colors } from "@/design/tokens";
import { initStorage } from "@/lib/storage";
import { configureNotifications } from "@/core/notifications/scheduler";

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    // Geist fonts will be added to assets/fonts/ and loaded here
    // For now, we use system fonts as fallback
  });

  useEffect(() => {
    async function initialize() {
      try {
        await initStorage();
        configureNotifications();
      } catch (error) {
        console.error("Failed to initialize:", error);
      }
    }
    initialize();
  }, []);

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.void }}>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.void },
          animation: "fade",
        }}
      />
    </View>
  );
}
