/**
 * FocusGuard Onboarding — Step 2: What are you protecting?
 *
 * Single-select: what is the user trying to protect?
 * Configures daily focus goal and streak motivation copy.
 */

import { useState } from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { colors, spacing, radii } from "@/design/tokens";
import { typography } from "@/design/typography";

const GOALS = [
  { id: "deep-work", label: "Deep work / studying", emoji: "🧠", goalMinutes: 120 },
  { id: "creative", label: "Creative projects", emoji: "🎨", goalMinutes: 90 },
  { id: "family", label: "Time with family", emoji: "👨‍👩‍👧‍👦", goalMinutes: 60 },
  { id: "health", label: "Physical health", emoji: "💪", goalMinutes: 45 },
  { id: "sleep", label: "Sleep", emoji: "😴", goalMinutes: 30 },
  { id: "wellbeing", label: "General wellbeing", emoji: "🧘", goalMinutes: 60 },
];

export default function OnboardingGoalsScreen() {
  const router = useRouter();
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.step}>Step 2 of 3</Text>
        <Text style={styles.title}>What are you protecting?</Text>
        <Text style={styles.subtitle}>
          This helps us set your daily focus goal
        </Text>
      </View>

      <View style={styles.list}>
        {GOALS.map((goal) => {
          const isSelected = selected === goal.id;
          return (
            <Pressable
              key={goal.id}
              style={[styles.goalCard, isSelected && styles.goalCardSelected]}
              onPress={() => setSelected(goal.id)}
            >
              <Text style={styles.goalEmoji}>{goal.emoji}</Text>
              <Text style={[styles.goalLabel, isSelected && styles.goalLabelSelected]}>
                {goal.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <View style={styles.footer}>
        <Pressable
          style={[styles.button, !selected && styles.buttonDisabled]}
          disabled={!selected}
          onPress={() => router.push("/(auth)/onboarding/schedule")}
        >
          <Text style={styles.buttonText}>Continue</Text>
        </Pressable>
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
  header: {
    marginBottom: spacing.lg,
  },
  step: {
    ...typography.label,
    color: colors.nebula,
    marginBottom: spacing.xs,
  },
  title: {
    ...typography.h1,
    color: colors.frost,
    marginBottom: spacing.xs,
  },
  subtitle: {
    ...typography.body,
    color: colors.mist,
  },
  list: {
    gap: spacing.sm,
  },
  goalCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.depth,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.rim,
    padding: spacing.md,
    gap: spacing.md,
  },
  goalCardSelected: {
    borderColor: colors.nebula,
    backgroundColor: colors.nebulaGlow,
  },
  goalEmoji: {
    fontSize: 28,
  },
  goalLabel: {
    ...typography.h3,
    color: colors.mist,
  },
  goalLabelSelected: {
    color: colors.frost,
  },
  footer: {
    marginTop: spacing.lg,
  },
  button: {
    backgroundColor: colors.nebula,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: radii.md,
    alignItems: "center",
  },
  buttonDisabled: {
    opacity: 0.4,
  },
  buttonText: {
    ...typography.label,
    color: colors.frost,
  },
});
