import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const AdminScreen = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.text}>Admin</Text>
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
});

export default AdminScreen;