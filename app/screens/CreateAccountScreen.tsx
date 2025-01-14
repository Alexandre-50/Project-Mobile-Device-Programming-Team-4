import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet,KeyboardAvoidingView,ScrollView,Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../../firebaseConfig';
import { doc, setDoc } from 'firebase/firestore';
import { MaterialIcons } from '@expo/vector-icons';

const CreateAccountScreen = () => {
	const [CodePostal,setCodePostal] = useState('');
    const [Ville,setVille] = useState('');
    const [Pays,setPays] = useState('');
    const [Adresse, setAdresse] = useState('');
    const [Prenom, setPrenom] = useState('');
    const [nom, setNom] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [secureTextEntry, setSecureTextEntry] = useState(true);
    const [secureTextEntry1, setSecureTextEntry1] = useState(true);
    const router = useRouter();
    const handleBackPress = () => {
      if (router.canGoBack()) {
        router.back(); // Revenir à la page précédente s'il y a une page dans l'historique
      } else {
        router.push('./LoginScreen'); // Sinon, redirigez explicitement vers la page de connexion
      }
    };
    
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
            const userCredential = await createUserWithEmailAndPassword(auth, email,password);
            const user = userCredential.user;

            await setDoc(doc(db, 'users', user.uid), {
                email: user.email,
                nom: nom,
                prenom: Prenom,
                adresse: Adresse,
                codePostal: CodePostal,
                ville: Ville,
                pays: Pays,
                role: 'user'
            });

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
        
            
            {/* Decorative circle in the top-left corner. */}
            <View style={styles.circleBlue1}></View> 
            {/* Another decorative circle with more transparency. */}
            <View style={styles.circleBlue2}></View> 
            {/* Decorative circle in the top-right corner. */}
            <View style={styles.circleBlue3}></View> 
            {/* Another decorative circle in the top-right with transparency. */}
            <View style={styles.circleBlue4}></View> 
            <Text style={styles.title}>Créer un compte</Text>
            <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
              <MaterialIcons name="arrow-back" size={24} color="black" />
            </TouchableOpacity>

            <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            >
              <ScrollView
                contentContainerStyle={styles.containerInput}
                keyboardShouldPersistTaps="handled"
              >
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
                  placeholder="Adresse"
                  placeholderTextColor="gray"
                  value={Adresse}
                  onChangeText={setAdresse}
                  style={styles.input}
                />
                <TextInput
                  placeholder="Pays"
                  placeholderTextColor="gray"
                  value={Pays}
                  onChangeText={setPays}
                  style={styles.input}
                />
                <TextInput
                  placeholder="Code Postal"
                  placeholderTextColor="gray"
                  value={CodePostal}
                  onChangeText={setCodePostal}
                  keyboardType="numeric"
                  style={styles.input}
                />
                <TextInput
                  placeholder="Ville"
                  placeholderTextColor="gray"
                  value={Ville}
                  onChangeText={setVille}
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
          </View>
      );
    };
    
    const styles = StyleSheet.create({
      container: {
        flex: 1,
        backgroundColor:'white',
        paddingHorizontal: 20,
        width: '100%',
      },
      circleBlue1: {
        position: 'absolute', // Positioned absolutely relative to the screen.
        top: -35, // Moves the circle slightly outside the top boundary.
        left: -50, // Moves the circle slightly outside the left boundary.
        width: 150, // Circle diameter.
        height: 150, // Circle height (equal to width for a perfect circle).
        borderRadius: 75, // Makes the shape a circle.
        backgroundColor: 'rgba(0,122,255,0.5)', // Light blue with transparency.
    },
    // Another decorative circle with more transparency.
    circleBlue2: {
        position: 'absolute',
        top: -60,
        left: 0,
        width: 150,
        height: 150,
        borderRadius: 75,
        backgroundColor: 'rgba(0,122,255,0.3)', // Even lighter blue.
    },
    // Decorative circle in the top-right corner.
    circleBlue3: {
        position: 'absolute',
        top: -35,
        right: -50,
        width: 150,
        height: 150,
        borderRadius: 75,
        backgroundColor: 'rgba(0,122,255,0.5)',
    },
    // Another transparent circle in the top-right.
    circleBlue4: {
        position: 'absolute',
        top: -60,
        right: 0,
        width: 150,
        height: 150,
        borderRadius: 75,
        backgroundColor: 'rgba(0,122,255,0.3)',
    },
      containerInput: {
        marginTop:"20%",
        flexGrow: 1,
        alignItems: 'center',
        backgroundColor:'white',
        paddingBottom:30,
      },
      backButton: {
        position: 'absolute',
        top: 60,
        left: 20,
        padding: 10,
    },
      title: {
        fontSize: 24,
        textAlign: 'center',
        alignItems: 'center',
        fontWeight: 'bold',
        marginVertical: 70,
        padding:0,
        
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
        backgroundColor: '#56AEFF',
        paddingVertical: 15,
        paddingHorizontal: 40,
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
      },
    });
    

export default CreateAccountScreen;