import React from 'react';
import { View, Text, StyleSheet,TouchableOpacity } from 'react-native';
import { AntDesign, FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const UserScreen = () => {
    const router = useRouter();
    return (
        
        <View style={styles.container}>
            <Text style={styles.text}>User</Text>
            <TouchableOpacity style={styles.profileButton} onPress={() => router.push('./ProfileAccount')}>
            <FontAwesome name="user" size={24} color="white" />
            </TouchableOpacity>
        </View>
        
          
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    text: {
        fontSize: 32,
        fontWeight: 'bold',
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

export default UserScreen;