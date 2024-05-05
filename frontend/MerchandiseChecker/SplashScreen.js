//Юра
import React, { useState, useEffect } from 'react';
import { Image, View, StyleSheet } from 'react-native';

const SplashScreen = ({ setSplashVisible }) => {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false); // Устанавливаем isLoading в false после задержки
            setSplashVisible(false); // Устанавливаем видимость сплеш-экрана в false
        }, 3000); // Задержка в 3 секунды

        // Очистка таймера при размонтировании компонента
        return () => clearTimeout(timer);
    }, [setSplashVisible]);

    if (isLoading) {
        return (
            <View style={styles.container}>
                <Image source={require('./assets/SplashScreen.png')} style={styles.image} />
            </View>
        );
    } else {
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