import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONT, RADIUS, SPACING } from '../../constants/theme';
import { useStore } from '../../store/useStore';

const { width } = Dimensions.get('window');
const BAR_W = (width - SPACING.md * 2 - SPACING.sm * 6) / 7;

const DAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export default function StatsScreen() {
  const { state } = useStore();
  const stats = state.stats.slice(-7);

  const maxFocus = Math.max(...stats.map((s) => s.focusMinutes), 1);
  const totalFocus = stats.reduce((a, s) => a + s.focusMinutes, 0);
  const totalSessions = stats.reduce((a, s) => a + s.sessionsCompleted, 0);
  const totalBlocked = stats.reduce((a, s) => a + s.blockedAttempts, 0);
  const avgFocus = Math.round(totalFocus / Math.max(stats.length, 1));

  const insights = [
    { icon: '🏆', label: 'Best day', value: `${Math.max(...stats.map((s) => s.focusMinutes))}m` },
    { icon: '📅', label: 'Avg per day', value: `${avgFocus}m` },
    { icon: '🔥', label: 'Current streak', value: `${state.focusStreak} days` },
    { icon: '🚫', label: 'Attempts blocked', value: String(totalBlocked) },
  ];

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Your Stats</Text>
        <Text style={styles.subtitle}>Last 7 days overview</Text>

        {/* Summary Cards */}
        <View style={styles.summaryRow}>
          <View style={[styles.summaryCard, { backgroundColor: COLORS.accentSoft, borderColor: `${COLORS.accent}40` }]}>
            <Ionicons name="timer-outline" size={20} color={COLORS.accent} />
            <Text style={[styles.summaryVal, { color: COLORS.accent }]}>{Math.round(totalFocus / 60)}h {totalFocus % 60}m</Text>
            <Text style={styles.summaryLabel}>Total Focus</Text>
          </View>
          <View style={[styles.summaryCard, { backgroundColor: COLORS.successSoft, borderColor: `${COLORS.success}40` }]}>
            <Ionicons name="checkmark-circle-outline" size={20} color={COLORS.success} />
            <Text style={[styles.summaryVal, { color: COLORS.success }]}>{totalSessions}</Text>
            <Text style={styles.summaryLabel}>Sessions Done</Text>
          </View>
          <View style={[styles.summaryCard, { backgroundColor: COLORS.dangerSoft, borderColor: `${COLORS.danger}40` }]}>
            <Ionicons name="ban-outline" size={20} color={COLORS.danger} />
            <Text style={[styles.summaryVal, { color: COLORS.danger }]}>{totalBlocked}</Text>
            <Text style={styles.summaryLabel}>Blocked</Text>
          </View>
        </View>

        {/* Bar Chart */}
        <View style={styles.chartCard}>
          <Text style={styles.chartTitle}>Focus Minutes — Daily</Text>
          <View style={styles.chart}>
            {stats.map((s, i) => {
              const barH = Math.max((s.focusMinutes / maxFocus) * 140, 4);
              const isToday = i === stats.length - 1;
              return (
                <View key={i} style={styles.barCol}>
                  <Text style={styles.barVal}>{s.focusMinutes > 0 ? `${s.focusMinutes}m` : ''}</Text>
                  <View style={styles.barTrack}>
                    <View
                      style={[
                        styles.bar,
                        { height: barH, backgroundColor: isToday ? COLORS.accent : COLORS.accentSoft, borderColor: isToday ? COLORS.accent : `${COLORS.accent}40` },
                      ]}
                    />
                  </View>
                  <Text style={[styles.barLabel, isToday && { color: COLORS.accent, fontWeight: '700' }]}>
                    {DAY_LABELS[i]}
                  </Text>
                </View>
              );
            })}
          </View>
        </View>

        {/* Blocked Attempts Chart */}
        <View style={styles.chartCard}>
          <Text style={styles.chartTitle}>Blocked Attempts — Daily</Text>
          <View style={styles.chart}>
            {stats.map((s, i) => {
              const maxB = Math.max(...stats.map((x) => x.blockedAttempts), 1);
              const barH = Math.max((s.blockedAttempts / maxB) * 100, 4);
              const isToday = i === stats.length - 1;
              return (
                <View key={i} style={styles.barCol}>
                  <Text style={styles.barVal}>{s.blockedAttempts > 0 ? s.blockedAttempts : ''}</Text>
                  <View style={styles.barTrack}>
                    <View style={[styles.bar, { height: barH, backgroundColor: isToday ? COLORS.danger : COLORS.dangerSoft, borderColor: isToday ? COLORS.danger : `${COLORS.danger}40` }]} />
                  </View>
                  <Text style={[styles.barLabel, isToday && { color: COLORS.danger, fontWeight: '700' }]}>
                    {DAY_LABELS[i]}
                  </Text>
                </View>
              );
            })}
          </View>
        </View>

        {/* Insights */}
        <Text style={styles.sectionTitle}>Insights</Text>
        <View style={styles.insightGrid}>
          {insights.map((item, i) => (
            <View key={i} style={styles.insightCard}>
              <Text style={styles.insightIcon}>{item.icon}</Text>
              <Text style={styles.insightVal}>{item.value}</Text>
              <Text style={styles.insightLabel}>{item.label}</Text>
            </View>
          ))}
        </View>

        {/* Streak Banner */}
        <View style={styles.streakBanner}>
          <Text style={styles.streakEmoji}>🔥</Text>
          <View style={{ flex: 1 }}>
            <Text style={styles.streakTitle}>You're on a {state.focusStreak}-day streak!</Text>
            <Text style={styles.streakSub}>Keep it up — consistency is the key to deep work.</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bg },
  content: { padding: SPACING.md, paddingBottom: SPACING.xxl },

  title: { color: COLORS.text, fontSize: FONT.xxl, fontWeight: '800', marginBottom: 4 },
  subtitle: { color: COLORS.textSub, fontSize: FONT.sm, marginBottom: SPACING.lg },

  summaryRow: { flexDirection: 'row', gap: SPACING.sm, marginBottom: SPACING.lg },
  summaryCard: { flex: 1, borderRadius: RADIUS.md, padding: SPACING.sm, alignItems: 'center', borderWidth: 1, gap: 4 },
  summaryVal: { fontSize: FONT.lg, fontWeight: '800' },
  summaryLabel: { color: COLORS.textSub, fontSize: FONT.xs, textAlign: 'center' },

  chartCard: { backgroundColor: COLORS.surface, borderRadius: RADIUS.lg, padding: SPACING.md, marginBottom: SPACING.md, borderWidth: 1, borderColor: COLORS.border },
  chartTitle: { color: COLORS.text, fontSize: FONT.md, fontWeight: '700', marginBottom: SPACING.md },
  chart: { flexDirection: 'row', alignItems: 'flex-end', gap: SPACING.xs, height: 180 },
  barCol: { flex: 1, alignItems: 'center', justifyContent: 'flex-end', gap: 4, height: '100%' },
  barTrack: { width: '100%', alignItems: 'center', justifyContent: 'flex-end', height: 150 },
  bar: { width: '80%', borderRadius: 4, borderWidth: 1, minHeight: 4 },
  barVal: { color: COLORS.textSub, fontSize: 9, textAlign: 'center' },
  barLabel: { color: COLORS.textSub, fontSize: 10, fontWeight: '500' },

  sectionTitle: { color: COLORS.text, fontSize: FONT.lg, fontWeight: '700', marginBottom: SPACING.sm, marginTop: SPACING.xs },

  insightGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm, marginBottom: SPACING.lg },
  insightCard: { width: (width - SPACING.md * 2 - SPACING.sm) / 2, backgroundColor: COLORS.surface, borderRadius: RADIUS.md, padding: SPACING.md, borderWidth: 1, borderColor: COLORS.border, gap: 4 },
  insightIcon: { fontSize: 22 },
  insightVal: { color: COLORS.text, fontSize: FONT.xl, fontWeight: '800' },
  insightLabel: { color: COLORS.textSub, fontSize: FONT.xs },

  streakBanner: { flexDirection: 'row', alignItems: 'center', gap: SPACING.md, backgroundColor: COLORS.accentSoft, borderRadius: RADIUS.md, padding: SPACING.md, borderWidth: 1, borderColor: COLORS.accentGlow },
  streakEmoji: { fontSize: 36 },
  streakTitle: { color: COLORS.text, fontSize: FONT.md, fontWeight: '700' },
  streakSub: { color: COLORS.textSub, fontSize: FONT.xs, marginTop: 2 },
});
