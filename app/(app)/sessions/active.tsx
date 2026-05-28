/**
 * FocusGuard Active Session Screen (Fullscreen)
 *
 * Immersive session view with timer, intention, and controls.
 * Skia ring animation will be added in Phase 2.
 */

import { View, Text, StyleSheet, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { colors, spacing, radii } from "@/design/tokens";
import { typography } from "@/design/typography";
import { useTimer } from "@/hooks/useTimer";
import { formatTimer } from "@/lib/time";
import { Pause, Play, Square, Plus } from "lucide-react-native";

export default function ActiveSessionScreen() {
  const router = useRouter();
  const {
    isRunning,
    isPaused,
    elapsedSeconds,
    targetSeconds,
    remainingSeconds,
    progress,
    pause,
    resume,
    stop,
  } = useTimer();

  const displaySeconds = remainingSeconds ?? elapsedSeconds;
  const isCountdown = targetSeconds !== null;

  const handleStop = () => {
    stop();
    router.back();
  };

  return (
    <View style={styles.container}>
      {/* Timer */}
      <View style={styles.timerContainer}>
        <Text style={styles.timerText}>{formatTimer(displaySeconds)}</Text>
        {isCountdown && progress !== null && (
          <Text style={styles.progressText}>{Math.round(progress * 100)}%</Text>
        )}
      </View>

      {/* Controls */}
      <View style={styles.controls}>
        <Pressable style={styles.controlButton} onPress={handleStop}>
          <Square size={28} color={colors.alert} />
          <Text style={styles.controlLabel}>Stop</Text>
        </Pressable>

        <Pressable
          style={[styles.controlButton, styles.primaryControl]}
          onPress={isPaused ? resume : pause}
        >
          {isPaused ? (
            <Play size={32} color={colors.frost} />
          ) : (
            <Pause size={32} color={colors.frost} />
          )}
          <Text style={styles.controlLabelPrimary}>
            {isPaused ? "Resume" : "Pause"}
          </Text>
        </Pressable>

        <Pressable style={styles.controlButton} onPress={() => {}}>
          <Plus size={28} color={colors.mist} />
          <Text style={styles.controlLabel}>+5m</Text>
        </Pressable>
      </View>

      {/* Blocked apps */}
      <View style={styles.blockedSection}>
        <Text style={styles.blockedTitle}>Apps blocked during this session</Text>
        <Text style={styles.blockedSubtitle}>
          Your focus is protected
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.void,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: spacing.lg,
  },
  timerContainer: {
    alignItems: "center",
    marginBottom: spacing["3xl"],
  },
  timerText: {
    ...typography["mono-xl"],
    color: colors.frost,
    fontSize: 72,
    lineHeight: 80,
  },
  progressText: {
    ...typography.label,
    color: colors.mist,
    marginTop: spacing.sm,
  },
  controls: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xl,
    marginBottom: spacing["3xl"],
  },
  controlButton: {
    alignItems: "center",
    gap: spacing.xs,
  },
  primaryControl: {
    width: 72,
    height: 72,
    borderRadius: radii.full,
    backgroundColor: colors.nebula,
    justifyContent: "center",
  },
  controlLabel: {
    ...typography.caption,
    color: colors.mist,
  },
  controlLabelPrimary: {
    ...typography.caption,
    color: colors.frost,
  },
  blockedSection: {
    alignItems: "center",
    gap: spacing.xs,
  },
  blockedTitle: {
    ...typography.label,
    color: colors.mist,
  },
  blockedSubtitle: {
    ...typography.caption,
    color: colors.shadow,
  },
});
