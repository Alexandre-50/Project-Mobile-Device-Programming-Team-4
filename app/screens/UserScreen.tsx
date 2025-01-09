import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const UserScreen = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.text}>User</Text>
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

export default UserScreen;