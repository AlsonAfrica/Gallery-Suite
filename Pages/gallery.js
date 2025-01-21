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

 
// If no photos are found or search query is empty, show empty state
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
 
 
  // Ui for the gallery page
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


// Styles
const windowWidth = Dimensions.get('window').width;
const photoSize = (windowWidth - 50) / 4;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F9FC', // Light blue-grey background
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E4E9F2',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  searchContainer: {
    padding: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E4E9F2',
  },
  searchInput: {
    height: 44,
    backgroundColor: '#EDF1F7',
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#2E3A59',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#2E3A59',
    letterSpacing: -0.5,
  },
  refreshButton: {
    color: '#3366FF',
    fontSize: 16,
    fontWeight: '600',
  },
  photoGrid: {
    padding: 12,
  },
  photoContainer: {
    margin: 6,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  photo: {
    width: photoSize,
    height: photoSize,
    backgroundColor: '#EDF1F7',
  },
  photoInfo: {
    padding: 8,
    backgroundColor: '#FFFFFF',
  },
  photoDate: {
    fontSize: 12,
    color: '#8F9BB3',
    fontWeight: '500',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#FFFFFF',
  },
  emptyStateText: {
    fontSize: 18,
    color: '#8F9BB3',
    marginBottom: 24,
    textAlign: 'center',
    lineHeight: 24,
  },
  captureButton: {
    backgroundColor: '#3366FF',
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#3366FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  captureButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  deleteOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(231, 76, 60, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 0,
  },
  deleteText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
    textAlign: 'center',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  }
});
