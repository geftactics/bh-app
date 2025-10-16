import NoPerformanceCard from '@/components/NoPerformanceCard';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import PerformanceCard from '@/components/PerformanceCard';
import { Colors } from '@/constants/Colors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Image, StyleSheet, Text, View } from 'react-native';

const parsePerformanceDate = useMemo(() => (day: string, time: string): Date => {
  const [hh, mm] = [parseInt(time.slice(0, 2)), parseInt(time.slice(2))];

  const dayOffset: Record<string, number> = {
    Thursday: 0,
    Friday: 1,
    Saturday: 2,
    Sunday: 3,
  };

  const now = new Date();

  // Step 1: Find the *Thursday* of this week
  const dayOfWeek = now.getDay(); // 0 (Sun) to 6 (Sat)
  const daysSinceThursday = (dayOfWeek + 7 - 4) % 7; // 4 = Thursday
  const festivalThursday = new Date(now);
  festivalThursday.setDate(now.getDate() - daysSinceThursday);
  festivalThursday.setHours(0, 0, 0, 0);

  // Step 2: Add offset for correct day (Fri = +1, Sat = +2, etc)
  const performanceDate = new Date(festivalThursday);
  performanceDate.setDate(festivalThursday.getDate() + dayOffset[day]);

  // Step 3: Apply hour/minute
  performanceDate.setHours(hh, mm, 0, 0);

  // Step 4: Treat late-night (e.g., 0200) as next calendar day
  if (hh < 5) {
    performanceDate.setDate(performanceDate.getDate() + 1);
  }

  return performanceDate;
}, []);

export default function NowNextScreen() {
  const [stages, setStages] = useState<any[]>([]);
  const [lineup, setLineup] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [now, setNow] = useState(new Date());

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      const loadData = async () => {
        try {
          const [s, l] = await Promise.all([
            AsyncStorage.getItem('stages'),
            AsyncStorage.getItem('lineup'),
          ]);

          if (isActive) {
            setStages(s ? JSON.parse(s) : []);
            setLineup(l ? JSON.parse(l) : []);
            setLoading(false);
          }
        } catch (error) {
          console.warn('Failed to load data:', error);
          if (isActive) setLoading(false);
        }
      };

      loadData();

      return () => {
        isActive = false;
      };
    }, []) // <- only run once, like artists/index
  );


  // Refresh the current time every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setNow(new Date());
    }, 60000);

    return () => clearInterval(interval);
  }, []);


    const getFestivalDayBounds = (now: Date) => {
    const start = new Date(now);
    const end = new Date(now);

    if (now.getHours() < 5) {
      // Before 5am → still part of previous festival day
      start.setDate(start.getDate() - 1);
    }

    // Set bounds of current festival day
    start.setHours(5, 0, 0, 0); // 05:00 today
    end.setTime(start.getTime() + 24 * 60 * 60 * 1000); // +24h → 04:59 next day

    return { start, end };
  };

  const getNowAndNext = (slug: string) => {
    const { start: dayStart, end: dayEnd } = getFestivalDayBounds(now);

    const events = lineup
      .filter((e) => e.venue === slug)
      .map((e) => ({
        ...e,
        startDate: parsePerformanceDate(e.day, e.start),
        endDate: parsePerformanceDate(e.day, e.end),
      }))
      .filter((e) => e.startDate >= dayStart && e.startDate < dayEnd) // only today's events
      .sort((a, b) => a.startDate.getTime() - b.startDate.getTime());

    const current = events.find((e) => now >= e.startDate && now <= e.endDate);
    const next = events.find((e) => e.startDate > now);

    return { current, next };
  };



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
      {loading ? (
        <ActivityIndicator size="large" color={Colors.tint} />
      ) : (
        stages.map((stage) => {
          const { current, next } = getNowAndNext(stage.slug);

          return (
            <View key={stage.slug} style={styles.stageBlock}>
              <Text style={styles.stageTitle}>{stage.name}</Text>

              {current ? (
                <PerformanceCard
                  key={`now-${current.day}-${current.venue}-${current.start}-${current.artist}`.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase()}
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
                  key={`now-closed-${stage.slug}`}
                  description="Now – Venue closed"
                />
              )}

              {next ? (
                <PerformanceCard
                  key={`next-${next.day}-${next.venue}-${next.start}-${next.artist}`.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase()}
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
                  key={`next-closed-${stage.slug}`}
                  description="Next – Venue closed"
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
    color: Colors.gray,
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
    borderBottomColor: Colors.lightGray,
  },
  stageTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
    color: Colors.tint,
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
