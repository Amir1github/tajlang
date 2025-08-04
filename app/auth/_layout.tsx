import { Stack } from 'expo-router';
import { View, StyleSheet } from 'react-native';
import AnimatedWordsBackground from '@/components/AnimatedWordsBackground';

export default function AuthLayout() {
  return (
    <View style={styles.container}>
      {/* Общий фоновый слой со словами — он не будет исчезать между экранами */}
      <View style={styles.background}>
        {Array.from({ length: 10 }).map((_, i) => (
          <AnimatedWordsBackground key={`bg-${i}`} />
        ))}
      </View>

      {/* Все auth-экраны */}
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="sign-in" />
        <Stack.Screen name="sign-up" />
        <Stack.Screen name="callback" />
      </Stack>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 0,
    pointerEvents: 'none',
  },
});
