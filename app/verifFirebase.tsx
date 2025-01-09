import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { auth } from '../firebaseConfig'; // Vérifie bien le chemin d'import


const verifFirebase = () => {
    const router = useRouter();
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        // Vérification de la connexion Firebase
        if (auth) {
            setIsConnected(true);
            console.log('Firebase est bien connecté');
        } else {
            console.error('Erreur de connexion à Firebase');
        }
    }, []);

    const handlePress = () => {
        router.push('./screens/HomeScreen');
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Connexion Firebase : {isConnected ? 'Réussie' : 'Échec'}</Text>
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
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 10,
    },
    button: {
        backgroundColor: '#3498db',
        paddingVertical: 15,
        paddingHorizontal: 40,
        marginTop: 20,
        width: 300,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
    },
});


export default verifFirebase;
