import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useState } from 'react';
import { StyleSheet } from 'react-native';

import lineup from '@/assets/data/lineup.json';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import PerformanceCard from '@/components/PerformanceCard';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';

export default function TabTwoScreen() {
  const [favourites, setFavourites] = useState<string[]>([]);
  const [performances, setPerformances] = useState<any[]>([]);

  useFocusEffect(
    useCallback(() => {
      const loadFavourites = async () => {
        const data = await AsyncStorage.getItem('favourites');
        if (data) setFavourites(JSON.parse(data));
      };
      loadFavourites();
    }, [])
  );

  useFocusEffect(
    useCallback(() => {
      if (favourites.length === 0) return;
      const filtered = lineup.filter((perf) => {
        const uid = `${perf.day}-${perf.venue}-${perf.start}-${perf.artist}`
          .replace(/[^a-zA-Z0-9]/g, '-')
          .toLowerCase();
        return favourites.includes(uid);
      });

      const getSortableDayIndex = (day: string, time: string): number => {
        const dayOrder = ['Thursday', 'Friday', 'Saturday', 'Sunday'];
        let index = dayOrder.indexOf(day);

        // Post-midnight performances (00:00–04:59) should be sorted as next day
        if (/^0[0-4][0-9]{2}$/.test(time) || time === '0500') {
          index += 1;
        }

        return index;
      };

      const sorted = filtered.sort((a, b) => {
        const dayA = getSortableDayIndex(a.day, a.start);
        const dayB = getSortableDayIndex(b.day, b.start);
        if (dayA !== dayB) return dayA - dayB;
        return parseInt(a.start) - parseInt(b.start);
      });

      setPerformances(sorted);
    }, [favourites])
  );

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
      headerImage={
        <IconSymbol
          size={310}
          color="#808080"
          name="chevron.left.forwardslash.chevron.right"
          style={styles.headerImage}
        />
      }
    >
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">My List</ThemedText>
      </ThemedView>

      {performances.map((performance) => (
        <ThemedView
          key={`${performance.day}-${performance.venue}-${performance.start}-${performance.artist}`.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase()}
          style={{ marginHorizontal: -15, marginVertical: 0 }}>
        <PerformanceCard
          uid={`${performance.day}-${performance.venue}-${performance.start}-${performance.artist}`.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase()}
          day={performance.day}
          start={performance.start}
          end={performance.end}
          artist={performance.artist}
          genre={performance.genre}
          description={performance.description}
          venue={performance.venue}
        /></ThemedView>
      ))}
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: '#808080',
    bottom: -90,
    left: -35,
    position: 'absolute',
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
  },
});
