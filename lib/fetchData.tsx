import AsyncStorage from '@react-native-async-storage/async-storage';

export async function fetchData() {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10 * 1000);

  const urls = {
    stages: 'https://raw.githubusercontent.com/geftactics/bh-app/refs/heads/main/assets/data/stages.json',
    lineup: 'https://raw.githubusercontent.com/geftactics/bh-app/refs/heads/main/assets/data/lineup.json',
  };

  try {
    // Fetch both in parallel
    console.log('Getting data...')
    const [stagesRes, lineupRes] = await Promise.all([
      fetch(urls.stages, { signal: controller.signal }),
      fetch(urls.lineup, { signal: controller.signal }),
    ]);

    const [stages, lineup] = await Promise.all([
      stagesRes.json(),
      lineupRes.json(),
    ]);

    // Cache both
    await AsyncStorage.setItem('stages', JSON.stringify(stages));
    await AsyncStorage.setItem('lineup', JSON.stringify(lineup));

    //console.log(stages);
    //console.log(lineup);

    return { stages, lineup };
  } catch (err) {
    // Fallback to cached data
    const [stagesCached, lineupCached] = await Promise.all([
      AsyncStorage.getItem('stages'),
      AsyncStorage.getItem('lineup'),
    ]);

    if (stagesCached && lineupCached) {
      return {
        stages: JSON.parse(stagesCached),
        lineup: JSON.parse(lineupCached),
      };
    }

    throw new Error('Unable to load data');
  } finally {
    clearTimeout(timeoutId);
  }
}
