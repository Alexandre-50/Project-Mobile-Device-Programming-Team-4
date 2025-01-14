import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { getAuth } from 'firebase/auth';
import { getFirestore, collection, getDocs,getDoc, deleteDoc, doc } from 'firebase/firestore';
import { useRouter } from 'expo-router';
import { firebaseConfig } from '../../firebaseConfig';
import { initializeApp } from 'firebase/app';
import { MaterialIcons, FontAwesome } from '@expo/vector-icons';

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const ManageAdminScreen = () => {
    const [adminEmails, setAdminEmails] = useState<string[]>([]);
    const [isSuperAdmin, setIsSuperAdmin] = useState(false);
    const router = useRouter();
    const quitter = async () => {
        const user = auth.currentUser;
        if (user) {
            const userDoc = await getDoc(doc(db, 'users', user.uid));
            if (userDoc.exists()) {
                const userData = userDoc.data();
                if (userData.role === 'superadmin') {
                    router.replace('./SuperAdminScreen');
                } else if (userData.role === 'admin') {
                    router.replace('./AdminScreen');
                } else {
                    router.replace('./HomeScreen');
                }
            }
        }
    };
    useEffect(() => {
        const checkSuperAdmin = async () => {
            const user = auth.currentUser;
            if (!user) {
                router.push('./LoginScreen');
                return;
            }

            try {
                const usersRef = collection(db, 'users');
                const querySnapshot = await getDocs(usersRef);
                let superAdminFound = false;
                const adminList: string[] = [];

                querySnapshot.forEach((doc) => {
                    const userData = doc.data();
                    if (userData.email == user.email) {
                        console.log('Rôle de l\'utilisateur (Manage Admin Screen):', userData.role);
                    }
                    if (userData.role === 'superadmin' && userData.email === user.email) {
                        superAdminFound = true;
                    }
                    if (userData.role === 'admin') {
                        adminList.push(userData.email);
                    }
                });

                setIsSuperAdmin(superAdminFound);
                if (superAdminFound) {
                    setAdminEmails(adminList.sort((a, b) => a.localeCompare(b)));
                } else {
                    alert('Accès refusé. Vous devez être superadmin.');
                    router.push('./HomeScreen');
                }
            } catch (error) {
                console.error('Erreur lors de la vérification des rôles:', error);
            }
        };

        checkSuperAdmin();
    }, []);

    const deleteAdmin = async (email: string) => {
        try {
            const usersRef = collection(db, 'users');
            const querySnapshot = await getDocs(usersRef);
            querySnapshot.forEach(async (document) => {
                const userData = document.data();
                if (userData.email === email) {
                    await deleteDoc(doc(db, 'users', document.id));
                    setAdminEmails((prev) => prev.filter((item) => item !== email).sort((a, b) => a.localeCompare(b)));
                    alert('Admin supprimé avec succès.');
                }
            });
        } catch (error) {
            console.error('Erreur lors de la suppression de l\'admin:', error);
        }
    };


    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.profileButton} onPress={() => router.push('./ProfileAccount')}>
                <FontAwesome name="user" size={24} color="white" />
            </TouchableOpacity>
            <View style={styles.circleBlue1}></View>
            <View style={styles.circleBlue2}></View>
            <View style={styles.circleBlue3}></View>
            <View style={styles.circleBlue4}></View>
            <TouchableOpacity style={styles.backButton} onPress={() => quitter()}>
                <MaterialIcons name="arrow-back" size={24} color="black" />
            </TouchableOpacity>
            
            <Text style={styles.title}>Liste des Admin</Text>
            {isSuperAdmin ? (
                <View style={styles.adminListWrapper}>
                    <ScrollView contentContainerStyle={styles.adminListContainer}>
                        {adminEmails.map((item) => (
                            <View key={item} style={styles.adminItem}>
                                <Text style={styles.emailText} numberOfLines={1} ellipsizeMode="tail">
                                {item}
                                </Text>
                                <TouchableOpacity onPress={() => deleteAdmin(item)}>
                                    <MaterialIcons style={styles.deleteButton} name="delete" size={24} color="red" />
                                </TouchableOpacity>
                            </View>
                          
                        ))}
                    </ScrollView>
                </View>
            ) : (
                <Text style={styles.errorText}>Accès non autorisé</Text>
            )}
            {isSuperAdmin && (
                <TouchableOpacity style={styles.button} onPress={() => router.push('./AddAdminScreen')}>
                    <Text style={styles.buttonText}>Ajouter un Admin</Text>
                </TouchableOpacity>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white'
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
    profileButton: {
        backgroundColor: '#56AEFF',
        borderRadius: 50,
        width: 60,
        height: 60,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        top: 50,
        transform: [{ translateX: -30 }],
        left: '50%',
        
    },
    backButton: {
        position: 'absolute',
        top: 40,
        left: 20,
        padding: 10,
    },
    adminListWrapper: {
        backgroundColor: 'white',
        height: '50%',
        justifyContent: 'center',
        width: '90%',
        padding: 10,
        borderWidth: 1,
        borderRadius: 10,
        borderColor: '#ddd',
    },
    adminListContainer: {
        flexDirection: 'column',
        justifyContent: 'flex-start',
    },
    
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 10,
    },
    adminItem: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: "#ddd",
    },
    emailText: {
        flex: 1,
        fontSize: 16,
        marginRight: 10,
        overflow: "hidden",
    },
    deleteButton: {
        paddingHorizontal: 5,
    },
    errorText: {
        fontSize: 18,
        color: 'red',
    },
    button: {
        backgroundColor: '#56AEFF',
        paddingVertical: 15,
        paddingHorizontal: 40,
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

export default ManageAdminScreen;
