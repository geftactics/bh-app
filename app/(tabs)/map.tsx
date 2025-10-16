import * as Location from 'expo-location';
import React, { useEffect, useMemo, useRef } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import MapView, { Overlay } from 'react-native-maps';

export default function MapScreen() {

  useEffect(() => {
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          console.warn('Permission to access location was denied');
          return;
        }
        const location = await Location.getCurrentPositionAsync({});
        console.log('User location:', location.coords);
      } catch (error) {
        console.warn('Failed to get location:', error);
      }
    })();
  }, []);

  const MAP_BOUNDS = useMemo(() => ({
    LAT_MIN: 53.920,
    LAT_MAX: 53.925,
    LNG_MIN: -2.322,
    LNG_MAX: -2.314,
  }), []);

  const ANIMATION_DURATION = 300;
  const ADJUSTMENT_DELAY = 400;

  const mapRef = useRef(null);
  const isAdjusting = useRef(false);

  const mapRegion = useMemo(() => ({
    latitude: 53.9224,
    longitude: -2.3173,
    latitudeDelta: 0.002,
    longitudeDelta: 0.002,
  }), []);

  const clampCoordinate = (value: number, min: number, max: number) => {
    return Math.max(min, Math.min(max, value));
  };

  const enforceBounds = (region) => {
    if (isAdjusting.current || !mapRef.current) return;

    const { latitude, longitude } = region;
    const newLat = clampCoordinate(latitude, MAP_BOUNDS.LAT_MIN, MAP_BOUNDS.LAT_MAX);
    const newLng = clampCoordinate(longitude, MAP_BOUNDS.LNG_MIN, MAP_BOUNDS.LNG_MAX);

    const needsAdjustment = newLat !== latitude || newLng !== longitude;

    if (needsAdjustment) {
      isAdjusting.current = true;
      mapRef.current.animateToRegion({
        ...region,
        latitude: newLat,
        longitude: newLng,
      }, ANIMATION_DURATION);

      setTimeout(() => {
        isAdjusting.current = false;
      }, ADJUSTMENT_DELAY);
    }
  };

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={mapRegion}
        mapType="satellite"
        minZoomLevel={15}
        maxZoomLevel={20}
        onRegionChangeComplete={enforceBounds}
        showsUserLocation={true}
        showsMyLocationButton={true}
      >
        <Overlay
          image={require('../../assets/images/map.png')}
          bounds={[[53.91858546665261, -2.323428140894661], [53.92567009497323, -2.309537849205826]]}
        />
        {/* <Marker
          coordinate={{ latitude: 53.9224033688216, longitude: -2.3172987000990846 }}
          title="The Ring"
        />
        <Marker
          coordinate={{ latitude: 53.92119347024692, longitude: -2.3190932512065348 }}
          title="Stumblefunk at the Factory"
        /> */}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
});
