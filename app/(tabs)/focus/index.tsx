import { View, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState, useEffect, useRef } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { Txt, Spacer, Btn, Card, Row, Pill, ScreenHeader } from '../../../src/ui/primitives';
import { C, S, R, F } from '../../../src/design/tokens';
import { useStore } from '../../../src/store';
import { SESSION_MODES, getModeById } from '../../../src/core/sessions/modes';
import { SessionModeId } from '../../../src/types/domain';

const { width } = Dimensions.get('window');
const RING = Math.min(width * 0.6, 240);

function fmt(sec: number) {
  return `${String(Math.floor(sec / 60)).padStart(2, '0')}:${String(sec % 60).padStart(2, '0')}`;
}

export default function FocusScreen() {
  const { activeSession, startSession, completeSession, abandonSession, sessions, streak } = useStore();
  const [mode, setMode] = useState<SessionModeId>('pomodoro');
  const [intention, setIntention] = useState('');
  const [secondsLeft, setSecondsLeft] = useState(25 * 60);
  const [running, setRunning] = useState(false);
  const [reflect, setReflect] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const modeObj = getModeById(mode);
  const total = modeObj.workMinutes * 60;
  const progress = 1 - secondsLeft / total;

  useEffect(() => {
    if (!running) setSecondsLeft(getModeById(mode).workMinutes * 60);
  }, [mode]);

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setSecondsLeft((s) => {
          if (s <= 1) {
            clearInterval(intervalRef.current!);
            setRunning(false);
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            setReflect(true);
            return 0;
          }
          return s - 1;
        });
      }, 1000);
    } else {
      clearInterval(intervalRef.current!);
    }
    return () => clearInterval(intervalRef.current!);
  }, [running]);

  const totalDone = sessions.filter((s) => s.outcome === 'completed').length;
  const totalMinutes = sessions.filter((s) => s.outcome === 'completed').reduce((sum, s) => sum + s.plannedMinutes, 0);

  if (reflect) {
    return (
      <SafeAreaView style={[styles.safe, { justifyContent: 'center', alignItems: 'center' }]}>
        <LinearGradient colors={[C.void, C.abyss]} style={StyleSheet.absoluteFillObject} />
        <Card style={styles.reflectCard} gap="md">
          <Txt size="xxxl" align="center">🎉</Txt>
          <Txt size="xxl" weight="black" align="center">Session Complete!</Txt>
          <Txt size="md" color={C.mist} align="center">{modeObj.workMinutes} minutes focused. How did it feel?</Txt>
          <Row style={{ justifyContent: 'center' }} gap="lg">
            {['😩','😐','🙂','😊','🤩'].map((e, i) => (
              <TouchableOpacity key={i} onPress={() => {
                completeSession(i + 1);
                setReflect(false);
                setSecondsLeft(modeObj.workMinutes * 60);
                setIntention('');
                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
              }}>
                <Txt size="xxxl">{e}</Txt>
              </TouchableOpacity>
            ))}
          </Row>
        </Card>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <ScreenHeader title="Focus" subtitle="Choose your mode and begin" />

        {/* Mode selector */}
        <View style={styles.modeGrid}>
          {SESSION_MODES.map((m) => (
            <TouchableOpacity
              key={m.id}
              style={[styles.modeCard, mode === m.id && { borderColor: m.color, backgroundColor: `${m.color}15` }]}
              onPress={() => !running && setMode(m.id)}
              activeOpacity={0.75}
            >
              <Txt size="xl">{m.emoji}</Txt>
              <Txt size="sm" weight="bold" color={mode === m.id ? m.color : C.frost} align="center">{m.label}</Txt>
              <Txt size="xs" color={C.mist} align="center">{m.workMinutes}m</Txt>
            </TouchableOpacity>
          ))}
        </View>

        {/* Timer ring */}
        <View style={styles.ringWrap}>
          <View style={[styles.ringOuter, { width: RING + 24, height: RING + 24, borderRadius: (RING + 24) / 2, borderColor: `${modeObj.color}28` }]}>
            <View style={[styles.ringArc, {
              width: RING, height: RING, borderRadius: RING / 2,
              borderColor: modeObj.color,
              borderTopColor: progress > 0.5 ? modeObj.color : 'transparent',
              borderRightColor: progress > 0.25 ? modeObj.color : 'transparent',
              borderBottomColor: progress > 0.75 ? modeObj.color : 'transparent',
              borderLeftColor: 'transparent',
              transform: [{ rotate: `${progress * 360 - 90}deg` }],
            }]} />
            <View style={[styles.ringCenter, { width: RING - 32, height: RING - 32, borderRadius: (RING - 32) / 2 }]}>
              <Txt size="display" weight="black" color={running ? modeObj.color : C.frost} style={{ letterSpacing: -2 }}>{fmt(secondsLeft)}</Txt>
              <Txt size="sm" color={C.mist}>{running ? 'focusing...' : 'ready'}</Txt>
              <Spacer h="xs" />
              <Pill label={modeObj.label} color={modeObj.color} bg={`${modeObj.color}18`} />
            </View>
          </View>
        </View>

        {/* Description */}
        <View style={[styles.descCard, { borderColor: `${modeObj.color}33`, backgroundColor: `${modeObj.color}0d` }]}>
          <Txt size="sm" color={C.mist} align="center">{modeObj.description}</Txt>
        </View>

        {/* Intention */}
        {!running && (
          <View style={styles.intentionRow}>
            <Ionicons name="pencil-outline" size={16} color={C.shadow} style={{ marginTop: 2 }} />
            <TextInput
              style={styles.intentionInput}
              placeholder="What are you working on? (optional)"
              placeholderTextColor={C.shadow}
              value={intention} onChangeText={setIntention} maxLength={80}
            />
          </View>
        )}

        {/* Controls */}
        {!running ? (
          <Btn label={`Start ${modeObj.label}`} onPress={() => {
            startSession(mode, modeObj.workMinutes, intention);
            setRunning(true);
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          }} />
        ) : (
          <Row gap="sm">
            <TouchableOpacity style={[styles.ctrlBtn, { borderColor: C.rim }]} onPress={() => { setRunning(false); Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); }} activeOpacity={0.75}>
              <Ionicons name="pause" size={22} color={C.frost} />
              <Txt size="md" weight="bold">Pause</Txt>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.ctrlBtn, { borderColor: `${C.alert}44`, backgroundColor: C.alertDim }]}
              onPress={() => Alert.alert('Stop Session?', 'Progress saved as abandoned.', [
                { text: 'Keep Going', style: 'cancel' },
                { text: 'Stop', style: 'destructive', onPress: () => { clearInterval(intervalRef.current!); setRunning(false); abandonSession(); setSecondsLeft(modeObj.workMinutes * 60); } },
              ])} activeOpacity={0.75}>
              <Ionicons name="stop" size={22} color={C.alert} />
              <Txt size="md" weight="bold" color={C.alert}>Stop</Txt>
            </TouchableOpacity>
          </Row>
        )}

        {/* Stats */}
        <View style={styles.statsRow}>
          {[
            { v: String(totalDone), l: 'Sessions Done' },
            { v: `${Math.floor(totalMinutes / 60)}h ${totalMinutes % 60}m`, l: 'Total Focus' },
            { v: `${streak} 🔥`, l: 'Day Streak' },
          ].map(({ v, l }) => (
            <Card key={l} style={{ flex: 1, padding: S.sm, gap: 2 }}>
              <Txt size="lg" weight="extrabold" color={C.nebula} align="center">{v}</Txt>
              <Txt size="xs" color={C.mist} align="center">{l}</Txt>
            </Card>
          ))}
        </View>
        <Spacer h="xxl" />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.abyss },
  scroll: { padding: S.md, gap: S.sm },
  modeGrid: { flexDirection: 'row', gap: S.sm },
  modeCard: { flex: 1, alignItems: 'center', gap: 4, backgroundColor: C.depth, borderRadius: R.md, padding: S.sm, borderWidth: 2, borderColor: C.rim, minHeight: 90, justifyContent: 'center' },
  ringWrap: { alignItems: 'center', justifyContent: 'center', paddingVertical: S.lg },
  ringOuter: { borderWidth: 10, alignItems: 'center', justifyContent: 'center', position: 'relative' },
  ringArc: { position: 'absolute', borderWidth: 10, opacity: 0.6 },
  ringCenter: { backgroundColor: C.abyss, alignItems: 'center', justifyContent: 'center', gap: 4 },
  descCard: { borderRadius: R.md, padding: S.md, borderWidth: 1, alignItems: 'center' },
  intentionRow: { flexDirection: 'row', alignItems: 'flex-start', gap: S.sm, backgroundColor: C.surface, borderRadius: R.md, padding: S.md, borderWidth: 1, borderColor: C.rim },
  intentionInput: { flex: 1, color: C.frost, fontSize: F.md, lineHeight: 22 },
  ctrlBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: S.sm, borderRadius: R.md, padding: S.md, minHeight: 52, borderWidth: 1, backgroundColor: C.surface },
  statsRow: { flexDirection: 'row', gap: S.sm },
  reflectCard: { margin: S.lg, padding: S.lg, alignItems: 'center' },
});
