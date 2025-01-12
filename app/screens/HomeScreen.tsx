import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

const HomeScreen = () => {
    const router = useRouter();

    const handlePress = () => {
        router.push('./LoginScreen');
    };

    return (
        <View style={styles.container}>
            <View style={styles.circleBlue1}></View>
            <View style={styles.circleBlue2}></View>
            <View style={styles.circleBlue3}></View>
            <View style={styles.circleBlue4}></View>
            <Image 
                source={require('../../assets/images/app/HomeScreen.png')} 
                style={styles.image}
            />
            <Text style={styles.title}>Participez, gagnez, soutenez !</Text>
            <Text style={styles.description}>
                Chaque mois, tentez de remporter un maillot collector rare ou signé ! Pour participer, rejoignez notre loto solidaire : les premiers inscrits bénéficient de tarifs réduits, et une partie des recettes est reversée à nos associations partenaires. Une chance unique pour vous de gagner, tout en soutenant une bonne cause.
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
        backgroundColor: '#ffffff',
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
    },circleBlue4: {
        position: 'absolute',
        top: -60,
        right: 0,
        width: 150,
        height: 150,
        borderRadius: 75,
        backgroundColor: 'rgba(0,122,255,0.3)',
    },
    image: {
        width: 250,
        height: 200,
        resizeMode: 'contain',
        marginVertical: 0,
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
        // borderRadius: 10,
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

export default HomeScreen;