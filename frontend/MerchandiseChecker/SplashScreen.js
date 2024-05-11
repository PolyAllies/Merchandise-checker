import React, { useState, useEffect } from 'react';
import { Image, View, StyleSheet } from 'react-native';

const SplashScreen = ({ setSplashVisible }) => {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Загружаем асинхронно главный экран приложения
        const loadMainWindow = async () => {
          setTimeout(() => {
            setIsLoading(false); // Задержка перед переходом к главному окну приложения
          }, 2000);
        };

        loadMainWindow();
      }, []);

    if (isLoading) {
        return (
            <View style={styles.container}>
                <Image source={require('./assets/SplashScreen.png')} style={styles.image} />
            </View>
        );
    } else {
        setSplashVisible(false); // Устанавливаем видимость сплеш-экрана в false, когда загрузка завершена
        return null;
    }
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
    },
    image: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
});

export default SplashScreen;