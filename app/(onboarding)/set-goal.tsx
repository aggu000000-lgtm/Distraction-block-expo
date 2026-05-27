import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Txt, Spacer, Btn } from '../../src/ui/primitives';
import { C, S, R } from '../../src/design/tokens';
import { useStore } from '../../src/store';

const GOALS = [
  { minutes: 30,  label: '30 min / day', emoji: '🌱', desc: 'Building the habit' },
  { minutes: 60,  label: '1 hr / day',   emoji: '⚡', desc: 'Solid daily practice' },
  { minutes: 120, label: '2 hrs / day',  emoji: '🔥', desc: 'Serious deep work' },
  { minutes: 180, label: '3+ hrs / day', emoji: '🏆', desc: 'Elite focus regime' },
];

export default function SetGoalScreen() {
  const router = useRouter();
  const completeOnboarding = useStore((s) => s.completeOnboarding);
  const [selected, setSelected] = useState(60);

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.progress}>
        <View style={[styles.dot, { backgroundColor: C.nebula }]} />
        <View style={[styles.line, { backgroundColor: C.nebula }]} />
        <View style={[styles.dot, { backgroundColor: C.nebula }]} />
        <View style={[styles.line, { backgroundColor: C.nebula }]} />
        <View style={[styles.dot, { backgroundColor: C.pulse }]} />
      </View>

      <View style={styles.headerArea}>
        <Txt size="xxl" weight="extrabold">Set your daily goal</Txt>
        <Txt size="sm" color={C.mist} style={{ marginTop: 4 }}>How much time do you want to protect?</Txt>
      </View>

      <View style={styles.goalList}>
        {GOALS.map((g) => (
          <TouchableOpacity
            key={g.minutes}
            style={[styles.goalRow, selected === g.minutes && styles.goalRowActive]}
            onPress={() => setSelected(g.minutes)}
            activeOpacity={0.75}
          >
            <Txt size="xxl">{g.emoji}</Txt>
            <View style={{ flex: 1 }}>
              <Txt size="lg" weight="bold">{g.label}</Txt>
              <Txt size="sm" color={C.mist}>{g.desc}</Txt>
            </View>
            <View style={selected === g.minutes ? styles.radioOn : styles.radioOff}>
              {selected === g.minutes && <View style={styles.radioFill} />}
            </View>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.footer}>
        <Btn
          label="Start protecting my focus →"
          onPress={() => { completeOnboarding(); router.replace('/(tabs)/home'); }}
        />
        <Spacer h="xs" />
        <Txt size="xs" color={C.shadow} align="center">Your data never leaves this device.</Txt>
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
  goalList: { flex: 1, paddingHorizontal: S.md, gap: S.sm },
  goalRow: { flexDirection: 'row', alignItems: 'center', gap: S.md, backgroundColor: C.depth, borderRadius: R.md, padding: S.md, borderWidth: 2, borderColor: C.rim },
  goalRowActive: { borderColor: C.nebula, backgroundColor: C.nebulaDim },
  radioOff: { width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: C.rim },
  radioOn: { width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: C.nebula, alignItems: 'center', justifyContent: 'center' },
  radioFill: { width: 10, height: 10, borderRadius: 5, backgroundColor: C.nebula },
  footer: { padding: S.md, paddingBottom: S.xl, borderTopWidth: 1, borderTopColor: C.rim },
});
