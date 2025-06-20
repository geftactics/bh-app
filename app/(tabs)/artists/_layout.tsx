import { Stack } from 'expo-router';

export default function StagesLayout() {
  return (
    <Stack
      screenOptions={{
        headerTitleAlign: 'center',
        headerBackTitle: 'Back',
      }}
    >
      <Stack.Screen name="index" options={{ headerShown: false }} />
    </Stack>
  );
}
