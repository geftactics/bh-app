import AsyncStorage from '@react-native-async-storage/async-storage';

const SCHEDULE_KEY = 'festival_schedule_v1';

export async function fetchData() {
  const controller = new AbortController();

  // Timeout logic (10 seconds)
  const timeoutId = setTimeout(() => controller.abort(), 10000);

  try {
    const res = await fetch('https://example.com/schedule.json', {
      signal: controller.signal,
    });
    const data = await res.json();
    await AsyncStorage.setItem(SCHEDULE_KEY, JSON.stringify(data));
    return data;
  } catch (err) {
    const cached = await AsyncStorage.getItem(SCHEDULE_KEY);
    if (cached) return JSON.parse(cached);
    else throw new Error('Unable to load data');
  } finally {
    clearTimeout(timeoutId);
  }
}
