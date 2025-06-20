import ArtistCard from '@/components/ArtistCard';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, StyleSheet } from 'react-native';

export default function TabTwoScreen() {

  const [artists, setArtists] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef<{ scrollTo: (params: { y: number; animated?: boolean }) => void }>(null);
  const navigation = useNavigation();

  useEffect(() => {
    AsyncStorage.getItem('lineup').then((json) => {
      if (json) {
        setArtists(JSON.parse(json));
      }
      setLoading(false);
    });
  }, []);

  artists.sort((a, b) => a.artist.localeCompare(b.artist));
  const uniqueArtists = Array.from(
    new Map(artists.map((a) => [a.artist.toLowerCase(), a])).values()
  );


  if (loading) {
    return <ActivityIndicator size="large" />;
  }

  return (
    <ParallaxScrollView
      ref={scrollRef}
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
      {uniqueArtists.map((artist) => (
        <ArtistCard
          key={artist.artist.replace(/\s+/g, '_')}
          name={artist.artist}
          slug={artist.artist.replace(/\s+/g, '_')}
          genre={artist.genre}
          image={artist.image}
        />
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
