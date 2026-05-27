import { View, StyleSheet, ScrollView, TouchableOpacity, Switch, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Txt, Card, Spacer, Row, Pill, Divider } from '../../../src/ui/primitives';
import { C, S, R } from '../../../src/design/tokens';
import { useStore } from '../../../src/store';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const router = useRouter();
  const { apps, rules, reports, streak, focusGoalMinutes, isShieldActive, toggleShield } = useStore();

  const blockedCount = apps.filter((a) => a.isBlocked).length;
  const today = reports[reports.length - 1];
  const focusPct = Math.min((today?.focusMinutes ?? 0) / focusGoalMinutes, 1);
  const totalFocusHrs = Math.floor(reports.reduce((s, r) => s + r.focusMinutes, 0) / 60);

  const h = new Date().getHours();
  const greeting = h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* Header */}
        <View style={styles.header}>
          <View>
            <Txt size="sm" color={C.mist} weight="medium">{greeting} 👋</Txt>
            <Txt size="xxl" weight="black">FocusGuard</Txt>
          </View>
          <View style={styles.streakBadge}>
            <Txt size="xl">🔥</Txt>
            <View>
              <Txt size="xl" weight="black" color={C.amber}>{streak}</Txt>
              <Txt size="xs" color={C.mist}>day streak</Txt>
            </View>
          </View>
        </View>

        {/* Shield master toggle */}
        <TouchableOpacity activeOpacity={0.85} onPress={toggleShield}>
          <LinearGradient
            colors={isShieldActive ? [`${C.pulse}22`, `${C.pulse}08`] : [C.depth, C.depth]}
            style={[styles.shieldCard, { borderColor: isShieldActive ? `${C.pulse}44` : C.rim }]}
          >
            <View style={[styles.shieldIcon, { backgroundColor: isShieldActive ? C.pulseDim : C.surface }]}>
              <Ionicons
                name={isShieldActive ? 'shield-checkmark' : 'shield-outline'}
                size={32}
                color={isShieldActive ? C.pulse : C.shadow}
              />
            </View>
            <View style={{ flex: 1 }}>
              <Txt size="lg" weight="bold" color={isShieldActive ? C.pulse : C.mist}>
                {isShieldActive ? 'Shield Active' : 'Shield Off'}
              </Txt>
              <Txt size="sm" color={C.mist}>
                {isShieldActive ? `${blockedCount} apps protected` : 'Tap to activate blocking'}
              </Txt>
            </View>
            <Switch
              value={isShieldActive} onValueChange={toggleShield}
              trackColor={{ false: C.surface, true: C.pulseGlow }}
              thumbColor={isShieldActive ? C.pulse : C.shadow}
              ios_backgroundColor={C.surface}
            />
          </LinearGradient>
        </TouchableOpacity>

        {/* Today's focus */}
        <Card style={{ padding: S.md }} gap="md">
          <Row>
            <Txt size="md" weight="bold" style={{ flex: 1 }}>Today's Focus</Txt>
            <Txt size="sm" color={C.mist}>{today?.focusMinutes ?? 0}m / {focusGoalMinutes}m</Txt>
          </Row>
          <View style={styles.progressBg}>
            <LinearGradient
              colors={[C.nebula, C.nebulaBright]}
              start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
              style={[styles.progressFill, { width: `${Math.max(focusPct * 100, 2)}%` }]}
            />
          </View>
          <Row gap="sm">
            {[
              { v: String(today?.sessionsCompleted ?? 0), l: 'Sessions', c: C.nebula },
              { v: String(today?.openBlocked ?? 0),       l: 'Blocked',  c: C.alert  },
              { v: `${streak}d`,                          l: 'Streak',   c: C.amber  },
            ].map(({ v, l, c }) => (
              <View key={l} style={[styles.statPill, { flex: 1, backgroundColor: `${c}18` }]}>
                <Txt size="lg" weight="extrabold" color={c} align="center">{v}</Txt>
                <Txt size="xs" color={C.mist} align="center">{l}</Txt>
              </View>
            ))}
          </Row>
        </Card>

        {/* Quick actions */}
        <Txt size="xs" weight="bold" color={C.mist} style={styles.sectionLabel}>QUICK ACTIONS</Txt>
        <View style={styles.quickGrid}>
          {[
            { emoji: '⏱️', label: 'Start Focus',  sub: 'Pomodoro / Flow',     color: C.nebula, route: '/(tabs)/focus'    },
            { emoji: '🛡️', label: 'Block Apps',   sub: `${blockedCount} active`, color: C.alert,  route: '/(tabs)/shield'   },
            { emoji: '📊', label: 'Insights',     sub: `${totalFocusHrs}h total`, color: C.pulse,  route: '/(tabs)/insights' },
            { emoji: '👤', label: 'Profile',      sub: 'Settings & more',     color: C.amber,  route: '/(tabs)/profile'  },
          ].map(({ emoji, label, sub, color, route }) => (
            <TouchableOpacity
              key={label}
              style={[styles.quickCard, { backgroundColor: `${color}12`, borderColor: `${color}28` }]}
              onPress={() => router.push(route as any)}
              activeOpacity={0.7}
            >
              <Txt size="xxl">{emoji}</Txt>
              <Txt size="sm" weight="bold" color={color} style={{ marginTop: 4 }}>{label}</Txt>
              <Txt size="xs" color={C.mist}>{sub}</Txt>
            </TouchableOpacity>
          ))}
        </View>

        {/* Active rules */}
        <Row style={styles.sectionRow}>
          <Txt size="xs" weight="bold" color={C.mist} style={{ flex: 1 }}>ACTIVE RULES</Txt>
          <TouchableOpacity onPress={() => router.push('/(tabs)/shield')}>
            <Txt size="xs" color={C.nebula} weight="semibold">Manage →</Txt>
          </TouchableOpacity>
        </Row>
        <Card>
          {rules.map((rule, i) => (
            <View key={rule.id}>
              {i > 0 && <Divider indent={S.md + 36 + S.md} />}
              <View style={styles.ruleRow}>
                <View style={[styles.ruleIcon, { backgroundColor: rule.isActive ? C.nebulaDim : C.surface }]}>
                  <Txt size="md">{rule.emoji}</Txt>
                </View>
                <View style={{ flex: 1 }}>
                  <Txt size="md" weight="semibold">{rule.name}</Txt>
                  <Txt size="xs" color={C.mist}>{rule.appIds.length} apps · {rule.friction}</Txt>
                </View>
                <Pill label={rule.isActive ? 'ON' : 'OFF'} color={rule.isActive ? C.pulse : C.shadow} bg={rule.isActive ? C.pulseDim : C.surface} />
              </View>
            </View>
          ))}
        </Card>

        {/* Blocked apps preview */}
        <Txt size="xs" weight="bold" color={C.mist} style={styles.sectionLabel}>BLOCKED APPS</Txt>
        <Card>
          <View style={styles.appGrid}>
            {apps.filter((a) => a.isBlocked).slice(0, 8).map((app) => (
              <View key={app.id} style={styles.appPill}>
                <Txt size="lg">{app.icon}</Txt>
                <Txt size="xs" color={C.mist} numberOfLines={1}>{app.name}</Txt>
                <Ionicons name="lock-closed" size={10} color={C.alert} />
              </View>
            ))}
          </View>
        </Card>

        {/* Quote */}
        <Card style={{ gap: S.sm, padding: S.md }}>
          <Txt size="lg">💡</Txt>
          <Txt size="sm" color={C.mist} style={{ fontStyle: 'italic', lineHeight: 20 }}>
            "Focus is not about saying yes to one thing. It's about saying no to a hundred other good ideas."
          </Txt>
          <Txt size="xs" color={C.shadow} weight="semibold">— Steve Jobs</Txt>
        </Card>

        <Spacer h="xxl" />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.abyss },
  scroll: { padding: S.md, gap: S.sm },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: S.sm },
  streakBadge: { flexDirection: 'row', alignItems: 'center', gap: S.xs, backgroundColor: C.amberDim, paddingHorizontal: S.sm, paddingVertical: S.xs, borderRadius: R.md, borderWidth: 1, borderColor: `${C.amber}33` },
  shieldCard: { flexDirection: 'row', alignItems: 'center', gap: S.md, borderRadius: R.md, padding: S.md, borderWidth: 1 },
  shieldIcon: { width: 56, height: 56, borderRadius: R.sm, alignItems: 'center', justifyContent: 'center' },
  progressBg: { height: 8, backgroundColor: C.surface, borderRadius: R.full, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: R.full },
  statPill: { borderRadius: R.sm, padding: S.sm, gap: 2 },
  sectionLabel: { marginTop: S.xs, marginLeft: S.xs },
  sectionRow: { marginTop: S.xs, paddingHorizontal: S.xs },
  quickGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: S.sm },
  quickCard: { width: (width - S.md * 2 - S.sm) / 2, borderRadius: R.md, padding: S.md, borderWidth: 1, gap: 2 },
  ruleRow: { flexDirection: 'row', alignItems: 'center', gap: S.md, padding: S.md },
  ruleIcon: { width: 36, height: 36, borderRadius: R.sm, alignItems: 'center', justifyContent: 'center' },
  appGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: S.sm, padding: S.sm },
  appPill: { alignItems: 'center', gap: 2, backgroundColor: C.surface, borderRadius: R.sm, padding: S.sm, minWidth: 60 },
});
