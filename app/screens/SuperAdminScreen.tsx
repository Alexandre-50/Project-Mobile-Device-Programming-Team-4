// Importing React module to create UI components.
import React from 'react'; 
// Importing components from React Native for building the user interface.
import { View, Button, Text, TouchableOpacity, StyleSheet } from 'react-native'; 
// Importing useRouter hook for navigation between screens using Expo Router.
import { useRouter } from 'expo-router'; 
// Importing icons from AntDesign and FontAwesome icon libraries.
import { AntDesign, FontAwesome } from '@expo/vector-icons'; 

// Main component for the Super Admin screen.
const SuperAdminScreen: React.FC = () => {
    const router = useRouter(); // Initializing the router for navigation.

    return (
        // Main container for the entire screen layout.
        <View style={styles.container}> 
            {/* Decorative circle in the top-left corner. */}
            <View style={styles.circleBlue1}></View> 
            {/* Another decorative circle with more transparency. */}
            <View style={styles.circleBlue2}></View> 
            {/* Decorative circle in the top-right corner. */}
            <View style={styles.circleBlue3}></View> 
            {/* Another decorative circle in the top-right with transparency. */}
            <View style={styles.circleBlue4}></View> 
            
            {/* Button to navigate to the profile screen. */}
            <TouchableOpacity 
                style={styles.profileButton} 
                onPress={() => router.push('./ProfileAccountScreen')}
            >
                {/* User icon inside the button */}
                <FontAwesome name="user" size={24} color="white" />
            </TouchableOpacity>
            
            {/* Navigation container for managing buttons */}
            <View style={styles.containernav}>
                {/* Button to navigate to Manage Admin screen */}
                <TouchableOpacity 
                    style={styles.button} 
                    onPress={() => router.replace('./ManageAdminScreen')}
                >
                    <Text style={styles.buttonText}>Manage Admin</Text>
                </TouchableOpacity>
                
                {/* Button to navigate to Manage Event screen */}
                <TouchableOpacity 
                    style={styles.button} 
                    onPress={() => router.replace('./ManageEventScreen')}
                >
                    <Text style={styles.buttonText}>Manage Event</Text>
                </TouchableOpacity>
                
                {/* Button to navigate to Manage Associations screen */}
                <TouchableOpacity 
                    style={styles.button} 
                    onPress={() => router.replace('./ManageAssoScreen')}
                >
                    <Text style={styles.buttonText}>Manage Assos</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

// Styles for the components in the screen.
const styles = StyleSheet.create({
    // Main container style for the screen.
    container: {
        flex: 1, // Take up the entire screen.
        backgroundColor: 'white', // White background color.
        justifyContent: 'center', // Center content vertically.
    },
    // Decorative blue circle in the top-left corner.
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
    // Style for the profile button in the center top of the screen.
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
    // Container for navigation buttons.
    containernav: {
        flex: 1, // Takes available space.
        justifyContent: 'center', // Center buttons vertically.
        alignItems: 'center', // Center buttons horizontally.
    },
    // Style for navigation buttons.
    button: {
        backgroundColor: '#56AEFF', // Blue background.
        paddingVertical: 15, // Padding on top and bottom.
        paddingHorizontal: 40, // Padding on left and right.
        marginTop: 20, // Space between buttons.
        width: 300, // Fixed button width.
    },
    // Style for button text.
    buttonText: {
        color: '#fff', // White text color.
        fontSize: 18, // Font size.
        fontWeight: 'bold', // Bold text.
        textAlign: 'center', // Center text horizontally.
    },
});

// Exporting the component as the default export.
export default SuperAdminScreen;
