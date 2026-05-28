/**
 * FocusGuard Temptation Modal (Friction Modal)
 *
 * "Are you sure?" friction modal.
 * Shows usage count, countdown, and options.
 */

import { useState, useEffect } from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { colors, spacing, radii } from "@/design/tokens";
import { typography } from "@/design/typography";
import type { FrictionLevel } from "@/types/domain";

type TemptationModalProps = {
  appName: string;
  frictionLevel: FrictionLevel;
  usageCount: number;
  onBypass: () => void;
  onStayFocused: () => void;
};

export default function TemptationModal() {
  const router = useRouter();
  const [countdown, setCountdown] = useState(5);
  const [canBypass, setCanBypass] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setCanBypass(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Still want to open this app?</Text>
        <Text style={styles.subtitle}>
          You've tried to open this app multiple times today.
        </Text>

        {/* Countdown ring placeholder */}
        <View style={styles.countdownCircle}>
          <Text style={styles.countdownText}>{countdown}</Text>
        </View>

        <View style={styles.actions}>
          <Pressable
            style={[styles.stayButton]}
            onPress={() => router.back()}
          >
            <Text style={styles.stayButtonText}>Stay Focused</Text>
          </Pressable>

          <Pressable
            style={[styles.openButton, !canBypass && styles.openButtonDisabled]}
            disabled={!canBypass}
            onPress={() => router.back()}
          >
            <Text style={[styles.openButtonText, !canBypass && styles.openButtonTextDisabled]}>
              {canBypass ? "Open Anyway" : `Wait ${countdown}s`}
            </Text>
          </Pressable>
        </View>
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
  title: {
    ...typography.h2,
    color: colors.frost,
    textAlign: "center",
  },
  subtitle: {
    ...typography.body,
    color: colors.mist,
    textAlign: "center",
  },
  countdownCircle: {
    width: 80,
    height: 80,
    borderRadius: radii.full,
    backgroundColor: colors.surface,
    borderWidth: 2,
    borderColor: colors.amber,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: spacing.md,
  },
  countdownText: {
    ...typography.display,
    color: colors.amber,
    fontFamily: "monospace",
  },
  actions: {
    width: "100%",
    gap: spacing.sm,
  },
  stayButton: {
    backgroundColor: colors.nebula,
    paddingVertical: spacing.md,
    borderRadius: radii.md,
    alignItems: "center",
  },
  stayButtonText: {
    ...typography.label,
    color: colors.frost,
  },
  openButton: {
    backgroundColor: "transparent",
    paddingVertical: spacing.md,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.rim,
    alignItems: "center",
  },
  openButtonDisabled: {
    borderColor: colors.fog,
  },
  openButtonText: {
    ...typography.label,
    color: colors.mist,
  },
  openButtonTextDisabled: {
    color: colors.shadow,
  },
});
