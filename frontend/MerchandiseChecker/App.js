import React, { useState } from 'react';
import SplashScreen from './SplashScreen';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';

export default function App() {
  const [splashVisible, setSplashVisible] = useState(true);

  return (
      <>
          {splashVisible ? (
              <SplashScreen setSplashVisible={setSplashVisible} />
          ) : (
              <View style={styles.container}>
                  <Text>no</Text>
                  <StatusBar style="auto" />
              </View>
          )}
      </>
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
