import React from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  ViewStyle, TextStyle, ActivityIndicator,
  type TouchableOpacityProps,
} from 'react-native';
import { C, R, S, F, W } from '../../design/tokens';

// ─── Txt ─────────────────────────────────────────────────

type TxtProps = {
  children: React.ReactNode;
  size?: keyof typeof F;
  weight?: keyof typeof W;
  color?: string;
  style?: TextStyle;
  align?: 'left' | 'center' | 'right';
  numberOfLines?: number;
};

export function Txt({
  children, size = 'md', weight = 'regular',
  color = C.frost, style, align, numberOfLines,
}: TxtProps) {
  return (
    <Text
      numberOfLines={numberOfLines}
      style={[{ fontSize: F[size], fontWeight: W[weight], color, textAlign: align }, style]}
    >
      {children}
    </Text>
  );
}

// ─── Card ────────────────────────────────────────────────

export function Card({
  children, style, pad = 'md', gap,
}: {
  children: React.ReactNode;
  style?: ViewStyle;
  pad?: keyof typeof S;
  gap?: keyof typeof S;
}) {
  return (
    <View style={[styles.card, { padding: S[pad], gap: gap ? S[gap] : undefined }, style]}>
      {children}
    </View>
  );
}

// ─── Pill ────────────────────────────────────────────────

export function Pill({ label, color = C.nebula, bg = C.nebulaDim }: {
  label: string; color?: string; bg?: string;
}) {
  return (
    <View style={[styles.pill, { backgroundColor: bg }]}>
      <Txt size="xs" weight="semibold" color={color}>{label}</Txt>
    </View>
  );
}

// ─── Divider ─────────────────────────────────────────────

export function Divider({ indent = 0 }: { indent?: number }) {
  return <View style={[styles.divider, { marginLeft: indent }]} />;
}

// ─── Btn ─────────────────────────────────────────────────

type BtnVariant = 'primary' | 'secondary' | 'ghost' | 'danger';

export function Btn({
  label, variant = 'primary', icon, loading, fullWidth = true, style, ...rest
}: TouchableOpacityProps & {
  label: string; variant?: BtnVariant;
  icon?: React.ReactNode; loading?: boolean; fullWidth?: boolean;
}) {
  const vs = btnVariants[variant];
  return (
    <TouchableOpacity
      activeOpacity={0.75}
      style={[styles.btn, vs.container, fullWidth && { width: '100%' }, style]}
      {...rest}
    >
      {loading
        ? <ActivityIndicator color={vs.textColor} />
        : <>{icon}<Txt size="md" weight="bold" color={vs.textColor}>{label}</Txt></>
      }
    </TouchableOpacity>
  );
}

const btnVariants: Record<BtnVariant, { container: ViewStyle; textColor: string }> = {
  primary:   { container: { backgroundColor: C.nebula },                                   textColor: '#ffffff' },
  secondary: { container: { backgroundColor: 'transparent', borderWidth: 1, borderColor: C.rim }, textColor: C.frost },
  ghost:     { container: { backgroundColor: 'transparent' },                              textColor: C.mist },
  danger:    { container: { backgroundColor: C.alertDim, borderWidth: 1, borderColor: `${C.alert}44` }, textColor: C.alert },
};

// ─── Row ─────────────────────────────────────────────────

export function Row({
  children, style, gap = 'sm', align = 'center',
}: { children: React.ReactNode; style?: ViewStyle; gap?: keyof typeof S; align?: ViewStyle['alignItems'] }) {
  return (
    <View style={[{ flexDirection: 'row', alignItems: align, gap: S[gap] }, style]}>
      {children}
    </View>
  );
}

// ─── Spacer ──────────────────────────────────────────────

export function Spacer({ h = 'md' }: { h?: keyof typeof S }) {
  return <View style={{ height: S[h] }} />;
}

// ─── ScreenHeader ────────────────────────────────────────

export function ScreenHeader({
  title, subtitle, right,
}: { title: string; subtitle?: string; right?: React.ReactNode }) {
  return (
    <View style={styles.screenHeader}>
      <View style={{ flex: 1 }}>
        <Txt size="xxl" weight="extrabold">{title}</Txt>
        {subtitle && <Txt size="sm" color={C.mist} style={{ marginTop: 2 }}>{subtitle}</Txt>}
      </View>
      {right}
    </View>
  );
}

// ─── EmptyState ──────────────────────────────────────────

export function EmptyState({ emoji, title, subtitle }: {
  emoji: string; title: string; subtitle?: string;
}) {
  return (
    <View style={styles.empty}>
      <Txt size="xxxl">{emoji}</Txt>
      <Spacer h="sm" />
      <Txt size="lg" weight="bold" align="center">{title}</Txt>
      {subtitle && <Txt size="sm" color={C.mist} align="center" style={{ marginTop: 4 }}>{subtitle}</Txt>}
    </View>
  );
}

// ─── Styles ──────────────────────────────────────────────

const styles = StyleSheet.create({
  card: { backgroundColor: C.depth, borderRadius: R.md, borderWidth: 1, borderColor: C.rim },
  pill: { paddingHorizontal: S.sm, paddingVertical: 3, borderRadius: R.full, alignSelf: 'flex-start' },
  divider: { height: 1, backgroundColor: C.rim },
  btn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: S.sm, paddingVertical: 15, paddingHorizontal: S.lg,
    borderRadius: R.md, minHeight: 52,
  },
  screenHeader: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: S.md, paddingTop: S.md, paddingBottom: S.sm,
  },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: S.xxl },
});
