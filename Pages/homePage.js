import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native';


// Icons
import Entypo from '@expo/vector-icons/Entypo';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Feather from '@expo/vector-icons/Feather';



// Beginning of component
export default function HomePage({ navigation}) {
   
  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.content}>
        <StatusBar style="auto" />
        <Text style={styles.text}>Welcome to the Home Page!</Text>
      </SafeAreaView>
      
      {/* Custom Bottom Navigation Bar */}
      <View style={styles.navBar}>
        <TouchableOpacity
          style={styles.navButton}
          onPress={() => navigation.navigate('Gallery')}
        >
          <Text style={styles.navText}><MaterialCommunityIcons name="view-gallery-outline" size={26} color="black" /></Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.navButton}
          onPress={() => navigation.navigate('Camera')}
        >
          <Text style={styles.navText}><Entypo name="camera" size={40} color="black" /></Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.navButton}
          onPress={() => navigation.navigate('Map')}
        >
          <Text style={styles.navText}><Feather name="map-pin" size={26} color="black" /></Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  navBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 60,
    backgroundColor: '#f8f8f8',
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  navButton: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  navText: {
    fontSize: 16,
    color: '#007BFF',
  },
});
