/**
 * FocusGuard Profile Screen
 *
 * Settings, account, and data management.
 */

import { View, Text, StyleSheet, ScrollView, Pressable } from "react-native";
import { colors, spacing, radii } from "@/design/tokens";
import { typography } from "@/design/typography";
import { useUserStore } from "@/store/user.store";
import { Settings, Bell, Database, Info, ChevronRight } from "lucide-react-native";

type SettingRow = {
  icon: React.ReactNode;
  label: string;
  value?: string;
  onPress?: () => void;
};

export default function ProfileScreen() {
  const { preferences, streak } = useUserStore();

  const settingsSections = [
    {
      title: "Shield Settings",
      rows: [
        {
          icon: <Settings size={20} color={colors.mist} />,
          label: "Strict Mode",
          value: preferences.pinLockEnabled ? "On" : "Off",
        },
      ] as SettingRow[],
    },
    {
      title: "Session Defaults",
      rows: [
        {
          icon: <Settings size={20} color={colors.mist} />,
          label: "Default Mode",
          value: preferences.defaultSessionMode,
        },
        {
          icon: <Settings size={20} color={colors.mist} />,
          label: "Daily Goal",
          value: `${preferences.dailyFocusGoalMinutes}m`,
        },
        {
          icon: <Bell size={20} color={colors.mist} />,
          label: "Haptic Feedback",
          value: preferences.hapticEnabled ? "On" : "Off",
        },
      ] as SettingRow[],
    },
    {
      title: "Data",
      rows: [
        {
          icon: <Database size={20} color={colors.mist} />,
          label: "Export Data",
        },
        {
          icon: <Database size={20} color={colors.alert} />,
          label: "Clear All Data",
        },
      ] as SettingRow[],
    },
    {
      title: "About",
      rows: [
        {
          icon: <Info size={20} color={colors.mist} />,
          label: "Version",
          value: "0.1.0",
        },
      ] as SettingRow[],
    },
  ];

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Profile</Text>

      {/* Streak Summary */}
      <View style={styles.streakCard}>
        <Text style={styles.streakNumber}>{streak.current}</Text>
        <Text style={styles.streakLabel}>Day Streak</Text>
        <Text style={styles.streakDetail}>
          Best: {streak.longest} · {streak.freezesRemaining} freezes left
        </Text>
      </View>

      {/* Settings Sections */}
      {settingsSections.map((section) => (
        <View key={section.title} style={styles.section}>
          <Text style={styles.sectionTitle}>{section.title}</Text>
          <View style={styles.sectionCard}>
            {section.rows.map((row, index) => (
              <Pressable
                key={row.label}
                style={[
                  styles.settingRow,
                  index < section.rows.length - 1 && styles.settingRowBorder,
                ]}
                onPress={row.onPress}
              >
                <View style={styles.settingLeft}>
                  {row.icon}
                  <Text style={styles.settingLabel}>{row.label}</Text>
                </View>
                <View style={styles.settingRight}>
                  {row.value && (
                    <Text style={styles.settingValue}>{row.value}</Text>
                  )}
                  <ChevronRight size={16} color={colors.shadow} />
                </View>
              </Pressable>
            ))}
          </View>
        </View>
      ))}

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          FocusGuard v0.1.0 · Built with ❤️
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
  streakCard: {
    backgroundColor: colors.depth,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.rim,
    padding: spacing.lg,
    alignItems: "center",
    marginBottom: spacing.lg,
  },
  streakNumber: {
    ...typography.display,
    color: colors.amber,
    fontFamily: "monospace",
  },
  streakLabel: {
    ...typography.h3,
    color: colors.frost,
    marginTop: spacing.xs,
  },
  streakDetail: {
    ...typography.body,
    color: colors.mist,
    marginTop: spacing.xs,
  },
  section: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    ...typography.label,
    color: colors.mist,
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: spacing.sm,
  },
  sectionCard: {
    backgroundColor: colors.depth,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.rim,
    overflow: "hidden",
  },
  settingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
  },
  settingRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.rim,
  },
  settingLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  settingLabel: {
    ...typography.body,
    color: colors.frost,
  },
  settingRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  settingValue: {
    ...typography.body,
    color: colors.mist,
  },
  footer: {
    paddingVertical: spacing.xl,
    alignItems: "center",
  },
  footerText: {
    ...typography.caption,
    color: colors.shadow,
  },
});
