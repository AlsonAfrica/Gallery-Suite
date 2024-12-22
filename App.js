import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomePage from './Pages/homePage';
import Profile from './Pages/profile';
import Map from './Pages/map';


const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen 
          name="Home" 
          component={HomePage} 
          options={{ title: 'Welcome Home' }} 
        />
        <Stack.Screen 
          name="Profile" 
          component={Profile} 
          options={{ title: 'Welcome Profile' }} 
        />
        <Stack.Screen 
          name="Map" 
          component={Map} 
          options={{ title: 'Map' }} 
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

