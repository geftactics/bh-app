import AsyncStorage from '@react-native-async-storage/async-storage';

const TIMEOUT_MS = 10000;
const URLS = {
  stages: 'https://raw.githubusercontent.com/geftactics/bh-app/refs/heads/main/assets/data/stages.json',
  lineup: 'https://raw.githubusercontent.com/geftactics/bh-app/refs/heads/main/assets/data/lineup.json',
} as const;

/**
 * Fetches festival data from remote URLs with fallback to cached data
 * @returns Promise containing stages and lineup data
 * @throws Error when both remote fetch and cache retrieval fail
 */
export async function fetchData() {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    console.log('Getting data...');
    const [stagesRes, lineupRes] = await Promise.all([
      fetch(URLS.stages, { signal: controller.signal }),
      fetch(URLS.lineup, { signal: controller.signal }),
    ]);

    const [stages, lineup] = await Promise.all([
      stagesRes.json(),
      lineupRes.json(),
    ]);

    await Promise.all([
      AsyncStorage.setItem('stages', JSON.stringify(stages)),
      AsyncStorage.setItem('lineup', JSON.stringify(lineup)),
    ]);

    return { stages, lineup };
  } catch (err) {
    try {
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
    } catch (cacheError) {
      console.warn('Cache retrieval failed:', cacheError);
    }

    throw new Error('Unable to load data');
  } finally {
    clearTimeout(timeoutId);
  }
}
