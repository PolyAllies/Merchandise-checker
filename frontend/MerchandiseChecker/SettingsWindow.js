import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';

export default function SettingsWindow() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [userData, setUserData] = useState(null);

  const handleLogin = async () => {
    // Логика проверки введенных пользователем данных и входа в аккаунт
    try {
      // Ваша логика проверки логина и пароля
      // ...

      // После успешного входа получаем данные пользователя с сервера
      const response = await fetch('http://your-server.com/userdata');
      const userData = await response.json();
      setUserData(userData);

      // После успешного входа устанавливаем флаг входа в true
      setIsLoggedIn(true);
    } catch (error) {
      console.error('Ошибка входа:', error);
    }
  };

  const handleLogout = () => {
    // Логика выхода из аккаунта
    setIsLoggedIn(false);
    setUsername('');
    setPassword('');
    setUserData(null);
  };

  return (
    <View style={styles.container}>
      {isLoggedIn ? (
        <>
          <View style={styles.header}>
            <Text style={styles.title}>Добро пожаловать, {userData.name}!</Text>
          </View>
          <View style={styles.body}>
            <View style={styles.item}>
              <Text style={styles.itemLabel}>Имя:</Text>
              <Text style={styles.itemValue}>{userData.name}</Text>
            </View>
            <View style={styles.item}>
              <Text style={styles.itemLabel}>Фамилия:</Text>
              <Text style={styles.itemValue}>{userData.surname}</Text>
            </View>
            <View style={styles.item}>
              <Text style={styles.itemLabel}>Email:</Text>
              <Text style={styles.itemValue}>{userData.email}</Text>
            </View>
            {/* Добавьте другие поля для отображения данных пользователя */}
            <TouchableOpacity style={styles.button} onPress={handleLogout}>
              <Text style={styles.buttonText}>Выйти из аккаунта</Text>
            </TouchableOpacity>
          </View>
        </>
      ) : (
        <>
          <View style={styles.header}>
            <Text style={styles.title}>Вход</Text>
          </View>
          <View style={styles.body}>
            <TextInput
              style={styles.input}
              placeholder="Логин"
              onChangeText={setUsername}
              value={username}
            />
            <TextInput
              style={styles.input}
              placeholder="Пароль"
              onChangeText={setPassword}
              value={password}
              secureTextEntry={true}
            />
            <TouchableOpacity style={styles.button} onPress={handleLogin}>
              <Text style={styles.buttonText}>Войти</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F6F4E6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'black',
  },
  body: {
    alignItems: 'center',
    width: 450
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 5,
    marginBottom: 20,
  },
  itemLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
  },
  itemValue: {
    fontSize: 18,
    color: 'black',
  },
  input: {
    fontSize: 18,
    width: '80%',
    height: 50,
    padding: 10,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 15,
    marginBottom: 20,
  },
  button: {
    width: '80%',
    paddingVertical: 15,
    backgroundColor: '#FDDB3A',
    borderRadius: 40,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
});
