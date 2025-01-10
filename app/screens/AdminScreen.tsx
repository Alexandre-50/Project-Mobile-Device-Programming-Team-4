import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { AntDesign, FontAwesome } from '@expo/vector-icons';

const AdminScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      {/* Bouton + en bas à droite */}
      <TouchableOpacity style={styles.addButton} onPress={() => {}}>
        <AntDesign name="plus" size={30} color="white" />
      </TouchableOpacity>

      {/* Bouton personnage en haut à droite */}
      <TouchableOpacity style={styles.profileButton} onPress={() => {}}>
        <FontAwesome name="user" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'center',
  },
  addButton: {
    position: 'absolute',
    bottom: 50,
    right: 20,
    backgroundColor: '#3498db',
    borderRadius: 50,
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileButton: {
    backgroundColor: '#3498db',
    borderRadius: 50,
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: 50,
    right: 20,
  },
});

export default AdminScreen;
