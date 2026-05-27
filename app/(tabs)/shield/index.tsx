import { View, StyleSheet, FlatList, TouchableOpacity, Switch, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState, useMemo } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { Txt, Card, Pill, Spacer, Row, Divider, EmptyState, ScreenHeader } from '../../../src/ui/primitives';
import { C, S, R, F } from '../../../src/design/tokens';
import { useStore } from '../../../src/store';
import { TrackedApp } from '../../../src/types/domain';

const CATS = ['All', 'Social', 'Video', 'Chat', 'Gaming', 'News', 'Shopping'];

export default function ShieldScreen() {
  const { apps, rules, toggleApp, removeApp, toggleRule } = useStore();
  const [search, setSearch] = useState('');
  const [cat, setCat] = useState('All');
  const [tab, setTab] = useState<'apps' | 'rules'>('apps');

  const filtered = useMemo(() =>
    apps.filter((a) =>
      a.name.toLowerCase().includes(search.toLowerCase()) &&
      (cat === 'All' || a.category === cat)
    ), [apps, search, cat]);

  const blockedCount = apps.filter((a) => a.isBlocked).length;
  const pct = Math.round((blockedCount / Math.max(apps.length, 1)) * 100);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScreenHeader title="Shield" subtitle={`${blockedCount} of ${apps.length} apps protected`} />

      {/* Tab row */}
      <View style={styles.tabRow}>
        {(['apps', 'rules'] as const).map((t) => (
          <TouchableOpacity key={t} style={[styles.tabBtn, tab === t && styles.tabBtnActive]} onPress={() => setTab(t)}>
            <Txt size="sm" weight="semibold" color={tab === t ? C.nebula : C.mist}>
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </Txt>
          </TouchableOpacity>
        ))}
      </View>

      {tab === 'apps' ? (
        <>
          <View style={styles.searchWrap}>
            <Ionicons name="search" size={16} color={C.shadow} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search apps..." placeholderTextColor={C.shadow}
              value={search} onChangeText={setSearch}
            />
            {search.length > 0 && (
              <TouchableOpacity onPress={() => setSearch('')}>
                <Ionicons name="close-circle" size={18} color={C.shadow} />
              </TouchableOpacity>
            )}
          </View>

          <FlatList
            data={CATS} horizontal showsHorizontalScrollIndicator={false}
            keyExtractor={(i) => i} contentContainerStyle={styles.catList}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[styles.catChip, cat === item && styles.catChipActive]}
                onPress={() => setCat(item)}
              >
                <Txt size="xs" weight="semibold" color={cat === item ? C.nebula : C.mist}>{item}</Txt>
              </TouchableOpacity>
            )}
          />

          <View style={styles.progressWrap}>
            <View style={styles.progressBg}>
              <View style={[styles.progressFill, { width: `${pct}%` }]} />
            </View>
            <Txt size="xs" color={C.mist} style={{ minWidth: 72 }}>{pct}% protected</Txt>
          </View>

          <FlatList
            data={filtered}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.list}
            ItemSeparatorComponent={() => <Spacer h="xs" />}
            ListEmptyComponent={<EmptyState emoji="🔍" title="No apps found" />}
            renderItem={({ item }) => (
              <Card style={styles.appRow}>
                <Txt size="xxl">{item.icon}</Txt>
                <View style={{ flex: 1 }}>
                  <Txt size="md" weight="semibold">{item.name}</Txt>
                  <Txt size="xs" color={C.mist}>{item.category}</Txt>
                </View>
                {item.isBlocked && <Pill label="Blocked" color={C.alert} bg={C.alertDim} />}
                <Switch
                  value={item.isBlocked} onValueChange={() => toggleApp(item.id)}
                  trackColor={{ false: C.surface, true: `${C.nebula}55` }}
                  thumbColor={item.isBlocked ? C.nebula : C.shadow}
                  ios_backgroundColor={C.surface}
                />
                <TouchableOpacity
                  onPress={() => Alert.alert(`Remove "${item.name}"?`, '', [
                    { text: 'Cancel', style: 'cancel' },
                    { text: 'Remove', style: 'destructive', onPress: () => removeApp(item.id) },
                  ])}
                  hitSlop={{ top: 12, bottom: 12, left: 8, right: 8 }}
                >
                  <Ionicons name="trash-outline" size={16} color={C.shadow} />
                </TouchableOpacity>
              </Card>
            )}
          />
        </>
      ) : (
        <FlatList
          data={rules}
          keyExtractor={(r) => r.id}
          contentContainerStyle={styles.list}
          ItemSeparatorComponent={() => <Spacer h="sm" />}
          ListEmptyComponent={<EmptyState emoji="📋" title="No rules yet" subtitle="Rules let you block apps on a schedule" />}
          renderItem={({ item: rule }) => (
            <Card style={{ padding: S.md }} gap="sm">
              <Row>
                <View style={styles.ruleEmoji}><Txt size="xl">{rule.emoji}</Txt></View>
                <View style={{ flex: 1 }}>
                  <Txt size="md" weight="bold">{rule.name}</Txt>
                  <Txt size="xs" color={C.mist}>
                    {rule.condition.type === 'schedule'
                      ? `${rule.condition.from}–${rule.condition.to} · ${rule.appIds.length} apps`
                      : rule.condition.type === 'session'
                      ? `During sessions · ${rule.appIds.length} apps`
                      : `Always · ${rule.appIds.length} apps`}
                  </Txt>
                </View>
                <Switch
                  value={rule.isActive} onValueChange={() => toggleRule(rule.id)}
                  trackColor={{ false: C.surface, true: `${C.nebula}55` }}
                  thumbColor={rule.isActive ? C.nebula : C.shadow}
                  ios_backgroundColor={C.surface}
                />
              </Row>
              <Divider />
              <Pill
                label={`${rule.friction.charAt(0).toUpperCase() + rule.friction.slice(1)} friction`}
                color={rule.friction === 'locked' || rule.friction === 'hard' ? C.alert : rule.friction === 'medium' ? C.nebula : C.amber}
                bg={rule.friction === 'locked' || rule.friction === 'hard' ? C.alertDim : rule.friction === 'medium' ? C.nebulaDim : C.amberDim}
              />
            </Card>
          )}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.abyss },
  tabRow: { flexDirection: 'row', marginHorizontal: S.md, marginBottom: S.sm, backgroundColor: C.depth, borderRadius: R.md, padding: 4, borderWidth: 1, borderColor: C.rim },
  tabBtn: { flex: 1, alignItems: 'center', paddingVertical: S.sm, borderRadius: R.sm },
  tabBtnActive: { backgroundColor: C.nebulaDim },
  searchWrap: { flexDirection: 'row', alignItems: 'center', backgroundColor: C.surface, borderRadius: R.md, marginHorizontal: S.md, marginBottom: S.sm, paddingHorizontal: S.sm, height: 44, borderWidth: 1, borderColor: C.rim, gap: S.sm },
  searchInput: { flex: 1, color: C.frost, fontSize: F.md },
  catList: { paddingHorizontal: S.md, gap: S.xs, paddingBottom: S.sm },
  catChip: { paddingHorizontal: S.md, paddingVertical: 6, borderRadius: R.full, backgroundColor: C.depth, borderWidth: 1, borderColor: C.rim },
  catChipActive: { backgroundColor: C.nebulaDim, borderColor: C.nebula },
  progressWrap: { flexDirection: 'row', alignItems: 'center', gap: S.sm, paddingHorizontal: S.md, marginBottom: S.sm },
  progressBg: { flex: 1, height: 5, backgroundColor: C.surface, borderRadius: R.full, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: C.nebula, borderRadius: R.full },
  list: { paddingHorizontal: S.md, paddingBottom: 100 },
  appRow: { flexDirection: 'row', alignItems: 'center', gap: S.sm, padding: S.md },
  ruleEmoji: { width: 42, height: 42, backgroundColor: C.surface, borderRadius: R.sm, alignItems: 'center', justifyContent: 'center' },
});
