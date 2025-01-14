import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { AntDesign, FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';


const AdminScreen = () => {
  const router = useRouter();
  return (
    
    <View style={styles.container}>
      <View style={styles.circleBlue1}></View> 
      <View style={styles.circleBlue2}></View> 
      <View style={styles.circleBlue3}></View> 
      <View style={styles.circleBlue4}></View> 
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
    backgroundColor: '#56AEFF',
    borderRadius: 50,
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: 50,
    transform: [{ translateX: -30 }],
    left: '50%',
},
  circleBlue1: {
    position: 'absolute',
    top: -35,
    left: -50,
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: 'rgba(0,122,255,0.5)',
},
circleBlue2: {
    position: 'absolute',
    top: -60,
    left: 0,
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: 'rgba(0,122,255,0.3)',
},
circleBlue3: {
    position: 'absolute',
    top: -35,
    right: -50,
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: 'rgba(0,122,255,0.5)',
},
circleBlue4: {
    position: 'absolute',
    top: -60,
    right: 0,
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: 'rgba(0,122,255,0.3)',
},
});

export default AdminScreen;
