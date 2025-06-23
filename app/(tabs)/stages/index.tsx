import ParallaxScrollView from '@/components/ParallaxScrollView';
import StageCard from '@/components/StageCard';
import { photoMap } from '@/constants/StageImages';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Asset } from 'expo-asset';
import { useNavigation } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Image, StyleSheet } from 'react-native';

export default function TabTwoScreen() {
  const [stages, setStages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef<{ scrollTo: (params: { y: number; animated?: boolean }) => void }>(null);
  const navigation = useNavigation();

  useEffect(() => {
    const loadStagesAndImages = async () => {
      const json = await AsyncStorage.getItem('stages');
      const stageList = json ? JSON.parse(json) : [];

      const preloadPromises = stageList.map((stage: any) => {
        const imageModule = photoMap[stage.slug]; 
        return Asset.fromModule(imageModule).downloadAsync();
      });

      await Promise.all(preloadPromises); 

      setStages(stageList);
      setLoading(false);
    };

    loadStagesAndImages();
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" />;
  }

  return (
    <ParallaxScrollView
      ref={scrollRef}
      headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
      headerImage={
          <Image
            source={require('@/assets/images/header-logo.png')}
            style={styles.topImage}
          />
      }
    >
      {stages.map((stage) => (
        <StageCard key={stage.slug} name={stage.name} slug={stage.slug} />
      ))}
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
