import { Redirect } from 'expo-router';
import { useStore } from '../src/store';

export default function Entry() {
  const hasOnboarded = useStore((s) => s.hasOnboarded);
  return hasOnboarded
    ? <Redirect href="/(tabs)/home" />
    : <Redirect href="/(onboarding)/welcome" />;
}
