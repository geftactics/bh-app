import { useColorScheme } from '@/hooks/useColorScheme';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import 'react-native-reanimated';
import LoadingScreen from '../components/LoadingScreen';
import LoadingScreenError from '../components/LoadingScreenError';
import { fetchData } from '../lib/fetchData';

export default function RootLayout() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const colorScheme = useColorScheme();

  async function loadSchedule() {
    setLoading(true);
    setError(false);
    try {
      await fetchData();
      setLoading(false);
    } catch (e) {
      console.warn('Error loading data:', e);
      setError(true);
    }
  }

  useEffect(() => {
    loadSchedule();
  }, []);

  if (error) return <LoadingScreenError onRetry={loadSchedule} />;
  if (loading) return <LoadingScreen />;
  
  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
