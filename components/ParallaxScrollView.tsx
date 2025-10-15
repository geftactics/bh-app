import React, { forwardRef, useImperativeHandle, type PropsWithChildren, type ReactElement } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  interpolate,
  useAnimatedRef,
  useAnimatedStyle,
  useScrollViewOffset,
} from 'react-native-reanimated';


import { Colors } from '@/constants/Colors';
import { useBottomTabOverflow } from '@/components/ui/TabBarBackground';


const HEADER_HEIGHT = 150;

type Props = PropsWithChildren<{
  headerImage: ReactElement;
  headerBackgroundColor: string;
}>;

// The ref will expose a scrollTo method
export interface ParallaxScrollViewRef {
  scrollTo: (params: { y: number; animated?: boolean }) => void;
}

const ParallaxScrollView = forwardRef<ParallaxScrollViewRef, Props>(({
  children,
  headerImage,
  headerBackgroundColor,
}, ref) => {

  const scrollRef = useAnimatedRef<Animated.ScrollView>();
  const scrollOffset = useScrollViewOffset(scrollRef);
  const bottom = useBottomTabOverflow();

  const headerAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateY: interpolate(
          scrollOffset.value,
          [-HEADER_HEIGHT, 0, HEADER_HEIGHT],
          [-HEADER_HEIGHT / 2, 0, HEADER_HEIGHT * 0.75]
        ),
      },
      {
        scale: interpolate(scrollOffset.value, [-HEADER_HEIGHT, 0, HEADER_HEIGHT], [2, 1, 1]),
      },
    ],
  }));

  // Expose scrollTo method to parent via ref
  useImperativeHandle(ref, () => ({
    scrollTo: ({ y, animated = true }) => {
      // @ts-ignore
      scrollRef.current?.scrollTo({ y, animated });
    },
  }));

  return (
    <View style={[styles.container, { backgroundColor: Colors.background }]}>
      <Animated.ScrollView
        ref={scrollRef}
        scrollEventThrottle={16}
        scrollIndicatorInsets={{ bottom }}
        contentContainerStyle={{ paddingBottom: bottom }}>
        <Animated.View
          style={[
            styles.header,
            { backgroundColor: headerBackgroundColor },
            headerAnimatedStyle,
          ]}>
          {headerImage}
        </Animated.View>
        <View style={[styles.content, { backgroundColor: Colors.background }]}>{children}</View>
      </Animated.ScrollView>
    </View>
  );
});

export default ParallaxScrollView;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    height: HEADER_HEIGHT,
    overflow: 'hidden',
  },
  content: {
    flex: 1,
    padding: 32,
    gap: 16,
    overflow: 'hidden',
  },
});
