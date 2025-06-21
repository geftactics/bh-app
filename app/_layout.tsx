import { useColorScheme } from '@/hooks/useColorScheme';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useRef, useState } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import 'react-native-reanimated';
import LoadingScreen from '../components/LoadingScreen';
import LoadingScreenError from '../components/LoadingScreenError';
import { fetchData } from '../lib/fetchData';

export default function RootLayout() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const colorScheme = useColorScheme();
  const appState = useRef(AppState.currentState);

  async function loadSchedule() {
    try {
      await fetchData();
      setLoading(false); // Only clear loading on initial load
    } catch (e) {
      console.warn('Error loading data:', e);
      setError(true);
    }
  }

  // Initial load
  useEffect(() => {
    loadSchedule();
  }, []);

  // Refresh on app foreground
  useEffect(() => {
    const subscription = AppState.addEventListener('change', handleAppStateChange);
    return () => subscription.remove(); // Clean up
  }, []);

  const handleAppStateChange = (nextAppState: AppStateStatus) => {
    if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
      console.log('App has come to the foreground – refreshing schedule');
      fetchData(); // Re-fetch without setting `loading` again
    }
    appState.current = nextAppState;
  };

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
