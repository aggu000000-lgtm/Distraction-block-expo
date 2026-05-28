/**
 * FocusGuard Home Dashboard
 *
 * Shows: Focus ring, Shield status, Streak counter, Today's blocks, Recent session.
 */

import { View, Text, StyleSheet, Pressable } from "react-native";
import { colors, spacing, radii } from "@/design/tokens";
import { typography } from "@/design/typography";
import { useUserStore } from "@/store/user.store";
import { useBlockingStore } from "@/store/blocking.store";
import { ShieldCheck, ShieldOff, Flame, Timer } from "lucide-react-native";

export default function HomeScreen() {
  const { streak, preferences } = useUserStore();
  const { isShieldActive, setShieldActive } = useBlockingStore();

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.greeting}>FocusGuard</Text>
        <View style={styles.streakBadge}>
          <Flame size={16} color={colors.amber} />
          <Text style={styles.streakText}>{streak.current}</Text>
        </View>
      </View>

      {/* Focus Ring Widget */}
      <View style={styles.widget}>
        <Text style={styles.widgetTitle}>Today's Focus</Text>
        <Text style={styles.widgetValue}>0 / {preferences.dailyFocusGoalMinutes}m</Text>
        <Text style={styles.widgetSubtitle}>Start a session to begin tracking</Text>
      </View>

      {/* Shield Status Widget */}
      <Pressable
        style={[styles.widget, styles.shieldWidget]}
        onPress={() => setShieldActive(!isShieldActive)}
      >
        <View style={styles.shieldRow}>
          {isShieldActive ? (
            <ShieldCheck size={24} color={colors.pulse} />
          ) : (
            <ShieldOff size={24} color={colors.shadow} />
          )}
          <Text style={styles.widgetTitle}>
            Shield {isShieldActive ? "Active" : "Inactive"}
          </Text>
        </View>
        <Text style={styles.widgetSubtitle}>
          {isShieldActive ? "Your apps are protected" : "Tap to activate protection"}
        </Text>
      </Pressable>

      {/* Streak Widget */}
      <View style={styles.widget}>
        <Text style={styles.widgetTitle}>Streak</Text>
        <Text style={styles.streakLarge}>{streak.current} days</Text>
        <Text style={styles.widgetSubtitle}>
          Best: {streak.longest} days · {streak.freezesRemaining} freezes left
        </Text>
      </View>

      {/* Quick Actions */}
      <View style={styles.quickActions}>
        <Pressable style={styles.actionButton}>
          <Timer size={20} color={colors.frost} />
          <Text style={styles.actionText}>Start Session</Text>
        </Pressable>
      </View>
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
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.lg,
  },
  greeting: {
    ...typography.h1,
    color: colors.frost,
  },
  streakBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.amberSoft,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radii.full,
    gap: spacing.xs,
  },
  streakText: {
    ...typography.label,
    color: colors.amber,
  },
  widget: {
    backgroundColor: colors.depth,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.rim,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  shieldWidget: {
    borderColor: colors.rim,
  },
  shieldRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    marginBottom: spacing.xs,
  },
  widgetTitle: {
    ...typography.h3,
    color: colors.frost,
  },
  widgetValue: {
    ...typography.display,
    color: colors.frost,
    fontFamily: "monospace",
    marginVertical: spacing.sm,
  },
  widgetSubtitle: {
    ...typography.body,
    color: colors.mist,
  },
  streakLarge: {
    ...typography.display,
    color: colors.amber,
    fontFamily: "monospace",
    marginVertical: spacing.sm,
  },
  quickActions: {
    marginTop: spacing.md,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.nebula,
    paddingVertical: spacing.md,
    borderRadius: radii.md,
    gap: spacing.sm,
  },
  actionText: {
    ...typography.label,
    color: colors.frost,
  },
});
