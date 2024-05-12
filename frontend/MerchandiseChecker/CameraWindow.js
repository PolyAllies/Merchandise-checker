import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Camera } from 'expo-camera';
import * as Permissions from 'expo-permissions';

export default function CameraWindow() {
  const [cameraPermission, setCameraPermission] = useState(null);

  useEffect(() => {
    (async () => {
      const { status } = await Permissions.askAsync(Permissions.CAMERA);
      setCameraPermission(status === 'granted');
    })();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.body}>
        {cameraPermission === null ? (
          <Text style={styles.noPermissionText}>Получение разрешения...</Text>
        ) : cameraPermission === false ? (
          <Text style={styles.noPermissionText}>Доступ к камере не предоставлен</Text>
        ) : (
          <Camera style={styles.camera} />
        )}
        <TouchableOpacity style={styles.button}>
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
