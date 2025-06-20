// app/stages/[slug].tsx
import { Colors } from '@/constants/Colors';
import { logoMap, photoMap } from '@/constants/StageImages';
import { useColorScheme } from '@/hooks/useColorScheme';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Stack, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';

export default function StageDetail() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme];
  const { slug } = useLocalSearchParams<{ slug: string }>();

  const [stages, setStages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    AsyncStorage.getItem('stages').then((json) => {
      if (json) {
        setStages(JSON.parse(json));
      }
      setLoading(false);
    });
  }, []);

  const stage = stages.find((s) => s.slug === slug);

  return (
    <>
      <Stack.Screen
        options={{
          title: stage?.name || 'Stage',
          headerBackTitle: 'Back',
          headerStyle: {
            backgroundColor: 'black',
          },
          headerTintColor: 'white', // adjust this if you have a `text` color in your theme
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
        <ScrollView contentContainerStyle={[styles.container, { backgroundColor: theme.background }]}>
          <View style={styles.card}>
            <Image source={photoMap[slug]} style={styles.image} />
            <Image source={logoMap[slug]} style={styles.logoOverlay} />
          </View>
          <Text style={styles.description}>{stage.description}</Text>
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
    fontSize: 16,
    lineHeight: 22,
  },
  error: {
    color: 'red',
    fontSize: 20,
  },
});
