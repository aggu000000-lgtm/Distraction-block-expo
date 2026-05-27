import { View, Text, StyleSheet, FlatList, TouchableOpacity, Switch, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useState, useMemo } from 'react';
import { COLORS, FONT, RADIUS, SPACING } from '../../constants/theme';
import { useStore, BlockedApp } from '../../store/useStore';

const CATEGORIES = ['All', 'Social', 'Video', 'Chat', 'Gaming', 'News'];

export default function BlockListScreen() {
  const { state, toggleApp, removeApp } = useStore();
  const [search, setSearch] = useState('');
  const [selectedCat, setSelectedCat] = useState('All');

  const filtered = useMemo(() => {
    return state.blockedApps.filter((app) => {
      const matchSearch = app.name.toLowerCase().includes(search.toLowerCase());
      const matchCat = selectedCat === 'All' || app.category === selectedCat;
      return matchSearch && matchCat;
    });
  }, [state.blockedApps, search, selectedCat]);

  const blockedCount = state.blockedApps.filter((a) => a.isBlocked).length;

  const handleRemove = (app: BlockedApp) => {
    Alert.alert('Remove App', `Remove "${app.name}" from the list?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Remove', style: 'destructive', onPress: () => removeApp(app.id) },
    ]);
  };

  const renderApp = ({ item }: { item: BlockedApp }) => (
    <View style={styles.appCard}>
      <Text style={styles.appEmoji}>{item.icon}</Text>
      <View style={styles.appInfo}>
        <Text style={styles.appName}>{item.name}</Text>
        <View style={styles.catPill}>
          <Text style={styles.catText}>{item.category}</Text>
        </View>
      </View>
      <View style={styles.appActions}>
        <Switch
          value={item.isBlocked}
          onValueChange={() => toggleApp(item.id)}
          trackColor={{ false: COLORS.surfaceAlt, true: COLORS.accentGlow }}
          thumbColor={item.isBlocked ? COLORS.accent : COLORS.textMuted}
          ios_backgroundColor={COLORS.surfaceAlt}
        />
        <TouchableOpacity onPress={() => handleRemove(item)} style={styles.removeBtn} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
          <Ionicons name="trash-outline" size={16} color={COLORS.textMuted} />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Block List</Text>
          <Text style={styles.subtitle}>{blockedCount} of {state.blockedApps.length} apps blocked</Text>
        </View>
        <View style={styles.headerBadge}>
          <Ionicons name="ban" size={14} color={COLORS.danger} />
          <Text style={styles.headerBadgeText}>{blockedCount} active</Text>
        </View>
      </View>

      {/* Search */}
      <View style={styles.searchWrap}>
        <Ionicons name="search" size={16} color={COLORS.textMuted} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search apps..."
          placeholderTextColor={COLORS.textMuted}
          value={search}
          onChangeText={setSearch}
        />
        {search.length > 0 && (
          <TouchableOpacity onPress={() => setSearch('')}>
            <Ionicons name="close-circle" size={18} color={COLORS.textMuted} />
          </TouchableOpacity>
        )}
      </View>

      {/* Category Filter */}
      <View style={styles.catScroll}>
        {CATEGORIES.map((cat) => (
          <TouchableOpacity
            key={cat}
            style={[styles.catChip, selectedCat === cat && styles.catChipActive]}
            onPress={() => setSelectedCat(cat)}
          >
            <Text style={[styles.catChipText, selectedCat === cat && styles.catChipTextActive]}>
              {cat}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Progress Bar */}
      <View style={styles.progressWrap}>
        <View style={styles.progressBg}>
          <View style={[styles.progressFill, { width: `${(blockedCount / Math.max(state.blockedApps.length, 1)) * 100}%` }]} />
        </View>
        <Text style={styles.progressLabel}>{Math.round((blockedCount / Math.max(state.blockedApps.length, 1)) * 100)}% protected</Text>
      </View>

      {/* List */}
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={renderApp}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyIcon}>🔍</Text>
            <Text style={styles.emptyText}>No apps found</Text>
          </View>
        }
      />

      {/* Add Button */}
      <View style={styles.addWrap}>
        <TouchableOpacity style={styles.addBtn} activeOpacity={0.85}>
          <Ionicons name="add" size={20} color={COLORS.white} />
          <Text style={styles.addBtnText}>Add App to Block</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bg },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: SPACING.md, paddingTop: SPACING.md, paddingBottom: SPACING.sm },
  title: { color: COLORS.text, fontSize: FONT.xxl, fontWeight: '800' },
  subtitle: { color: COLORS.textSub, fontSize: FONT.sm, marginTop: 2 },
  headerBadge: { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: COLORS.dangerSoft, paddingHorizontal: 10, paddingVertical: 5, borderRadius: RADIUS.full },
  headerBadgeText: { color: COLORS.danger, fontSize: FONT.xs, fontWeight: '700' },

  searchWrap: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.surface, borderRadius: RADIUS.md, marginHorizontal: SPACING.md, marginBottom: SPACING.sm, paddingHorizontal: SPACING.sm, height: 44, borderWidth: 1, borderColor: COLORS.border },
  searchIcon: { marginRight: 8 },
  searchInput: { flex: 1, color: COLORS.text, fontSize: FONT.md },

  catScroll: { flexDirection: 'row', paddingHorizontal: SPACING.md, gap: SPACING.xs, marginBottom: SPACING.sm, flexWrap: 'nowrap' },
  catChip: { paddingHorizontal: 14, paddingVertical: 6, borderRadius: RADIUS.full, backgroundColor: COLORS.surface, borderWidth: 1, borderColor: COLORS.border },
  catChipActive: { backgroundColor: COLORS.accentSoft, borderColor: COLORS.accent },
  catChipText: { color: COLORS.textSub, fontSize: FONT.sm, fontWeight: '600' },
  catChipTextActive: { color: COLORS.accent },

  progressWrap: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, paddingHorizontal: SPACING.md, marginBottom: SPACING.sm },
  progressBg: { flex: 1, height: 6, backgroundColor: COLORS.surface, borderRadius: RADIUS.full, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: COLORS.accent, borderRadius: RADIUS.full },
  progressLabel: { color: COLORS.textSub, fontSize: FONT.xs, fontWeight: '600', minWidth: 80 },

  list: { paddingHorizontal: SPACING.md, paddingBottom: 100 },
  appCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.surface, borderRadius: RADIUS.md, padding: SPACING.md, gap: SPACING.sm, borderWidth: 1, borderColor: COLORS.border },
  appEmoji: { fontSize: 28, width: 40, textAlign: 'center' },
  appInfo: { flex: 1, gap: 4 },
  appName: { color: COLORS.text, fontSize: FONT.md, fontWeight: '600' },
  catPill: { alignSelf: 'flex-start', backgroundColor: COLORS.bg, paddingHorizontal: 8, paddingVertical: 2, borderRadius: RADIUS.full },
  catText: { color: COLORS.textMuted, fontSize: FONT.xs, fontWeight: '500' },
  appActions: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm },
  removeBtn: { padding: 4 },
  separator: { height: SPACING.sm },

  empty: { alignItems: 'center', paddingTop: SPACING.xxl },
  emptyIcon: { fontSize: 48, marginBottom: SPACING.sm },
  emptyText: { color: COLORS.textSub, fontSize: FONT.md },

  addWrap: { position: 'absolute', bottom: SPACING.lg, left: SPACING.md, right: SPACING.md },
  addBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: SPACING.sm, backgroundColor: COLORS.accent, borderRadius: RADIUS.md, padding: SPACING.md, elevation: 8, shadowColor: COLORS.accent, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.4, shadowRadius: 12 },
  addBtnText: { color: COLORS.white, fontSize: FONT.md, fontWeight: '700' },
});
