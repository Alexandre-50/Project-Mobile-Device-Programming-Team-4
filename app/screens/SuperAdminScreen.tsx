import React from 'react';
import { View, Button, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { AntDesign, FontAwesome } from '@expo/vector-icons';

const SuperAdminScreen: React.FC = () => {
    const router = useRouter();

    return (
        
        <View style={styles.container}>
            <TouchableOpacity style={styles.profileButton} onPress={() => {}}>
        <FontAwesome name="user" size={24} color="white" />
      </TouchableOpacity>
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
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
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

export default SuperAdminScreen;