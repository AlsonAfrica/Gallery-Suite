import React from 'react';
import { View, Image, StyleSheet, Dimensions, TouchableOpacity, Text } from 'react-native';
import { PinchGestureHandler, State } from 'react-native-gesture-handler';
import Animated, { 
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring
} from 'react-native-reanimated';

const ImageFullScreen = ({ route, navigation }) => {
  const { photo } = route.params;
  
  // Create animated values for scale and focal point
  const scale = useSharedValue(1);
  const focalX = useSharedValue(0);
  const focalY = useSharedValue(0);

  // Handle pinch gesture
  const pinchHandler = useAnimatedGestureHandler({
    onStart: (event) => {
      focalX.value = event.focalX;
      focalY.value = event.focalY;
    },
    onActive: (event) => {
      scale.value = event.scale;
    },
    onEnd: () => {
      // Reset scale with spring animation if it's too small
      if (scale.value < 1) {
        scale.value = withSpring(1);
      }
      // Limit maximum zoom
      else if (scale.value > 4) {
        scale.value = withSpring(4);
      }
    },
  });

  // Create animated style for the image
  const animatedImageStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          scale: scale.value,
        },
      ],
    };
  });

  const AnimatedImage = Animated.createAnimatedComponent(Image);

  return (
    <View style={styles.container}>
      <PinchGestureHandler
        onGestureEvent={pinchHandler}
      >
        <Animated.View>
          <AnimatedImage
            source={{ uri: photo.uri }}
            style={[styles.image, animatedImageStyle]}
          />
        </Animated.View>
      </PinchGestureHandler>

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
    resizeMode: 'contain',
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