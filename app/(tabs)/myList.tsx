import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useState } from 'react';
import { Image, StyleSheet, View } from 'react-native';

import lineup from '@/assets/data/lineup.json';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { Colors } from '@/constants/Colors';
import PerformanceCard from '@/components/PerformanceCard';
import { ThemedText } from '@/components/ThemedText';


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
      headerBackgroundColor={Colors.headerBackground}
      headerImage={
        <Image
          source={require('@/assets/images/header-logo.png')}
          style={styles.topImage}
        />
      }
    >
      <View style={[styles.titleContainer, { backgroundColor: Colors.background }]}>
        <ThemedText type="title">My List</ThemedText>
      </View>

      {performances.length === 0 ? (
        <View style={[styles.emptyContainer, { backgroundColor: Colors.background }]}>
          <ThemedText type="default" style={styles.emptyText}>Oh! So empty!</ThemedText>
          <ThemedText type="default" style={styles.emptyText}> </ThemedText>
          <ThemedText type="default" style={styles.emptyText}>
            Click the 🖤 next to the things you like to add them to your list!
          </ThemedText>
        </View>
      ) : (
        performances.map((performance) => (
          <View
            key={`${performance.day}-${performance.venue}-${performance.start}-${performance.artist}`.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase()}
            style={{ marginHorizontal: -15, marginVertical: -5, backgroundColor: Colors.background }}
          >
            <PerformanceCard
              uid={`${performance.day}-${performance.venue}-${performance.start}-${performance.artist}`.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase()}
              day={performance.day}
              start={performance.start}
              end={performance.end}
              artist={performance.artist}
              genre={performance.genre}
              description={performance.description}
              venue={performance.venue}
            />
          </View>
        ))
      )}
    </ParallaxScrollView>
  );

  

}

const styles = StyleSheet.create({
  headerImage: {
    color: Colors.gray,
    bottom: -90,
    left: -35,
    position: 'absolute',
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
  },
    emptyContainer: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: Colors.darkGray,
    fontStyle: 'italic',
    textAlign: 'center',
  },
  topImage: {
    height: 178,
    width: 290,
    position: 'absolute',
    bottom: 0,
    left: '50%',
    transform: [{ translateX: -145 }], // half of width to center it
  },
});
