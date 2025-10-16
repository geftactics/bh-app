import ArtistCard from '@/components/ArtistCard';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { Colors } from '@/constants/Colors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, Image, StyleSheet, View } from 'react-native';

export default function ArtistsIndexScreen() {

  const [artists, setArtists] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef<{ scrollTo: (params: { y: number; animated?: boolean }) => void }>(null);

  useFocusEffect(
    useCallback(() => {
      let isActive = true;
      const loadData = async () => {
        try {
          const json = await AsyncStorage.getItem('lineup');
          if (json && isActive) {
            setArtists(JSON.parse(json));
            setLoading(false);
          }
        } catch (error) {
          console.warn('Failed to load artists:', error);
          setLoading(false);
        }
      };

      loadData();

      return () => {
        isActive = false;
      };
    }, [])
  );

  const uniqueArtists = useMemo(() => {
    const unique = Array.from(
      new Map(artists.map((a) => [a.artist.toLowerCase(), a])).values()
    );
    
    // Pre-compute sort keys for better performance
    const withSortKeys = unique.map(artist => ({
      ...artist,
      sortKey: artist.artist.replace(/^DJ\s+/i, '').toLowerCase()
    }));
    
    return withSortKeys
      .sort((a, b) => a.sortKey.localeCompare(b.sortKey))
      .map(({ sortKey, ...artist }) => artist); // Remove sort key from final result
  }, [artists]);

  return (
    <ParallaxScrollView
      ref={scrollRef}
      headerBackgroundColor={Colors.headerBackground}
      headerImage={
        <Image
          source={require('@/assets/images/header-logo.png')}
          style={styles.topImage}
        />
      }
    >
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.tint} />
        </View>
      ) : (
        uniqueArtists.map((artist) => {
          const slug = encodeURIComponent(artist.artist);

          return (
            <View key={slug} style={{ margin: 0, padding: 0 }}>
              <ArtistCard
                name={artist.artist}
                slug={slug}
                genre={artist.genre}
                image={artist.image}
              />
            </View>
          );
        })
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
  loadingContainer: {
  flex: 1,
  backgroundColor: Colors.background,
  justifyContent: 'center',
  alignItems: 'center',
  paddingTop: 100,
  },
  loadingText: {
    fontSize: 18,
    marginBottom: 10,
    fontStyle: 'italic',
    color: Colors.textSecondary,
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
