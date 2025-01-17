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
import { useRouter } from "expo-router";
import { auth, db } from "../../firebaseConfig";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import {
  collection,
  getDocs,
  doc,
  setDoc,
  getDoc,
  Timestamp,
  
} from "firebase/firestore";
import { MaterialIcons } from "@expo/vector-icons";
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';

const AddEventScreen = () => {
  const [eventName, setEventName] = useState("");
  const [selectedAsso, setSelectedAsso] = useState("");
  const [assos, setAssos] = useState<string[]>([]);
  const [percentage, setPercentage] = useState("");
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [error, setError] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const router = useRouter();
  


const uploadImage = async (uri: string): Promise<string> => {
  try {
    // Redimensionner l'image à 120x120
    const resizedImage = await ImageManipulator.manipulateAsync(
      uri,
      [{ resize: { width: 120, height: 120 } }], // Redimensionnement
      { compress: 1, format: ImageManipulator.SaveFormat.PNG } // Conserver la qualité et enregistrer en PNG
    );

    const response = await fetch(resizedImage.uri);
    const blob = await response.blob();

    const storage = getStorage();
    const imageRef = ref(storage, `eventImages/${Date.now()}`); // Crée un chemin unique
    await uploadBytes(imageRef, blob);

    const imageUrl = await getDownloadURL(imageRef);
    return imageUrl;
  } catch (error) {
    console.error("Erreur lors de l'upload de l'image :", error);
    throw error;
  }
};

  
  useEffect(() => {
    const fetchAssos = async () => {
      const assosCollection = await getDocs(collection(db, "assos"));
      const assosList = assosCollection.docs.map((doc) => doc.data().nom);
      setAssos(assosList);
      console.log("Associations proposées :", assosList);
    };
    fetchAssos();
  }, []);

  const quitter = async () => {
    const user = auth.currentUser;
    if (user) {
      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        if (userData.role === "superadmin") {
          router.replace("./SuperAdminScreen");
        } else if (userData.role === "admin") {
          router.replace("./ManageEventScreen");
        } else {
          router.replace("./HomeScreen");
        }
      }
    }
  };
  


  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert('Permission refusée', 'Vous devez autoriser l’accès à la galerie pour choisir une image.');
      return;
    }
  
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });
  
    // Vérifiez si result.assets existe avant d'y accéder
    if (!result.canceled && result.assets && result.assets.length > 0) {
      setSelectedImage(result.assets[0].uri);
    }
  };
  

  const takePhoto = async () => {
    // Demander la permission pour accéder à la caméra
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert('Permission refusée', 'Vous devez autoriser l accès à la caméra pour prendre une photo.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    }
  };
  const handleAddEvent = async () => {
    if (!eventName || !selectedAsso || !percentage || !startDate || !endDate) {
      setError("Veuillez remplir tous les champs.");
      return;
    }
  
    const percentValue = Number(percentage);
    if (percentValue < 0 || percentValue > 100) {
      setError("Le pourcentage doit être compris entre 0 et 100.");
      return;
    }
  
    const currentDate = new Date();
    if (startDate <= currentDate) {
      setError("La date de début doit être postérieure à la date actuelle.");
      return;
    }
  
    if (endDate <= startDate) {
      setError("La date de fin doit être postérieure à la date de début.");
      return;
    }
  
    try {
      let imageUrl = null;
      if (selectedImage) {
        // Télécharge l'image redimensionnée et obtient l'URL
        imageUrl = await uploadImage(selectedImage);
      }
  
      const newEventRef = doc(collection(db, "evenements"));
      await setDoc(newEventRef, {
        nom: eventName,
        asso: selectedAsso,
        pourcentAsso: percentValue,
        startDate: Timestamp.fromDate(startDate),
        endDate: Timestamp.fromDate(endDate),
        participations: "0",
        imageUrl: imageUrl, // Ajoute l'URL de l'image
        winner: "0",
      });
  
      quitter();
    } catch (error) {
      console.error("Erreur lors de l'ajout de l'événement :", error);
      setError("Erreur lors de l'ajout de l'événement.");
    }
  };
  
  

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.circleBlue1}></View>
        <View style={styles.circleBlue2}></View>
        <View style={styles.circleBlue3}></View>
        <View style={styles.circleBlue4}></View>

        <TouchableOpacity onPress={() => quitter()} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>

        <Text style={styles.title}>Add Event</Text>

        <TextInput
          placeholder="Event Name"
          placeholderTextColor="gray"
          value={eventName}
          onChangeText={setEventName}
          style={styles.input}
        />

        <Text>Select an association :</Text>
        <TouchableOpacity
          style={styles.input}
          onPress={() => setModalVisible(true)}
        >
          <Text>{selectedAsso || "Choose an association"}</Text>
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
          placeholder="Percentage of the association"
          placeholderTextColor="gray"
          value={percentage}
          onChangeText={setPercentage}
          keyboardType="numeric"
          style={styles.input}
        />

        <Text>Start date and time :</Text>
        <DateTimePicker
          value={startDate}
          mode="datetime"
          display="default"
          onChange={(event, selectedDate) =>
            setStartDate(selectedDate || startDate)
          }
        />

        <Text>End date and time :</Text>
        <DateTimePicker
          value={endDate}
          mode="datetime"
          display="default"
          onChange={(event, selectedDate) =>
            setEndDate(selectedDate || endDate)
          }
        />
        <View style={styles.ChooseImageContainer}>
          {selectedImage ? (
            <Image source={{ uri: selectedImage }} style={styles.Image} />
          ) : (
            <Text style={styles.PlaceHolderText}>No picture selected</Text>
          )}

          <View style={styles.ButtonContainer}>
            <TouchableOpacity style={styles.buttonChoisirImage} onPress={takePhoto}>
              <Text style={styles.modalButtonText}>Take a picture</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.buttonChoisirImage} onPress={pickImage}>
              <Text style={styles.modalButtonText}>Choose a picture</Text>
            </TouchableOpacity>
          </View>
        </View>

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <TouchableOpacity style={styles.button} onPress={handleAddEvent}>
          <Text style={styles.buttonText}>Add Event</Text>
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
  modalContainerCentered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContentCentered: {
    height: "80%",
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  modalButton: {
    padding: 15,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    marginBottom: 10,
    backgroundColor: "white",
  },
  modalButtonText: {
    fontSize: 14,
    textAlign: "center",
  },
  backButton: {
    position: "absolute",
    top: 40,
    left: 20,
    padding: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    width: "90%",
    padding: 15,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    marginBottom: 15,
  },
  button: {
    backgroundColor: "#56AEFF",
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 10,
    marginTop: 10,
    width: "90%",

  },
  buttonChoisirImage: {
    backgroundColor: "#eee",
    paddingVertical: 15,
    paddingHorizontal: 2,
    borderRadius: 10,
    marginTop: 10,
    width: "90%",
    borderColor:'#ddd',
  },
  buttonText: {
    color:"black",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",

  },
  errorText: {
    color: "red",
    marginBottom: 10,
  },
  ChooseImageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,

  },
  Image: {
    width: 200,
    height: 200,
    borderRadius: 10,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: 'black',

  },
  PlaceHolderText: {
    fontSize: 16,
    color: 'gray',
    marginBottom: 20,
  },
  ButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '60%',
  },
});

export default AddEventScreen;
