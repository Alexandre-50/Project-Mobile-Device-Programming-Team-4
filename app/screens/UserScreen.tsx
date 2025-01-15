import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { getAuth } from "firebase/auth";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { StripeProvider, useStripe } from "@stripe/stripe-react-native";
import * as Linking from 'expo-linking';
import { publicKey } from "../../constants/StripePublicKey";

interface EventData {
  id: string;
  nom?: string;
  asso?: string;
  startDate: Date;
  endDate: Date;
  participations: number;
  pourcentAsso: number;
}

const UserScreen = () => {
  const [eventOfTheDay, setEventOfTheDay] = useState<EventData | null>(null);
  const [nextEvent, setNextEvent] = useState<EventData | null>(null);
  const [loading, setLoading] = useState(true);
  const auth = getAuth();
  const db = getFirestore();
  const router = useRouter();
  const { initPaymentSheet, presentPaymentSheet } = useStripe();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const eventCollectionRef = collection(db, "evenements");
        const eventDocsSnap = await getDocs(eventCollectionRef);

        const today = new Date();

        const eventList: EventData[] = eventDocsSnap.docs.map((doc) => {
          const data = doc.data();
          const event: EventData = {
            id: doc.id,
            nom: data.nom || "Nom inconnu",
            asso: data.asso || "Association inconnue",
            startDate: new Date(data.startDate.seconds * 1000),
            endDate: new Date(data.endDate.seconds * 1000),
            participations: data.participations || 0,
            pourcentAsso: data.pourcentAsso || 0,
          };
          return event;
        });

        const todayEvent = eventList.find(
          (event) => event.startDate <= today && today <= event.endDate
        );
        setEventOfTheDay(todayEvent || null);

        const upcomingEvent = eventList
          .filter((event) => event.startDate > today)
          .sort((a, b) => a.startDate.getTime() - b.startDate.getTime())[0];
        setNextEvent(upcomingEvent || null);
      } catch (error) {
        console.error("Erreur lors de la récupération des événements :", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const calculateTicketsLeft = (participations: number) => {
    if (participations < 100) return 100 - participations;
    if (participations < 300) return 300 - participations;
    if (participations < 500) return 500 - participations;
    if (participations < 1000) return 1000 - participations;
    return 0;
  };

  const calculateTimeRemaining = (date: Date) => {
    const now = new Date();
    const diff = date.getTime() - now.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    return `${days}j ${hours}h ${minutes}m ${seconds}s`;
  };

  const calculatePrice = (participations: number) => {
    if (participations < 100) return 1;
    if (participations < 300) return 2;
    if (participations < 500) return 3;
    if (participations < 1000) return 5;
    return 10;
  };

const handlePayment = async () => {
    if (!eventOfTheDay) return;

    try {
        const price = calculatePrice(eventOfTheDay.participations);
        console.log("Envoi au backend: ", { price, currency: 'eur', productID: eventOfTheDay.id });

        const response = await fetch(
            'https://getpaymentintent-exzkoelgwq-uc.a.run.app',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    price: price,
                    currency: 'eur',
                    productID: eventOfTheDay.id
                })
            }
        );
        const data = await response.json();
        console.log("Données reçues depuis le backend : ", data);

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const returnURL = Linking.createURL('app/screens/UserScreen');

        const { error } = await initPaymentSheet({
            merchantDisplayName: "Loterie Solidaire",
            paymentIntentClientSecret: data.paymentIntent,
            customerEphemeralKeySecret: data.ephemeralKey,
            customerId: data.customer,
            returnURL: returnURL
        });

        if (error) {
            Alert.alert("Erreur", error.message);
            return;
        }

        const { error: paymentError } = await presentPaymentSheet();

        if (paymentError) {
            Alert.alert("Paiement échoué", paymentError.message);
        } else {
            Alert.alert("Succès", "Votre paiement a été effectué avec succès!");
        }
    } catch (error) {
        console.error("Erreur lors du paiement :", error);
        Alert.alert("Erreur", "Une erreur est survenue lors du paiement.");
    }
};

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Chargement...</Text>
      </View>
    );
  }

  return (
    <StripeProvider publishableKey={publicKey}>
      <View style={styles.container}>
        <View style={styles.circleBlue1}></View>
              <View style={styles.circleBlue2}></View>
              <View style={styles.circleBlue3}></View>
              <View style={styles.circleBlue4}></View>
              <TouchableOpacity
                style={styles.profileButton}
                onPress={() => router.push("./ProfileAccountScreen")}
              >
                <FontAwesome name="user" size={24} color="white" />
              </TouchableOpacity>
              <View style={styles.headerContainer}>
                <Text style={styles.title}>
                  {eventOfTheDay ? eventOfTheDay.nom : "Événement inconnu"}
                </Text>
        
                <Text style={styles.eventRemainingTime}>
                  Fin dans{" "}
                  {eventOfTheDay ? calculateTimeRemaining(eventOfTheDay.endDate) : "--"}
                </Text>
                <Text style={styles.eventParticipation}>
                  Actuellement : {eventOfTheDay ? eventOfTheDay.participations : 0}{" "}
                  participations
                </Text>
        
                <Text style={styles.eventFunds}>
                  {eventOfTheDay ? eventOfTheDay.pourcentAsso : 0}% des fonds de cet
                  évènement sera reversé à l'association{" : "}
                  {
                    <Text style={{ fontWeight: "bold" }}>
                      {" "}
                      {eventOfTheDay ? eventOfTheDay.asso : "Association inconnue"}{" "}
                    </Text>
                  }
                </Text>
                <Text style={styles.ticketsLeft}>
                  Nombre de tickets restants avant augmentation :{" "}
                  {eventOfTheDay
                    ? calculateTicketsLeft(eventOfTheDay.participations)
                    : 0}
                </Text>
                <TouchableOpacity style={styles.participateButton} onPress={handlePayment}>
                  <Text style={styles.participateButtonText}>
                    Participer -{" "}
                    {eventOfTheDay ? calculatePrice(eventOfTheDay.participations) : 1}€
                  </Text>
                </TouchableOpacity>
              </View>
      </View>
    </StripeProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },
  circleBlue1: {
    position: "absolute",
    top: -35,
    left: -50,
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: "rgba(0,122,255,0.5)",
  },
  circleBlue2: {
    position: "absolute",
    top: -60,
    left: 0,
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: "rgba(0,122,255,0.3)",
  },
  circleBlue3: {
    position: "absolute",
    top: -35,
    right: -50,
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: "rgba(0,122,255,0.5)",
  },
  circleBlue4: {
    position: "absolute",
    top: -60,
    right: 0,
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: "rgba(0,122,255,0.3)",
  },
  profileButton: {
    backgroundColor: "#56AEFF",
    borderRadius: 50,
    width: 60,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    top: 50,
    transform: [{ translateX: -30 }],
    left: "50%",
  },
  headerContainer: {
    backgroundColor: "#f9f9f9",
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    alignItems: "center",
    width: "90%",
  },
  header: {
    backgroundColor: "#007bff",
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
    width: "100%",
    alignItems: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "black",
  },
  eventInfo: {
    marginBottom: 20,
  },
  eventRemainingTime: {
    fontSize: 16,
    color: "#333",
    marginBottom: 8,
  },
  eventParticipation: {
    fontSize: 16,
    color: "#333",
    marginBottom: 8,
  },
  eventDate: {
    fontSize: 16,
    color: "#555",
    marginBottom: 4,
  },
  eventFunds: {
    fontSize: 14,
    color: "#333",
    marginBottom: 8,
    textAlign: "center",
  },
  ticketsLeft: {
    fontSize: 14,
    color: "#d9534f",
    marginBottom: 20,
    textAlign: "center",
  },
  participateButton: {
    backgroundColor: "#007bff",
    padding: 10,
    borderRadius: 10,
    width: "80%",
    alignItems: "center",
  },
  participateButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  noEventText: {
    fontSize: 16,
    color: "#555",
  },
});
export default UserScreen;
