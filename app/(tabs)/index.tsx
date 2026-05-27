import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { COLORS, FONT, RADIUS, SPACING } from '../../constants/theme';
import { useStore } from '../../store/useStore';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const router = useRouter();
  const { state, toggleBlocking } = useStore();

  const blockedCount = state.blockedApps.filter((a) => a.isBlocked).length;
  const todayStats = state.stats[state.stats.length - 1];
  const totalFocusToday = todayStats?.focusMinutes ?? 0;
  const blockedToday = todayStats?.blockedAttempts ?? 0;

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Good focus,</Text>
            <Text style={styles.appName}>FocusGuard 🛡️</Text>
          </View>
          <View style={[styles.streakBadge, { backgroundColor: COLORS.accentSoft }]}>
            <Text style={styles.streakFire}>🔥</Text>
            <Text style={styles.streakText}>{state.focusStreak} day streak</Text>
          </View>
        </View>

        {/* Master Toggle Card */}
        <View style={[styles.masterCard, state.isBlockingActive ? styles.masterCardOn : styles.masterCardOff]}>
          <View style={styles.masterCardInner}>
            <View style={styles.masterIconWrap}>
              <Ionicons
                name={state.isBlockingActive ? 'shield-checkmark' : 'shield-outline'}
                size={36}
                color={state.isBlockingActive ? COLORS.success : COLORS.textMuted}
              />
            </View>
            <View style={styles.masterText}>
              <Text style={styles.masterTitle}>
                {state.isBlockingActive ? 'Protection Active' : 'Protection Off'}
              </Text>
              <Text style={styles.masterSub}>
                {state.isBlockingActive
                  ? `Blocking ${blockedCount} apps`
                  : 'All apps accessible'}
              </Text>
            </View>
            <Switch
              value={state.isBlockingActive}
              onValueChange={toggleBlocking}
              trackColor={{ false: COLORS.surfaceAlt, true: COLORS.accentGlow }}
              thumbColor={state.isBlockingActive ? COLORS.accent : COLORS.textMuted}
              ios_backgroundColor={COLORS.surfaceAlt}
            />
          </View>
          <View style={styles.masterDivider} />
          <View style={styles.masterStats}>
            <View style={styles.masterStat}>
              <Text style={styles.masterStatVal}>{blockedCount}</Text>
              <Text style={styles.masterStatLabel}>Apps Blocked</Text>
            </View>
            <View style={styles.masterStatDivider} />
            <View style={styles.masterStat}>
              <Text style={styles.masterStatVal}>{totalFocusToday}m</Text>
              <Text style={styles.masterStatLabel}>Focus Today</Text>
            </View>
            <View style={styles.masterStatDivider} />
            <View style={styles.masterStat}>
              <Text style={styles.masterStatVal}>{blockedToday}</Text>
              <Text style={styles.masterStatLabel}>Attempts Blocked</Text>
            </View>
          </View>
        </View>

        {/* Quick Actions */}
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.quickGrid}>
          <TouchableOpacity
            style={[styles.quickCard, { backgroundColor: COLORS.accentSoft }]}
            onPress={() => router.push('/focus')}
            activeOpacity={0.7}
          >
            <Ionicons name="timer" size={28} color={COLORS.accent} />
            <Text style={[styles.quickLabel, { color: COLORS.accent }]}>Start Focus</Text>
            <Text style={styles.quickSub}>Pomodoro & Flow</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.quickCard, { backgroundColor: COLORS.dangerSoft }]}
            onPress={() => router.push('/blocklist')}
            activeOpacity={0.7}
          >
            <Ionicons name="ban" size={28} color={COLORS.danger} />
            <Text style={[styles.quickLabel, { color: COLORS.danger }]}>Block Apps</Text>
            <Text style={styles.quickSub}>{blockedCount} active blocks</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.quickCard, { backgroundColor: COLORS.successSoft }]}
            onPress={() => router.push('/stats')}
            activeOpacity={0.7}
          >
            <Ionicons name="trending-up" size={28} color={COLORS.success} />
            <Text style={[styles.quickLabel, { color: COLORS.success }]}>My Progress</Text>
            <Text style={styles.quickSub}>View weekly stats</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.quickCard, { backgroundColor: COLORS.warningSoft }]}
            onPress={() => router.push('/settings')}
            activeOpacity={0.7}
          >
            <Ionicons name="settings" size={28} color={COLORS.warning} />
            <Text style={[styles.quickLabel, { color: COLORS.warning }]}>Settings</Text>
            <Text style={styles.quickSub}>Rules & schedule</Text>
          </TouchableOpacity>
        </View>

        {/* Currently Blocked Apps */}
        <View style={styles.sectionRow}>
          <Text style={styles.sectionTitle}>Blocked Right Now</Text>
          <TouchableOpacity onPress={() => router.push('/blocklist')}>
            <Text style={styles.seeAll}>See all</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.appList}>
          {state.blockedApps
            .filter((a) => a.isBlocked)
            .slice(0, 5)
            .map((app) => (
              <View key={app.id} style={styles.appRow}>
                <Text style={styles.appIcon}>{app.icon}</Text>
                <View style={styles.appInfo}>
                  <Text style={styles.appName2}>{app.name}</Text>
                  <Text style={styles.appCat}>{app.category}</Text>
                </View>
                <View style={styles.blockedPill}>
                  <Ionicons name="lock-closed" size={11} color={COLORS.danger} />
                  <Text style={styles.blockedPillText}>Blocked</Text>
                </View>
              </View>
            ))}
        </View>

        {/* Motivational Quote */}
        <View style={styles.quoteCard}>
          <Text style={styles.quoteIcon}>💡</Text>
          <Text style={styles.quoteText}>
            "Focus is not about saying yes to one thing. It's about saying no to a hundred other good ideas."
          </Text>
          <Text style={styles.quoteAuthor}>— Steve Jobs</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bg },
  scroll: { flex: 1 },
  content: { padding: SPACING.md, paddingBottom: SPACING.xxl },

  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.lg },
  greeting: { color: COLORS.textSub, fontSize: FONT.sm, fontWeight: '500' },
  appName: { color: COLORS.text, fontSize: FONT.xxl, fontWeight: '800', letterSpacing: -0.5 },
  streakBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 12, paddingVertical: 6, borderRadius: RADIUS.full },
  streakFire: { fontSize: 16 },
  streakText: { color: COLORS.accent, fontSize: FONT.sm, fontWeight: '700' },

  masterCard: { borderRadius: RADIUS.lg, padding: SPACING.md, marginBottom: SPACING.lg, borderWidth: 1 },
  masterCardOn: { backgroundColor: 'rgba(74,222,128,0.07)', borderColor: 'rgba(74,222,128,0.25)' },
  masterCardOff: { backgroundColor: COLORS.surface, borderColor: COLORS.border },
  masterCardInner: { flexDirection: 'row', alignItems: 'center', gap: SPACING.md, marginBottom: SPACING.md },
  masterIconWrap: { width: 56, height: 56, backgroundColor: COLORS.bg, borderRadius: RADIUS.md, alignItems: 'center', justifyContent: 'center' },
  masterText: { flex: 1 },
  masterTitle: { color: COLORS.text, fontSize: FONT.lg, fontWeight: '700' },
  masterSub: { color: COLORS.textSub, fontSize: FONT.sm, marginTop: 2 },
  masterDivider: { height: 1, backgroundColor: COLORS.border, marginBottom: SPACING.md },
  masterStats: { flexDirection: 'row', justifyContent: 'space-around' },
  masterStat: { alignItems: 'center' },
  masterStatVal: { color: COLORS.text, fontSize: FONT.xl, fontWeight: '800' },
  masterStatLabel: { color: COLORS.textSub, fontSize: FONT.xs, marginTop: 2 },
  masterStatDivider: { width: 1, backgroundColor: COLORS.border },

  sectionTitle: { color: COLORS.text, fontSize: FONT.lg, fontWeight: '700', marginBottom: SPACING.sm },
  sectionRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.sm },
  seeAll: { color: COLORS.accent, fontSize: FONT.sm, fontWeight: '600' },

  quickGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm, marginBottom: SPACING.lg },
  quickCard: {
    width: (width - SPACING.md * 2 - SPACING.sm) / 2,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    gap: SPACING.xs,
  },
  quickLabel: { fontSize: FONT.md, fontWeight: '700', marginTop: SPACING.xs },
  quickSub: { color: COLORS.textSub, fontSize: FONT.xs },

  appList: { backgroundColor: COLORS.surface, borderRadius: RADIUS.md, overflow: 'hidden', marginBottom: SPACING.lg, borderWidth: 1, borderColor: COLORS.border },
  appRow: { flexDirection: 'row', alignItems: 'center', padding: SPACING.md, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  appIcon: { fontSize: 24, marginRight: SPACING.sm },
  appInfo: { flex: 1 },
  appName2: { color: COLORS.text, fontSize: FONT.md, fontWeight: '600' },
  appCat: { color: COLORS.textSub, fontSize: FONT.xs, marginTop: 1 },
  blockedPill: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: COLORS.dangerSoft, paddingHorizontal: 8, paddingVertical: 4, borderRadius: RADIUS.full },
  blockedPillText: { color: COLORS.danger, fontSize: FONT.xs, fontWeight: '600' },

  quoteCard: { backgroundColor: COLORS.surface, borderRadius: RADIUS.md, padding: SPACING.md, borderWidth: 1, borderColor: COLORS.border, gap: SPACING.sm },
  quoteIcon: { fontSize: 24 },
  quoteText: { color: COLORS.textSub, fontSize: FONT.sm, lineHeight: 20, fontStyle: 'italic' },
  quoteAuthor: { color: COLORS.textMuted, fontSize: FONT.xs, fontWeight: '600' },
});
