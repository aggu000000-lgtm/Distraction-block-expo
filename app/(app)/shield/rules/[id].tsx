/**
 * FocusGuard Shield — Rule Editor
 *
 * Create/edit block rule: name, apps, condition, friction level.
 */

import { useState } from "react";
import { View, Text, StyleSheet, ScrollView, Pressable, TextInput } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { colors, spacing, radii } from "@/design/tokens";
import { typography } from "@/design/typography";
import { useBlockingStore } from "@/store/blocking.store";
import type { FrictionLevel, BlockRule } from "@/types/domain";
import { FRICTION_LEVELS } from "@/core/blocking/friction";

const FRICTION_OPTIONS: FrictionLevel[] = ["soft", "medium", "hard", "locked"];

export default function RuleEditorScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { rules, addRule, updateRule } = useBlockingStore();

  const existingRule = rules.find((r) => r.id === id);
  const isNew = !existingRule;

  const [name, setName] = useState(existingRule?.name ?? "");
  const [friction, setFriction] = useState<FrictionLevel>(existingRule?.friction ?? "medium");

  const handleSave = () => {
    if (!name.trim()) return;

    const rule: BlockRule = {
      id: existingRule?.id ?? `rule_${Date.now()}`,
      name: name.trim(),
      apps: existingRule?.apps ?? [],
      condition: existingRule?.condition ?? { type: "always" },
      friction,
      isActive: existingRule?.isActive ?? true,
      createdAt: existingRule?.createdAt ?? Date.now(),
    };

    if (isNew) {
      addRule(rule);
    } else {
      updateRule(rule);
    }

    router.back();
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{isNew ? "Create Rule" : "Edit Rule"}</Text>

      {/* Name */}
      <View style={styles.section}>
        <Text style={styles.label}>Rule Name</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="e.g., Deep Work, Morning Routine"
          placeholderTextColor={colors.shadow}
        />
      </View>

      {/* Friction Level */}
      <View style={styles.section}>
        <Text style={styles.label}>Friction Level</Text>
        <View style={styles.frictionGrid}>
          {FRICTION_OPTIONS.map((level) => {
            const config = FRICTION_LEVELS[level];
            const isSelected = friction === level;
            return (
              <Pressable
                key={level}
                style={[styles.frictionCard, isSelected && styles.frictionCardSelected]}
                onPress={() => setFriction(level)}
              >
                <Text style={[styles.frictionName, isSelected && styles.frictionNameSelected]}>
                  {config.name}
                </Text>
                <Text style={styles.frictionDesc} numberOfLines={2}>
                  {config.description}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      {/* Save */}
      <Pressable
        style={[styles.saveBtn, !name.trim() && styles.saveBtnDisabled]}
        disabled={!name.trim()}
        onPress={handleSave}
      >
        <Text style={styles.saveBtnText}>{isNew ? "Create Rule" : "Save Changes"}</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.abyss, paddingHorizontal: spacing.md, paddingTop: spacing["3xl"] },
  title: { ...typography.h1, color: colors.frost, marginBottom: spacing.lg },
  section: { marginBottom: spacing.lg },
  label: { ...typography.label, color: colors.mist, textTransform: "uppercase", letterSpacing: 1, marginBottom: spacing.sm },
  input: { backgroundColor: colors.depth, borderRadius: radii.md, borderWidth: 1, borderColor: colors.rim, padding: spacing.md, color: colors.frost, ...typography.body },
  frictionGrid: { gap: spacing.sm },
  frictionCard: { backgroundColor: colors.depth, borderRadius: radii.md, borderWidth: 1, borderColor: colors.rim, padding: spacing.md, gap: spacing.xs },
  frictionCardSelected: { borderColor: colors.nebula, backgroundColor: colors.nebulaGlow },
  frictionName: { ...typography.label, color: colors.mist },
  frictionNameSelected: { color: colors.frost },
  frictionDesc: { ...typography.caption, color: colors.shadow },
  saveBtn: { backgroundColor: colors.nebula, paddingVertical: spacing.md, borderRadius: radii.md, alignItems: "center", marginTop: spacing.md, marginBottom: spacing["3xl"] },
  saveBtnDisabled: { opacity: 0.4 },
  saveBtnText: { ...typography.label, color: colors.frost },
});
