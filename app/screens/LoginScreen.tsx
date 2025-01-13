import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView,Platform, StyleSheet } from 'react-native';
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
                setError('Please fill the fields.');
                return;
            }
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

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
                    setError('Role not recognised, please contact the administrator.');
                }
            } else {
                console.log('User no found in the database.');
                setError('Incorrect ID.');
            }
        } catch (error) {
            //console.error('Erreur lors de la connexion :', error);
            setError('Incorrect ID.');
        }
    };

    return (
        <KeyboardAvoidingView
                  style={{ flex: 1 }}
                  behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                >
        <View style={styles.container}>
            <View style={styles.circleBlue1}></View>
            <View style={styles.circleBlue2}></View>
            <View style={styles.circleBlue3}></View>
            <View style={styles.circleBlue4}></View>
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
                <Text style={styles.buttonText}>To connect</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => router.push('./CreateAccountScreen')}>
                <Text style={styles.signupText}>Create an account</Text>
            </TouchableOpacity>
        </View>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor:'white',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
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
        backgroundColor: '#56AEFF',
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
        color: '#56AEFF',
        textAlign: 'center',
        fontSize: 16,
    }
});

export default LoginScreen;