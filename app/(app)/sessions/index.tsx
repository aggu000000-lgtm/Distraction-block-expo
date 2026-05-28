/**
 * FocusGuard Sessions Screen
 *
 * Session history and mode selection.
 */

import { View, Text, StyleSheet, Pressable, FlatList } from "react-native";
import { colors, spacing, radii } from "@/design/tokens";
import { typography } from "@/design/typography";
import { useSessionStore, SESSION_MODES } from "@/store/session.store";
import { Timer, Play } from "lucide-react-native";
import type { SessionModeId } from "@/types/domain";

const MODES: { id: SessionModeId; label: string; description: string; emoji: string }[] = [
  { id: "pomodoro", label: "Pomodoro", description: "25m work / 5m break", emoji: "🍅" },
  { id: "flow", label: "Flow State", description: "No time limit", emoji: "🌊" },
  { id: "sprint", label: "Sprint", description: "15m quick focus", emoji: "⚡" },
  { id: "custom", label: "Custom", description: "You choose", emoji: "⚙️" },
];

export default function SessionsScreen() {
  const { sessions, isLoading } = useSessionStore();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sessions</Text>

      {/* Mode selection */}
      <Text style={styles.sectionTitle}>Start a Session</Text>
      <View style={styles.modeGrid}>
        {MODES.map((mode) => (
          <Pressable key={mode.id} style={styles.modeCard}>
            <Text style={styles.modeEmoji}>{mode.emoji}</Text>
            <Text style={styles.modeLabel}>{mode.label}</Text>
            <Text style={styles.modeDescription}>{mode.description}</Text>
          </Pressable>
        ))}
      </View>

      {/* Session history */}
      <Text style={styles.sectionTitle}>Recent Sessions</Text>
      {sessions.length === 0 ? (
        <View style={styles.emptyState}>
          <Timer size={48} color={colors.shadow} />
          <Text style={styles.emptyTitle}>No sessions yet</Text>
          <Text style={styles.emptyText}>
            Start your first session above
          </Text>
        </View>
      ) : (
        <FlatList
          data={sessions}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.sessionCard}>
              <Text style={styles.sessionMode}>{item.mode.id}</Text>
              <Text style={styles.sessionOutcome}>{item.outcome}</Text>
            </View>
          )}
        />
      )}
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
  sectionTitle: {
    ...typography.label,
    color: colors.mist,
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: spacing.sm,
  },
  modeGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  modeCard: {
    width: "47%",
    backgroundColor: colors.depth,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.rim,
    padding: spacing.md,
    alignItems: "center",
    gap: spacing.xs,
  },
  modeEmoji: {
    fontSize: 28,
  },
  modeLabel: {
    ...typography.label,
    color: colors.frost,
  },
  modeDescription: {
    ...typography.caption,
    color: colors.mist,
    textAlign: "center",
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: spacing["3xl"],
    gap: spacing.sm,
  },
  emptyTitle: {
    ...typography.h3,
    color: colors.mist,
  },
  emptyText: {
    ...typography.body,
    color: colors.shadow,
    textAlign: "center",
  },
  sessionCard: {
    backgroundColor: colors.depth,
    borderRadius: radii.sm,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  sessionMode: {
    ...typography.label,
    color: colors.frost,
  },
  sessionOutcome: {
    ...typography.caption,
    color: colors.mist,
  },
});
