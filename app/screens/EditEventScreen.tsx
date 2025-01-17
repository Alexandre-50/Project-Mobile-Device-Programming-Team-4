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
  const { id } = useLocalSearchParams(); 
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
    <View style={styles.container}>
      

        
      <View style={styles.circleBlue1}></View> 
      <View style={styles.circleBlue2}></View> 
      <View style={styles.circleBlue3}></View>
      <View style={styles.circleBlue4}></View> 
      <Text style={styles.title}>Edit Event</Text>
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        

        <TextInput
          placeholder="Event Name"
          placeholderTextColor="gray"
          value={event.nom}
          onChangeText={(text) => setEvent({ ...event, nom: text })}
          style={styles.input}
        />

        <Text>Select an association :</Text>
        <TouchableOpacity style={styles.input} onPress={() => setModalVisible(true)}>
          <Text>{event.asso || "Choose an association"}</Text>
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
          placeholder="Percentage of the association"
          placeholderTextColor="gray"
          value={event.pourcentAsso.toString()}
          onChangeText={(text) => setEvent({ ...event, pourcentAsso: text })}
          keyboardType="numeric"
          style={styles.input}
        />

        <Text>Start date and time</Text>
        <DateTimePicker
            value={new Date(event.startDate)} 
            mode="datetime"
            display="default"
            onChange={(pickerEvent, selectedDate) => {
                if (selectedDate) {
                setEvent({ ...event, startDate: selectedDate });
                }
            }}
            />

            <DateTimePicker
            value={new Date(event.endDate)} 
            mode="datetime"
            display="default"
            onChange={(pickerEvent, selectedDate) => {
                if (selectedDate) {
                setEvent({ ...event, endDate: selectedDate }); 
                }
            }}
            />


        

        <View style={styles.ChooseImageContainer}>
        {selectedImage ? (
            <Image source={{ uri: selectedImage }} style={styles.Image} />
        ) : (
            <Text style={styles.PlaceHolderText}>no picture select</Text>
        )}

        <View style={styles.ButtonContainer}>
            {}
            <TouchableOpacity style={styles.buttonChoisirImage} onPress={takePhoto}>
            <Text style={styles.modalButtonText}>Take a picture</Text>
            </TouchableOpacity>

            {}
            <TouchableOpacity style={styles.buttonChoisirImage} onPress={pickImage}>
            <Text style={styles.modalButtonText}>Choose a picture</Text>
            </TouchableOpacity>
        </View>
        </View>

        

        <TouchableOpacity style={styles.button} onPress={handleSaveChanges}>
          <Text style={styles.buttonText}>Save changes</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  </View>
  );
};

const styles = StyleSheet.create({
    container: {
      flexGrow: 1,
      justifyContent: "center",
      alignItems: "center",
      paddingHorizontal: 20,
      paddingVertical: 30,
      width: "100%",
      backgroundColor: "transparent",
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
        marginLeft: -100,
        width: "50%",
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
      width: "80%",
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
