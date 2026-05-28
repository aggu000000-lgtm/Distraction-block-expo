import type { ExpoConfig } from "@expo/config";

const getEnvConfig = (): Partial<ExpoConfig> => {
  const env = process.env.APP_ENV ?? "development";

  switch (env) {
    case "production":
      return {
        name: "FocusGuard",
        slug: "focusguard",
      };
    case "staging":
      return {
        name: "FocusGuard (Staging)",
        slug: "focusguard-staging",
      };
    default:
      return {
        name: "FocusGuard (Dev)",
        slug: "focusguard-dev",
      };
  }
};

export default (): ExpoConfig => ({
  name: "FocusGuard",
  slug: "focusguard",
  version: "0.1.0",
  orientation: "portrait",
  icon: "./assets/images/icon.png",
  scheme: "focusguard",
  userInterfaceStyle: "dark",
  newArchEnabled: true,
  splash: {
    image: "./assets/images/splash-icon.png",
    resizeMode: "contain",
    backgroundColor: "#080811",
  },
  ios: {
    supportsTablet: true,
    bundleIdentifier: "com.focusguard.app",
  },
  android: {
    adaptiveIcon: {
      foregroundImage: "./assets/images/adaptive-icon.png",
      backgroundColor: "#080811",
    },
    package: "com.focusguard.app",
  },
  web: {
    bundler: "metro",
    output: "static",
    favicon: "./assets/images/favicon.png",
  },
  plugins: ["expo-router", "expo-sqlite"],
  experiments: {
    typedRoutes: true,
  },
  ...getEnvConfig(),
});
