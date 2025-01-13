import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { getAuth } from 'firebase/auth';
import { getFirestore, collection, getDocs } from 'firebase/firestore';

const UserScreen = () => {
    const [eventOfTheDay, setEventOfTheDay] = useState<any>(null);
    const [nextEvent, setNextEvent] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const auth = getAuth();
    const db = getFirestore();
    const router = useRouter();

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const eventCollectionRef = collection(db, 'evenements');
                const eventDocsSnap = await getDocs(eventCollectionRef);

                const today = new Date();

                const eventList = eventDocsSnap.docs.map((doc) => {
                    const data = doc.data();
                    const startDate = data.startDate?.toDate();
                    const endDate = data.endDate?.toDate();

                    return {
                        id: doc.id,
                        ...data,
                        startDate,
                        endDate,
                    };
                });

                // Trouver l'événement en cours
                const todayEvent = eventList.find(
                    (event) =>
                        event.startDate <= today && today <= event.endDate
                );
                setEventOfTheDay(todayEvent || null);

                // Trouver le prochain événement
                const upcomingEvent = eventList
                    .filter((event) => event.startDate > today)
                    .sort((a, b) => a.startDate - b.startDate)[0];
                setNextEvent(upcomingEvent || null);
            } catch (error) {
                console.error('Erreur lors de la récupération des événements :', error);
            } finally {
                setLoading(false);
            }
        };

        fetchEvents();
    }, []);

    const calculateTimeRemaining = (date: Date) => {
        const now = new Date();
        const diff = date.getTime() - now.getTime();
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        return `${days}j ${hours}h ${minutes}m ${seconds}s`;
    };

    if (loading) {
        return (
            <View style={styles.container}>
                <Text>Chargement...</Text>
            </View>
        );
    }
    

    return (
        <View style={styles.container}>
            {/* Cercles décoratifs */}
            <View style={styles.circleBlue1}></View>
            <View style={styles.circleBlue2}></View>
            <View style={styles.circleBlue3}></View>
            <View style={styles.circleBlue4}></View>

            {/* Bouton Profil */}
            <TouchableOpacity
                style={styles.profileButton}
                onPress={() => router.push('./ProfileAccountScreen')}
            >
                <FontAwesome name="user" size={24} color="white" />
            </TouchableOpacity>
            
            {/* Contenu principal */}
            <View style={styles.eventCard}>
                {eventOfTheDay ? (
                    <>
                        <View style={styles.header}>
                            <Text style={styles.eventName}>{eventOfTheDay.nom}</Text>
                        </View>
                        <View style={styles.eventInfo}>
                            <Text style={styles.eventRemainingTime}>
                                Fin dans {calculateTimeRemaining(eventOfTheDay.endDate)}
                            </Text>
                            <Text style={styles.eventParticipation}>
                                Actuellement : {eventOfTheDay.participations || 0} participations
                            </Text>
                            <Text style={styles.eventFunds}>
                                50% des fonds de cet événement seront reversés à l'association :
                                <Text style={styles.link}>{eventOfTheDay.associationLink}</Text>
                            </Text>
                            <Text style={styles.ticketsLeft}>
                                Plus que {eventOfTheDay.remainingTickets || 0} tickets à ce prix
                            </Text>
                        </View>
                      
                        <TouchableOpacity style={styles.participateButton} onPress={() => router.push('./payementScreen')}>
                            <Text style={styles.participateButtonText}>
                                Participer -{" "}
                                {eventOfTheDay.remainingTickets
                                    ? Math.floor(eventOfTheDay.remainingTickets / 100) + 1
                                    : 1}{" "}
                                €
                            </Text>
                        </TouchableOpacity>

                    </>
                ) : nextEvent ? (
                    <>
                        <View style={styles.header}>
                            <Text style={styles.eventName}>Prochain événement : {nextEvent.nom}</Text>
                        </View>
                        <View style={styles.eventInfo}>
                            <Text style={styles.eventRemainingTime}>
                                Commence dans {calculateTimeRemaining(nextEvent.startDate)}
                            </Text>
                            <Text style={styles.eventDate}>
                                Début : {nextEvent.startDate.toLocaleDateString()} à{' '}
                                {nextEvent.startDate.toLocaleTimeString()}
                            </Text>
                            <Text style={styles.eventDate}>
                                Fin : {nextEvent.endDate.toLocaleDateString()} à{' '}
                                {nextEvent.endDate.toLocaleTimeString()}
                            </Text>
                            <Text style={styles.eventFunds}>
                                50% des fonds de cet événement seront reversés à l'association :
                                <Text style={styles.link}>{nextEvent.associationLink}</Text>
                            </Text>
                            <Text style={styles.ticketsLeft}>
                                 {nextEvent.remainingTickets || 0} participants
                            </Text>
                        </View>
                    </>
                ) : (
                    <Text style={styles.noEventText}>Aucun événement à venir</Text>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
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
    eventCard: {
        backgroundColor: '#f9f9f9',
        padding: 16,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ddd',
        alignItems: 'center',
        width: '90%',
    },
    header: {
        backgroundColor: '#007bff',
        padding: 10,
        borderRadius: 10,
        marginBottom: 10,
        width: '100%',
        alignItems: 'center',
    },
    eventName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff',
    },
    eventInfo: {
        marginBottom: 20,
    },
    eventRemainingTime: {
        fontSize: 16,
        color: '#333',
        marginBottom: 8,
    },
    eventParticipation: {
        fontSize: 16,
        color: '#333',
        marginBottom: 8,
    },
    eventDate: {
        fontSize: 16,
        color: '#555',
        marginBottom: 4,
    },
    eventFunds: {
        fontSize: 14,
        color: '#333',
        marginBottom: 8,
    },
    link: {
        color: '#007bff',
        textDecorationLine: 'underline',
    },
    ticketsLeft: {
        fontSize: 14,
        color: '#d9534f',
        marginBottom: 20,
    },
    participateButton: {
        backgroundColor: '#007bff',
        padding: 10,
        borderRadius: 10,
        width: '80%',
        alignItems: 'center',
    },
    participateButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    noEventText: {
        fontSize: 16,
        color: '#555',
    },
});
export default UserScreen;