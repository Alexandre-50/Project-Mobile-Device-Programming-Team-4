import React from 'react';
import { View, Button,Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { AntDesign, FontAwesome } from '@expo/vector-icons';

const SuperAdminScreen: React.FC = () => {
    const router = useRouter();

    return (
        
        <View style={styles.container}>
            <View style={styles.circleBlue1}></View>
            <View style={styles.circleBlue2}></View>
            <View style={styles.circleBlue3}></View>
            <View style={styles.circleBlue4}></View>
            <TouchableOpacity style={styles.profileButton} onPress={() => router.push('./ProfileAccountScreen')}>
                <FontAwesome name="user" size={24} color="white" />
            </TouchableOpacity>
            <View style={styles.containernav}>
                <TouchableOpacity style={styles.button} onPress={() =>  router.replace('./ManageAdminScreen')}>
                    <Text style={styles.buttonText}>Manage Admin</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={() =>  router.replace('./AddEventScreen')}>
                    <Text style={styles.buttonText}>Manage Event</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={() =>  router.replace('./ManageAssoScreen')}>
                    <Text style={styles.buttonText}>Manage Assos</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor:'white',
        justifyContent: 'center',
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
    containernav: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    button: {
        backgroundColor: '#56AEFF',
        paddingVertical: 15,
        paddingHorizontal: 40,
        marginTop: 20,
        width:300,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
    },
});

export default SuperAdminScreen;