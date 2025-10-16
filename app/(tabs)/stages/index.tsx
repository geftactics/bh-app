import ParallaxScrollView from '@/components/ParallaxScrollView';
import StageCard from '@/components/StageCard';
import { Colors } from '@/constants/Colors';
import { photoMap } from '@/constants/StageImages';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Asset } from 'expo-asset';
import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Image, StyleSheet } from 'react-native';

export default function StagesIndexScreen() {
  const [stages, setStages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef<{ scrollTo: (params: { y: number; animated?: boolean }) => void }>(null);

  useEffect(() => {
    const loadStagesAndImages = async () => {
      try {
        const json = await AsyncStorage.getItem('stages');
        const stageList = json ? JSON.parse(json) : [];

        const preloadPromises = stageList.map((stage: any) => {
          const imageModule = photoMap[stage.slug]; 
          return Asset.fromModule(imageModule).downloadAsync();
        });

        await Promise.all(preloadPromises); 

        setStages(stageList);
        setLoading(false);
      } catch (error) {
        console.warn('Failed to load stages:', error);
        setLoading(false);
      }
    };

    loadStagesAndImages();
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" />;
  }

  return (
    <ParallaxScrollView
      ref={scrollRef}
      headerBackgroundColor={Colors.headerBackground}
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
    color: Colors.gray,
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
