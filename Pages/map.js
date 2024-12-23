import React from 'react';
import { StyleSheet, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

export default function Map({ navigation, route }) {
  const { photos } = route.params;

  // Filter and map photos to extract valid locations
  const locations = photos

  // Filter out latitude and longitude from photos
    .filter(photo => photo.latitude && photo.longitude) 

    // Map through photos
    .map(photo => ({
      id: photo.id,
      latitude: photo.latitude,
      longitude: photo.longitude,
      uri: photo.uri,
      timestamp: photo.timestamp,
    }));
  
    // console.log for data check
  console.log(JSON.stringify(locations, null, 2));

  // Rendering the map component with dynamic data
  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: locations[0]?.latitude || 0,
          longitude: locations[0]?.longitude || 0,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
      >
        {locations.map(location => (
          <Marker
            key={location.id}
            coordinate={{
              latitude: location.latitude,
              longitude: location.longitude,
            }}
            title={`Photo ID: ${location.id}`}
            description={`Taken at: ${new Date(location.timestamp).toLocaleString()}`}
          />
        ))}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
});
