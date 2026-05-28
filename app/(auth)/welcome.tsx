/**
 * FocusGuard Welcome Screen
 *
 * App name + one-sentence value proposition.
 * No signup required (local-first, Phase 1).
 */

import { View, Text, StyleSheet, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { colors } from "@/design/tokens";
import { typography } from "@/design/typography";
import { spacing, radii } from "@/design/tokens";

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.emoji}>🛡️</Text>
        <Text style={styles.title}>FocusGuard</Text>
        <Text style={styles.subtitle}>
          The distraction blocker that respects your intelligence.
        </Text>
        <Text style={styles.description}>
          It doesn't just block. It teaches you about yourself.
        </Text>
      </View>

      <View style={styles.footer}>
        <Pressable
          style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
          onPress={() => router.push("/(auth)/onboarding/habits")}
        >
          <Text style={styles.buttonText}>Get Started</Text>
        </Pressable>

        <Text style={styles.privacy}>
          Your data never leaves this device.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.abyss,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing["3xl"],
    paddingBottom: spacing.xl,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emoji: {
    fontSize: 64,
    marginBottom: spacing.lg,
  },
  title: {
    ...typography.h1,
    color: colors.frost,
    marginBottom: spacing.sm,
  },
  subtitle: {
    ...typography.h3,
    color: colors.frost,
    textAlign: "center",
    marginBottom: spacing.md,
  },
  description: {
    ...typography.body,
    color: colors.mist,
    textAlign: "center",
    maxWidth: 280,
  },
  footer: {
    gap: spacing.md,
  },
  button: {
    backgroundColor: colors.nebula,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: radii.md,
    alignItems: "center",
  },
  buttonPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.97 }],
  },
  buttonText: {
    ...typography.label,
    color: colors.frost,
  },
  privacy: {
    ...typography.caption,
    color: colors.shadow,
    textAlign: "center",
  },
});
