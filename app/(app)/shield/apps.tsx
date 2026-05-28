/**
 * FocusGuard Shield — Individual App Toggles
 */

import { View, Text, StyleSheet, FlatList, Pressable } from "react-native";
import { colors, spacing, radii } from "@/design/tokens";
import { typography } from "@/design/typography";
import { useBlockingStore } from "@/store/blocking.store";

export default function ShieldAppsScreen() {
  const { apps, toggleAppTracked } = useBlockingStore();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Manage Apps</Text>
      <FlatList
        data={apps}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Pressable style={styles.row} onPress={() => toggleAppTracked(item.id)}>
            <Text style={styles.icon}>{item.icon}</Text>
            <View style={styles.info}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.category}>{item.category}</Text>
            </View>
            <View style={[styles.badge, item.isTracked && styles.badgeOn]}>
              <Text style={[styles.badgeText, item.isTracked && styles.badgeTextOn]}>
                {item.isTracked ? "Tracked" : "Off"}
              </Text>
            </View>
          </Pressable>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.abyss, paddingHorizontal: spacing.md, paddingTop: spacing["3xl"] },
  title: { ...typography.h1, color: colors.frost, marginBottom: spacing.lg },
  row: { flexDirection: "row", alignItems: "center", backgroundColor: colors.depth, borderRadius: radii.sm, padding: spacing.md, marginBottom: spacing.sm, gap: spacing.sm },
  icon: { fontSize: 24 },
  info: { flex: 1, gap: spacing.xs },
  name: { ...typography.body, color: colors.frost },
  category: { ...typography.caption, color: colors.mist },
  badge: { paddingHorizontal: spacing.sm, paddingVertical: spacing.xs, borderRadius: radii.xs, backgroundColor: colors.fog },
  badgeOn: { backgroundColor: colors.nebulaGlow },
  badgeText: { ...typography.caption, color: colors.mist },
  badgeTextOn: { color: colors.nebula },
});
