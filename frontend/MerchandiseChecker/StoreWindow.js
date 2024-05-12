import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';

export default function StoreWindow() {
  const [selectedItems, setSelectedItems] = useState([]);
  const windowWidth = Dimensions.get('window').width;

  const handleSelectItem = (item) => {
    let newSelectedItems;
    if (selectedItems.includes(item)) {
      newSelectedItems = selectedItems.filter((selectedItem) => selectedItem !== item);
    } else {
      newSelectedItems = [...selectedItems, item];
    }
    setSelectedItems(newSelectedItems);
  };

  return (
    <ScrollView contentContainerStyle={[styles.container, { paddingTop: 15 }]}>
      {[...Array(17).keys()].map((item) => (
        <TouchableOpacity
          key={item}
          onPress={() => handleSelectItem(item)}
          style={[
            styles.item,
            { width: windowWidth },
            item % 2 === 0 ? styles.evenItem : styles.oddItem,
          ]}
        >
          <View style={styles.row}>
            <Text style={[styles.text, { flex: 1, paddingLeft: 10 }]}>Task {item + 1}</Text>
            {selectedItems.includes(item) && <View style={styles.checkmark} />}
          </View>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'lightyellow',
  },
  item: {
    paddingVertical: 25,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  oddItem: {
    backgroundColor: '#e0e0e0',
  },
  evenItem: {
    backgroundColor: 'lightyellow',
  },
  checkmark: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#FDDB3A',
    marginRight: 10,
  },
  text: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
    textAlign: 'center',
  },
});
