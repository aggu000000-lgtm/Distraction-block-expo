import { View, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Txt, Spacer, Btn } from '../../src/ui/primitives';
import { C, S, R } from '../../src/design/tokens';
import { useStore } from '../../src/store';

export default function PickAppsScreen() {
  const router = useRouter();
  const { apps, toggleApp } = useStore();
  const blocked = apps.filter((a) => a.isBlocked);

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.progress}>
        <View style={[styles.dot, { backgroundColor: C.nebula }]} />
        <View style={[styles.line]} /><View style={styles.dot} />
        <View style={styles.line} /><View style={styles.dot} />
      </View>

      <View style={styles.headerArea}>
        <Txt size="xxl" weight="extrabold">What drains you?</Txt>
        <Txt size="sm" color={C.mist} style={{ marginTop: 4 }}>Select every app that steals your focus. Be honest.</Txt>
        <View style={styles.countBadge}>
          <Ionicons name="ban" size={13} color={C.alert} />
          <Txt size="xs" weight="bold" color={C.alert}>{blocked.length} selected</Txt>
        </View>
      </View>

      <FlatList
        data={apps}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.grid}
        columnWrapperStyle={{ gap: S.sm }}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.tile, item.isBlocked && styles.tileActive]}
            onPress={() => toggleApp(item.id)}
            activeOpacity={0.75}
          >
            <Txt size="xxl">{item.icon}</Txt>
            <Spacer h="xs" />
            <Txt size="sm" weight="semibold" align="center" numberOfLines={1}>{item.name}</Txt>
            <Txt size="xs" color={C.mist} align="center">{item.category}</Txt>
            {item.isBlocked && (
              <View style={styles.check}>
                <Ionicons name="checkmark-circle" size={18} color={C.nebula} />
              </View>
            )}
          </TouchableOpacity>
        )}
      />

      <View style={styles.footer}>
        <Btn
          label={`Continue — ${blocked.length} apps blocked`}
          onPress={() => router.push('/(onboarding)/set-goal')}
          disabled={blocked.length === 0}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.abyss },
  progress: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: S.xl, paddingTop: S.md },
  dot: { width: 10, height: 10, borderRadius: 5, backgroundColor: C.rim },
  line: { flex: 1, height: 2, backgroundColor: C.rim },
  headerArea: { paddingHorizontal: S.md, paddingVertical: S.md },
  countBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: C.alertDim, alignSelf: 'flex-start', paddingHorizontal: S.sm, paddingVertical: 4, borderRadius: R.full, borderWidth: 1, borderColor: `${C.alert}33`, marginTop: S.sm },
  grid: { paddingHorizontal: S.md, paddingBottom: 120, gap: S.sm },
  tile: { flex: 1, backgroundColor: C.depth, borderRadius: R.md, padding: S.md, alignItems: 'center', borderWidth: 2, borderColor: C.rim, position: 'relative', minHeight: 110, justifyContent: 'center' },
  tileActive: { borderColor: C.nebula, backgroundColor: C.nebulaDim },
  check: { position: 'absolute', top: 8, right: 8 },
  footer: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: S.md, paddingBottom: S.xl, backgroundColor: C.abyss, borderTopWidth: 1, borderTopColor: C.rim },
});
