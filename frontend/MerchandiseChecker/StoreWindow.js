import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { useState } from 'react';

export default function StoreWindow() {
  const [selectedItem, setSelectedItem] = useState(null);

  const handleSelectItem = (item) => {
    setSelectedItem(item);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {[...Array(17).keys()].map(item => (
        <TouchableOpacity key={item} onPress={() => handleSelectItem(item)} style={[styles.item, item === selectedItem ? styles.selectedItem : (item % 2 === 0 ? styles.evenItem : styles.oddItem)]}>
          <Text style={styles.text}>Item {item + 1}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 20,
    paddingHorizontal: 10,
    backgroundColor: 'lightyellow',
  },
  item: {
    padding: 25,
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
  },
});