import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// Pages 
import HomePage from './Pages/homePage';
import Map from './Pages/map';
import Gallery from './Pages/gallery';
import Camera from './Pages/cameraPage';
import ImageFullScreen from './Pages/imageFullScreen';


const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen 
          name="Home" 
          component={HomePage} 
          options={{ headerShown: false }} 
          
        />
        <Stack.Screen 
          name="Gallery" 
          component={Gallery} 
          options={{ title: 'Gallery' }} 
        />
        <Stack.Screen 
          name="Map" 
          component={Map} 
          options={{ title: 'Map' }} 
        />
        <Stack.Screen 
          name="Camera" 
          component={Camera} 
          options={{ title: 'Camera' }} 
        />
        <Stack.Screen 
          name="Image" 
          component={ImageFullScreen} 
          options={{ title: 'Image' }} 
        />
      </Stack.Navigator>
      <StatusBar style="auto" />
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

