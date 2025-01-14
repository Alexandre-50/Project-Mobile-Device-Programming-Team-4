import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, ScrollView, Platform, Modal, FlatList } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useRouter } from 'expo-router';
import { auth, db } from '../../firebaseConfig';
import { collection, getDocs, doc, setDoc, getDoc, Timestamp } from 'firebase/firestore';
import { MaterialIcons } from '@expo/vector-icons';

const AddEventScreen = () => {
    const [eventName, setEventName] = useState('');
    const [selectedAsso, setSelectedAsso] = useState('');
    const [assos, setAssos] = useState<string[]>([]);
    const [percentage, setPercentage] = useState('');
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [error, setError] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const fetchAssos = async () => {
            const assosCollection = await getDocs(collection(db, 'assos'));
            const assosList = assosCollection.docs.map(doc => doc.data().nom);
            setAssos(assosList);
            console.log('Associations proposées :', assosList);
        };
        fetchAssos();
    }, []);

    const quitter = async () => {
        const user = auth.currentUser;
        if (user) {
            const userDoc = await getDoc(doc(db, 'users', user.uid));
            if (userDoc.exists()) {
                const userData = userDoc.data();
                if (userData.role === 'superadmin') {
                    router.replace('./SuperAdminScreen');
                } else if (userData.role === 'admin') {
                    router.replace('./ManageEventScreen');
                } else {
                    router.replace('./HomeScreen');
                }
            }
        }
    };

    const handleAddEvent = async () => {
        if (!eventName || !selectedAsso || !percentage || !startDate || !endDate) {
            setError('Veuillez remplir tous les champs.');
            return;
        }

        const percentValue = Number(percentage);
        if (percentValue < 0 || percentValue > 100) {
            setError('Le pourcentage doit être compris entre 0 et 100.');
            return;
        }

        const currentDate = new Date();
        if (startDate <= currentDate) {
            setError('La date de début doit être postérieure à la date actuelle.');
            return;
        }

        if (endDate <= startDate) {
            setError('La date de fin doit être postérieure à la date de début.');
            return;
        }

        try {
            const newEventRef = doc(collection(db, 'evenements'));
            await setDoc(newEventRef, {
                nom: eventName,
                asso: selectedAsso,
                pourcentAsso: percentValue,
                startDate: Timestamp.fromDate(startDate),
                endDate: Timestamp.fromDate(endDate)
            });

            quitter();

        } catch (error) {
            setError('Erreur lors de l\'ajout de l\'événement.');
        }
    };

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
            <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
                <View style={styles.circleBlue1}></View>
                <View style={styles.circleBlue2}></View>
                <View style={styles.circleBlue3}></View>
                <View style={styles.circleBlue4}></View>

                <TouchableOpacity onPress={() => quitter()} style={styles.backButton}>
                    <MaterialIcons name="arrow-back" size={24} color="black" />
                </TouchableOpacity>

                <Text style={styles.title}>Ajouter un événement</Text>

                <TextInput
                    placeholder="Nom de l'événement"
                    placeholderTextColor="gray"
                    value={eventName}
                    onChangeText={setEventName}
                    style={styles.input}
                />

                <Text>Sélectionnez une association :</Text>
                <TouchableOpacity style={styles.input} onPress={() => setModalVisible(true)}>
                    <Text>{selectedAsso || "Choisir une association"}</Text>
                </TouchableOpacity>

                <Modal visible={modalVisible} animationType="slide" transparent>
                    <View style={styles.modalContainerCentered}>
                        <View style={styles.modalContentCentered}>
                            <FlatList
                                data={assos}
                                keyExtractor={(item, index) => index.toString()}
                                renderItem={({ item }) => (
                                    <TouchableOpacity
                                        style={styles.modalButton}
                                        onPress={() => {
                                            setSelectedAsso(item);
                                            setModalVisible(false);
                                        }}
                                    >
                                        <Text style={styles.modalButtonText}>{item}</Text>
                                    </TouchableOpacity>
                                )}
                            />
                        </View>
                    </View>
                </Modal>

                <TextInput
                    placeholder="Pourcentage de l'association"
                    placeholderTextColor="gray"
                    value={percentage}
                    onChangeText={setPercentage}
                    keyboardType="numeric"
                    style={styles.input}
                />

                <Text>Date et heure de début :</Text>
                <DateTimePicker
                    value={startDate}
                    mode="datetime"
                    display="default"
                    onChange={(event, selectedDate) => setStartDate(selectedDate || startDate)}
                />

                <Text>Date et heure de fin :</Text>
                <DateTimePicker
                    value={endDate}
                    mode="datetime"
                    display="default"
                    onChange={(event, selectedDate) => setEndDate(selectedDate || endDate)}
                />

                {error ? <Text style={styles.errorText}>{error}</Text> : null}

                <TouchableOpacity style={styles.button} onPress={handleAddEvent}>
                    <Text style={styles.buttonText}>Ajouter l'événement</Text>
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
    modalContainerCentered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)'
    },
    modalContentCentered: {
        height: '80%',
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center'
    },
    modalButton: {
        padding: 15,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 10,
        marginBottom: 10,
        backgroundColor: 'white'
    },
    modalButtonText: {
        fontSize: 16,
        textAlign: 'center'
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

export default AddEventScreen;
