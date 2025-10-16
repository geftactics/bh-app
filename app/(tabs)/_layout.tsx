import { HapticTab } from '@/components/HapticTab';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { MaterialIcons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            // Use a transparent background on iOS to show the blur effect
            position: 'absolute',
          },
          default: {},
        }),
      }}>
      <Tabs.Screen
        name="index"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="stages"
        options={{
          title: 'Stages',
          tabBarIcon: ({ color }) => (<MaterialIcons name="speaker" size={28} color={color} />)
        }}
      />
      <Tabs.Screen
        name="artists"
        options={{
          title: 'Artists',
          tabBarIcon: ({ color }) => (<MaterialIcons name="people" size={28} color={color} />)
        }}
      />
      <Tabs.Screen
        name="nowNext"
        options={{
          title: 'Now/Next',
          tabBarIcon: ({ color }) => (<MaterialIcons name="access-time" size={28} color={color} />)
        }}
      />
      <Tabs.Screen
        name="map"
        options={{
          title: 'Map',
          tabBarIcon: ({ color }) => (<MaterialIcons name="map" size={28} color={color} />)
        }}
      />
      <Tabs.Screen
        name="myList"
        options={{
          title: 'My List',
          tabBarIcon: ({ color }) => (<MaterialIcons name="list-alt" size={28} color={color} />)
        }}
      />
    </Tabs>
  );
}
