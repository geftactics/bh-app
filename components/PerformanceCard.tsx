import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

type Props = {
  uid: string;
  day: string;
  start: string;
  end: string;
  genre: string;
  venue?: string;
  description: string;
  artist: string;
};

export default function PerformanceCard({
  uid,
  day,
  start,
  end,
  description,
  artist,
  genre,
  venue
}: Props) {
  const router = useRouter();
  const [isFavourite, setIsFavourite] = useState(false);
  const [formattedVenue, setFormattedVenue] = useState<string | null>(null);

  useEffect(() => {
    AsyncStorage.getItem('stages').then((data) => {
      if (data) {
        const stages = JSON.parse(data);
        const match = stages.find((stage: any) => stage.slug === venue);
        setFormattedVenue(match.name);
      }
    });
  }, [venue]);

  // Check if performance is already in favourites
  useEffect(() => {
    AsyncStorage.getItem('favourites').then((data) => {
      if (data) {
        const favs = JSON.parse(data);
        setIsFavourite(favs.includes(uid));
      }
    });
  }, [uid]);

  const toggleFavourite = async () => {
    try {
      const data = await AsyncStorage.getItem('favourites');
      let favs = data ? JSON.parse(data) : [];

      if (favs.includes(uid)) {
        favs = favs.filter((id: string) => id !== uid);
        setIsFavourite(false);
      } else {
        favs.push(uid);
        setIsFavourite(true);
      }

      await AsyncStorage.setItem('favourites', JSON.stringify(favs));
    } catch (error) {
      console.error('Error toggling favourite:', error);
    }
  };

  const handleCardPress = () => {
    const slug = artist.replace(/\s+/g, '_');
    if (!venue) {
      router.push(`/artists/${slug}`, {withAnchor: true});
    }
  };

  return (
    <Pressable onPress={handleCardPress} style={styles.card}>
      <View style={styles.row}>
        <Text style={styles.heading}>
          {venue ? `${formattedVenue}\n${day} - ` : ''}
          {start}-{end}
          {!venue ? ` – ${artist.replace(/-/g, ' ')} ` : ''}
        </Text>
        <Pressable onPress={toggleFavourite} hitSlop={10}>
          <Ionicons
            name={isFavourite ? 'heart' : 'heart-outline'}
            size={24}
            color={isFavourite ? '#E30083' : 'gray'}
          />
        </Pressable>
      </View>
      <Text style={styles.description}>{genre}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#eee',
    marginHorizontal: 15,
    marginVertical: 8,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  heading: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
    flex: 1,
    paddingRight: 10,
  },
  description: {
    fontSize: 14,
    color: 'black',
  },
});
