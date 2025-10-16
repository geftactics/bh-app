import { Colors } from '@/constants/Colors';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function ArtistCard({
  name,
  slug,
  genre,
  image,
}: {
  name: string;
  slug: string;
  genre: string;
  image: string;
}) {
  const router = useRouter();
  const [error, setError] = useState(false);

  return (
    <TouchableOpacity
      onPress={() => router.push(`/artists/${slug}`)}
      style={styles.cardContainer}
    >
      <View style={styles.card}>
        {/* Left: Image with fallback */}
        <View style={styles.imageContainer}>
          <Image
            source={
              error || !image
                ? require('@/assets/images/placeholder.png') 
                : { uri: image }
            }
            style={styles.image}
            onError={() => setError(true)}
            resizeMode="cover"
          />
        </View>

        {/* Center: Artist Name and Genre */}
        <View style={styles.nameContainer}>
          <Text style={styles.nameText}>{name}</Text>
          <Text style={styles.genreText}>{genre}</Text>
        </View>

        {/* Right: Arrow Icon */}
        <View style={styles.iconContainer}>
          <MaterialIcons name="arrow-forward-ios" size={20} color={Colors.arrow} />
        </View>
      </View>

      {/* Horizontal Rule */}
      <View style={styles.divider} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    width: '100%',
    marginBottom: 0,
    marginTop: -10,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 0,
  },
  imageContainer: {
    width: 60,
    height: 60,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: Colors.cardBackground,
    marginRight: 20,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  nameContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  nameText: {
    fontSize: 18,
    fontWeight: '600',
  },
  genreText: {
    marginTop: 5,
    color: Colors.gray,
    fontSize: 12,
    fontWeight: '600',
  },
  iconContainer: {
    paddingLeft: 10,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.lightGray,
    marginHorizontal: 10,
    marginTop: 5,
  },
});
