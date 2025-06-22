import NoPerformanceCard from '@/components/NoPerformanceCard';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import PerformanceCard from '@/components/PerformanceCard';
import { IconSymbol } from '@/components/ui/IconSymbol';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

// Convert a performance's day and time into a JavaScript Date
function parsePerformanceDate(day: string, time: string): Date {
  const dayMap: Record<string, number> = {
    Thursday: 4,
    Friday: 5,
    Saturday: 6,
    Sunday: 0,
  };

  const [hh, mm] = [parseInt(time.slice(0, 2)), parseInt(time.slice(2))];
  const now = new Date();
  const result = new Date(now);

  const daysUntil = (dayMap[day] - now.getDay() + 7) % 7;
  result.setDate(now.getDate() + daysUntil);
  result.setHours(hh, mm, 0, 0);

  // Treat 0000–0459 as part of previous day
  if (hh < 5) {
    result.setDate(result.getDate() + 1);
  }

  return result;
}

export default function NowNextScreen() {
  const [stages, setStages] = useState<any[]>([]);
  const [lineup, setLineup] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const [s, l] = await Promise.all([
        AsyncStorage.getItem('stages'),
        AsyncStorage.getItem('lineup'),
      ]);
      setStages(s ? JSON.parse(s) : []);
      setLineup(l ? JSON.parse(l) : []);
      setLoading(false);
    };
    load();
  }, []);

  const now = new Date();

  const getNowAndNext = (slug: string) => {
    const events = lineup
      .filter((e) => e.venue === slug)
      .map((e) => ({
        ...e,
        startDate: parsePerformanceDate(e.day, e.start),
        endDate: parsePerformanceDate(e.day, e.end),
      }))
      .sort((a, b) => a.startDate.getTime() - b.startDate.getTime());

    const current = events.find((e) => now >= e.startDate && now <= e.endDate);
    const next = events.find((e) => e.startDate > now);

    return { current, next };
  };

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

      {loading ? (
        <Text style={styles.loading}>Loading...</Text>
      ) : (
        stages.map((stage) => {
          const { current, next } = getNowAndNext(stage.slug);

          return (
            <View key={stage.slug} style={styles.stageBlock}>
              <Text style={styles.stageTitle}>{stage.name}</Text>
              {current ? (
                <PerformanceCard
                  key={`${current.day}-${current.venue}-${current.start}-${current.artist}`.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase()}
                  uid={`${current.day}-${current.venue}-${current.start}-${current.artist}`.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase()}
                  day={current.day}
                  start={current.start}
                  end={current.end}
                  artist={current.artist}
                  genre={current.genre}
                  description={current.description}
                />
              ) : (
                <NoPerformanceCard
                  key={`venue-closed-${Math.random().toString(36).substr(2, 9)}`}
                  description='Now - Venue closed'
                />
              )}
              {next ? (
                <PerformanceCard
                  key={`${next.day}-${next.venue}-${next.start}-${next.artist}`.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase()}
                  uid={`${next.day}-${next.venue}-${next.start}-${next.artist}`.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase()}
                  day={next.day}
                  start={next.start}
                  end={next.end}
                  artist={next.artist}
                  genre={next.genre}
                  description={next.description}
                />
              ) : (
                <NoPerformanceCard
                  key={`venue-closed-${Math.random().toString(36).substr(2, 9)}`}
                  description='Next - Venue closed'
                />
              )}
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
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  loading: {
    padding: 20,
    fontStyle: 'italic',
  },
  stageBlock: {
    marginHorizontal: -15,
    paddingBottom: 20,
    marginBottom: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  stageTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#E30083'
  },
  now: {
    color: 'green',
  },
  next: {
    color: 'blue',
  },
  closed: {
    color: 'gray',
    fontStyle: 'italic',
  },
});
