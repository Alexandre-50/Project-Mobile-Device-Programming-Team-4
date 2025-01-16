import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Image,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { getAuth } from "firebase/auth";
import {
  getFirestore,
  collection,
  doc,
  getDoc,
  getDocs,
  updateDoc,
  increment,
  addDoc,
} from "firebase/firestore";
import { StripeProvider, useStripe } from "@stripe/stripe-react-native";
import * as Linking from "expo-linking";
import { publicKey } from "../../constants/StripePublicKey";

interface EventData {
  id: string;
  nom?: string;
  asso?: string;
  startDate: Date;
  endDate: Date;
  participations: number;
  pourcentAsso: number;
  imageUrl?: string | null;
}

const UserScreen = () => {
  const [eventOfTheDay, setEventOfTheDay] = useState<EventData | null>(null);
  const [stripeCustomerId, setStripeCustomerId] = useState<string | null>(null);
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
            imageUrl: data.imageUrl || null,
          };
          return event;
        });

        const todayEvent = eventList.find(
          (event) => event.startDate <= today && today <= event.endDate
        );
        setEventOfTheDay(todayEvent || null);
      } catch (error) {
        console.error("Erreur lors de la récupération des événements :", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  useEffect(() => {
    // Récupérer l'ID client Stripe de l'utilisateur connecté
    const fetchStripeCustomerId = async () => {
      const user = auth.currentUser;
      if (!user) return;

      const userDocRef = doc(db, "users", user.uid);
      const userDocSnap = await getDoc(userDocRef);

      if (userDocSnap.exists() && userDocSnap.data().stripeCustomerId) {
        setStripeCustomerId(userDocSnap.data().stripeCustomerId);
      } else {
        console.error("ID client Stripe introuvable pour cet utilisateur.");
      }
    };

    fetchStripeCustomerId();
  }, [auth]);

  const calculateTicketsLeft = (participations: number) => {
    if (participations < 100) return 100 - participations;
    if (participations < 300) return 300 - participations;
    if (participations < 500) return 500 - participations;
    if (participations < 1000) return 1000 - participations;
    return 0;
  };

  const addParticipation = async (userId: string, eventId: string) => {
    try {
      const participationRef = collection(db, "participations");
      await addDoc(participationRef, {
        userId,
        eventId,
        createdAt: new Date(), // Ajouter une date pour suivre le moment de la participation
      });
      console.log("Participation ajoutée avec succès :", userId, eventId);
    } catch (error) {
      console.error("Erreur lors de l'ajout de la participation :", error);
      Alert.alert("Erreur", "Impossible d'enregistrer la participation.");
    }
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

  const updateEventParticipation = async (eventId: string) => {
    try {
      const eventRef = doc(db, "evenements", eventId);
      await updateDoc(eventRef, {
        participations: increment(1), // Incrémente la participation
      });
      console.log("Participation ajoutée avec succès à l'événement :", eventId);

      // Mettre à jour localement l'événement
      setEventOfTheDay((prevEvent) => {
        if (prevEvent) {
          return { ...prevEvent, participations: prevEvent.participations + 1 };
        }
        return prevEvent;
      });
    } catch (error) {
      console.error(
        "Erreur lors de la mise à jour des participations :",
        error
      );
      Alert.alert("Erreur", "Impossible de mettre à jour les participations.");
    }
  };

  const handlePayment = async () => {
    if (!eventOfTheDay || !stripeCustomerId) {
      Alert.alert("Erreur", "Impossible de récupérer l'ID client Stripe.");
      return;
    }

    try {
      const price = calculatePrice(eventOfTheDay.participations);
      console.log("Envoi au backend : ", {
        price,
        currency: "eur",
        productID: eventOfTheDay.id,
        customerId: stripeCustomerId,
      });

      const response = await fetch(
        "https://getpaymentintent-exzkoelgwq-uc.a.run.app",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            price,
            currency: "eur",
            productID: eventOfTheDay.id,
            customerId: stripeCustomerId,
          }),
        }
      );
      const data = await response.json();
      console.log("Données reçues depuis le backend : ", data);

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const returnURL = Linking.createURL("app/screens/UserScreen");

      const { error } = await initPaymentSheet({
        merchantDisplayName: "Loterie Solidaire",
        paymentIntentClientSecret: data.paymentIntent,
        customerEphemeralKeySecret: data.ephemeralKey,
        customerId: stripeCustomerId,
        returnURL,
      });

      if (error) {
        Alert.alert("Erreur", error.message);
        return;
      }

      const { error: paymentError } = await presentPaymentSheet();

      if (paymentError) {
        Alert.alert("Paiement échoué", paymentError.message);
      } else {
        Alert.alert("Succès", "Votre paiement a été effectué avec succès !");
        await updateEventParticipation(eventOfTheDay.id);
        if (auth.currentUser?.uid) {
          await addParticipation(auth.currentUser.uid, eventOfTheDay.id);
        } else {
          console.error("Utilisateur non authentifié");
          Alert.alert(
            "Erreur",
            "Impossible d'enregistrer la participation. Utilisateur non authentifié."
          );
        }
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
            {eventOfTheDay
              ? calculateTimeRemaining(eventOfTheDay.endDate)
              : "--"}
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
                {eventOfTheDay
                  ? eventOfTheDay.asso
                  : "Association inconnue"}{" "}
              </Text>
            }
          </Text>
          <Image
            source={{
              uri:
                eventOfTheDay?.imageUrl ||
                require("../../assets/images/app/DefaultImageEvent.png"),
            }}
            style={styles.eventImage}
          />

          <Text style={styles.ticketsLeft}>
            Nombre de tickets restants avant augmentation :{" "}
            {eventOfTheDay
              ? calculateTicketsLeft(eventOfTheDay.participations)
              : 0}
          </Text>
          <TouchableOpacity
            style={styles.participateButton}
            onPress={handlePayment}
          >
            <Text style={styles.participateButtonText}>
              Participer -{" "}
              {eventOfTheDay ? calculatePrice(eventOfTheDay.participations) : 1}
              €
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

  eventImage: {
    width: 60, // Taille de l'image
    height: 60,
    borderRadius: 4,
    marginRight: 16,
    borderWidth: 1,
    borderColor: "#ccc",
    backgroundColor: "#f9f9f9", // Couleur de fond pour éviter des moments de chargement vides
  },
});
export default UserScreen;
