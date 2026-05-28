/**
 * FocusGuard Onboarding — Step 1: What drains you?
 *
 * Multi-select grid of apps/categories.
 * "Select the apps that steal your focus"
 */

import { useState } from "react";
import { View, Text, StyleSheet, Pressable, FlatList } from "react-native";
import { useRouter } from "expo-router";
import { colors, spacing, radii } from "@/design/tokens";
import { typography } from "@/design/typography";
import { DEFAULT_APPS } from "@/data/default-apps";

export default function OnboardingHabitsScreen() {
  const router = useRouter();
  const [selected, setSelected] = useState<string[]>([]);

  const toggleApp = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id],
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.step}>Step 1 of 3</Text>
        <Text style={styles.title}>What drains you?</Text>
        <Text style={styles.subtitle}>
          Select the apps that steal your focus
        </Text>
      </View>

      <FlatList
        data={DEFAULT_APPS}
        numColumns={3}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.grid}
        columnWrapperStyle={styles.row}
        renderItem={({ item }) => {
          const isSelected = selected.includes(item.id);
          return (
            <Pressable
              style={[styles.appChip, isSelected && styles.appChipSelected]}
              onPress={() => toggleApp(item.id)}
            >
              <Text style={styles.appIcon}>{item.icon}</Text>
              <Text
                style={[styles.appName, isSelected && styles.appNameSelected]}
                numberOfLines={1}
              >
                {item.name}
              </Text>
            </Pressable>
          );
        }}
      />

      <View style={styles.footer}>
        <Pressable
          style={[styles.button, selected.length === 0 && styles.buttonDisabled]}
          disabled={selected.length === 0}
          onPress={() => router.push("/(auth)/onboarding/goals")}
        >
          <Text style={styles.buttonText}>
            Continue ({selected.length} selected)
          </Text>
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
  grid: {
    paddingBottom: spacing.lg,
  },
  row: {
    justifyContent: "flex-start",
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  appChip: {
    width: "30%",
    backgroundColor: colors.depth,
    borderRadius: radii.sm,
    borderWidth: 1,
    borderColor: colors.rim,
    padding: spacing.sm,
    alignItems: "center",
    gap: spacing.xs,
  },
  appChipSelected: {
    borderColor: colors.nebula,
    backgroundColor: colors.nebulaGlow,
  },
  appIcon: {
    fontSize: 28,
  },
  appName: {
    ...typography.caption,
    color: colors.mist,
    textAlign: "center",
  },
  appNameSelected: {
    color: colors.frost,
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
  buttonDisabled: {
    opacity: 0.4,
  },
  buttonText: {
    ...typography.label,
    color: colors.frost,
  },
});
