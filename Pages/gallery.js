import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, FlatList, Dimensions, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native';
import * as SQLite from 'expo-sqlite';

export default function Gallery({ navigation }) {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [db, setDb] = useState(null);

  useEffect(() => {
    initDB();
  }, []);

  const initDB = async () => {
    try {
      const database = await SQLite.openDatabaseAsync('photos.db');
      setDb(database);
      await loadPhotos(database);
    } catch (error) {
      console.error('Database initialization error:', error);
      setLoading(false);
    }
  };

  const loadPhotos = async (database) => {
    try {
      const results = await database.getAllAsync('SELECT * FROM photos ORDER BY timestamp DESC');
      setPhotos(results);
    } catch (error) {
      console.error('Error loading photos:', error);
    } finally {
      setLoading(false);
    }
  };

  const refreshGallery = () => {
    setLoading(true);
    if (db) {
      loadPhotos(db);
    }
  };

  const handlePhotoPress = (photo) => {
    navigation.navigate('PhotoDetail', { photo });
  };

  const renderPhoto = ({ item }) => (
    <TouchableOpacity 
      style={styles.photoContainer} 
      onPress={() => handlePhotoPress(item)}
    >
      <Image
        source={{ uri: item.uri }}
        style={styles.photo}
      />
      <View style={styles.photoInfo}>
        <Text style={styles.photoDate} numberOfLines={1}>
          {new Date(item.timestamp).toLocaleDateString()}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyStateText}>No photos yet</Text>
      <TouchableOpacity 
        style={styles.captureButton}
        onPress={() => navigation.navigate('Camera')}
      >
        <Text style={styles.captureButtonText}>Take a Photo</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.content}>
        <StatusBar style="auto" />
        
        <View style={styles.header}>
          <Text style={styles.title}>Gallery</Text>
          <TouchableOpacity onPress={refreshGallery}>
            <Text style={styles.refreshButton}>Refresh</Text>
          </TouchableOpacity>
        </View>

        {loading ? (
          <ActivityIndicator size="large" color="#007BFF" />
        ) : (
          <FlatList
            data={photos}
            renderItem={renderPhoto}
            keyExtractor={(item) => item.id.toString()}
            numColumns={4}
            contentContainerStyle={styles.photoGrid}
            ListEmptyComponent={renderEmptyState}
            showsVerticalScrollIndicator={false}
          />
        )}
      </SafeAreaView>
      {/* Custom Bottom Navigation Bar */}
    </View>
  );
}


const windowWidth = Dimensions.get('window').width;
const photoSize = (windowWidth - 50) / 4; // 2 columns with margins

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  refreshButton: {
    color: '#007BFF',
    fontSize: 16,
  },
  photoGrid: {
    padding: 8,
  },
  photoContainer: {
    margin: 4,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    overflow: 'hidden',
  },
  photo: {
    width: photoSize,
    height: photoSize,
  },
  photoInfo: {
    padding: 4,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
  },
  photoDate: {
    fontSize: 12,
    color: '#666',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyStateText: {
    fontSize: 18,
    color: '#666',
    marginBottom: 20,
  },
  captureButton: {
    backgroundColor: '#007BFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  captureButtonText: {
    color: '#fff',
    fontSize: 16,
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