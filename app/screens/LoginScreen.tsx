import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../../firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import { MaterialIcons } from '@expo/vector-icons';

const LoginScreen = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [secureTextEntry, setSecureTextEntry] = useState(true);
    const router = useRouter();

    const handleLogin = async () => {
        try {
            if (!email || !password) {
                setError('Veuillez remplir tous les champs.');
                return;
            }
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Correction : vérifier le rôle dans Firestore avec la collection "users"
            const userDoc = await getDoc(doc(db, 'users', user.uid));
            if (userDoc.exists()) {
                const userData = userDoc.data();
                console.log('User data:', userData);
                if (userData?.role === 'admin') {
                    router.push('./AdminScreen');
                } else if (userData?.role === 'user') {
                    router.push('./UserScreen');
                } else if (userData?.role === 'superadmin') {
                    router.push('./SuperAdminScreen');
                } else {
                    setError('Rôle non reconnu, veuillez contacter l\'administrateur.');
                }
            } else {
                console.log('Utilisateur non trouvé dans la base de données.');
                setError('Identifiants incorrects.');
            }
        } catch (error) {
            console.error('Erreur lors de la connexion :', error);
            setError('Identifiants incorrects.');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Connexion</Text>
            <TextInput
                placeholder="Adresse e-mail"
                placeholderTextColor="gray"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                style={styles.input}
            />
            <View style={styles.passwordContainer}>
                <TextInput
                    placeholder="Mot de passe"
                    placeholderTextColor="gray"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={secureTextEntry}
                    style={styles.input}
                />
                <TouchableOpacity onPress={() => setSecureTextEntry(!secureTextEntry)}>
                    <MaterialIcons style={styles.oeil} 
                        name={secureTextEntry ? "visibility-off" : "visibility"} 
                        size={24} 
                        color="gray" 
                    />
                </TouchableOpacity>
            </View>
            {error ? <Text style={styles.errorText}>{error}</Text> : null}
            <TouchableOpacity style={styles.button} onPress={handleLogin}>
                <Text style={styles.buttonText}>Se connecter</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => router.push('./CreateAccountScreen')}>
                <Text style={styles.signupText}>Créer un compte</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    input: {
        width: '100%',
        padding: 15,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 10,
        marginBottom: 15,
    },
    passwordContainer: {
        width: '100%',
    },
    oeil: {
       position:'absolute',
       top:-50,
       right:10,
    },
    button: {
        backgroundColor: '#3498db',
        paddingVertical: 15,
        paddingHorizontal: 40,
        borderRadius: 10,
        marginTop: 10,
        width: '100%',
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    errorText: {
        color: 'red',
        marginBottom: 10,
    },
    signupText: {
        marginTop: 20,
        color: '#3498db',
        textAlign: 'center',
        fontSize: 16,
    }
});

export default LoginScreen;