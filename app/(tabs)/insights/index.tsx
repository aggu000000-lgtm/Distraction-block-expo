import { View, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Txt, Card, Spacer, Row, ScreenHeader } from '../../../src/ui/primitives';
import { C, S, R } from '../../../src/design/tokens';
import { useStore } from '../../../src/store';
import { generateInsights } from '../../../src/core/analytics/aggregator';

const { width } = Dimensions.get('window');
const CHART_H = 150;
const DAYS = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

export default function InsightsScreen() {
  const { reports, streak, events, apps } = useStore();
  const last7 = reports.slice(-7);

  const totalFocus   = last7.reduce((s, r) => s + r.focusMinutes, 0);
  const totalSess    = last7.reduce((s, r) => s + r.sessionsCompleted, 0);
  const totalBlocked = last7.reduce((s, r) => s + r.openBlocked, 0);
  const totalBypass  = last7.reduce((s, r) => s + r.frictionBypassed, 0);
  const maxFocus     = Math.max(...last7.map((r) => r.focusMinutes), 1);
  const maxBlocked   = Math.max(...last7.map((r) => r.openBlocked), 1);
  const bypassRate   = totalBlocked > 0 ? Math.round((totalBypass / totalBlocked) * 100) : 0;
  const insights     = generateInsights(last7);

  const appStats = apps
    .filter((a) => a.isBlocked)
    .map((app) => ({
      ...app,
      blockedCount: events.filter((e) => e.appId === app.id && e.type === 'open_blocked').length,
    }))
    .sort((a, b) => b.blockedCount - a.blockedCount)
    .slice(0, 5);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <ScreenHeader title="Insights" subtitle="Last 7 days" />

        {/* Summary */}
        <View style={styles.summaryRow}>
          {[
            { icon: 'timer-outline',           color: C.nebula, value: `${Math.floor(totalFocus/60)}h ${totalFocus%60}m`, label: 'Focus Time' },
            { icon: 'checkmark-circle-outline', color: C.pulse,  value: String(totalSess),                                label: 'Sessions'   },
            { icon: 'ban-outline',             color: C.alert,  value: String(totalBlocked),                             label: 'Blocked'    },
          ].map(({ icon, color, value, label }) => (
            <LinearGradient key={label} colors={[`${color}22`, `${color}05`] as [string,string]}
              style={[styles.summCard, { borderColor: `${color}30` }]}>
              <Ionicons name={icon as any} size={18} color={color} />
              <Txt size="lg" weight="extrabold" color={color}>{value}</Txt>
              <Txt size="xs" color={C.mist} align="center">{label}</Txt>
            </LinearGradient>
          ))}
        </View>

        {/* Focus chart */}
        <Card style={styles.chartCard} gap="md">
          <Row>
            <Txt size="md" weight="bold" style={{ flex: 1 }}>Focus Minutes</Txt>
            <Txt size="xs" color={C.mist}>avg {Math.round(totalFocus / Math.max(last7.length,1))}m</Txt>
          </Row>
          <View style={styles.chart}>
            {last7.map((r, i) => {
              const h = Math.max((r.focusMinutes / maxFocus) * CHART_H, 4);
              const isToday = i === last7.length - 1;
              return (
                <View key={i} style={styles.barCol}>
                  {r.focusMinutes > 0 && <Txt size="xs" color={C.mist} style={{ marginBottom: 2 }}>{r.focusMinutes}</Txt>}
                  <View style={styles.barTrack}>
                    <LinearGradient
                      colors={isToday ? [C.nebulaBright, C.nebula] : [`${C.nebula}66`, `${C.nebula}33`] as [string,string]}
                      style={[styles.bar, { height: h }]}
                    />
                  </View>
                  <Txt size="xs" color={isToday ? C.nebula : C.mist} weight={isToday ? 'bold' : 'regular'}>
                    {DAYS[new Date(r.date).getDay()]}
                  </Txt>
                </View>
              );
            })}
          </View>
        </Card>

        {/* Blocked chart */}
        <Card style={styles.chartCard} gap="md">
          <Row>
            <Txt size="md" weight="bold" style={{ flex: 1 }}>Attempts Blocked</Txt>
            <Txt size="xs" color={C.mist}>{bypassRate}% bypassed</Txt>
          </Row>
          <View style={styles.chart}>
            {last7.map((r, i) => {
              const h = Math.max((r.openBlocked / maxBlocked) * (CHART_H * 0.7), 4);
              const isToday = i === last7.length - 1;
              return (
                <View key={i} style={styles.barCol}>
                  {r.openBlocked > 0 && <Txt size="xs" color={C.mist} style={{ marginBottom: 2 }}>{r.openBlocked}</Txt>}
                  <View style={styles.barTrack}>
                    <LinearGradient
                      colors={isToday ? [C.alert, `${C.alert}bb`] : [`${C.alert}66`, `${C.alert}33`] as [string,string]}
                      style={[styles.bar, { height: h }]}
                    />
                  </View>
                  <Txt size="xs" color={isToday ? C.alert : C.mist} weight={isToday ? 'bold' : 'regular'}>
                    {DAYS[new Date(r.date).getDay()]}
                  </Txt>
                </View>
              );
            })}
          </View>
        </Card>

        {/* Streak banner */}
        <LinearGradient colors={[`${C.amber}22`, `${C.amber}08`] as [string,string]}
          style={[styles.streakBanner, { borderColor: `${C.amber}44` }]}>
          <Txt size="xxxl">🔥</Txt>
          <View style={{ flex: 1 }}>
            <Txt size="xl" weight="black" color={C.amber}>{streak}-day streak</Txt>
            <Txt size="sm" color={C.mist}>Consistency is the only metric that matters.</Txt>
          </View>
        </LinearGradient>

        {/* App breakdown */}
        {appStats.length > 0 && (
          <>
            <Txt size="xs" weight="bold" color={C.mist} style={styles.sectionLabel}>MOST TARGETED APPS</Txt>
            <Card>
              {appStats.map((app, i) => (
                <View key={app.id}>
                  {i > 0 && <View style={styles.divider} />}
                  <Row style={{ padding: S.md, gap: S.sm }}>
                    <Txt size="xl">{app.icon}</Txt>
                    <Txt size="md" weight="semibold" style={{ flex: 1 }}>{app.name}</Txt>
                    <View style={styles.barSmBg}>
                      <View style={[styles.barSmFill, { width: `${(app.blockedCount / Math.max(appStats[0].blockedCount,1)) * 100}%` }]} />
                    </View>
                    <Txt size="sm" weight="bold" color={C.alert} style={{ minWidth: 20, textAlign: 'right' }}>{app.blockedCount}</Txt>
                  </Row>
                </View>
              ))}
            </Card>
          </>
        )}

        {/* Insights */}
        {insights.length > 0 && (
          <>
            <Txt size="xs" weight="bold" color={C.mist} style={styles.sectionLabel}>OBSERVATIONS</Txt>
            {insights.map((ins, i) => (
              <Card key={i} style={styles.insightRow}>
                <View style={styles.insightDot} />
                <Txt size="sm" color={C.mist} style={{ flex: 1, lineHeight: 20 }}>{ins}</Txt>
              </Card>
            ))}
          </>
        )}

        <Spacer h="xxl" />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.abyss },
  scroll: { padding: S.md, gap: S.sm },
  summaryRow: { flexDirection: 'row', gap: S.sm },
  summCard: { flex: 1, borderRadius: R.md, padding: S.sm, alignItems: 'center', gap: 4, borderWidth: 1 },
  chartCard: { padding: S.md },
  chart: { flexDirection: 'row', alignItems: 'flex-end', gap: S.xs, height: CHART_H + 40 },
  barCol: { flex: 1, alignItems: 'center', justifyContent: 'flex-end', gap: 4 },
  barTrack: { width: '100%', alignItems: 'center', justifyContent: 'flex-end', height: CHART_H },
  bar: { width: '75%', borderRadius: R.xs, minHeight: 4 },
  streakBanner: { flexDirection: 'row', alignItems: 'center', gap: S.md, borderRadius: R.md, padding: S.md, borderWidth: 1 },
  sectionLabel: { marginTop: S.xs, marginLeft: S.xs },
  divider: { height: 1, backgroundColor: C.rim, marginLeft: S.md },
  barSmBg: { width: 80, height: 6, backgroundColor: C.surface, borderRadius: R.full, overflow: 'hidden' },
  barSmFill: { height: '100%', backgroundColor: C.alert, borderRadius: R.full },
  insightRow: { flexDirection: 'row', alignItems: 'flex-start', gap: S.sm, padding: S.md },
  insightDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: C.nebula, marginTop: 7 },
});
