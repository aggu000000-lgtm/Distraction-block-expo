/**
 * FocusGuard Shield Screen
 *
 * Block list overview, app toggles, and rule management.
 */

import { View, Text, StyleSheet, FlatList, Pressable } from "react-native";
import { colors, spacing, radii } from "@/design/tokens";
import { typography } from "@/design/typography";
import { useBlockingStore } from "@/store/blocking.store";
import { ShieldCheck, ShieldOff, Lock, Unlock } from "lucide-react-native";

export default function ShieldScreen() {
  const { apps, rules, isShieldActive, toggleAppTracked, toggleRuleActive } =
    useBlockingStore();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Shield</Text>

      {/* Shield Status */}
      <View style={styles.statusCard}>
        <View style={styles.statusRow}>
          {isShieldActive ? (
            <ShieldCheck size={24} color={colors.pulse} />
          ) : (
            <ShieldOff size={24} color={colors.shadow} />
          )}
          <Text style={styles.statusText}>
            Shield is {isShieldActive ? "Active" : "Inactive"}
          </Text>
        </View>
      </View>

      {/* Rules */}
      <Text style={styles.sectionTitle}>Rules ({rules.length})</Text>
      {rules.length === 0 ? (
        <View style={styles.emptyState}>
          <Lock size={32} color={colors.shadow} />
          <Text style={styles.emptyText}>No rules configured yet</Text>
        </View>
      ) : (
        <FlatList
          data={rules}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.ruleCard}>
              <View style={styles.ruleInfo}>
                <Text style={styles.ruleName}>{item.name}</Text>
                <Text style={styles.ruleDetail}>
                  {item.apps.length} apps · {item.friction}
                </Text>
              </View>
              <Pressable onPress={() => toggleRuleActive(item.id)}>
                {item.isActive ? (
                  <Unlock size={20} color={colors.pulse} />
                ) : (
                  <Lock size={20} color={colors.shadow} />
                )}
              </Pressable>
            </View>
          )}
        />
      )}

      {/* Tracked Apps */}
      <Text style={styles.sectionTitle}>Tracked Apps ({apps.filter((a) => a.isTracked).length})</Text>
      <FlatList
        data={apps}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Pressable style={styles.appRow} onPress={() => toggleAppTracked(item.id)}>
            <Text style={styles.appIcon}>{item.icon}</Text>
            <Text style={styles.appName}>{item.name}</Text>
            <View style={[styles.toggle, item.isTracked && styles.toggleOn]}>
              <Text style={styles.toggleText}>
                {item.isTracked ? "Tracked" : "Off"}
              </Text>
            </View>
          </Pressable>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.abyss,
    paddingHorizontal: spacing.md,
    paddingTop: spacing["3xl"],
  },
  title: {
    ...typography.h1,
    color: colors.frost,
    marginBottom: spacing.lg,
  },
  statusCard: {
    backgroundColor: colors.depth,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.rim,
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  statusText: {
    ...typography.h3,
    color: colors.frost,
  },
  sectionTitle: {
    ...typography.label,
    color: colors.mist,
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: spacing.sm,
    marginTop: spacing.md,
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: spacing.xl,
    gap: spacing.sm,
  },
  emptyText: {
    ...typography.body,
    color: colors.shadow,
  },
  ruleCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: colors.depth,
    borderRadius: radii.sm,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  ruleInfo: {
    gap: spacing.xs,
  },
  ruleName: {
    ...typography.label,
    color: colors.frost,
  },
  ruleDetail: {
    ...typography.caption,
    color: colors.mist,
  },
  appRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.depth,
    borderRadius: radii.sm,
    padding: spacing.md,
    marginBottom: spacing.sm,
    gap: spacing.sm,
  },
  appIcon: {
    fontSize: 20,
  },
  appName: {
    ...typography.body,
    color: colors.frost,
    flex: 1,
  },
  toggle: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radii.xs,
    backgroundColor: colors.fog,
  },
  toggleOn: {
    backgroundColor: colors.nebulaGlow,
  },
  toggleText: {
    ...typography.caption,
    color: colors.mist,
  },
});
