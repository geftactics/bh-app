// components/StageCard.tsx

import { logoMap, photoMap } from '@/constants/StageImages';
import { useRouter } from 'expo-router';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';

export default function StageCard({ name, slug }: { name: string; slug: string }) {
  const router = useRouter();

  return (
    <TouchableOpacity onPress={() => router.push(`/stages/${slug}`)}>
      <View style={styles.card}>
        <Image source={photoMap[slug]} style={styles.image} />
        <Image source={logoMap[slug]} style={styles.logoOverlay} />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    position: 'relative',
    height: 100,
    width: '100%',
    marginBottom: 10,
    borderRadius: 12,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
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
    padding: 10

  },
  titleBox: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: 'rgba(0,0,0,0.4)',
    padding: 10,
  },
  title: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
});
