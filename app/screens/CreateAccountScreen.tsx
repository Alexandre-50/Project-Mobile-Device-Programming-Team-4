import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebaseConfig';
import { MaterialIcons } from '@expo/vector-icons';

const CreateAccountScreen = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [secureTextEntry, setSecureTextEntry] = useState(true);
    const [secureTextEntry1, setSecureTextEntry1] = useState(true);
    const router = useRouter();

    const handleSignUp = async () => {
        if (password !== confirmPassword) {
            setError('Les mots de passe ne correspondent pas.');
            return;
        }
        if (!email || !password) {
            setError('Veuillez remplir tous les champs.');
            return;
        }
        try {
    await createUserWithEmailAndPassword(auth, email, password);
    router.push('./LoginScreen');
} catch (error) {
    if (error instanceof Error && "code" in error) {
        if (error.code === 'auth/invalid-email') {
            setError('L\'adresse e-mail n\'est pas valide.');
        } else if (error.code === 'auth/email-already-in-use') {
            setError('Cette adresse e-mail est déjà utilisée.');
        } else {
            setError('Erreur lors de la création du compte.');
        }
    } else {
        setError('Une erreur inconnue est survenue.');
    }
}

    };

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                <MaterialIcons name="arrow-back" size={24} color="black" />
            </TouchableOpacity>
            <Text style={styles.title}>Créer un compte</Text>
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
            <View style={styles.passwordContainer}>
                <TextInput
                    placeholder="Confirmer le mot de passe"
                    placeholderTextColor="gray"
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry={secureTextEntry1}
                    style={styles.input}
                />
                <TouchableOpacity onPress={() => setSecureTextEntry1(!secureTextEntry1)}>
                    <MaterialIcons style={styles.oeil} 
                        name={secureTextEntry1 ? "visibility-off" : "visibility"} 
                        size={24} 
                        color="gray" 
                    />
                </TouchableOpacity>
            </View>
            {error ? <Text style={styles.errorText}>{error}</Text> : null}
            <TouchableOpacity style={styles.button} onPress={handleSignUp}>
                <Text style={styles.buttonText}>S'inscrire</Text>
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
    backButton: {
        position: 'absolute',
        top: 50,
        left: 20,
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
    }
});

export default CreateAccountScreen;
