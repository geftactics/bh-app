import PerformanceCard from '@/components/PerformanceCard';
import { Colors } from '@/constants/Colors';
import { logoMap, photoMap } from '@/constants/StageImages';
import { getCollapsedDaysForToday } from '@/lib/utils';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { Stack, useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
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

const DAY_ORDER = ['Thursday', 'Friday', 'Saturday', 'Sunday'] as const;

const DAY_MAP = {
  Thursday: 4,
  Friday: 5,
  Saturday: 6,
  Sunday: 0,
} as const;

function parseTime(timeString: string): number {
  const hours = parseInt(timeString.slice(0, 2), 10);
  const minutes = parseInt(timeString.slice(2), 10);
  return hours < 5 ? hours + 24 + minutes / 60 : hours + minutes / 60;
}

function timeSort(a: any, b: any): number {
  return parseTime(a.start) - parseTime(b.start);
}

/**
 * Stage detail screen showing performances for a specific stage
 */
export default function StageDetail() {
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


  useFocusEffect(
    React.useCallback(() => {
      let isActive = true;

      const load = async () => {
        const [s, l] = await Promise.all([
          AsyncStorage.getItem('stages'),
          AsyncStorage.getItem('lineup'),
        ]);

        if (!isActive) return;

        setStages(s ? JSON.parse(s) : []);
        setLineup(l ? JSON.parse(l) : []);
        setLoading(false);
      };

      load();

      return () => {
        isActive = false;
      };
    }, [])
  );


  const stage = stages.find((s) => s.slug === slug);
  const stagePerformances = lineup.filter((e) => e.venue === slug);

  const performancesByDay: Record<string, any[]> = {};
  DAY_ORDER.forEach((day) => {
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
          headerStyle: { backgroundColor: Colors.black },
          headerTintColor: Colors.white,
        }}
      />

      {loading ? (
        <View style={[styles.container, { backgroundColor: Colors.background }]}> 
          <ActivityIndicator size="large" color={Colors.tint} />
        </View>
      ) : !stage ? (
        <View style={[styles.container, { backgroundColor: Colors.background }]}> 
          <Text style={styles.error}>Stage not found</Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={[styles.container, { backgroundColor: Colors.background, paddingBottom: 100 }]}> 
          <View style={styles.card}>
            <Image source={photoMap[slug]} style={styles.image} />
            <Image source={logoMap[slug]} style={styles.logoOverlay} />
          </View>
          <Text style={styles.description}>{stage.description}</Text>

          {DAY_ORDER.map((day) => (
            performancesByDay[day].length > 0 && (
              <View key={day} style={styles.daySection}>
                <Pressable onPress={() => toggleCollapse(day)}>
                  <Text style={styles.dayHeader}>
                    {collapsed[day] ? '▶' : '▼'} {day}
                  </Text>
                </Pressable>
                {!collapsed[day] && (
                  performancesByDay[day].map((performance) => {
                    const uid = `${performance.day}-${performance.venue}-${performance.start}-${performance.artist}`
                      .replace(/[^a-zA-Z0-9]/g, '-')
                      .toLowerCase();
                    
                    return (
                      <PerformanceCard
                        key={uid}
                        uid={uid}
                        day={performance.day}
                        start={performance.start}
                        end={performance.end}
                        artist={performance.artist}
                        genre={performance.genre}
                        description={performance.description}
                      />
                    );
                  })
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
    shadowColor: Colors.shadow,
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
    fontSize: 16,
  },
  daySection: {
    marginBottom: 20,
  },
  dayHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.tint,
    marginTop: 20,
  },
  error: {
    color: 'red',
    fontSize: 20,
  },
});
