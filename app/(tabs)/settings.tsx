import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { COLORS, FONT, RADIUS, SPACING } from '../../constants/theme';
import { useStore } from '../../store/useStore';

type SettingRowProps = {
  icon: string;
  iconColor: string;
  title: string;
  subtitle?: string;
  right?: React.ReactNode;
  onPress?: () => void;
  danger?: boolean;
};

function SettingRow({ icon, iconColor, title, subtitle, right, onPress, danger }: SettingRowProps) {
  return (
    <TouchableOpacity style={styles.settingRow} onPress={onPress} activeOpacity={onPress ? 0.7 : 1}>
      <View style={[styles.settingIcon, { backgroundColor: `${iconColor}20` }]}>
        <Ionicons name={icon as any} size={18} color={iconColor} />
      </View>
      <View style={styles.settingText}>
        <Text style={[styles.settingTitle, danger && { color: COLORS.danger }]}>{title}</Text>
        {subtitle && <Text style={styles.settingSub}>{subtitle}</Text>}
      </View>
      {right ?? (onPress && <Ionicons name="chevron-forward" size={16} color={COLORS.textMuted} />)}
    </TouchableOpacity>
  );
}

export default function SettingsScreen() {
  const { state, toggleBlocking, toggleRule } = useStore();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [strictMode, setStrictMode] = useState(false);
  const [breakReminders, setBreakReminders] = useState(true);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Settings</Text>
        <Text style={styles.subtitle}>Configure your focus environment</Text>

        {/* Protection */}
        <Text style={styles.sectionLabel}>PROTECTION</Text>
        <View style={styles.section}>
          <SettingRow
            icon="shield-checkmark"
            iconColor={state.isBlockingActive ? COLORS.success : COLORS.textMuted}
            title="App Blocking"
            subtitle={state.isBlockingActive ? 'Currently active — apps are blocked' : 'Disabled — all apps accessible'}
            right={
              <Switch
                value={state.isBlockingActive}
                onValueChange={toggleBlocking}
                trackColor={{ false: COLORS.surfaceAlt, true: COLORS.accentGlow }}
                thumbColor={state.isBlockingActive ? COLORS.accent : COLORS.textMuted}
                ios_backgroundColor={COLORS.surfaceAlt}
              />
            }
          />
          <View style={styles.divider} />
          <SettingRow
            icon="lock-closed"
            iconColor={COLORS.danger}
            title="Strict Mode"
            subtitle="Cannot disable blocking during sessions"
            right={
              <Switch
                value={strictMode}
                onValueChange={setStrictMode}
                trackColor={{ false: COLORS.surfaceAlt, true: COLORS.accentGlow }}
                thumbColor={strictMode ? COLORS.accent : COLORS.textMuted}
                ios_backgroundColor={COLORS.surfaceAlt}
              />
            }
          />
        </View>

        {/* Block Rules */}
        <Text style={styles.sectionLabel}>BLOCK RULES</Text>
        <View style={styles.section}>
          {state.blockRules.map((rule, i) => (
            <View key={rule.id}>
              {i > 0 && <View style={styles.divider} />}
              <View style={styles.ruleRow}>
                <View style={[styles.settingIcon, { backgroundColor: COLORS.accentSoft }]}>
                  <Ionicons name="calendar" size={18} color={COLORS.accent} />
                </View>
                <View style={styles.settingText}>
                  <Text style={styles.settingTitle}>{rule.name}</Text>
                  <Text style={styles.settingSub}>
                    {rule.schedule
                      ? `${rule.schedule.startTime}–${rule.schedule.endTime} • ${rule.apps.length} apps`
                      : `${rule.apps.length} apps`}
                  </Text>
                </View>
                <Switch
                  value={rule.isActive}
                  onValueChange={() => toggleRule(rule.id)}
                  trackColor={{ false: COLORS.surfaceAlt, true: COLORS.accentGlow }}
                  thumbColor={rule.isActive ? COLORS.accent : COLORS.textMuted}
                  ios_backgroundColor={COLORS.surfaceAlt}
                />
              </View>
            </View>
          ))}
          <View style={styles.divider} />
          <TouchableOpacity
            style={styles.addRuleBtn}
            onPress={() => Alert.alert('Coming Soon', 'Custom rule editor coming in the next update!')}
          >
            <Ionicons name="add-circle-outline" size={18} color={COLORS.accent} />
            <Text style={styles.addRuleBtnText}>Add New Rule</Text>
          </TouchableOpacity>
        </View>

        {/* Notifications */}
        <Text style={styles.sectionLabel}>NOTIFICATIONS</Text>
        <View style={styles.section}>
          <SettingRow
            icon="notifications"
            iconColor={COLORS.warning}
            title="Notifications"
            subtitle="Alerts when apps are blocked"
            right={
              <Switch
                value={notificationsEnabled}
                onValueChange={setNotificationsEnabled}
                trackColor={{ false: COLORS.surfaceAlt, true: COLORS.accentGlow }}
                thumbColor={notificationsEnabled ? COLORS.accent : COLORS.textMuted}
                ios_backgroundColor={COLORS.surfaceAlt}
              />
            }
          />
          <View style={styles.divider} />
          <SettingRow
            icon="timer-outline"
            iconColor={COLORS.success}
            title="Break Reminders"
            subtitle="Remind you to take breaks every hour"
            right={
              <Switch
                value={breakReminders}
                onValueChange={setBreakReminders}
                trackColor={{ false: COLORS.surfaceAlt, true: COLORS.accentGlow }}
                thumbColor={breakReminders ? COLORS.accent : COLORS.textMuted}
                ios_backgroundColor={COLORS.surfaceAlt}
              />
            }
          />
        </View>

        {/* Focus Preferences */}
        <Text style={styles.sectionLabel}>FOCUS</Text>
        <View style={styles.section}>
          <SettingRow icon="timer" iconColor={COLORS.accent} title="Default Session Length" subtitle="25 minutes (Pomodoro)" onPress={() => {}} />
          <View style={styles.divider} />
          <SettingRow icon="moon" iconColor={COLORS.accent} title="Wind Down Mode" subtitle="Auto-enable 1 hour before bedtime" onPress={() => {}} />
          <View style={styles.divider} />
          <SettingRow icon="sunny" iconColor={COLORS.warning} title="Morning Routine" subtitle="Block social from 6am–9am" onPress={() => {}} />
        </View>

        {/* About */}
        <Text style={styles.sectionLabel}>ABOUT</Text>
        <View style={styles.section}>
          <SettingRow icon="information-circle" iconColor={COLORS.textSub} title="App Version" subtitle="1.0.0 (Build 1)" />
          <View style={styles.divider} />
          <SettingRow icon="star" iconColor={COLORS.warning} title="Rate FocusGuard" onPress={() => {}} />
          <View style={styles.divider} />
          <SettingRow icon="share-social" iconColor={COLORS.accent} title="Share with Friends" onPress={() => {}} />
          <View style={styles.divider} />
          <SettingRow
            icon="trash"
            iconColor={COLORS.danger}
            title="Reset All Data"
            danger
            onPress={() =>
              Alert.alert('Reset All Data', 'This will delete all your stats, rules, and settings. Are you sure?', [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Reset', style: 'destructive', onPress: () => {} },
              ])
            }
          />
        </View>

        <Text style={styles.footer}>Made with ❤️ · FocusGuard v1.0</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bg },
  content: { padding: SPACING.md, paddingBottom: SPACING.xxl },

  title: { color: COLORS.text, fontSize: FONT.xxl, fontWeight: '800', marginBottom: 4 },
  subtitle: { color: COLORS.textSub, fontSize: FONT.sm, marginBottom: SPACING.lg },

  sectionLabel: { color: COLORS.textMuted, fontSize: FONT.xs, fontWeight: '700', letterSpacing: 1.2, marginBottom: SPACING.xs, marginTop: SPACING.sm, paddingLeft: 4 },
  section: { backgroundColor: COLORS.surface, borderRadius: RADIUS.lg, overflow: 'hidden', marginBottom: SPACING.md, borderWidth: 1, borderColor: COLORS.border },

  settingRow: { flexDirection: 'row', alignItems: 'center', padding: SPACING.md, gap: SPACING.md },
  ruleRow: { flexDirection: 'row', alignItems: 'center', padding: SPACING.md, gap: SPACING.md },
  settingIcon: { width: 36, height: 36, borderRadius: RADIUS.sm, alignItems: 'center', justifyContent: 'center' },
  settingText: { flex: 1 },
  settingTitle: { color: COLORS.text, fontSize: FONT.md, fontWeight: '600' },
  settingSub: { color: COLORS.textSub, fontSize: FONT.xs, marginTop: 2 },

  divider: { height: 1, backgroundColor: COLORS.border, marginLeft: SPACING.md + 36 + SPACING.md },

  addRuleBtn: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, padding: SPACING.md },
  addRuleBtnText: { color: COLORS.accent, fontSize: FONT.md, fontWeight: '600' },

  footer: { color: COLORS.textMuted, fontSize: FONT.xs, textAlign: 'center', marginTop: SPACING.lg },
});
