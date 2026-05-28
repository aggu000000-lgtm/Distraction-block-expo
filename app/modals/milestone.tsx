/**
 * FocusGuard Milestone Modal
 *
 * Streak/achievement celebration modal.
 */

import { View, Text, StyleSheet, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { colors, spacing, radii } from "@/design/tokens";
import { typography } from "@/design/typography";

export default function MilestoneModal() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.emoji}>🔥</Text>
        <Text style={styles.title}>Achievement Unlocked!</Text>
        <Text style={styles.subtitle}>
          You've reached a milestone. Keep going.
        </Text>

        <View style={styles.stats}>
          <View style={styles.stat}>
            <Text style={styles.statValue}>7</Text>
            <Text style={styles.statLabel}>Day Streak</Text>
          </View>
        </View>

        <Pressable style={styles.button} onPress={() => router.back()}>
          <Text style={styles.buttonText}>Continue</Text>
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
  emoji: {
    fontSize: 64,
  },
  title: {
    ...typography.h2,
    color: colors.pulse,
    textAlign: "center",
  },
  subtitle: {
    ...typography.body,
    color: colors.mist,
    textAlign: "center",
  },
  stats: {
    flexDirection: "row",
    gap: spacing.lg,
    marginVertical: spacing.md,
  },
  stat: {
    alignItems: "center",
  },
  statValue: {
    ...typography.display,
    color: colors.amber,
    fontFamily: "monospace",
  },
  statLabel: {
    ...typography.caption,
    color: colors.mist,
  },
  button: {
    backgroundColor: colors.nebula,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: radii.md,
    width: "100%",
    alignItems: "center",
  },
  buttonText: {
    ...typography.label,
    color: colors.frost,
  },
});
