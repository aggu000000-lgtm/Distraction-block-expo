/**
 * FocusGuard Shield — Rule List
 */

import { View, Text, StyleSheet, FlatList, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { colors, spacing, radii } from "@/design/tokens";
import { typography } from "@/design/typography";
import { useBlockingStore } from "@/store/blocking.store";
import { describeCondition } from "@/core/blocking/rules";
import { Plus, Lock, Unlock } from "lucide-react-native";

export default function RulesScreen() {
  const router = useRouter();
  const { rules, toggleRuleActive } = useBlockingStore();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Rules</Text>
        <Pressable style={styles.addBtn} onPress={() => router.push("/(app)/shield/rules/new")}>
          <Plus size={20} color={colors.frost} />
        </Pressable>
      </View>

      {rules.length === 0 ? (
        <View style={styles.empty}>
          <Lock size={48} color={colors.shadow} />
          <Text style={styles.emptyText}>No rules yet. Create your first rule.</Text>
        </View>
      ) : (
        <FlatList
          data={rules}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <Pressable style={styles.card} onPress={() => toggleRuleActive(item.id)}>
              <View style={styles.cardInfo}>
                <Text style={styles.cardName}>{item.name}</Text>
                <Text style={styles.cardDetail}>
                  {item.apps.length} apps · {item.friction} · {describeCondition(item.condition)}
                </Text>
              </View>
              {item.isActive ? (
                <Unlock size={20} color={colors.pulse} />
              ) : (
                <Lock size={20} color={colors.shadow} />
              )}
            </Pressable>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.abyss, paddingHorizontal: spacing.md, paddingTop: spacing["3xl"] },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: spacing.lg },
  title: { ...typography.h1, color: colors.frost },
  addBtn: { width: 40, height: 40, borderRadius: radii.full, backgroundColor: colors.nebula, alignItems: "center", justifyContent: "center" },
  empty: { flex: 1, alignItems: "center", justifyContent: "center", gap: spacing.md },
  emptyText: { ...typography.body, color: colors.shadow, textAlign: "center" },
  card: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", backgroundColor: colors.depth, borderRadius: radii.md, borderWidth: 1, borderColor: colors.rim, padding: spacing.md, marginBottom: spacing.sm },
  cardInfo: { gap: spacing.xs, flex: 1 },
  cardName: { ...typography.h3, color: colors.frost },
  cardDetail: { ...typography.caption, color: colors.mist },
});
