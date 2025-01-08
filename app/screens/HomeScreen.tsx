import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

const HomeScreen = () => {
    const router = useRouter(); // Utilisation de useRouter d'expo-router

    const handlePress = () => {
        router.push('./SignUpScreen'); // Utilisation de push pour la navigation
    };

    return (
        <View style={styles.container}>
            <View style={styles.circleTopLeft}></View>
            <Image 
                source={require('../../assets/images/app/HomeScreen.png')} 
                style={styles.image}
            />
            <Text style={styles.title}>Participez, gagnez, soutenez !</Text>
            <Text style={styles.description}>
                Chaque mois, tentez de remporter un maillot collector rare ou signé ! 
            </Text>
            <TouchableOpacity style={styles.button} onPress={handlePress}>
                <Text style={styles.buttonText}>C’est Parti !</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 20,
        backgroundColor: '#d3d3d3',
    },
    circleTopLeft: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: 150,
        height: 150,
        borderRadius: 75,
        backgroundColor: 'rgba(0,122,255,0.3)',
    },
    image: {
        width: 200,
        height: 200,
        resizeMode: 'contain',
        marginVertical: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 10,
    },
    description: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 20,
    },
    button: {
        backgroundColor: '#3498db',
        paddingVertical: 15,
        paddingHorizontal: 40,
        borderRadius: 10,
        marginTop: 20,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default HomeScreen;
