import PerformanceCard from '@/components/PerformanceCard';
import { Colors } from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Stack, useLocalSearchParams, useNavigation } from 'expo-router';
import { useEffect, useLayoutEffect, useState } from 'react';
import { ActivityIndicator, Image, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const dayOrder = ['Thursday', 'Friday', 'Saturday', 'Sunday'];

export default function ArtistDetail() {
  const navigation = useNavigation();
  const { slug } = useLocalSearchParams<{ slug: string }>();

  const [entries, setEntries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{ flexDirection: 'row', alignItems: 'center', marginLeft: Platform.OS === 'ios' ? -10 : 0 }}
        >
          <Ionicons name="chevron-back" size={24} color={Colors.white} />
          {Platform.OS === 'ios' && (
            <Text style={{ color: Colors.white, fontSize: 17, marginLeft: 2 }}>Back</Text>
          )}
        </TouchableOpacity>
      ),
    });
  }, [navigation]);
  
  useEffect(() => {
    AsyncStorage.getItem('lineup').then((json) => {
      if (json) {
        setEntries(JSON.parse(json));
      }
      setLoading(false);
    });
  }, []);

  const artistName = slug ? decodeURIComponent(slug) : '';

  const artistPerformances = entries.filter((e) => e.artist === artistName);

  const artist = artistPerformances[0]; // use first performance for image/description etc

  const sortedPerformances = [...artistPerformances].sort((a, b) => {
    const dayDiff = dayOrder.indexOf(a.day) - dayOrder.indexOf(b.day);
    return dayDiff !== 0 ? dayDiff : parseInt(a.start) - parseInt(b.start);
  });

  return (
    <>
      <Stack.Screen
        options={{
          title: '',
          headerBackTitle: 'Back',
          headerStyle: { backgroundColor: Colors.black },
          headerTintColor: Colors.white,
        }}
      />

      {loading ? (
        <View style={[styles.container, { backgroundColor: Colors.background }]}>
          <ActivityIndicator size="large" color={Colors.tint} />
        </View>
      ) : !artist ? (
        <View style={[styles.container, { backgroundColor: Colors.background }]}>
          <Text style={styles.error}>Artist not found</Text>
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={[
            styles.container,
            { backgroundColor: Colors.background, paddingBottom: 80 },
          ]}
        >
          <View style={styles.topRow}>
            <View style={styles.imageContainer}>
              <Image
                source={
                  error || !artist.image
                    ? require('../../assets/images/placeholder.png')
                    : { uri: artist.image }
                }
                style={styles.image}
                onError={() => setError(true)}
                resizeMode="cover"
              />
            </View>

            <View style={styles.pinkBox}>
              <Text style={styles.artistName}>{artist.artist}</Text>
            </View>
          </View>

          {artist.description && (
            <View style={[styles.descriptionContainer, { padding: 7 }]}>
              <Text style={styles.descriptionText}>{artist.description}</Text>
            </View>
          )}

          {sortedPerformances.map((performance) => (
            <View 
              style={[styles.descriptionContainer, { padding: 0 }]}
              key={`${performance.day}-${performance.venue}-${performance.start}-${performance.artist}`.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase()}
            >
            <PerformanceCard
              noLink={true}
              day={performance.day}
              start={performance.start}
              end={performance.end}
              venue={performance.venue}
              artist={performance.artist}
              genre={performance.genre}
              description={performance.description}
              uid={`${performance.day}-${performance.venue}-${performance.start}-${performance.artist}`.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase()}
            />
            </View>
          ))}
        </ScrollView>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 0,
    flexGrow: 1,
  },
  innerContainer: {
    padding:10
  },
  topRow: {
    flexDirection: 'row',
    marginBottom: 20,
    alignItems: 'center',
  },
  imageContainer: {
    width: '50%',
    aspectRatio: 1,
    backgroundColor: Colors.cardBackground,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  pinkBox: {
    width: '50%',
    aspectRatio: 1,
    backgroundColor: Colors.tint,
    justifyContent: 'center',
    alignItems: 'center',
  },
  artistName: {
    fontWeight: 'bold',
    fontSize: 29,
    color: Colors.black,
    textAlign: 'center',
    paddingHorizontal: 10,
  },
  descriptionText: {
    fontSize: 16,
  },
  descriptionContainer: {
    marginHorizontal: 18,
    marginBottom: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  error: {
    color: 'red',
    fontSize: 20,
  },
});
