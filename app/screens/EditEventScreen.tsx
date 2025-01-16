import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  Modal,
  FlatList,
  Alert,
  Image,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useRouter, useLocalSearchParams } from "expo-router";
import { auth, db } from "../../firebaseConfig";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import {
  doc,
  updateDoc,
  getDoc,
  collection,
  getDocs,
  Timestamp,
} from "firebase/firestore";
import { MaterialIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import * as ImageManipulator from "expo-image-manipulator";

const EditEventScreen = () => {
  const [event, setEvent] = useState<any>(null);
  const [assos, setAssos] = useState<string[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const router = useRouter();
  const { id } = useLocalSearchParams(); // Récupère l'ID de l'événement depuis les paramètres
  const storage = getStorage();

  useEffect(() => {
    const fetchEvent = async () => {
      if (!id) return;
      try {
        const eventDoc = await getDoc(doc(db, "evenements", id as string));
        if (eventDoc.exists()) {
          const data = eventDoc.data();
          setEvent({
            ...data,
            startDate: data.startDate.toDate(),
            endDate: data.endDate.toDate(),
          });
          setSelectedImage(data.imageUrl || null);
        } else {
          Alert.alert("Erreur", "Événement introuvable");
          router.back();
        }
      } catch (error) {
        console.error("Erreur lors de la récupération de l'événement :", error);
        Alert.alert("Erreur", "Impossible de charger l'événement.");
        router.back();
      }
    };

    const fetchAssos = async () => {
      const assosCollection = await getDocs(collection(db, "assos"));
      const assosList = assosCollection.docs.map((doc) => doc.data().nom);
      setAssos(assosList);
    };

    fetchEvent();
    fetchAssos();
  }, [id]);

  const uploadImage = async (uri: string): Promise<string> => {
    try {
      const resizedImage = await ImageManipulator.manipulateAsync(
        uri,
        [{ resize: { width: 120, height: 120 } }],
        { compress: 1, format: ImageManipulator.SaveFormat.PNG }
      );

      const response = await fetch(resizedImage.uri);
      const blob = await response.blob();
      const imageRef = ref(storage, `eventImages/${Date.now()}`);
      await uploadBytes(imageRef, blob);

      const imageUrl = await getDownloadURL(imageRef);
      return imageUrl;
    } catch (error) {
      console.error("Erreur lors de l'upload de l'image :", error);
      throw error;
    }
  };
  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert(
        "Permission refusée",
        "Vous devez autoriser l'accès à la galerie pour choisir une image."
      );
      return;
    }
  
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });
  
    if (!result.canceled && result.assets?.length > 0) {
      setSelectedImage(result.assets[0].uri);
    }
  };
  
  const takePhoto = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert(
        "Permission refusée",
        "Vous devez autoriser l'accès à la caméra pour prendre une photo."
      );
      return;
    }
  
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });
  
    if (!result.canceled && result.assets?.length > 0) {
      setSelectedImage(result.assets[0].uri);
    }
  };
  
  const handleSaveChanges = async () => {
    if (!event.nom || !event.asso || !event.pourcentAsso || !event.startDate || !event.endDate) {
      Alert.alert("Erreur", "Veuillez remplir tous les champs.");
      return;
    }

    if (Number(event.pourcentAsso) < 0 || Number(event.pourcentAsso) > 100) {
      Alert.alert("Erreur", "Le pourcentage doit être compris entre 0 et 100.");
      return;
    }

    if (event.startDate >= event.endDate) {
      Alert.alert("Erreur", "La date de fin doit être postérieure à la date de début.");
      return;
    }

    try {
      let imageUrl = event.imageUrl || null;
      if (selectedImage && selectedImage !== event.imageUrl) {
        imageUrl = await uploadImage(selectedImage);
      }

      await updateDoc(doc(db, "evenements", id as string), {
        ...event,
        imageUrl,
        startDate: Timestamp.fromDate(new Date(event.startDate)),
        endDate: Timestamp.fromDate(new Date(event.endDate)),
      });

      Alert.alert("Succès", "Événement mis à jour !");
      router.replace("./ManageEventScreen");
    } catch (error) {
      console.error("Erreur lors de la mise à jour de l'événement :", error);
      Alert.alert("Erreur", "Impossible de mettre à jour l'événement.");
    }
  };

  if (!event) {
    return (
      <View style={styles.loader}>
        <Text>Chargement...</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>

        <Text style={styles.title}>Modifier l'événement</Text>

        <TextInput
          placeholder="Nom de l'événement"
          placeholderTextColor="gray"
          value={event.nom}
          onChangeText={(text) => setEvent({ ...event, nom: text })}
          style={styles.input}
        />

        <Text>Sélectionnez une association :</Text>
        <TouchableOpacity style={styles.input} onPress={() => setModalVisible(true)}>
          <Text>{event.asso || "Choisir une association"}</Text>
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
                      setEvent({ ...event, asso: item });
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
          value={event.pourcentAsso.toString()}
          onChangeText={(text) => setEvent({ ...event, pourcentAsso: text })}
          keyboardType="numeric"
          style={styles.input}
        />

        <Text>Date et heure de début :</Text>
        <DateTimePicker
            value={new Date(event.startDate)} // Assurez-vous que la valeur est un objet Date valide
            mode="datetime"
            display="default"
            onChange={(pickerEvent, selectedDate) => {
                if (selectedDate) {
                setEvent({ ...event, startDate: selectedDate }); // Mettez à jour startDate uniquement si une date est sélectionnée
                }
            }}
            />

            <DateTimePicker
            value={new Date(event.endDate)} // Assurez-vous que la valeur est un objet Date valide
            mode="datetime"
            display="default"
            onChange={(pickerEvent, selectedDate) => {
                if (selectedDate) {
                setEvent({ ...event, endDate: selectedDate }); // Mettez à jour endDate uniquement si une date est sélectionnée
                }
            }}
            />


        

        <View style={styles.ChooseImageContainer}>
        {selectedImage ? (
            <Image source={{ uri: selectedImage }} style={styles.Image} />
        ) : (
            <Text style={styles.PlaceHolderText}>Aucune image sélectionnée</Text>
        )}

        <View style={styles.ButtonContainer}>
            {/* Bouton pour prendre une photo */}
            <TouchableOpacity style={styles.buttonChoisirImage} onPress={takePhoto}>
            <Text style={styles.modalButtonText}>Prendre une photo</Text>
            </TouchableOpacity>

            {/* Bouton pour choisir une image depuis la galerie */}
            <TouchableOpacity style={styles.buttonChoisirImage} onPress={pickImage}>
            <Text style={styles.modalButtonText}>Choisir depuis la galerie</Text>
            </TouchableOpacity>
        </View>
        </View>

        

        <TouchableOpacity style={styles.button} onPress={handleSaveChanges}>
          <Text style={styles.buttonText}>Enregistrer les modifications</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
    container: {
      flexGrow: 1,
      justifyContent: "center",
      alignItems: "center",
      paddingHorizontal: 20,
      paddingVertical: 30,
      backgroundColor: "white",
    },
    backButton: {
      position: "absolute",
      top: 20,
      left: 20,
      padding: 10,
    },
    title: {
      fontSize: 24,
      fontWeight: "bold",
      marginBottom: 20,
      color: "#333",
    },
    ButtonContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginLeft: -35,
        width: "100%",
        marginTop: 10,
      },
      buttonChoisirImage: {
        backgroundColor: "#56AEFF",
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 10,
        marginHorizontal: 5,
      },
      modalButtonText: {
        color: "white",
        fontSize: 14,
        textAlign: "center",
      },
    input: {
      width: "90%",
      padding: 15,
      borderWidth: 1,
      borderColor: "#ccc",
      borderRadius: 10,
      marginBottom: 15,
      backgroundColor: "#f9f9f9",
    },
    button: {
      backgroundColor: "#56AEFF",
      paddingVertical: 15,
      paddingHorizontal: 40,
      borderRadius: 10,
      marginTop: 20,
      width: "90%",
    },
    buttonText: {
      color: "white",
      fontSize: 16,
      fontWeight: "bold",
      textAlign: "center",
    },
    modalContainerCentered: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    modalContentCentered: {
      width: "80%",
      backgroundColor: "white",
      borderRadius: 10,
      padding: 20,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 5,
      elevation: 5,
    },
    modalButton: {
      padding: 15,
      borderWidth: 1,
      borderColor: "#ccc",
      borderRadius: 10,
      marginBottom: 10,
      backgroundColor: "#f9f9f9",
    },
    
    ChooseImageContainer: {
      justifyContent: "center",
      alignItems: "center",
      width: "100%",
      marginTop: 20,
    },
    Image: {
      width: 200,
      height: 200,
      borderRadius: 10,
      marginBottom: 20,
      borderWidth: 2,
      borderColor: "#333",
    },
    PlaceHolderText: {
      fontSize: 16,
      color: "gray",
      marginBottom: 20,
    },
    
    loader: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
  });
  

export default EditEventScreen;
