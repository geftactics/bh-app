import { Dimensions, StyleSheet, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

export default function TabTwoScreen() {
  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: 51.5074,      // Example: London latitude
          longitude: -0.1278,     // London longitude
          latitudeDelta: 0.05,    // Zoom level
          longitudeDelta: 0.05,
        }}
      >
        <Marker
          coordinate={{ latitude: 51.5074, longitude: -0.1278 }}
          title="Example Marker"
          description="This is a marker on the map"
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
