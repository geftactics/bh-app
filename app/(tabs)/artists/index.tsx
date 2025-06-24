import ArtistCard from '@/components/ArtistCard';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { useNavigation } from 'expo-router';
import { useCallback, useRef, useState } from 'react';
import { ActivityIndicator, Image, StyleSheet, View } from 'react-native';

export default function TabTwoScreen() {

  const [artists, setArtists] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef<{ scrollTo: (params: { y: number; animated?: boolean }) => void }>(null);
  const navigation = useNavigation();

  useFocusEffect(
    useCallback(() => {
      let isActive = true;
      const loadData = async () => {
        const json = await AsyncStorage.getItem('lineup');
        if (json && isActive) {
          setArtists(JSON.parse(json));
          setLoading(false);
        }
      };

      loadData();

      return () => {
        isActive = false;
      };
    }, [])
  );

  const uniqueArtists = Array.from(
    new Map(artists.map((a) => [a.artist.toLowerCase(), a])).values()
  );

  uniqueArtists.sort((a, b) => {
    const nameA = a.artist.replace(/^DJ\s+/i, '').toLowerCase();
    const nameB = b.artist.replace(/^DJ\s+/i, '').toLowerCase();
    return nameA.localeCompare(nameB);
  });

  return (
    <ParallaxScrollView
      ref={scrollRef}
      headerBackgroundColor={{ light: '#353636', dark: '#353636' }}
      headerImage={
        <Image
          source={require('@/assets/images/header-logo.png')}
          style={styles.topImage}
        />
      }
    >
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#E30083" />
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
    color: '#808080',
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
  backgroundColor: '#FFE200',
  justifyContent: 'center',
  alignItems: 'center',
  paddingTop: 100,
  },
  loadingText: {
    fontSize: 18,
    marginBottom: 10,
    fontStyle: 'italic',
    color: '#333',
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
