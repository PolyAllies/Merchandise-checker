import React, { useState } from 'react';
import SplashScreen from './SplashScreen';
import StoreWindow from './StoreWindow';
import SettingsWindow from './SettingsWindow';
import CameraWindow from './CameraWindow';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity, Image  } from 'react-native';

export default function App() {
  const [splashVisible, setSplashVisible] = useState(true);
  const [currentPage, setCurrentPage] = useState('StoreWindow');

  const handlePageChange = (page) => {
    setCurrentPage(page);
    /*if (currentPage === 'SettingsWindow' && !isLoggedIn) {
      setIsLoggedIn(true);
    }*/
  };

  const currentPageIndex = ['StoreWindow', 'CameraWindow', 'SettingsWindow'].indexOf(currentPage);

  return (
    <>
      {splashVisible ? (
        <SplashScreen setSplashVisible={setSplashVisible} />
      ) : (
        <View style={styles.container}>
          {/* Отображение текущей страницы */}
          {currentPage === 'StoreWindow' && <StoreWindow />}
          {currentPage === 'SettingsWindow' && <SettingsWindow />}
          {currentPage === 'CameraWindow' && <CameraWindow />}

          {/* Нижняя панель навигации */}
          <View style={styles.footer}>
            <View style={styles.navButtonContainer}>
              <TouchableOpacity style={[styles.navButton, currentPageIndex === 0 && styles.navButtonActive]} onPress={() => handlePageChange('StoreWindow')}>
                <Image source={require('./assets/Store.png')} style={styles.navImage} />
              </TouchableOpacity>
              <TouchableOpacity style={[styles.navButton, currentPageIndex === 1 && styles.navButtonActive]} onPress={() => handlePageChange('CameraWindow')}>
                <Image source={require('./assets/camera.png')} style={styles.navImage} />
              </TouchableOpacity>
              <TouchableOpacity style={[styles.navButton, currentPageIndex === 2 && styles.navButtonActive]} onPress={() => handlePageChange('SettingsWindow')}>
                <Image source={require('./assets/settings.png')} style={styles.navImage} />
              </TouchableOpacity>
            </View>
          </View>
          <StatusBar style="auto" />
        </View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#41444B',
    alignItems: 'center',
    justifyContent: 'center',
  },
  footer: {
    flex: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'stretch',
    backgroundColor: 'white',
    height: 90,
  },
  navButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: '100%',
    backgroundColor: '#41444B',
  },
  navButton: {
    paddingVertical: 15,
    paddingHorizontal: 40,
  },
  navButtonActive: {
    backgroundColor: '#FDDB3A',
  },
  navImage: {
    width: 65,
    height: 60,
  },
});