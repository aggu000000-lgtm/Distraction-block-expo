import { View, StyleSheet, ScrollView, TouchableOpacity, Switch, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Txt, Card, Spacer, Divider, ScreenHeader } from '../../../src/ui/primitives';
import { C, S, R } from '../../../src/design/tokens';
import { useStore } from '../../../src/store';

export default function ProfileScreen() {
  const { streak, sessions, focusGoalMinutes, isShieldActive, toggleShield, achievements } = useStore();
  const [notifs, setNotifs]   = useState(true);
  const [breaks, setBreaks]   = useState(true);
  const [strict, setStrict]   = useState(false);
  const [haptics, setHaptics] = useState(true);

  const totalMinutes = sessions.filter((s) => s.outcome === 'completed').reduce((sum, s) => sum + s.plannedMinutes, 0);
  const totalHours = Math.floor(totalMinutes / 60);
  const completionRate = sessions.length > 0
    ? Math.round((sessions.filter((s) => s.outcome === 'completed').length / sessions.length) * 100)
    : 0;

  const sections = [
    {
      label: 'PROTECTION',
      rows: [
        { icon: 'shield-checkmark', color: isShieldActive ? C.pulse : C.shadow, label: 'App Blocking', sub: isShieldActive ? 'Shield is active' : 'Shield is off', toggle: isShieldActive, onToggle: toggleShield },
        { icon: 'lock-closed', color: C.alert, label: 'Strict Mode', sub: 'Cannot disable during sessions', toggle: strict, onToggle: setStrict },
      ],
    },
    {
      label: 'NOTIFICATIONS',
      rows: [
        { icon: 'notifications', color: C.amber, label: 'Notifications', sub: 'Streak alerts & session reminders', toggle: notifs, onToggle: setNotifs },
        { icon: 'cafe', color: C.pulse, label: 'Break Reminders', sub: 'Remind you to rest every hour', toggle: breaks, onToggle: setBreaks },
      ],
    },
    {
      label: 'PREFERENCES',
      rows: [
        { icon: 'phone-portrait', color: C.nebula, label: 'Haptic Feedback', sub: 'Tactile response on interactions', toggle: haptics, onToggle: setHaptics },
        { icon: 'flag', color: C.pulse, label: 'Daily Focus Goal', sub: `${focusGoalMinutes} minutes`, chevron: true, onPress: () => Alert.alert('Coming in v1.1', 'Goal editor is on the roadmap.') },
        { icon: 'timer', color: C.nebula, label: 'Default Session', sub: '25 minutes (Pomodoro)', chevron: true, onPress: () => Alert.alert('Coming in v1.1', 'Session editor is on the roadmap.') },
      ],
    },
    {
      label: 'ABOUT',
      rows: [
        { icon: 'information-circle', color: C.mist, label: 'App Version', sub: '1.0.0' },
        { icon: 'star', color: C.amber, label: 'Rate FocusGuard', chevron: true, onPress: () => Alert.alert('Thank you! ⭐', 'Rating available once on the App Store.') },
        { icon: 'trash', color: C.alert, label: 'Reset All Data', danger: true, onPress: () => Alert.alert('Reset All Data?', 'Permanently delete everything.', [{ text: 'Cancel', style: 'cancel' }, { text: 'Reset', style: 'destructive' }]) },
      ],
    },
  ];

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <ScreenHeader title="Profile" />

        {/* Stats hero */}
        <Card style={styles.hero} gap="md">
          <View style={styles.statsRow}>
            {[
              { v: String(totalHours), l: 'Total Hours', c: C.nebula },
              { v: String(streak),     l: 'Day Streak 🔥', c: C.amber },
              { v: `${completionRate}%`, l: 'Completion', c: C.pulse },
            ].map(({ v, l, c }, i, arr) => (
              <View key={l} style={{ flexDirection: 'row', flex: 1 }}>
                <View style={styles.statBlock}>
                  <Txt size="xxxl" weight="black" color={c}>{v}</Txt>
                  <Txt size="xs" color={C.mist} align="center">{l}</Txt>
                </View>
                {i < arr.length - 1 && <View style={styles.statDiv} />}
              </View>
            ))}
          </View>
        </Card>

        {/* Achievements */}
        <Txt size="xs" weight="bold" color={C.mist} style={styles.sectionLabel}>ACHIEVEMENTS</Txt>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.achList}>
          {achievements.map((a) => (
            <View key={a.id} style={[styles.achCard, !a.unlockedAt && styles.achLocked]}>
              <Txt size="xxl" style={{ opacity: a.unlockedAt ? 1 : 0.25 }}>{a.emoji}</Txt>
              <Txt size="xs" weight={a.unlockedAt ? 'bold' : 'regular'} color={a.unlockedAt ? C.frost : C.shadow} align="center" numberOfLines={1}>{a.label}</Txt>
            </View>
          ))}
        </ScrollView>

        {/* Settings sections */}
        {sections.map(({ label, rows }) => (
          <View key={label}>
            <Txt size="xs" weight="bold" color={C.mist} style={styles.sectionLabel}>{label}</Txt>
            <Card>
              {rows.map((row, i) => (
                <View key={row.label}>
                  {i > 0 && <Divider indent={S.md + 36 + S.md} />}
                  <TouchableOpacity
                    style={styles.row}
                    onPress={(row as any).onPress}
                    activeOpacity={(row as any).onPress ? 0.7 : 1}
                  >
                    <View style={[styles.rowIcon, { backgroundColor: `${row.color}20` }]}>
                      <Ionicons name={row.icon as any} size={18} color={row.color} />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Txt size="md" weight="semibold" color={(row as any).danger ? C.alert : C.frost}>{row.label}</Txt>
                      {(row as any).sub && <Txt size="xs" color={C.mist}>{(row as any).sub}</Txt>}
                    </View>
                    {(row as any).toggle !== undefined && (
                      <Switch
                        value={(row as any).toggle}
                        onValueChange={(row as any).onToggle}
                        trackColor={{ false: C.surface, true: `${C.nebula}55` }}
                        thumbColor={(row as any).toggle ? C.nebula : C.shadow}
                        ios_backgroundColor={C.surface}
                      />
                    )}
                    {(row as any).chevron && <Ionicons name="chevron-forward" size={16} color={C.shadow} />}
                  </TouchableOpacity>
                </View>
              ))}
            </Card>
          </View>
        ))}

        <Txt size="xs" color={C.shadow} align="center" style={{ marginTop: S.lg }}>
          Made with intention · FocusGuard v1.0{'\n'}Your data never leaves this device.
        </Txt>
        <Spacer h="xxl" />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.abyss },
  scroll: { padding: S.md, gap: S.sm },
  hero: { padding: S.lg },
  statsRow: { flexDirection: 'row', alignItems: 'center' },
  statBlock: { flex: 1, alignItems: 'center', gap: 4 },
  statDiv: { width: 1, height: 48, backgroundColor: C.rim },
  sectionLabel: { marginTop: S.xs, marginLeft: S.xs },
  achList: { gap: S.sm, paddingHorizontal: S.xs },
  achCard: { width: 76, height: 84, backgroundColor: C.depth, borderRadius: R.md, alignItems: 'center', justifyContent: 'center', gap: S.xs, borderWidth: 1, borderColor: C.rim, padding: S.xs },
  achLocked: { borderColor: C.fog, opacity: 0.55 },
  row: { flexDirection: 'row', alignItems: 'center', padding: S.md, gap: S.md },
  rowIcon: { width: 36, height: 36, borderRadius: R.sm, alignItems: 'center', justifyContent: 'center' },
});
