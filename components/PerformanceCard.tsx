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
  noLink?: boolean;
};

const dayOrder = ['Thursday', 'Friday', 'Saturday', 'Sunday'];

export default function PerformanceCard({
  uid,
  day,
  start,
  end,
  noLink,
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
        if (match) {
          setFormattedVenue(match.name);
        }
      }
    });
  }, [venue]);

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
      console.log(favs);

    } catch (error) {
      console.error('Error toggling favourite:', error);
    }
  };

  const handleCardPress = () => {
    const slug = encodeURIComponent(artist);
    if (!noLink) {
      router.push(`/artists/${slug}`, { withAnchor: true });
    }
  };

  // === Check if this event has finished ===
  function hasEventFinished() {
    const now = new Date();

    const dayIndexMap: Record<string, number> = {
      Sunday: 0,
      Monday: 1,
      Tuesday: 2,
      Wednesday: 3,
      Thursday: 4,
      Friday: 5,
      Saturday: 6,
    };

    const eventDayIndex = dayIndexMap[day];
    if (eventDayIndex === undefined) return false;

    const endHour = parseInt(end.slice(0, 2), 10);
    const endMin = parseInt(end.slice(2), 10);

    // Start by finding the most recent occurrence of this event's day
    const eventEnd = new Date(now);
    const daysSinceEvent =
      (now.getDay() - eventDayIndex + 7) % 7; // how many days ago the event's day was
    eventEnd.setDate(now.getDate() - daysSinceEvent);

    eventEnd.setHours(endHour);
    eventEnd.setMinutes(endMin);
    eventEnd.setSeconds(0);
    eventEnd.setMilliseconds(0);

    // Handle post-midnight performances (e.g. 0100): those actually happen the next calendar day
    if (endHour < 5) {
      eventEnd.setDate(eventEnd.getDate() + 1);
    }

    return now.getTime() > eventEnd.getTime();
  }



  const fadedOut = hasEventFinished();

  return (
    <Pressable onPress={handleCardPress} style={[styles.card, fadedOut && { opacity: 0.6 }]}>
      <View style={styles.row}>
        <Text style={styles.heading}>
          {artist && venue ? `${artist}\n` : ''}
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
    marginHorizontal: 5,
    marginVertical: 8,
    borderRadius: 12,
    minHeight: 75,
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
