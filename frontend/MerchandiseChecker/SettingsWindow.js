import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, TextInput } from 'react-native';

export default function SettingsWindow() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [userData, setUserData] = useState(null);

  const handleLogin = () => {
    // Логика проверки введенных пользователем данных и входа в аккаунт
    // ...

    setIsLoggedIn(true); 
    //...
    setUserData({
      name: 'Иван',
      surname: 'Иванов',
      patronymic: 'Иванович',
      position: 'Менеджер',
      employeeId: '12345',
    });
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  return (
    <View style={styles.container}>
      {isLoggedIn ? (
        <>
          <View style={styles.header}>
            <Text style={styles.title}>Аккаунт</Text>
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
              <Text style={styles.itemLabel}>Отчество:</Text>
              <Text style={styles.itemValue}>{userData.patronymic}</Text>
            </View>
            <View style={styles.item}>
              <Text style={styles.itemLabel}>Должность:</Text>
              <Text style={styles.itemValue}>{userData.position}</Text>
            </View>
            <View style={styles.item}>
              <Text style={styles.itemLabel}>ID сотрудника:</Text>
              <Text style={styles.itemValue}>{userData.employeeId}</Text>
            </View>
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
    width: '100%',
    height: '100%',
  },
  header: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'black',
  },
  body: {
    flex: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  item: {
    
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#F6F4E6',
    borderRadius: 5,
    marginBottom: 20,
  },
  itemLabel: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
  },
  itemValue: {
    fontSize: 20,
    color: 'black',
  },
  input: {
    fontSize: 20,
    width: '80%',
    height: 80,
    padding: 10,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 15,
    marginBottom: 10,
  },
  button: {
    paddingVertical: 20,
    paddingHorizontal: 50,
    backgroundColor: '#FDDB3A',
    borderRadius: 40,
    top: 40,
  },
  buttonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
});