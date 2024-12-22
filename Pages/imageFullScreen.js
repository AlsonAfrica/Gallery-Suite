import React from 'react';
import { View, Image, StyleSheet, Dimensions, TouchableOpacity,Text } from 'react-native';

const ImageFullScreen= ({ route, navigation }) => {
  const { photo } = route.params;  

  return (
    <View style={styles.container}>
      <Image source={{ uri: photo.uri }} style={styles.image} />

      <TouchableOpacity
        style={styles.closeButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.closeButtonText}>Close</Text>
      </TouchableOpacity>
    </View>
  );
};

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: windowWidth,
    height: windowHeight,
    resizeMode: 'contain',  // This ensures the image fits within the screen
  },
  closeButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 10,
    borderRadius: 20,
  },
  closeButtonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default ImageFullScreen;
