import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StyleSheet } from 'react-native';
import { C } from '../src/design/tokens';

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={styles.root}>
      <StatusBar style="light" backgroundColor={C.abyss} />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: C.abyss },
          animation: 'fade',
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="(onboarding)" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen
          name="friction-modal"
          options={{ presentation: 'transparentModal', animation: 'fade' }}
        />
      </Stack>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({ root: { flex: 1 } });
