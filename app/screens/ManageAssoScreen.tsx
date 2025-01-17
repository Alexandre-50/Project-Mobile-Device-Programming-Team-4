import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { getAuth } from 'firebase/auth';
import { getFirestore, collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { useRouter } from 'expo-router';
import { firebaseConfig } from '../../firebaseConfig';
import { initializeApp } from 'firebase/app';
import { MaterialIcons, FontAwesome } from '@expo/vector-icons';

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
            <TouchableOpacity style={styles.profileButton} onPress={() => router.push('./ProfileAccountScreen')}>
                <FontAwesome name="user" size={24} color="white" />
            </TouchableOpacity>
            <View style={styles.circleBlue1}></View>
            <View style={styles.circleBlue2}></View>
            <View style={styles.circleBlue3}></View>
            <View style={styles.circleBlue4}></View>

            <TouchableOpacity style={styles.backButton} onPress={() => router.push('./SuperAdminScreen')}>
                <MaterialIcons name="arrow-back" size={24} color="black" />
            </TouchableOpacity>
            <Text style={styles.title}>Associations List</Text>

            {isSuperAdmin ? (
                <View style={styles.assoListWrapper}>
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
                </View>
            ) : (
                <Text style={styles.errorText}>Accès non autorisé</Text>
            )}
            {isSuperAdmin && (
                <TouchableOpacity style={styles.button} onPress={() => router.push('./AddAssoScreen')}>
                    <Text style={styles.buttonText}>Add Association</Text>
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
        backgroundColor: 'white',
    },
   backButton: {
        position: 'absolute',
        top: 40,
        left: 20,
        padding: 10,
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
    assoListWrapper: {
        backgroundColor: 'white',
        height: '50%',
        justifyContent: 'center',
        width: '90%',
        padding: 10,
        borderWidth: 1,
        borderRadius: 10,
        borderColor: '#ddd',
    },
    assosListContainer: {
        flexDirection: 'column',
        justifyContent: 'flex-start',
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

export default ManageAssoScreen;
