import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { AntDesign, FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';


const AdminScreen = () => {
  const router = useRouter();
  return (
    
    <View style={styles.container}>
      {/* Decorative circle in the top-left corner. */}
      <View style={styles.circleBlue1}></View> 
      {/* Another decorative circle with more transparency. */}
      <View style={styles.circleBlue2}></View> 
      {/* Decorative circle in the top-right corner. */}
      <View style={styles.circleBlue3}></View> 
      {/* Another decorative circle in the top-right with transparency. */}
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
    backgroundColor: '#56AEFF', // Blue background.
    borderRadius: 50, // Circular shape.
    width: 60, // Button width.
    height: 60, // Button height.
    justifyContent: 'center', // Center icon vertically.
    alignItems: 'center', // Center icon horizontally.
    position: 'absolute', // Positioned absolutely.
    top: 50, // Positioned below the top edge.
    transform: [{ translateX: -30 }], // Centered horizontally.
    left: '50%', // Positioned in the horizontal center.
},
  circleBlue1: {
    position: 'absolute', // Positioned absolutely relative to the screen.
    top: -35, // Moves the circle slightly outside the top boundary.
    left: -50, // Moves the circle slightly outside the left boundary.
    width: 150, // Circle diameter.
    height: 150, // Circle height (equal to width for a perfect circle).
    borderRadius: 75, // Makes the shape a circle.
    backgroundColor: 'rgba(0,122,255,0.5)', // Light blue with transparency.
},
// Another decorative circle with more transparency.
circleBlue2: {
    position: 'absolute',
    top: -60,
    left: 0,
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: 'rgba(0,122,255,0.3)', // Even lighter blue.
},
// Decorative circle in the top-right corner.
circleBlue3: {
    position: 'absolute',
    top: -35,
    right: -50,
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: 'rgba(0,122,255,0.5)',
},
// Another transparent circle in the top-right.
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
