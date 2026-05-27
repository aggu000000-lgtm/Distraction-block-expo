import { Tabs } from 'expo-router';
import { View, StyleSheet, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { C, R, S } from '../../src/design/tokens';

type IconName = React.ComponentProps<typeof Ionicons>['name'];

function TabIcon({ name, activeName, color, focused }: {
  name: IconName; activeName: IconName; color: string; focused: boolean;
}) {
  return (
    <View style={[styles.iconWrap, focused && styles.iconWrapActive]}>
      <Ionicons name={focused ? activeName : name} size={22} color={color} />
    </View>
  );
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: C.nebula,
        tabBarInactiveTintColor: C.shadow,
        tabBarLabelStyle: styles.label,
      }}
    >
      <Tabs.Screen name="home" options={{ title: 'Home',    tabBarIcon: (p) => <TabIcon name="home-outline"    activeName="home"            {...p} /> }} />
      <Tabs.Screen name="shield" options={{ title: 'Shield', tabBarIcon: (p) => <TabIcon name="shield-outline"  activeName="shield-checkmark" {...p} /> }} />
      <Tabs.Screen name="focus" options={{ title: 'Focus',  tabBarIcon: (p) => <TabIcon name="timer-outline"   activeName="timer"            {...p} /> }} />
      <Tabs.Screen name="insights" options={{ title: 'Insights',tabBarIcon: (p) => <TabIcon name="bar-chart-outline" activeName="bar-chart"   {...p} /> }} />
      <Tabs.Screen name="profile" options={{ title: 'Profile',tabBarIcon: (p) => <TabIcon name="person-outline" activeName="person"           {...p} /> }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: C.depth, borderTopColor: C.rim, borderTopWidth: 1,
    height: Platform.OS === 'ios' ? 88 : 68,
    paddingBottom: Platform.OS === 'ios' ? 28 : 10, paddingTop: 8, elevation: 0,
  },
  label: { fontSize: 11, fontWeight: '600', letterSpacing: 0.2 },
  iconWrap: { width: 42, height: 28, alignItems: 'center', justifyContent: 'center', borderRadius: R.xs },
  iconWrapActive: { backgroundColor: C.nebulaDim },
});
