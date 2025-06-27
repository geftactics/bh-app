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

  function hasEventFinished() {
    const festivalStart = new Date('2025-06-26');
    const festivalEnd = new Date('2025-06-29T23:59:59');

    const now = new Date();

    const getFestivalDayIndex = (date: Date) => {
      const adjusted = new Date(date);
      if (adjusted.getHours() < 5) {
        adjusted.setDate(adjusted.getDate() - 1);
      }
      const dayIndex = adjusted.getDay(); // Sunday = 0
      return dayIndex === 0 ? 7 : dayIndex; // Sunday as 7
    };

    const today = getFestivalDayIndex(now);

    const dayIndexMap: Record<string, number> = {
      Monday: 1,
      Tuesday: 2,
      Wednesday: 3,
      Thursday: 4,
      Friday: 5,
      Saturday: 6,
      Sunday: 7,
    };

    const endHour = parseInt(end.slice(0, 2), 10);
    const endMin = parseInt(end.slice(2), 10);
    const endInt = parseInt(end, 10);
    const nowStamp = parseInt(
      `${now.getHours()}${now.getMinutes().toString().padStart(2, '0')}`,
      10
    );

    // Before festival
    if (now < festivalStart) return false;

    // After festival
    if (now > festivalEnd) return true;

    const perfDayIndex = dayIndexMap[day];

    // Performance is after today
    if (today < perfDayIndex) return false;

    // Performance is before today
    if (today > perfDayIndex) return true;

    // Performance is today
    if (today === perfDayIndex) {
      if (endInt < 500) {
        // ends post-midnight
        if (now.getHours() < 5) {
          // still before 5am
          return nowStamp > endInt;
        } else {
          // not past midnight yet, event hasn’t happened
          return false;
        }
      }

      if (now.getHours() < 5) {
        // it's a new calendar day, but still festival previous night
        return true; // pre-midnight event definitely over
      }

      return nowStamp > endInt;
    }

    return false;
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
