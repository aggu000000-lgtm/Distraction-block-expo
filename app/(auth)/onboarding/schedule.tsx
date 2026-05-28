/**
 * FocusGuard Onboarding — Step 3: When do you want to focus?
 *
 * Visual schedule picker: drag to select time blocks on a weekly calendar.
 * Creates first schedule-based rule: "Work Hours"
 */

import { useState } from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { colors, spacing, radii } from "@/design/tokens";
import { typography } from "@/design/typography";
import { useBlockingStore } from "@/store/blocking.store";
import { useUserStore } from "@/store/user.store";
import type { Day, BlockRule } from "@/types/domain";

const DAYS: Day[] = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];
const DAY_LABELS: Record<Day, string> = {
  mon: "M",
  tue: "T",
  wed: "W",
  thu: "T",
  fri: "F",
  sat: "S",
  sun: "S",
};

const TIME_PRESETS = [
  { id: "morning", label: "Morning", from: "06:00", to: "12:00", emoji: "🌅" },
  { id: "afternoon", label: "Afternoon", from: "12:00", to: "18:00", emoji: "☀️" },
  { id: "evening", label: "Evening", from: "18:00", to: "22:00", emoji: "🌙" },
  { id: "work", label: "Work Hours", from: "09:00", to: "17:00", emoji: "💼" },
];

export default function OnboardingScheduleScreen() {
  const router = useRouter();
  const [selectedDays, setSelectedDays] = useState<Day[]>(["mon", "tue", "wed", "thu", "fri"]);
  const [selectedTime, setSelectedTime] = useState<string | null>("work");
  const { addRule } = useBlockingStore();
  const { completeOnboarding } = useUserStore();

  const toggleDay = (day: Day) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day],
    );
  };

  const handleComplete = () => {
    const timePreset = TIME_PRESETS.find((t) => t.id === selectedTime);

    if (timePreset && selectedDays.length > 0) {
      const rule: BlockRule = {
        id: `rule_${Date.now()}`,
        name: "Work Hours",
        apps: [], // User will configure in Shield tab
        condition: {
          type: "schedule",
          days: selectedDays,
          from: timePreset.from,
          to: timePreset.to,
        },
        friction: "medium",
        isActive: true,
        createdAt: Date.now(),
      };
      addRule(rule);
    }

    completeOnboarding();
    router.replace("/(app)/home");
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.step}>Step 3 of 3</Text>
        <Text style={styles.title}>When do you want to focus?</Text>
        <Text style={styles.subtitle}>
          We'll create your first blocking rule
        </Text>
      </View>

      {/* Day selector */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Active Days</Text>
        <View style={styles.dayRow}>
          {DAYS.map((day) => {
            const isSelected = selectedDays.includes(day);
            return (
              <Pressable
                key={day}
                style={[styles.dayChip, isSelected && styles.dayChipSelected]}
                onPress={() => toggleDay(day)}
              >
                <Text style={[styles.dayLabel, isSelected && styles.dayLabelSelected]}>
                  {DAY_LABELS[day]}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      {/* Time selector */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Time Block</Text>
        <View style={styles.timeGrid}>
          {TIME_PRESETS.map((time) => {
            const isSelected = selectedTime === time.id;
            return (
              <Pressable
                key={time.id}
                style={[styles.timeCard, isSelected && styles.timeCardSelected]}
                onPress={() => setSelectedTime(time.id)}
              >
                <Text style={styles.timeEmoji}>{time.emoji}</Text>
                <Text style={[styles.timeLabel, isSelected && styles.timeLabelSelected]}>
                  {time.label}
                </Text>
                <Text style={styles.timeRange}>
                  {time.from} – {time.to}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      <View style={styles.footer}>
        <Pressable
          style={[styles.button, selectedDays.length === 0 && styles.buttonDisabled]}
          disabled={selectedDays.length === 0}
          onPress={handleComplete}
        >
          <Text style={styles.buttonText}>Start FocusGuard</Text>
        </Pressable>

        <Pressable onPress={handleComplete}>
          <Text style={styles.skipText}>Skip for now</Text>
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
  section: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    ...typography.label,
    color: colors.mist,
    marginBottom: spacing.sm,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  dayRow: {
    flexDirection: "row",
    gap: spacing.sm,
  },
  dayChip: {
    width: 40,
    height: 40,
    borderRadius: radii.full,
    backgroundColor: colors.depth,
    borderWidth: 1,
    borderColor: colors.rim,
    alignItems: "center",
    justifyContent: "center",
  },
  dayChipSelected: {
    backgroundColor: colors.nebula,
    borderColor: colors.nebula,
  },
  dayLabel: {
    ...typography.label,
    color: colors.mist,
  },
  dayLabelSelected: {
    color: colors.frost,
  },
  timeGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
  timeCard: {
    width: "47%",
    backgroundColor: colors.depth,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.rim,
    padding: spacing.md,
    alignItems: "center",
    gap: spacing.xs,
  },
  timeCardSelected: {
    borderColor: colors.nebula,
    backgroundColor: colors.nebulaGlow,
  },
  timeEmoji: {
    fontSize: 24,
  },
  timeLabel: {
    ...typography.label,
    color: colors.mist,
  },
  timeLabelSelected: {
    color: colors.frost,
  },
  timeRange: {
    ...typography.caption,
    color: colors.shadow,
  },
  footer: {
    marginTop: "auto",
    gap: spacing.md,
    alignItems: "center",
  },
  button: {
    backgroundColor: colors.nebula,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: radii.md,
    alignItems: "center",
    width: "100%",
  },
  buttonDisabled: {
    opacity: 0.4,
  },
  buttonText: {
    ...typography.label,
    color: colors.frost,
  },
  skipText: {
    ...typography.body,
    color: colors.shadow,
  },
});
