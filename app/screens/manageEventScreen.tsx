import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { FontAwesome,MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { getAuth } from 'firebase/auth';
import { getFirestore, getDocs, collection } from 'firebase/firestore';

const ManageEventScreen = () => {
    const [events, setEvents] = useState<any[]>([]);
    const [filteredEvents, setFilteredEvents] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState<'past' | 'present' | 'future'>('present');
    const auth = getAuth();
    const db = getFirestore();
    const router = useRouter();
    
    useEffect(() => {
        const fetchAllEvents = async () => {
            try {
                const eventCollectionRef = collection(db, 'evenements');
                const eventDocsSnap = await getDocs(eventCollectionRef);

                const eventList = eventDocsSnap.docs.map(doc => {
                    const data = doc.data();
                    const startDate = data.startDate?.toDate() || new Date();
                    const endDate = data.endDate?.toDate() || new Date();

                    return {
                        id: doc.id,
                        ...data,
                        startDate,
                        endDate,
                    };
                });

                setEvents(eventList);
            } catch (error) {
                console.error("Erreur lors de la récupération des événements :", error);
            } finally {
                setLoading(false);
            }
        };

        fetchAllEvents();
    }, []);

    useEffect(() => {
        const now = new Date();

        const filtered = events.filter(event => {
            if (selectedCategory === 'past') {
                return event.endDate < now;
            } else if (selectedCategory === 'present') {
                return event.startDate <= now && event.endDate >= now;
            } else if (selectedCategory === 'future') {
                return event.startDate > now;
            }
        });

        setFilteredEvents(filtered);
    }, [selectedCategory, events]);

    return (
        <View style={styles.container}>
            <View style={styles.circleBlue1}></View>
            <View style={styles.circleBlue2}></View>
            <View style={styles.circleBlue3}></View>
            <View style={styles.circleBlue4}></View>
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <MaterialIcons name="arrow-back" size={24} color="black" />
            </TouchableOpacity>
            <TouchableOpacity
                style={styles.profileButton}
                onPress={() => router.push('./ProfileAccountScreen')}
            >
                <FontAwesome name="user" size={24} color="white" />
            </TouchableOpacity>
                <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        style={[styles.categoryButton, selectedCategory === 'past' && styles.selectedButton]}
                        onPress={() => setSelectedCategory('past')}
                    >
                        <Text style={styles.buttonText}>Passé</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.categoryButton, selectedCategory === 'present' && styles.selectedButton]}
                        onPress={() => setSelectedCategory('present')}
                    >
                        <Text style={styles.buttonText}>Présent</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.categoryButton, selectedCategory === 'future' && styles.selectedButton]}
                        onPress={() => setSelectedCategory('future')}
                    >
                        <Text style={styles.buttonText}>Futur</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.listeContainer}>
                    <FlatList
                        data={filteredEvents}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item }) => (
                            <View style={styles.eventCard}>
                                <View style={styles.imagePlaceholder} />

                                <View style={styles.eventDetails}>
                                    <Text style={styles.eventName}>{item.nom}</Text>
                                    <Text style={styles.eventDate}>
                                        {item.startDate.toLocaleDateString()} - {item.endDate.toLocaleDateString()}
                                    </Text>
                                    <Text style={styles.eventParticipation}>
                                        Participations : {item.participations || 0}
                                    </Text>
                                </View>
                            </View>
                        )}
                    />
                </View>
                <TouchableOpacity style={styles.button} onPress={() =>  router.replace('./AddEventScreen')}>
                    <Text style={styles.buttonText}>Add Event</Text>
                </TouchableOpacity>
            
        </View>
    );
};

const styles = StyleSheet.create({
    
    container: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: '#fff',
        width: '100%',
    },
    button: {
        backgroundColor: '#56AEFF',
        paddingVertical: 15,
        paddingHorizontal: 40,
        width:"70%",
        left:"15%",
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
    backButton: {
        position: 'absolute',
        top: 40,
        left: 20,
        padding: 10,
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
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingHorizontal: 16,
        marginTop: "30%",
        padding:20,
    },
    categoryButton: {
        backgroundColor: '#ddd',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 20,
    },
    selectedButton: {
        backgroundColor: '#56AEFF',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    listeContainer: {
        width: '100%',
        height: '60%',
    },
    eventCard: {
        flexDirection: 'row',
        padding: 16,
        marginBottom: 16,
        borderRadius: 8,
        borderWidth: 1,
        marginLeft: '5%',
        borderColor: '#ddd',
        width: '90%',
        backgroundColor: '#f9f9f9',
    },
    imagePlaceholder: {
        width: "20%",
        height: "100%",
        backgroundColor: '#fff',
        borderRadius: 4,
        borderWidth: 1,
        borderColor: '#ccc',
        marginRight: 16,
    },
    FlatList: {
        flex: 1,
        width: '100%',
        backgroundColor: '#f9f9f9',
    },
    eventDetails: {
        flex: 1,
        justifyContent: 'center',
    },
    eventName: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    eventDate: {
        fontSize: 14,
        color: '#555',
        marginBottom: 4,
    },
    eventParticipation: {
        fontSize: 14,
        color: '#333',
    },
});

export default ManageEventScreen;
