import { Stack } from 'expo-router';
import { C } from '../../src/design/tokens';

export default function OnboardingLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: C.abyss },
        animation: 'slide_from_right',
      }}
    />
  );
}
