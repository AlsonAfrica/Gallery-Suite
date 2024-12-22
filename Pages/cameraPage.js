import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { useState, useRef, useEffect } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View, Image, Dimensions } from 'react-native';
import * as Location from 'expo-location';
import * as SQLite from 'expo-sqlite';
import * as FileSystem from 'expo-file-system';

export default function Camera() {
  const [facing, setFacing] = useState('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [photo, setPhoto] = useState(null);
  const [location, setLocation] = useState(null);
  const [locationPermission, setLocationPermission] = useState(null);
  const [db, setDb] = useState(null);
  const cameraRef = useRef(null);

  useEffect(() => {
    const setup = async () => {
      await initDB();
      await setupLocationPermissions();
    };
    setup();
  }, []);

  const initDB = async () => {
    try {
      const database = await SQLite.openDatabaseAsync('photos.db');
      await database.execAsync(`
        PRAGMA journal_mode = WAL;
        CREATE TABLE IF NOT EXISTS photos (
          id INTEGER PRIMARY KEY NOT NULL,
          uri TEXT NOT NULL,
          timestamp TEXT NOT NULL,
          latitude REAL,
          longitude REAL,
          altitude REAL,
          accuracy REAL
        );
      `);
      setDb(database);
    } catch (error) {
      console.error('Database initialization error:', error);
    }
  };

  const setupLocationPermissions = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    setLocationPermission(status === 'granted');
    
    if (status === 'granted') {
      const location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    }
  };

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>We need your permission to show the camera</Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  const toggleCameraFacing = () => {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  };

  const savePhotoToDisk = async (uri) => {
    const fileName = uri.split('/').pop();
    const newPath = `${FileSystem.documentDirectory}photos/${fileName}`;
    
    // Ensure directory exists
    await FileSystem.makeDirectoryAsync(`${FileSystem.documentDirectory}photos`, {
      intermediates: true
    }).catch(e => {
      console.log('Directory already exists');
    });

    // Copy the file
    await FileSystem.copyAsync({
      from: uri,
      to: newPath
    });

    return newPath;
  };

  const savePhotoToDatabase = async (photoData) => {
    try {
      const result = await db.runAsync(
        'INSERT INTO photos (uri, timestamp, latitude, longitude, altitude, accuracy) VALUES (?, ?, ?, ?, ?, ?)',
        [
          photoData.uri,
          photoData.timestamp,
          photoData.location?.latitude || null,
          photoData.location?.longitude || null,
          photoData.location?.altitude || null,
          photoData.location?.accuracy || null
        ]
      );
      return result.lastInsertRowId;
    } catch (error) {
      console.error('Error saving to database:', error);
      throw error;
    }
  };

  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        let currentLocation = null;
        if (locationPermission) {
          currentLocation = await Location.getCurrentPositionAsync({});
        }
        
        const photo = await cameraRef.current.takePictureAsync();
        const timestamp = new Date().toISOString();
        
        const photoWithMetadata = {
          ...photo,
          timestamp,
          location: currentLocation ? {
            latitude: currentLocation.coords.latitude,
            longitude: currentLocation.coords.longitude,
            altitude: currentLocation.coords.altitude,
            accuracy: currentLocation.coords.accuracy,
          } : null
        };
        
        setPhoto(photoWithMetadata);
      } catch (error) {
        console.error('Failed to take picture:', error);
      }
    }
  };

  const retakePicture = () => {
    setPhoto(null);
  };

  const confirmPicture = async () => {
    try {
      if (!db) {
        throw new Error('Database not initialized');
      }

      // Save photo to permanent storage
      const permanentUri = await savePhotoToDisk(photo.uri);
      
      // Update photo object with permanent URI
      const photoToSave = {
        ...photo,
        uri: permanentUri
      };

      // Save to database
      const photoId = await savePhotoToDatabase(photoToSave);
      console.log('Photo saved with ID:', photoId);
      
      // Clear the preview
      setPhoto(null);
      
    } catch (error) {
      console.error('Error saving photo:', error);
      alert('Failed to save photo');
    }
  };

  // Function to retrieve all photos (useful for debugging or viewing gallery)
  const getAllPhotos = async () => {
    try {
      const photos = await db.getAllAsync('SELECT * FROM photos ORDER BY timestamp DESC');
      return photos;
    } catch (error) {
      console.error('Error retrieving photos:', error);
      throw error;
    }
  };

  if (photo) {
    return (
      <View style={styles.container}>
        <Image
          source={{ uri: photo.uri }}
          style={styles.preview}
        />
        <View style={styles.metadataOverlay}>
          <Text style={styles.metadataText}>
            Time: {new Date(photo.timestamp).toLocaleString()}
          </Text>
          {photo.location && (
            <Text style={styles.metadataText}>
              Location: {photo.location.latitude.toFixed(6)}, {photo.location.longitude.toFixed(6)}
              {photo.location.altitude ? `\nAltitude: ${photo.location.altitude.toFixed(1)}m` : ''}
            </Text>
          )}
        </View>
        <View style={styles.previewButtons}>
          <TouchableOpacity style={styles.previewButton} onPress={retakePicture}>
            <Text style={styles.text}>Retake</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.previewButton} onPress={confirmPicture}>
            <Text style={styles.text}>Save</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView 
        style={styles.camera} 
        facing={facing}
        ref={cameraRef}
      >
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
            <Text style={styles.text}>Flip Camera</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.captureButton} onPress={takePicture}>
            <View style={styles.captureButtonInner} />
          </TouchableOpacity>
        </View>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  message: {
    textAlign: 'center',
    paddingBottom: 10,
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'transparent',
    margin: 64,
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  button: {
    alignItems: 'center',
    padding: 15,
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  captureButton: {
    borderWidth: 6,
    borderColor: 'white',
    backgroundColor: 'transparent',
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  captureButtonInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'white',
  },
  preview: {
    flex: 1,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  previewButtons: {
    position: 'absolute',
    bottom: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    padding: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  previewButton: {
    padding: 15,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  metadataOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 20,
  },
  metadataText: {
    color: 'white',
    fontSize: 16,
    marginBottom: 5,
  }
});