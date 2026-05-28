/**
 * FocusGuard Insights Screen
 *
 * Stats, analytics, and pattern detection.
 */

import { View, Text, StyleSheet, ScrollView } from "react-native";
import { colors, spacing, radii } from "@/design/tokens";
import { typography } from "@/design/typography";
import { useAnalyticsStore } from "@/store/analytics.store";
import { useUserStore } from "@/store/user.store";
import { BarChart3, TrendingUp, Clock } from "lucide-react-native";

export default function InsightsScreen() {
  const { todayReport } = useAnalyticsStore();
  const { streak } = useUserStore();

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Insights</Text>

      {/* Summary Cards */}
      <View style={styles.summaryGrid}>
        <View style={styles.summaryCard}>
          <Clock size={20} color={colors.nebula} />
          <Text style={styles.summaryValue}>
            {todayReport?.focusMinutes ?? 0}m
          </Text>
          <Text style={styles.summaryLabel}>Today</Text>
        </View>

        <View style={styles.summaryCard}>
          <TrendingUp size={20} color={colors.pulse} />
          <Text style={styles.summaryValue}>{streak.current}</Text>
          <Text style={styles.summaryLabel}>Day Streak</Text>
        </View>

        <View style={styles.summaryCard}>
          <BarChart3 size={20} color={colors.amber} />
          <Text style={styles.summaryValue}>
            {todayReport?.openBlocked ?? 0}
          </Text>
          <Text style={styles.summaryLabel}>Blocked</Text>
        </View>
      </View>

      {/* Weekly Chart Placeholder */}
      <View style={styles.chartCard}>
        <Text style={styles.chartTitle}>This Week</Text>
        <View style={styles.chartPlaceholder}>
          <BarChart3 size={48} color={colors.shadow} />
          <Text style={styles.chartText}>
            Charts will appear here once you have session data
          </Text>
        </View>
      </View>

      {/* Insights Placeholder */}
      <View style={styles.insightsCard}>
        <Text style={styles.insightsTitle}>Pattern Insights</Text>
        <Text style={styles.insightsPlaceholder}>
          Insights are generated from your focus data. Complete a few sessions to
          see patterns emerge.
        </Text>
      </View>
    </ScrollView>
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
  summaryGrid: {
    flexDirection: "row",
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: colors.depth,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.rim,
    padding: spacing.md,
    alignItems: "center",
    gap: spacing.xs,
  },
  summaryValue: {
    ...typography.h2,
    color: colors.frost,
    fontFamily: "monospace",
  },
  summaryLabel: {
    ...typography.caption,
    color: colors.mist,
  },
  chartCard: {
    backgroundColor: colors.depth,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.rim,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  chartTitle: {
    ...typography.h3,
    color: colors.frost,
    marginBottom: spacing.md,
  },
  chartPlaceholder: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: spacing.xl,
    gap: spacing.sm,
  },
  chartText: {
    ...typography.body,
    color: colors.shadow,
    textAlign: "center",
  },
  insightsCard: {
    backgroundColor: colors.depth,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.rim,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  insightsTitle: {
    ...typography.h3,
    color: colors.frost,
    marginBottom: spacing.sm,
  },
  insightsPlaceholder: {
    ...typography.body,
    color: colors.mist,
  },
});
