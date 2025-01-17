import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  TextInput,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import {
  getFirestore,
  collection,
  getDocs,
  query,
  getDoc,
  where,
  updateDoc,
  doc,
} from "firebase/firestore";
import { MaterialIcons, FontAwesome } from "@expo/vector-icons";

interface EventData {
  id: string;
  nom: string;
  asso: string;
  startDate: Date;
  endDate: Date;
  participations: number;
  pourcentAsso: number;
  imageUrl?: string | null;
  winner?: string;
}

const PastEventsScreen = () => {
  const [pastEvents, setPastEvents] = useState<EventData[]>([]);
  const router = useRouter();
  const db = getFirestore();

  useEffect(() => {
    const fetchPastEvents = async () => {
      try {
        const eventCollectionRef = collection(db, "evenements");
        const eventDocsSnap = await getDocs(eventCollectionRef);

        const now = new Date();
        const eventList: EventData[] = eventDocsSnap.docs
          .map((doc) => {
            const data = doc.data();
            return {
              id: doc.id,
              nom: data.nom || "Nom inconnu",
              asso: data.asso || "Association inconnue",
              startDate: new Date(data.startDate.seconds * 1000),
              endDate: new Date(data.endDate.seconds * 1000),
              participations: data.participations || 0,
              pourcentAsso: data.pourcentAsso || 0,
              imageUrl: data.imageUrl || null,
              winner: data.winner || "0", // Par défaut, on considère "0" comme non défini
            };
          })
          .filter((event) => event.endDate < now); // Filtrer uniquement les événements passés

        setPastEvents(eventList);
        checkAndDrawWinners(eventList);
      } catch (error) {
        console.error(
          "Erreur lors de la récupération des événements passés :",
          error
        );
      }
    };

    fetchPastEvents();
  }, []);

  const checkAndDrawWinners = async (events: EventData[]) => {
    for (const event of events) {
      if (event.winner === "0") {
        try {
          // Récupérer tous les participants de l'événement
          const participationRef = collection(db, "participations");
          const participationQuery = query(
            participationRef,
            where("eventId", "==", event.id)
          );
          const participationSnap = await getDocs(participationQuery);

          const participants = participationSnap.docs.map(
            (doc) => doc.data().userId
          );

          if (participants.length === 0) {
            console.log(`Aucun participant pour l'événement ${event.nom}`);

            // Mettre à jour le gagnant dans la base de données avec "Aucun Gagnant"
            const eventRef = doc(db, "evenements", event.id);
            await updateDoc(eventRef, { winner: "Aucun Gagnant" });
            continue; // Passer à l'événement suivant
          }

          // Tirage au sort
          const randomIndex = Math.floor(Math.random() * participants.length);
          const winnerId = participants[randomIndex];

          // Récupérer les informations du gagnant
          const userRef = doc(db, "users", winnerId);
          const userSnap = await getDoc(userRef);

          if (!userSnap.exists()) {
            console.error(`Utilisateur introuvable pour l'ID : ${winnerId}`);
            continue;
          }

          const userData = userSnap.data();
          const winnerName = `${userData.prenom} ${userData.nom}`;
          const winnerEmail = userData.email;

          // Mettre à jour le gagnant dans la base de données
          const eventRef = doc(db, "evenements", event.id);
          await updateDoc(eventRef, { winner: winnerId });

          console.log(
            `Gagnant désigné pour l'événement ${event.nom}: ${winnerName}`
          );

          // Vous pouvez également ajouter ici l'envoi d'un e-mail au gagnant
        } catch (error) {
          console.error(
            `Erreur lors du tirage au sort pour l'événement ${event.nom}:`,
            error
          );
        }
      }
    }

    // Recharger les événements après mise à jour
    const updatedEventsSnap = await getDocs(collection(db, "evenements"));
    const updatedEventList: EventData[] = updatedEventsSnap.docs
      .map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          nom: data.nom || "Nom inconnu",
          asso: data.asso || "Association inconnue",
          startDate: new Date(data.startDate.seconds * 1000),
          endDate: new Date(data.endDate.seconds * 1000),
          participations: data.participations || 0,
          pourcentAsso: data.pourcentAsso || 0,
          imageUrl: data.imageUrl || null,
          winner: data.winner || "0",
        };
      })
      .filter((event) => event.endDate < new Date());

    setPastEvents(updatedEventList);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.profileButton}
        onPress={() => router.push("./ProfileAccountScreen")}
      >
        <FontAwesome name="user" size={24} color="white" />
      </TouchableOpacity>
      <View style={styles.circleBlue1}></View>
      <View style={styles.circleBlue2}></View>
      <View style={styles.circleBlue3}></View>
      <View style={styles.circleBlue4}></View>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => router.push("./UserScreen")}
      >
        <MaterialIcons name="arrow-back" size={24} color="black" />
      </TouchableOpacity>
      <FlatList
        style={styles.FlatList}
        data={pastEvents}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.eventCard}>
            <Image
              source={{
                uri:
                  item.imageUrl ||
                  require("../../assets/images/app/DefaultImageEvent.png"),
              }}
              style={styles.eventImage}
            />
            <View style={styles.eventDetails}>
              <Text style={styles.eventName}>{item.nom}</Text>
              <Text style={styles.eventDate}>
                {item.startDate.toLocaleDateString()} -{" "}
                {item.endDate.toLocaleDateString()}
              </Text>
              <Text style={styles.eventParticipation}>
                Participations : {item.participations}
              </Text>
              <Text style={styles.eventFunds}>
                {item.pourcentAsso}% des fonds reversés à : {item.asso}
              </Text>
              <TextInput
                value={item.winner || ""}
                editable={false}
                style={styles.winnerInput}
                placeholder="Nom du gagnant"
              />
            </View>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
    backgroundColor: "white",
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
  backButton: {
    position: "absolute",
    top: 40,
    left: 20,
    padding: 10,
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
  FlatList: {
    position: "absolute",
    width: "100%",
    height: "850%",
    top: "15%",
    backgroundColor: "white",
    padding: 16,
  },
  eventCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    marginBottom: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#f9f9f9",
  },
  eventImage: {
    width: 60,
    height: 60,
    borderRadius: 4,
    marginRight: 16,
  },
  eventDetails: {
    flex: 1,
  },
  eventName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  eventDate: {
    fontSize: 14,
    color: "#555",
  },
  eventParticipation: {
    fontSize: 14,
    color: "#333",
  },
  eventFunds: {
    fontSize: 14,
    color: "#333",
  },
  winnerInput: {
    marginTop: 8,
    padding: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    backgroundColor: "#f9f9f9",
  },
});

export default PastEventsScreen;
