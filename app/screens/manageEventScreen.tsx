import React ,{useEffect , useState}from 'react';
import { View, Text, StyleSheet,TouchableOpacity,FlatList } from 'react-native';
import { AntDesign, FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, getDocs,collection } from 'firebase/firestore';
import { MaterialIcons } from '@expo/vector-icons';


const manageEventScreen = () => {
    const [events, setEvents] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const auth = getAuth();
    const db = getFirestore();
    const router = useRouter();

    useEffect(() => {
        const fetchAllEvents = async () => {
            try {
                // Récupérer tous les documents de la collection 'evenements'
                const eventCollectionRef = collection(db, 'evenements');
                const eventDocsSnap = await getDocs(eventCollectionRef);
    
                // Extraire les données des documents
                const eventList = eventDocsSnap.docs.map(doc => {
                    const data = doc.data();
    
                    // Convertir les Timestamps en chaînes lisibles
                    const startDate = data.startDate?.toDate().toLocaleDateString() || 'Date inconnue';
                    const endDate = data.endDate?.toDate().toLocaleDateString() || 'Date inconnue';
    
                    return {
                        id: doc.id, // Inclure l'ID du document
                        ...data, // Inclure les autres champs
                        startDate, // Remplacer startDate par une chaîne
                        endDate, // Remplacer endDate par une chaîne
                    };
                });
    
                setEvents(eventList); // Mettre à jour les événements
            } catch (error) {
                console.error("Erreur lors de la récupération des événements :", error);
            } finally {
                setLoading(false); // Désactiver le chargement
            }
        };
    
        fetchAllEvents();
    }, []);
    

   




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

            {/* Liste des événements */}
            <View style={styles.listeContainer}>
            <FlatList
                data={events}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View style={styles.eventCard}>
                        {/* Carré blanc */}
                        <View style={styles.imagePlaceholder} />

                        {/* Informations de l'événement */}
                        <View style={styles.eventDetails}>
                            <Text style={styles.eventName}>{item.nom}</Text>
                            <Text style={styles.eventDate}>
                                {item.startDate} - {item.endDate}
                            </Text>
                            <Text style={styles.eventParticipation}>
                                Participations : {item.participations || 0}
                            </Text>
                        </View>
                    </View>
                )}
            />
            </View>
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
    listeContainer: {
        width: '100%',
        marginTop: "40%",
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

export default manageEventScreen;