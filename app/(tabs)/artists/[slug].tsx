import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Stack, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';

export default function ArtistDetail() {
  const colorScheme = useColorScheme();
  const [error, setError] = useState(false);
  const theme = Colors[colorScheme];
  const { slug } = useLocalSearchParams<{ slug: string }>();

  const [artists, setArtists] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    AsyncStorage.getItem('lineup').then((json) => {
      if (json) {
        setArtists(JSON.parse(json));
      }
      setLoading(false);
    });
  }, []);

  const artist = artists.find((s) => s.artist.replace(/\s+/g, '_') === slug);

  return (
    <>
      <Stack.Screen
        options={{
          title: artist?.artist || 'Artist',
          headerBackTitle: 'Back',
          headerStyle: {
            backgroundColor: 'black',
          },
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
          {/* Top Row: Image + Pink Box */}
          <View style={styles.topRow}>
            {/* Artist Image */}
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

            {/* Pink Box with Artist Name */}
            <View style={styles.pinkBox}>
              <Text style={styles.artistName}>{artist.artist}</Text>
            </View>
          </View>

          {/* Space for performance detail card */}
          <View style={styles.performanceCard}>
            <Text style={styles.performanceText}>Performance details go here...</Text>
          </View>
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
  topRow: {
    flexDirection: 'row',
    marginBottom: 20,
    alignItems: 'center',
  },
  imageContainer: {
    width: '50%',
    aspectRatio: 1, // square
    borderRadius: 0,
    overflow: 'hidden',
    backgroundColor: '#eee',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  pinkBox: {
    width: '50%',
    height: undefined,
    aspectRatio: 1, // same square size as image
    backgroundColor: '#E30083', // pink
    borderRadius: 0,
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
  performanceCard: {
    backgroundColor: '#222',
    borderRadius: 12,
    padding: 16,
    // Add shadow or elevation if you want:
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  performanceText: {
    fontSize: 16,
    color: 'black',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  error: {
    color: 'red',
    fontSize: 20,
  },
});