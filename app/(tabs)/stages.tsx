import ParallaxScrollView from '@/components/ParallaxScrollView';
import StageCard from '@/components/StageCard';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet } from 'react-native';

export default function TabTwoScreen() {

  const [stages, setStages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    AsyncStorage.getItem('stages').then((json) => {
      if (json) {
        console.log(json)
        setStages(JSON.parse(json));
      }
      setLoading(false);
    });
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" />;
  }

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
      headerImage={
        <IconSymbol
          size={310}
          color="#808080"
          name="chevron.left.forwardslash.chevron.right"
          style={styles.headerImage}
        />
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Stages</ThemedText>
      </ThemedView>
      <ThemedText>This page will be stages list</ThemedText>
       <ScrollView contentContainerStyle={{ padding: 0 }}>
        {stages.map((stage) => (
          <StageCard key={stage.slug} name={stage.name} slug={stage.slug} />
        ))}
      </ScrollView>
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
});
