import PerformanceCard from '@/components/PerformanceCard';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Stack, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';

const dayOrder = ['Thursday', 'Friday', 'Saturday', 'Sunday'];

export default function ArtistDetail() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme];
  const { slug } = useLocalSearchParams<{ slug: string }>();

  const [entries, setEntries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem('lineup').then((json) => {
      if (json) {
        setEntries(JSON.parse(json));
      }
      setLoading(false);
    });
  }, []);

  const artistName = slug?.replace(/_/g, ' ');
  const artistPerformances = entries.filter((e) => e.artist === artistName);

  const artist = artistPerformances[0]; // use first performance for image/description etc

  const sortedPerformances = [...artistPerformances].sort((a, b) => {
    const dayDiff = dayOrder.indexOf(a.day) - dayOrder.indexOf(b.day);
    return dayDiff !== 0 ? dayDiff : parseInt(a.start) - parseInt(b.start);
  });

  return (
    <>
      <Stack.Screen
        options={{
          title: '',
          headerBackTitle: 'Back',
          headerStyle: { backgroundColor: 'black' },
          headerTintColor: 'white',
        }}
      />

      {loading ? (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
          <Text style={styles.title}>Loading...</Text>
        </View>
      ) : !artist ? (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
          <Text style={styles.error}>Artist not found</Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={[styles.container, { backgroundColor: theme.background }]}>
          <View style={styles.topRow}>
            <View style={styles.imageContainer}>
              <Image
                source={
                  error || !artist.image
                    ? require('../../../assets/images/placeholder.jpg')
                    : { uri: artist.image }
                }
                style={styles.image}
                onError={() => setError(true)}
                resizeMode="cover"
              />
            </View>

            <View style={styles.pinkBox}>
              <Text style={styles.artistName}>{artist.artist}</Text>
            </View>
          </View>

          {artist.description && (
            <View style={[styles.descriptionContainer, { padding: 7 }]}>
              <Text>{artist.description}</Text>
            </View>
          )}

          {sortedPerformances.map((performance) => (
            <View style={[styles.descriptionContainer, { padding: 0 }]}>
            <PerformanceCard
              day={performance.day}
              start={performance.start}
              end={performance.end}
              venue={performance.venue}
              artist={performance.artist}
              genre={performance.genre}
              description={performance.description}
              uid={`${performance.day}-${performance.venue}-${performance.start}-${performance.artist}`.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase()}
              key={`${performance.day}-${performance.venue}-${performance.start}-${performance.artist}`.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase()}
            />
            </View>
          ))}
        </ScrollView>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 0,
    flexGrow: 1,
  },
  innerContainer: {
    padding:10
  },
  topRow: {
    flexDirection: 'row',
    marginBottom: 20,
    alignItems: 'center',
  },
  imageContainer: {
    width: '50%',
    aspectRatio: 1,
    backgroundColor: '#eee',
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  pinkBox: {
    width: '50%',
    aspectRatio: 1,
    backgroundColor: '#E30083',
    justifyContent: 'center',
    alignItems: 'center',
  },
  artistName: {
    fontWeight: 'bold',
    fontSize: 36,
    color: 'black',
    textAlign: 'center',
    paddingHorizontal: 10,
  },
  descriptionContainer: {
    fontSize: 16,
    lineHeight: 20,
    marginHorizontal: 18,
    marginBottom: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  error: {
    color: 'red',
    fontSize: 20,
  },
});
