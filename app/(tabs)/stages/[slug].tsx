import PerformanceCard from '@/components/PerformanceCard';
import { Colors } from '@/constants/Colors';
import { logoMap, photoMap } from '@/constants/StageImages';
import { useColorScheme } from '@/hooks/useColorScheme';
import { getCollapsedDaysForToday } from '@/lib/utils';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Stack, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  Image,
  LayoutAnimation,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  UIManager,
  View,
} from 'react-native';

if (Platform.OS === 'android') {
  UIManager.setLayoutAnimationEnabledExperimental?.(true);
}

const dayOrder = ['Thursday', 'Friday', 'Saturday', 'Sunday'];

function isPast(day: string): boolean {
  const now = new Date();
  const dayMap: any = {
    Thursday: 4,
    Friday: 5,
    Saturday: 6,
    Sunday: 0,
  };
  return now.getDay() > dayMap[day] || (now.getDay() === dayMap[day] && now.getHours() >= 5);
}

function timeSort(a: any, b: any) {
  const parse = (t: string) => {
    const h = parseInt(t.slice(0, 2), 10);
    const m = parseInt(t.slice(2), 10);
    return h < 5 ? h + 24 + m / 60 : h + m / 60;
  };
  return parse(a.start) - parse(b.start);
}

export default function StageDetail() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme];
  const { slug } = useLocalSearchParams<{ slug: string }>();

  const [stages, setStages] = useState<any[]>([]);
  const [lineup, setLineup] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>(() => {
    const defaultCollapsedDays = getCollapsedDaysForToday();
    return {
      Thursday: defaultCollapsedDays.includes('Thursday'),
      Friday: defaultCollapsedDays.includes('Friday'),
      Saturday: defaultCollapsedDays.includes('Saturday'),
      Sunday: defaultCollapsedDays.includes('Sunday'),
    };
  });

  useEffect(() => {
    AsyncStorage.getItem('stages').then((json) => {
      if (json) {
        setStages(JSON.parse(json));
      }
    });
    AsyncStorage.getItem('lineup').then((json) => {
      if (json) {
        setLineup(JSON.parse(json));
      }
      setLoading(false);
    });
  }, []);

  const stage = stages.find((s) => s.slug === slug);
  const stagePerformances = lineup.filter((e) => e.venue === slug);

  const performancesByDay: Record<string, any[]> = {};
  dayOrder.forEach((day) => {
    performancesByDay[day] = stagePerformances
      .filter((p) => p.day === day)
      .sort(timeSort);
  });

  const toggleCollapse = (day: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setCollapsed((prev) => ({ ...prev, [day]: !prev[day] }));
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: stage?.name || 'Stage',
          headerBackTitle: 'Back',
          headerStyle: { backgroundColor: 'black' },
          headerTintColor: 'white',
        }}
      />

      {loading ? (
        <View style={[styles.container, { backgroundColor: theme.background }]}> 
          <Text style={styles.title}>Loading...</Text>
        </View>
      ) : !stage ? (
        <View style={[styles.container, { backgroundColor: theme.background }]}> 
          <Text style={styles.error}>Stage not found</Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={[styles.container, { backgroundColor: theme.background, paddingBottom: 100 }]}> 
          <View style={styles.card}>
            <Image source={photoMap[slug]} style={styles.image} />
            <Image source={logoMap[slug]} style={styles.logoOverlay} />
          </View>
          <Text style={styles.description}>{stage.description}</Text>

          {dayOrder.map((day) => (
            performancesByDay[day].length > 0 && (
              <View key={day} style={{ marginBottom: 20 }}>
                <Pressable onPress={() => toggleCollapse(day)}>
                  <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#E30083', marginTop: 20 }}>
                    {collapsed[day] ? '▶' : '▼'} {day}
                  </Text>
                </Pressable>
                {!collapsed[day] && (
                  performancesByDay[day].map((performance) => (
                    <PerformanceCard
                      key={`${performance.day}-${performance.venue}-${performance.start}-${performance.artist}`.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase()}
                      uid={`${performance.day}-${performance.venue}-${performance.start}-${performance.artist}`.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase()}
                      day={performance.day}
                      start={performance.start}
                      end={performance.end}
                      artist={performance.artist}
                      genre={performance.genre}
                      description={performance.description}
                    />
                  ))
                )}
              </View>
            )
          ))}
        </ScrollView>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    flexGrow: 1,
  },
  card: {
    position: 'relative',
    height: 100,
    width: '100%',
    marginBottom: 20,
    borderRadius: 12,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 12,
  },
  logoOverlay: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
    shadowColor: '#000',
    shadowOffset: { width: 5, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 3,
    elevation: 5,
    padding: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  description: {
    fontSize: 14,

  },
  error: {
    color: 'red',
    fontSize: 20,
  },
});
