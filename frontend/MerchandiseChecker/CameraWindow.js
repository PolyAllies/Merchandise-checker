import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Camera } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';

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
      sendPhoto(photo.uri);
    } else {
      console.error('Failed to take picture or URI is null:', photo);
    }
  }
};

  const sendPhoto = async (filePath) => {
    try {
      const photo = await MediaLibrary.getAssetInfoAsync(filePath);
      const formData = new FormData();
      formData.append('packetsNum', '1'); // Одна отправка
      formData.append('photoFormat', 'jpeg'); // Формат изображения
      formData.append('photo', {
        uri: photo.uri,
        type: 'image/jpeg',
        name: 'photo.jpg',
      });

      const response = await fetch('http://192.168.1.136:1234/photo', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        console.log('Photo sent successfully');
      } else {
        console.error('Failed to send photo');
      }
    } catch (error) {
      console.error('Error sending photo:', error);
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
    paddingHorizontal: 80,
    position: 'absolute',
    bottom: 15,
    backgroundColor: '#FDDB3A',
    borderRadius: 40,
  },
  buttonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
});
