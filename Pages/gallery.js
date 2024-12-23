import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, FlatList, Dimensions, ActivityIndicator, TextInput,Alert } from 'react-native';
import { SafeAreaView } from 'react-native';
import * as SQLite from 'expo-sqlite';
import Map from './map';
import Feather from '@expo/vector-icons/Feather';
import * as FileSystem from 'expo-file-system';


export default function Gallery({ navigation }) {
  // States
  const [photos, setPhotos] = useState([]);
  const [filteredPhotos, setFilteredPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [db, setDb] = useState(null);
  const [showMap,setshowMap] = useState(false)

  // Functions
  useEffect(() => {
    initDB();
  }, []);

  useEffect(() => {
    filterPhotos();
  }, [searchQuery, photos]);

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

  // Delete image function 
  const deletePhoto = async (photoId, uri) => {
    try {
      // Delete from database using runAsync
      const result = await db.runAsync(
        'DELETE FROM photos WHERE id = ?',
        [photoId]
      );

      if (result.changes > 0) {
        // Successfully deleted from database
        console.log(`Deleted photo with ID: ${photoId}`);
        
        // Remove from local state
        const updatedPhotos = photos.filter(photo => photo.id !== photoId);
        setPhotos(updatedPhotos);
        setFilteredPhotos(updatedPhotos);
        
        // Delete the actual file from filesystem
        try {
          await FileSystem.deleteAsync(uri);
          console.log('File deleted successfully');
        } catch (fileError) {
          console.error('Error deleting file:', fileError);
          // Continue even if file deletion fails
        }
      } else {
        throw new Error('No photo was deleted');
      }
    } catch (error) {
      console.error('Error deleting photo:', error);
      Alert.alert(
        'Error',
        'Failed to delete photo. Please try again.',
        [{ text: 'OK' }]
      );
    }
  };


  // Confirmation Dialog for deleting an image
  const handleLongPress = (photo) => {
    Alert.alert(
      'Delete Photo',
      'Are you sure you want to delete this photo?',
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => deletePhoto(photo.id, photo.uri)
        }
      ],
      { cancelable: true }
    );
  };

  // Retrive Photos from the database
  const loadPhotos = async (database) => {
    try {
      const results = await database.getAllAsync('SELECT * FROM photos ORDER BY timestamp DESC');
      setPhotos(results);
      setFilteredPhotos(results);
    } catch (error) {
      console.error('Error loading photos:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filter images by date search
  const filterPhotos = () => {
    if (!searchQuery.trim()) {
      setFilteredPhotos(photos);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = photos.filter(photo => {
      const date = new Date(photo.timestamp).toLocaleDateString().toLowerCase();
      const hasLocation = photo.latitude && photo.longitude;
      const locationString = hasLocation 
        ? `${photo.latitude},${photo.longitude}`.toLowerCase()
        : '';
      
      return date.includes(query) || locationString.includes(query);
    });
    
    setFilteredPhotos(filtered);
  };

  // Refresh Gallery 
  const refreshGallery = () => {
    setLoading(true);
    if (db) {
      loadPhotos(db);
    }
  };


//  Navigate to the Image screen with photo object as a prop
  const handlePhotoPress = (photo) => {
    navigation.navigate('Image', { photo });
  };

//  Render photo
  const renderPhoto = ({ item }) => (
    <TouchableOpacity 
      style={styles.photoContainer} 
      onPress={() => handlePhotoPress(item)}
      onLongPress={() => handleLongPress(item)}
      delayLongPress={500}
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
      <View style={styles.deleteOverlay}>
        <Text style={styles.deleteText}>Hold to delete</Text>
      </View>
    </TouchableOpacity>
  );

 

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyStateText}>
        {searchQuery.trim() ? 'No matching photos found' : 'No photos yet'}
      </Text>
      {!searchQuery.trim() && (
        <TouchableOpacity 
          style={styles.captureButton}
          onPress={() => navigation.navigate('Image',{ photos })}
        >
          <Text style={styles.captureButtonText}>Take a Photo</Text>
        </TouchableOpacity>
      )}
    </View>
  );
 
 
  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.content}>
        <StatusBar style="auto" />
        
        <View style={styles.header}>
          <Text style={styles.title}>Gallery</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Map',{ photos })}>
            <Text style={styles.refreshButton}><Feather name="map-pin" size={26} color="black" /></Text>
          </TouchableOpacity>
        </View>

        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search by date..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            clearButtonMode="while-editing"
          />
        </View>

        {loading ? (
          <ActivityIndicator size="large" color="#007BFF" />
        ) : (
          <FlatList
            data={filteredPhotos}
            renderItem={renderPhoto}
            keyExtractor={(item) => item.id.toString()}
            numColumns={4}
            contentContainerStyle={styles.photoGrid}
            ListEmptyComponent={renderEmptyState}
            showsVerticalScrollIndicator={false}
          />
        )}
      </SafeAreaView>
    </View>
  );
}

const windowWidth = Dimensions.get('window').width;
const photoSize = (windowWidth - 50) / 4;

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
  searchContainer: {
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  searchInput: {
    height: 40,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
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
    deleteOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.3)',
      justifyContent: 'center',
      alignItems: 'center',
      opacity: 0,
    },
    deleteText: {
      color: 'white',
      fontSize: 12,
      fontWeight: '600',
      textAlign: 'center',
    },
    photoContainer: {
      position: 'relative',
      margin: 1,
      width: '24%',
      aspectRatio: 1,
    },
    photo: {
      width: '100%',
      height: '100%',
    },
    photoInfo: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      padding: 4,
      backgroundColor: 'rgba(0,0,0,0.5)',
    },
    photoDate: {
      color: 'white',
      fontSize: 10,
    },
  },
});