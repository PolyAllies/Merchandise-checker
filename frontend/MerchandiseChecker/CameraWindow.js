import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking, Platform, Alert } from 'react-native';
import { Camera } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';
import * as ImagePicker from 'expo-image-picker';

export default function CameraWindow() {
  const [cameraPermission, setCameraPermission] = useState(null);
  const [mediaLibraryPermission, setMediaLibraryPermission] = useState(null);
  const [camera, setCamera] = useState(null);

  useEffect(() => {
    (async () => {
      const { status: cameraStatus } = await Camera.requestCameraPermissionsAsync();
      setCameraPermission(cameraStatus === 'granted');

      const { status: mediaLibraryStatus } = await MediaLibrary.requestPermissionsAsync();
      setMediaLibraryPermission(mediaLibraryStatus === 'granted');
    })();
  }, []);

  const takePicture = async () => {
    if (camera) {
      let photo;
      try {
        photo = await camera.takePictureAsync();
      } catch (error) {
        console.error('Error taking picture:', error);
      }
      if (photo && photo.uri) {
        sendPhoto(photo);
      } else {
        console.error('Failed to take picture or URI is null:', photo);
      }
    }
  };

  const sendPhoto = async (photo) => {
    try {
      const formData = new FormData();
      formData.append('packetsNum', '1');
      formData.append('photoFormat', 'jpeg');
      formData.append('photo', {
        uri: photo.uri,
        type: 'image/jpeg',
        name: 'photo.jpg',
      });

      const response = await fetch('http://192.168.50.85:8000/photo', {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const result = await response.json();

      if (response.ok) {
        console.log('Photo sent successfully');
        Alert.alert('Success', 'Photo processed and saved to gallery');
        if (Platform.OS === 'android') {
          Linking.openURL(result.processedPhotoUrl);
        } else {
          MediaLibrary.saveToLibraryAsync(result.processedPhotoUrl);
        }
      } else {
        console.error('Failed to send photo');
        Alert.alert('Error', 'Failed to process photo');
      }
    } catch (error) {
      console.error('Error sending photo:', error);
      Alert.alert('Error', 'Error sending photo');
    }
  };

  const pickImageFromGallery = async () => {
    if (mediaLibraryPermission) {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        sendPhoto(result.assets[0]);
      } else {
        console.log('Image selection canceled');
      }
    } else {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status === 'granted') {
        let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [4, 3],
          quality: 1,
        });

        if (!result.canceled) {
          sendPhoto(result.assets[0]);
        } else {
          console.log('Image selection canceled');
        }
      } else {
        console.log('Access to media library denied');
      }
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.body}>
        {cameraPermission === null || mediaLibraryPermission === null ? (
          <Text style={styles.noPermissionText}>Получение разрешения...</Text>
        ) : cameraPermission === false || mediaLibraryPermission === false ? (
          <Text style={styles.noPermissionText}>Доступ к камере или медиабиблиотеке не предоставлен</Text>
        ) : (
          <Camera
            style={styles.camera}
            type={Camera.Constants.Type.back}
            ref={(ref) => setCamera(ref)}
          />
        )}
        <TouchableOpacity style={styles.button} onPress={takePicture}>
          <Text style={styles.buttonText}>Сделать фото</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.galleryButton} onPress={pickImageFromGallery}>
          <Text style={styles.buttonText}>Галерея</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F6F4E6',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  body: {
    flex: 8,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  camera: {
    width: '100%',
    height: '100%',
  },
  noPermissionText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'red',
  },
  button: {
    paddingVertical: 25,
    paddingHorizontal: 50,
    position: 'absolute',
    bottom: 15,
    left: 0,
    backgroundColor: '#FDDB3A',
    borderRadius: 40,
  },
  galleryButton: {
    paddingVertical: 25,
    paddingHorizontal: 60,
    position: 'absolute',
    bottom: 15,
    backgroundColor: '#4287f5',
    borderRadius: 40,
    left: 250,
  },
  buttonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
});
