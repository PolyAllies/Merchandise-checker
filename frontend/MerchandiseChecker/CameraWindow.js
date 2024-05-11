import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Camera } from 'react-native';

export default function CameraWindow() {
  const [cameraPermission, setCameraPermission] = useState(null);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestPermissionsAsync();
      setCameraPermission(status === 'granted');
    })();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.body}>
        {cameraPermission ? (
          <Camera style={styles.camera} />
        ) : (
          <Text style={styles.noPermissionText}>Доступ к камере не предоставлен</Text>
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
