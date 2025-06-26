import React, { useRef } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import MapView, { Marker, Overlay } from 'react-native-maps';

export default function MapScreen() {
  const LAT_MIN = 53.920;
  const LAT_MAX = 53.925;
  const LNG_MIN = -2.322;
  const LNG_MAX = -2.314;

  const mapRef = useRef(null);
  const isAdjusting = useRef(false); // 🔒 prevent re-entry

  const mapRegion = {
    latitude: 53.9224,
    longitude: -2.3173,
    latitudeDelta: 0.002,
    longitudeDelta: 0.002,
  };

  const enforceBounds = (region) => {
    if (isAdjusting.current) return;

    const { latitude, longitude } = region;
    let newLat = latitude;
    let newLng = longitude;

    if (latitude < LAT_MIN) newLat = LAT_MIN;
    if (latitude > LAT_MAX) newLat = LAT_MAX;
    if (longitude < LNG_MIN) newLng = LNG_MIN;
    if (longitude > LNG_MAX) newLng = LNG_MAX;

    const clamped = (newLat !== latitude || newLng !== longitude);

    if (clamped && mapRef.current) {
      isAdjusting.current = true;
      mapRef.current.animateToRegion({
        ...region,
        latitude: newLat,
        longitude: newLng,
      }, 300);

      // Allow time for animateToRegion to settle before re-enabling
      setTimeout(() => {
        isAdjusting.current = false;
      }, 400);
    }
  };

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={mapRegion}
        mapType="satellite"
        minZoomLevel={16}
        maxZoomLevel={20}
        onRegionChangeComplete={enforceBounds}
      >
        <Overlay
          image={require('../../assets/images/placeholder.png')}
          bounds={[[53.921, -2.319], [53.923, -2.316]]} // adjust to match image area
        />
        <Marker
          coordinate={{ latitude: 53.9224033688216, longitude: -2.3172987000990846 }}
          title="The Ring"
        />
        <Marker
          coordinate={{ latitude: 53.92119347024692, longitude: -2.3190932512065348 }}
          title="Stumblefunk at the Factory"
        />
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
