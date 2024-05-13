import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export default function UserAccountWindow({ userData, onLogout }) {
  const handleLogout = () => {
    // Вызываем функцию onLogout, переданную из родительского компонента, чтобы выполнить выход из аккаунта
    onLogout();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Мой аккаунт</Text>
      <View style={styles.userInfo}>
        <Text style={styles.label}>Имя:</Text>
        <Text>{userData.name}</Text>
      </View>
      <View style={styles.userInfo}>
        <Text style={styles.label}>Фамилия:</Text>
        <Text>{userData.surname}</Text>
      </View>
      <View style={styles.userInfo}>
        <Text style={styles.label}>Email:</Text>
        <Text>{userData.email}</Text>
      </View>
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>Выйти из аккаунта</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F6F4E6',
    justifyContent: 'center',
    alignItems: 'center',
    width: 450,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  label: {
    fontWeight: 'bold',
    marginRight: 10,
  },
  logoutButton: {
    marginTop: 20,
    backgroundColor: '#FDDB3A',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  logoutButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
});
