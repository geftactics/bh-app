import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function ArtistCard({ name, slug, genre }: { name: string; slug: string; genre: string }) {
  const router = useRouter();

  return (
    <TouchableOpacity onPress={() => router.push(`/artists/${slug}`)} style={styles.cardContainer}>
      <View style={styles.card}>
        {/* Left: Image Placeholder */}
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: 'https://via.placeholder.com/80' }} // Replace with real image URL if available
            style={styles.image}
          />
        </View>

        {/* Center: Artist Name */}
        <View style={styles.nameContainer}>
          <Text style={styles.nameText}>{name}</Text>
          <Text style={styles.genreText}>{genre}</Text>
        </View>

        {/* Right: Arrow Icon */}
        <View style={styles.iconContainer}>
          <MaterialIcons name="arrow-forward-ios" size={20} color="#888" />
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
    marginBottom: 1,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 1,
  },
  imageContainer: {
    width: 80,
    height: 80,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#eee',
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
    color: 'grey',
    fontSize: 12,
    fontWeight: '600',
  },
  iconContainer: {
    paddingLeft: 10,
  },
  divider: {
    height: 1,
    backgroundColor: '#ccc',
    marginHorizontal: 10,
    marginTop: 18,
  },
});
