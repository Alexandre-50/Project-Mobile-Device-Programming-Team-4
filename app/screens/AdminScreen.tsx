import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { AntDesign, FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';


const AdminScreen = () => {
  const router = useRouter();
  return (
    
    <View style={styles.container}>
      <TouchableOpacity style={styles.profileButton} onPress={() =>  router.replace('./ProfileAccountScreen')}>
        <FontAwesome name="user" size={24} color="white" />
      </TouchableOpacity>


      <TouchableOpacity style={styles.addButton} onPress={() =>  router.replace('./AddEventScreen')}>
        <AntDesign name="plus" size={30} color="white" />
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
