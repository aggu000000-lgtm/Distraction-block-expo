import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Txt, Spacer, Btn } from '../../src/ui/primitives';
import { C, S, R } from '../../src/design/tokens';
import { useStore } from '../../src/store';

export default function WelcomeScreen() {
  const router = useRouter();
  const completeOnboarding = useStore((s) => s.completeOnboarding);

  return (
    <SafeAreaView style={styles.safe}>
      <LinearGradient colors={[C.void, C.abyss, '#12102a']} style={StyleSheet.absoluteFillObject} />
      <View style={[styles.orb, { top: -60, left: -60, width: 280, height: 280, borderRadius: 140, backgroundColor: `${C.nebula}18` }]} />
      <View style={[styles.orb, { bottom: 120, right: -40, width: 200, height: 200, borderRadius: 100, backgroundColor: `${C.pulse}0d` }]} />

      <View style={styles.content}>
        <View style={styles.hero}>
          <View style={styles.shieldBox}>
            <Txt size="display" align="center">🛡️</Txt>
          </View>
          <Spacer h="lg" />
          <Txt size="xxxl" weight="black" align="center">FocusGuard</Txt>
          <Spacer h="sm" />
          <Txt size="lg" color={C.mist} align="center" weight="medium">
            The distraction blocker that{'\n'}respects your intelligence.
          </Txt>
        </View>

        <View style={styles.features}>
          {[
            { emoji: '🔒', text: 'Friction-based blocking — not walls' },
            { emoji: '📊', text: 'Honest data about your attention' },
            { emoji: '🔥', text: 'Streaks that mean something' },
          ].map(({ emoji, text }) => (
            <View key={text} style={styles.featureRow}>
              <View style={styles.featureIcon}><Txt size="lg">{emoji}</Txt></View>
              <Txt size="md" color={C.mist} weight="medium" style={{ flex: 1 }}>{text}</Txt>
            </View>
          ))}
        </View>

        <View>
          <Btn label="Get Started →" onPress={() => router.push('/(onboarding)/pick-apps')} />
          <Spacer h="sm" />
          <TouchableOpacity
            style={styles.skipBtn}
            onPress={() => { completeOnboarding(); router.replace('/(tabs)/home'); }}
          >
            <Txt size="sm" color={C.shadow}>Skip — use defaults</Txt>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.void },
  orb: { position: 'absolute' },
  content: { flex: 1, paddingHorizontal: S.lg, justifyContent: 'space-between', paddingTop: S.xxl, paddingBottom: S.lg },
  hero: { alignItems: 'center' },
  shieldBox: { width: 100, height: 100, backgroundColor: C.nebulaDim, borderRadius: R.xl, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: `${C.nebula}44` },
  features: { gap: S.md },
  featureRow: { flexDirection: 'row', alignItems: 'center', gap: S.md, backgroundColor: C.depth, borderRadius: R.md, padding: S.md, borderWidth: 1, borderColor: C.rim },
  featureIcon: { width: 44, height: 44, backgroundColor: C.surface, borderRadius: R.sm, alignItems: 'center', justifyContent: 'center' },
  skipBtn: { alignItems: 'center', paddingVertical: S.sm },
});
