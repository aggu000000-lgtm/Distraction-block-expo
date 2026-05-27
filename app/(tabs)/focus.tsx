import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'expo-router';
import { COLORS, FONT, RADIUS, SPACING } from '../../constants/theme';
import { useStore } from '../../store/useStore';

type Mode = { label: string; duration: number; type: 'pomodoro' | 'custom' | 'flow'; icon: string; color: string; desc: string };

const MODES: Mode[] = [
  { label: 'Pomodoro', duration: 25, type: 'pomodoro', icon: '🍅', color: COLORS.danger, desc: '25 min focus + 5 min break' },
  { label: 'Flow State', duration: 90, type: 'flow', icon: '🌊', color: COLORS.accent, desc: '90 min deep work session' },
  { label: 'Power Hour', duration: 60, type: 'custom', icon: '⚡', color: COLORS.warning, desc: '60 min full concentration' },
  { label: 'Quick Sprint', duration: 15, type: 'custom', icon: '🏃', color: COLORS.success, desc: '15 min rapid task burst' },
];

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export default function FocusScreen() {
  const { state, startSession, completeSession, cancelSession } = useStore();
  const [selectedMode, setSelectedMode] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(MODES[0].duration * 60);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const router = useRouter();

  const mode = MODES[selectedMode];
  const total = mode.duration * 60;
  const progress = 1 - secondsLeft / total;
  const circumference = 2 * Math.PI * 100;
  const strokeDash = circumference * (1 - progress);

  useEffect(() => {
    setSecondsLeft(mode.duration * 60);
    setIsRunning(false);
    clearInterval(intervalRef.current!);
  }, [selectedMode]);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setSecondsLeft((s) => {
          if (s <= 1) {
            clearInterval(intervalRef.current!);
            setIsRunning(false);
            completeSession();
            Alert.alert('🎉 Session Complete!', `You focused for ${mode.duration} minutes. Great job!`, [{ text: 'Awesome!' }]);
            return mode.duration * 60;
          }
          return s - 1;
        });
      }, 1000);
    } else {
      clearInterval(intervalRef.current!);
    }
    return () => clearInterval(intervalRef.current!);
  }, [isRunning]);

  const handleStart = () => {
    startSession(mode.duration, mode.type);
    setIsRunning(true);
  };

  const handlePause = () => setIsRunning(false);

  const handleStop = () => {
    Alert.alert('Stop Session?', 'Progress will be lost.', [
      { text: 'Keep Going', style: 'cancel' },
      {
        text: 'Stop',
        style: 'destructive',
        onPress: () => {
          cancelSession();
          setIsRunning(false);
          setSecondsLeft(mode.duration * 60);
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Focus Timer</Text>
        <Text style={styles.subtitle}>Choose a mode and start your session</Text>

        {/* Mode Selector */}
        <View style={styles.modeGrid}>
          {MODES.map((m, i) => (
            <TouchableOpacity
              key={i}
              style={[styles.modeCard, selectedMode === i && { borderColor: m.color, backgroundColor: `${m.color}18` }]}
              onPress={() => !isRunning && setSelectedMode(i)}
              activeOpacity={0.75}
            >
              <Text style={styles.modeEmoji}>{m.icon}</Text>
              <Text style={[styles.modeLabel, selectedMode === i && { color: m.color }]}>{m.label}</Text>
              <Text style={styles.modeDuration}>{m.duration}m</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Timer Ring */}
        <View style={styles.timerContainer}>
          <View style={styles.timerRingWrap}>
            {/* SVG Ring via border trick */}
            <View style={[styles.ringOuter, { borderColor: `${mode.color}22` }]}>
              <View style={[styles.ringInner, { borderColor: mode.color, borderTopColor: 'transparent', transform: [{ rotate: `${progress * 360}deg` }] }]} />
              <View style={styles.ringCenter}>
                <Text style={styles.timerText}>{formatTime(secondsLeft)}</Text>
                <Text style={styles.timerLabel}>{isRunning ? 'Focusing...' : 'Ready'}</Text>
                <Text style={[styles.modeBadge, { color: mode.color }]}>{mode.label}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Mode Description */}
        <View style={[styles.descCard, { borderColor: `${mode.color}40`, backgroundColor: `${mode.color}0d` }]}>
          <Text style={styles.descText}>{mode.desc}</Text>
        </View>

        {/* Controls */}
        <View style={styles.controls}>
          {!isRunning ? (
            <TouchableOpacity style={[styles.primaryBtn, { backgroundColor: mode.color }]} onPress={handleStart} activeOpacity={0.85}>
              <Ionicons name="play" size={22} color={COLORS.white} />
              <Text style={styles.primaryBtnText}>Start Session</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.activeControls}>
              <TouchableOpacity style={styles.secondaryBtn} onPress={handlePause} activeOpacity={0.8}>
                <Ionicons name="pause" size={20} color={COLORS.text} />
                <Text style={styles.secondaryBtnText}>Pause</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.secondaryBtn, styles.stopBtn]} onPress={handleStop} activeOpacity={0.8}>
                <Ionicons name="stop" size={20} color={COLORS.danger} />
                <Text style={[styles.secondaryBtnText, { color: COLORS.danger }]}>Stop</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Stats Row */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statVal}>{state.stats.reduce((a, s) => a + s.sessionsCompleted, 0)}</Text>
            <Text style={styles.statLabel}>Total Sessions</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statVal}>{Math.round(state.stats.reduce((a, s) => a + s.focusMinutes, 0) / 60)}h</Text>
            <Text style={styles.statLabel}>Total Focus</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statVal}>{state.focusStreak}</Text>
            <Text style={styles.statLabel}>Day Streak 🔥</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const RING = 130;

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bg },
  content: { padding: SPACING.md, paddingBottom: SPACING.xxl },

  title: { color: COLORS.text, fontSize: FONT.xxl, fontWeight: '800', marginBottom: 4 },
  subtitle: { color: COLORS.textSub, fontSize: FONT.sm, marginBottom: SPACING.lg },

  modeGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm, marginBottom: SPACING.lg },
  modeCard: {
    flex: 1, minWidth: '44%', backgroundColor: COLORS.surface, borderRadius: RADIUS.md,
    padding: SPACING.md, alignItems: 'center', borderWidth: 2, borderColor: COLORS.border, gap: 4,
  },
  modeEmoji: { fontSize: 24 },
  modeLabel: { color: COLORS.text, fontSize: FONT.sm, fontWeight: '700' },
  modeDuration: { color: COLORS.textSub, fontSize: FONT.xs },

  timerContainer: { alignItems: 'center', marginBottom: SPACING.md },
  timerRingWrap: { width: RING * 2 + 20, height: RING * 2 + 20, alignItems: 'center', justifyContent: 'center' },
  ringOuter: {
    width: RING * 2, height: RING * 2, borderRadius: RING,
    borderWidth: 12, alignItems: 'center', justifyContent: 'center', position: 'relative',
  },
  ringInner: {
    position: 'absolute', width: RING * 2, height: RING * 2,
    borderRadius: RING, borderWidth: 12, borderColor: COLORS.accent,
  },
  ringCenter: { alignItems: 'center', gap: 4 },
  timerText: { color: COLORS.text, fontSize: 48, fontWeight: '800', letterSpacing: -2 },
  timerLabel: { color: COLORS.textSub, fontSize: FONT.sm, fontWeight: '500' },
  modeBadge: { fontSize: FONT.xs, fontWeight: '700', letterSpacing: 1, textTransform: 'uppercase' },

  descCard: { borderRadius: RADIUS.md, padding: SPACING.md, marginBottom: SPACING.lg, borderWidth: 1, alignItems: 'center' },
  descText: { color: COLORS.textSub, fontSize: FONT.sm, fontWeight: '500' },

  controls: { marginBottom: SPACING.lg },
  primaryBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: SPACING.sm, borderRadius: RADIUS.md, padding: SPACING.md, elevation: 8, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.4, shadowRadius: 12 },
  primaryBtnText: { color: COLORS.white, fontSize: FONT.lg, fontWeight: '700' },
  activeControls: { flexDirection: 'row', gap: SPACING.sm },
  secondaryBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: SPACING.sm, backgroundColor: COLORS.surface, borderRadius: RADIUS.md, padding: SPACING.md, borderWidth: 1, borderColor: COLORS.border },
  secondaryBtnText: { color: COLORS.text, fontSize: FONT.md, fontWeight: '700' },
  stopBtn: { borderColor: COLORS.dangerSoft },

  statsRow: { flexDirection: 'row', gap: SPACING.sm },
  statCard: { flex: 1, backgroundColor: COLORS.surface, borderRadius: RADIUS.md, padding: SPACING.md, alignItems: 'center', borderWidth: 1, borderColor: COLORS.border },
  statVal: { color: COLORS.text, fontSize: FONT.xl, fontWeight: '800' },
  statLabel: { color: COLORS.textSub, fontSize: FONT.xs, marginTop: 2, textAlign: 'center' },
});
