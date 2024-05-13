import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import UserAccountWindow from './UserAccountWindow.js';

export default function SettingsWindow() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);
  const [showUserAccount, setShowUserAccount] = useState(false);

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserData(null);
    setShowUserAccount(false);
  };

  const handleMyAccount = () => {
    setIsLoggedIn(true);
    setShowUserAccount(true);
    setUserData({ name: 'John', surname: 'Doe', email: 'john.doe@example.com' });
  };

  return (
    <View style={styles.container}>
      {showUserAccount ? (
        <UserAccountWindow userData={userData} onLogout={handleLogout} />
      ) : (
        <View style={styles.loginContainer}>
          <View style={styles.header}>
            <Text style={styles.title}>Вход</Text>
          </View>
          <View style={styles.body}>
            <TextInput
              style={styles.input}
              placeholder="Логин"
              onChangeText={() => {}}
            />
            <TextInput
              style={styles.input}
              placeholder="Пароль"
              onChangeText={() => {}}
              secureTextEntry={true}
            />
            <TouchableOpacity style={styles.button} onPress={() => setIsLoggedIn(true)}>
              <Text style={styles.buttonText}>Войти</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.myAccountButton} onPress={handleMyAccount}>
              <Text style={styles.myAccountButtonText}>Мой аккаунт</Text>
            </TouchableOpacity>
          </View>
        </View>
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
  loginContainer: {
    alignItems: 'center',
    width: '80%',
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
  input: {
    fontSize: 18,
    width: '100%',
    height: 50,
    padding: 10,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 15,
    marginBottom: 20,
  },
  button: {
    width: '100%',
    paddingVertical: 15,
    backgroundColor: '#FDDB3A',
    borderRadius: 40,
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  myAccountButton: {
    width: '100%',
    paddingVertical: 15,
    backgroundColor: '#C0C0C0',
    borderRadius: 40,
    alignItems: 'center',
  },
  myAccountButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
});
