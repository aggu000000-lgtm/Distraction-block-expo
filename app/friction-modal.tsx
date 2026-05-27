import { View, StyleSheet, TouchableOpacity, Modal, Platform } from 'react-native';
import { useEffect, useState, useRef } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { Txt, Btn, Spacer, Row } from '../src/ui/primitives';
import { C, S, R } from '../src/design/tokens';
import { useStore } from '../src/store';

const DELAY = 5;

export default function FrictionModal() {
  const { frictionModalApp, frictionDecision, apps, events, dismissFriction } = useStore();
  const [countdown, setCountdown] = useState(DELAY);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const app = apps.find((a) => a.id === frictionModalApp);
  const visible = !!(frictionModalApp && frictionDecision);

  useEffect(() => {
    if (visible) {
      setCountdown(DELAY);
      timerRef.current = setInterval(() => {
        setCountdown((c) => { if (c <= 1) { clearInterval(timerRef.current!); return 0; } return c - 1; });
      }, 1000);
    }
    return () => clearInterval(timerRef.current!);
  }, [visible, frictionModalApp]);

  if (!visible || !app || !frictionDecision || !frictionDecision.blocked) return null;

  const { friction, ruleName } = frictionDecision;
  const todayStart = new Date().setHours(0, 0, 0, 0);
  const openCount = events.filter((e) => e.appId === app.id && e.timestamp >= todayStart).length;

  return (
    <Modal transparent animationType="fade" visible={visible} statusBarTranslucent>
      <View style={styles.overlay}>
        <TouchableOpacity
          style={StyleSheet.absoluteFillObject}
          activeOpacity={1}
          onPress={friction === 'locked' ? undefined : () => dismissFriction(false)}
        />

        <View style={styles.sheet}>
          {/* Handle */}
          <View style={styles.handle} />

          {/* App */}
          <View style={styles.appBadge}><Txt size="xxxl">{app.icon}</Txt></View>
          <Spacer h="sm" />
          <Txt size="xxl" weight="black" align="center">{app.name}</Txt>
          <Txt size="sm" color={C.mist} align="center">
            Blocked by <Txt size="sm" color={C.nebula} weight="semibold">{ruleName}</Txt>
          </Txt>
          <Spacer h="lg" />

          {/* Friction content */}
          {friction === 'soft' && (
            <>
              <View style={styles.countBadge}>
                <Ionicons name="eye" size={16} color={C.amber} />
                <Txt size="md" weight="bold" color={C.amber}>{openCount}</Txt>
                <Txt size="sm" color={C.mist}>times today</Txt>
              </View>
              <Spacer h="lg" />
              <Btn label="Stay Focused" onPress={() => dismissFriction(false)} />
              <Spacer h="xs" />
              <TouchableOpacity onPress={() => dismissFriction(true)} style={styles.bypassBtn}>
                <Txt size="sm" color={C.shadow}>Open anyway</Txt>
              </TouchableOpacity>
            </>
          )}

          {friction === 'medium' && (
            <>
              <Txt size="sm" color={C.mist} align="center" style={{ lineHeight: 22 }}>
                Take a breath.{'\n'}What were you actually working on?
              </Txt>
              <Spacer h="lg" />
              <View style={[styles.countdownRing, countdown === 0 && { borderColor: C.alert }]}>
                <Txt size="xxl" weight="black" color={countdown === 0 ? C.alert : C.mist}>{countdown}</Txt>
              </View>
              <Spacer h="lg" />
              <Btn label="Stay Focused" onPress={() => dismissFriction(false)} />
              <Spacer h="xs" />
              <TouchableOpacity
                onPress={() => countdown === 0 && dismissFriction(true)}
                style={[styles.bypassBtn, countdown > 0 && { opacity: 0.3 }]}
                disabled={countdown > 0}
              >
                <Txt size="sm" color={C.alert}>
                  {countdown > 0 ? `Open anyway in ${countdown}s` : 'Open anyway'}
                </Txt>
              </TouchableOpacity>
            </>
          )}

          {friction === 'hard' && (
            <>
              <Txt size="sm" color={C.mist} align="center">4-7-8 Breathing Exercise</Txt>
              <Spacer h="md" />
              <BreathingCircle />
              <Spacer h="lg" />
              <Btn label="I'm calm. Stay focused." onPress={() => dismissFriction(false)} />
              <Spacer h="xs" />
              <TouchableOpacity
                onPress={() => countdown === 0 && dismissFriction(true)}
                style={[styles.bypassBtn, countdown > 0 && { opacity: 0.3 }]}
                disabled={countdown > 0}
              >
                <Txt size="sm" color={C.alert}>
                  {countdown > 0 ? `Open anyway in ${countdown}s` : 'Open anyway'}
                </Txt>
              </TouchableOpacity>
            </>
          )}

          {friction === 'locked' && (
            <>
              <View style={styles.lockBadge}>
                <Ionicons name="lock-closed" size={28} color={C.alert} />
              </View>
              <Spacer h="sm" />
              <Txt size="md" color={C.mist} align="center" style={{ lineHeight: 22 }}>
                This app is <Txt size="md" weight="bold" color={C.alert}>locked</Txt> during your session.{'\n'}
                Complete your session to access it.
              </Txt>
              <Spacer h="lg" />
              <Btn label="Back to Focus" onPress={() => dismissFriction(false)} />
            </>
          )}

          <Spacer h={Platform.OS === 'ios' ? 'lg' : 'md'} />
        </View>
      </View>
    </Modal>
  );
}

function BreathingCircle() {
  const [phase, setPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
  const phaseColor = phase === 'inhale' ? C.pulse : phase === 'hold' ? C.nebula : C.amber;
  const phaseText = phase === 'inhale' ? 'Breathe in...' : phase === 'hold' ? 'Hold...' : 'Breathe out...';

  useEffect(() => {
    const sequence: Array<['inhale' | 'hold' | 'exhale', number]> = [['inhale', 4000], ['hold', 7000], ['exhale', 8000]];
    let idx = 0;
    let t: ReturnType<typeof setTimeout>;
    const next = () => {
      setPhase(sequence[idx][0]);
      t = setTimeout(() => { idx = (idx + 1) % sequence.length; next(); }, sequence[idx][1]);
    };
    next();
    return () => clearTimeout(t);
  }, []);

  return (
    <View style={[styles.breathRing, { borderColor: phaseColor }]}>
      <Txt size="md" weight="bold" color={phaseColor} align="center">{phaseText}</Txt>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(8,8,17,0.88)', justifyContent: 'flex-end' },
  sheet: { backgroundColor: C.depth, borderTopLeftRadius: R.xl, borderTopRightRadius: R.xl, padding: S.lg, alignItems: 'center', borderTopWidth: 1, borderTopColor: C.rim },
  handle: { width: 40, height: 4, borderRadius: 2, backgroundColor: C.rim, marginBottom: S.lg },
  appBadge: { width: 72, height: 72, borderRadius: R.lg, backgroundColor: C.surface, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: C.rim },
  countBadge: { flexDirection: 'row', alignItems: 'center', gap: S.xs, backgroundColor: C.amberDim, borderRadius: R.full, paddingHorizontal: S.md, paddingVertical: S.sm, borderWidth: 1, borderColor: `${C.amber}33` },
  bypassBtn: { paddingVertical: S.sm, paddingHorizontal: S.md },
  countdownRing: { width: 80, height: 80, borderRadius: 40, borderWidth: 3, borderColor: C.rim, alignItems: 'center', justifyContent: 'center' },
  lockBadge: { width: 64, height: 64, borderRadius: R.lg, backgroundColor: C.alertDim, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: `${C.alert}44` },
  breathRing: { width: 140, height: 140, borderRadius: 70, borderWidth: 3, alignItems: 'center', justifyContent: 'center' },
});
