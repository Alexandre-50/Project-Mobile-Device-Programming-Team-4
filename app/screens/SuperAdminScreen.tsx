import React from 'react';
import { View, Button,Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { AntDesign, FontAwesome } from '@expo/vector-icons';

const SuperAdminScreen: React.FC = () => {
    const router = useRouter();

    return (
        
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Super Admin</Text>
                <TouchableOpacity style={styles.profileButton} onPress={() => {}}>
                    <FontAwesome name="user" size={24} color="white" />
                </TouchableOpacity>
            </View>
            <View style={styles.containernav}>
                <Button
                    title="Manage Admin"
                    onPress={() =>  router.replace('./ManageAdminScreen')}
                />
                <Button
                    title="Manage Event"
                    onPress={() => router.replace('./AddEventScreen')}
                />
                <Button
                    title="Manage Assos"
                    onPress={() => router.replace('./ManageAssoScreen')}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
    },
    containernav: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 10,
    },
    header:{
        width:'100%',
        backgroundColor: 'rgba(0,122,255,0.5)',
        padding: 50,
        marginTop:0,
        
    },
    profileButton: {
    backgroundColor: '#3498db',
    borderRadius: 50,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: 40,
    right: 10,
  },
});

export default SuperAdminScreen;