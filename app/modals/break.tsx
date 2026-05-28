/**
 * FocusGuard Break Modal
 *
 * Break time modal with countdown and suggestions.
 */

import { useState, useEffect } from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { colors, spacing, radii } from "@/design/tokens";
import { typography } from "@/design/typography";

const BREAK_SUGGESTIONS = [
  "Stand up and stretch",
  "Look at something 20 feet away",
  "Drink some water",
  "Take a deep breath",
  "Walk around for a minute",
];

export default function BreakModal() {
  const router = useRouter();
  const [secondsLeft, setSecondsLeft] = useState(300); // 5 min default
  const suggestion = BREAK_SUGGESTIONS[Math.floor(Math.random() * BREAK_SUGGESTIONS.length)];

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Break Time</Text>
        <Text style={styles.subtitle}>{suggestion}</Text>

        <View style={styles.timerCircle}>
          <Text style={styles.timerText}>
            {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
          </Text>
        </View>

        <Pressable style={styles.skipButton} onPress={() => router.back()}>
          <Text style={styles.skipButtonText}>Skip Break</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(8, 8, 17, 0.9)",
    paddingHorizontal: spacing.lg,
  },
  card: {
    backgroundColor: colors.depth,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.rim,
    padding: spacing.xl,
    width: "100%",
    alignItems: "center",
    gap: spacing.md,
  },
  title: {
    ...typography.h2,
    color: colors.amber,
  },
  subtitle: {
    ...typography.body,
    color: colors.mist,
    textAlign: "center",
  },
  timerCircle: {
    width: 120,
    height: 120,
    borderRadius: radii.full,
    backgroundColor: colors.surface,
    borderWidth: 2,
    borderColor: colors.amber,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: spacing.lg,
  },
  timerText: {
    ...typography["mono-xl"],
    color: colors.amber,
  },
  skipButton: {
    backgroundColor: "transparent",
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.rim,
  },
  skipButtonText: {
    ...typography.label,
    color: colors.mist,
  },
});
