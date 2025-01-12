import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { getAuth } from 'firebase/auth';
import { getFirestore, collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { useRouter } from 'expo-router';
import { firebaseConfig } from '../../firebaseConfig';
import { initializeApp } from 'firebase/app';
import { MaterialIcons } from '@expo/vector-icons';

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const ManageAdminScreen = () => {
    const [adminEmails, setAdminEmails] = useState<string[]>([]);
    const [isSuperAdmin, setIsSuperAdmin] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const checkSuperAdmin = async () => {
            const user = auth.currentUser;
            if (!user) {
                router.push('./LoginScreen');
                return;
            }

            console.log('Utilisateur connecté:', user.email);

            try {
                const usersRef = collection(db, 'users');
                const querySnapshot = await getDocs(usersRef);
                let superAdminFound = false;
                const adminList: string[] = [];

                querySnapshot.forEach((doc) => {
                    const userData = doc.data();
                    if (userData.email == user.email) {
                        console.log('Rôle de l\'utilisateur:', userData.role);
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
            <TouchableOpacity style={styles.backButton} onPress={() => router.push('./SuperAdminScreen')}>
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
                <TouchableOpacity style={styles.addButton} onPress={() => router.push('./AddAdminScreen')}>
                    <Text style={styles.addButtonText}>Ajouter un Admin</Text>
                </TouchableOpacity>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white'
    },
    backButton: {
        position: 'absolute',
        top: 20,
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
        justifyContent: "space-between", // Espace entre le texte et l'icône
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: "#ddd",
    },
    emailText: {
        flex: 1, // Permet au texte d'occuper l'espace restant
        fontSize: 16,
        marginRight: 10, // Ajoute de l'espace entre le texte et l'icône
        overflow: "hidden", // Empêche le texte de dépasser
    },
    deleteButton: {
        paddingHorizontal: 5, // Facultatif : Ajoute un peu d'espace autour de l'icône
    },
      
      
    errorText: {
        fontSize: 18,
        color: 'red',
    },
    addButton: {
        marginTop: 20,
        padding: 15,
        borderRadius: 10,
        backgroundColor: '#3498db',
        alignItems: 'center',
    },
    addButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default ManageAdminScreen;
