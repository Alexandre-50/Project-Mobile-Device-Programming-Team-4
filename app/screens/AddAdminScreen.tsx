import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, ScrollView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../../firebaseConfig';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { MaterialIcons } from '@expo/vector-icons';

const AddAdminScreen = () => {
    const [Prenom, setPrenom] = useState('');
    const [nom, setNom] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [secureTextEntry, setSecureTextEntry] = useState(true);
    const [secureTextEntry1, setSecureTextEntry1] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const checkUserRole = async () => {
            const user = auth.currentUser;
            if (user) {
                const userDoc = await getDoc(doc(db, 'users', user.uid));
                if (userDoc.exists()) {
                    console.log('User role:', userDoc.data().role);
                    if (userDoc.data().role !== 'superadmin') {
                        router.replace('./LoginScreen');
                    }
                }
            } else {
                router.replace('./LoginScreen');
            }
        };
        checkUserRole();
    }, []);

    const handleSignUp = async () => {
        if (!Prenom || !nom || !email || !password || !confirmPassword) {
            setError('Veuillez remplir tous les champs.');
            return;
        }
        if (password !== confirmPassword) {
            setError('Les mots de passe ne correspondent pas.');
            return;
        }
        try {
            const currentUser = auth.currentUser;

            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const userCreate = userCredential.user;

            await setDoc(doc(db, 'users', userCreate.uid), {
                email: userCreate.email,
                nom: nom,
                prenom: Prenom,
                role: 'admin'
            });

            if (currentUser) {
                await auth.updateCurrentUser(currentUser);
                const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
                if (userDoc.exists()) {
                    console.log('Current user role:', userDoc.data().role);
                }
            }

            router.push('./ManageAdminScreen');
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
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <View style={styles.circleBlue1}></View>
            <View style={styles.circleBlue2}></View>
            <View style={styles.circleBlue3}></View>
            <View style={styles.circleBlue4}></View>
          <ScrollView
            contentContainerStyle={styles.container}
            keyboardShouldPersistTaps="handled"
          >
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <MaterialIcons name="arrow-back" size={24} color="black" />
            </TouchableOpacity>
            <Text style={styles.title}>Créer un compte Admin</Text>
            
            <TextInput
              placeholder="Nom"
              placeholderTextColor="gray"
              value={nom}
              onChangeText={setNom}
              style={styles.input}
            />
            <TextInput
              placeholder="Prénom"
              placeholderTextColor="gray"
              value={Prenom}
              onChangeText={setPrenom}
              style={styles.input}
            />
            
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
              <TouchableOpacity onPress={() => setSecureTextEntry(!secureTextEntry)} style={styles.eyeIcon}>
                <MaterialIcons
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
              <TouchableOpacity onPress={() => setSecureTextEntry1(!secureTextEntry1)} style={styles.eyeIcon}>
                <MaterialIcons
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
          </ScrollView>
        </KeyboardAvoidingView>
    );
};


const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 30,
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
    },
    circleBlue4: {
        position: 'absolute',
        top: -60,
        right: 0,
        width: 150,
        height: 150,
        borderRadius: 75,
        backgroundColor: 'rgba(0,122,255,0.3)',
    },
    backButton: {
        position: 'absolute',
        top: 40,
        left: 20,
        padding: 10,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    input: {
        width: '90%',
        padding: 15,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 10,
        marginBottom: 15,
    },
    passwordContainer: {
        alignItems: 'center',
        width: '100%',
        position: 'relative',
    },
    eyeIcon: {
        position: 'absolute',
        right: 30,
        top: 15,
    },
    button: {
        backgroundColor: '#3498db',
        paddingVertical: 15,
        borderRadius: 10,
        marginTop: 10,
        width: '90%',
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

export default AddAdminScreen;
