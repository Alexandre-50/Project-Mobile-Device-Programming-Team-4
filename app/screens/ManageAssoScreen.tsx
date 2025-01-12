import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { getAuth } from 'firebase/auth';
import { getFirestore, collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { useRouter } from 'expo-router';
import { firebaseConfig } from '../../firebaseConfig';
import { initializeApp } from 'firebase/app';
import { MaterialIcons } from '@expo/vector-icons';

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const ManageAssoScreen = () => {
    const [assos, setAssos] = useState<{ id: string; nom: string; description: string }[]>([]);
    const [isSuperAdmin, setIsSuperAdmin] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const fetchAssos = async () => {
            const user = auth.currentUser;
            if (!user) {
                router.push('./LoginScreen');
                return;
            }

            try {
                const usersRef = collection(db, 'users');
                const assosRef = collection(db, 'assos');
                const querySnapshot = await getDocs(usersRef);
                let superAdminFound = false;

                querySnapshot.forEach((doc) => {
                    const userData = doc.data();
                    if (userData.role === 'superadmin' && userData.email === user.email) {
                        superAdminFound = true;
                    }
                });

                setIsSuperAdmin(superAdminFound);

                if (superAdminFound) {
                    const assosSnapshot = await getDocs(assosRef);
                    const assosList = assosSnapshot.docs.map(doc => {
                        const data = doc.data();
                        return {
                            id: doc.id,
                            nom: data.nom ?? '',
                            description: data.description ?? ''
                        };
                    });
                    setAssos(assosList);
                } else {
                    alert('Accès refusé. Vous devez être superadmin.');
                    router.push('./HomeScreen');
                }
            } catch (error) {
                console.error('Erreur lors de la récupération des associations :', error);
            }
        };

        fetchAssos();
    }, []);

    const deleteAsso = async (id: string) => {
        try {
            await deleteDoc(doc(db, 'assos', id));
            setAssos((prev) => prev.filter((item) => item.id !== id));
            alert('Association supprimée avec succès.');
        } catch (error) {
            console.error('Erreur lors de la suppression de l\'association :', error);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.headcontainer}>
            <TouchableOpacity style={styles.backButton} onPress={() => router.push('./SuperAdminScreen')}>
                <MaterialIcons name="arrow-back" size={24} color="black" />
            </TouchableOpacity>
            <Text style={styles.title}>Liste des Associations</Text>
            </View>
            {isSuperAdmin ? (
                <ScrollView contentContainerStyle={styles.assosListContainer}>
                    {assos.map((item) => (
                        <View key={item.id} style={styles.assoItem}>
                            <View>
                                <Text style={styles.nomText}>{item.nom}</Text>
                                <Text style={styles.descriptionText}>{item.description}</Text>
                            </View>
                            <TouchableOpacity style={styles.deleteButton} onPress={() => deleteAsso(item.id)}>
                                <MaterialIcons name="delete" size={24} color="red" />
                            </TouchableOpacity>
                        </View>
                    ))}
                </ScrollView>
            ) : (
                <Text style={styles.errorText}>Accès non autorisé</Text>
            )}
            {isSuperAdmin && (
                <TouchableOpacity style={styles.addButton} onPress={() => router.push('./AddAssoScreen')}>
                    <Text style={styles.addButtonText}>Ajouter une Association</Text>
                </TouchableOpacity>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    headcontainer: {
        backgroundColor: 'rgba(0,122,255,0.3)',
        width: '100%'
    },
        
    container: {

        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white',
        
        
    },
    backButton: {
        position: 'absolute',
        top: 30,
        left: 10,
        padding: 5,
        borderRadius: 50,
        backgroundColor: 'rgba(0,122,255,0.3)'
        
    },
    assosListContainer: {
        flexDirection: 'column',
        justifyContent: 'flex-start',
        borderWidth: 1,
        borderColor: '#ddd',
        padding: 50,
        borderRadius: 10

    },
    assoItem: {
        
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        
        marginVertical: 30,
    },
    nomText: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    descriptionText: {
        fontSize: 16,
    },
    deleteButton: {
        position: 'absolute',
        top: 7,
        right : 10,
        fontSize: 20,
    },
    errorText: {
        fontSize: 18,
        color: 'red',
    },
    addButton: {
        marginVertical: 20,
        padding: 15,
        borderRadius: 10,
        backgroundColor: '#3498db',
        alignItems: 'center',
        width: '90%'
    },
    addButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default ManageAssoScreen;
