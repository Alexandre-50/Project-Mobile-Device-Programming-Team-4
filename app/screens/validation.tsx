import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ValidationScreen = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.text}>Connecté</Text>
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
        fontSize: 24,
        fontWeight: 'bold',
    }
});

export default ValidationScreen;
