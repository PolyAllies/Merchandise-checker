import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Dimensions, Platform } from 'react-native';

const { width } = Dimensions.get('window');

export default function StoreWindow() {
  const [selectedItem, setSelectedItem] = useState(null);
  const [items, setItems] = useState([]);

  useEffect(() => {
    // Вместо этого запросите JSON с сервера и установите его в состояние items
    // Пример запроса к серверу:
    // fetch('https://example.com/items')
    //   .then(response => response.json())
    //   .then(data => setItems(data))
    //   .catch(error => console.error('Error fetching items:', error));

    // Временный заглушечный массив данных для демонстрации
    const tempItems = [...Array(17).keys()].map(item => ({
      id: item,
      name: `Item ${item + 1}`,
      selected: false, // Добавляем свойство selected для каждого элемента
    }));
    setItems(tempItems);
  }, []);

  const handleSelectItem = (item) => {
    setSelectedItem(item);
    // Переключаем свойство selected для выбранного элемента
    const updatedItems = items.map(i => {
      if (i.id === item.id) {
        return { ...i, selected: !i.selected };
      }
      return i;
    });
    setItems(updatedItems);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {items.map(item => (
        <TouchableOpacity key={item.id} onPress={() => handleSelectItem(item)} style={[styles.item, item.id === selectedItem?.id ? styles.selectedItem : (item.id % 2 === 0 ? styles.evenItem : styles.oddItem)]}>
          <Text style={styles.text}>{item.name}</Text>
          {/* Отображаем галочку только если элемент выбран */}
          {item.selected && <Text style={styles.checkmark}>✔</Text>}
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 30,
    paddingHorizontal: width * 0.1,
    backgroundColor: 'lightyellow',
    alignItems: 'center',
  },
  item: {
    padding: 20,
    width: Platform.OS === 'ios' ? width * 0.8 : width * 0.9,
    marginBottom: 10,
    left: -25,
    flexDirection: 'row', // Добавляем направление в строку для размещения галочки
    justifyContent: 'space-between', // Добавляем пространство между элементами и галочкой
    alignItems: 'center', // Выравниваем элементы по центру
  },
  oddItem: {
    backgroundColor: '#e0e0e0',
  },
  evenItem: {
    backgroundColor: 'lightyellow',
  },
  selectedItem: {
    backgroundColor: '#FDDB3A',
  },
  text: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
    textAlign: 'center'
  },
  checkmark: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'green',
  },
});
