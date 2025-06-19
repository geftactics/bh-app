import AsyncStorage from '@react-native-async-storage/async-storage';

export async function fetchData() {
  const controller = new AbortController();

  // Timeout logic (10 seconds)
  const timeoutId = setTimeout(() => controller.abort(), 10 * 1000);

  try {
    const res = await fetch('https://raw.githubusercontent.com/geftactics/bh-app/refs/heads/main/assets/data/stages.json', {
      signal: controller.signal,
    });
    const data = await res.json();
    await AsyncStorage.setItem('stages', JSON.stringify(data));
    return data;
  } catch (err) {
    const cached = await AsyncStorage.getItem('stages');
    if (cached) return JSON.parse(cached);
    else throw new Error('Unable to load data');
  } finally {
    clearTimeout(timeoutId);
  }
}
