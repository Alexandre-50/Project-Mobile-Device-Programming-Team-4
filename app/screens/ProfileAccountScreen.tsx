import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { getAuth } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { AntDesign, FontAwesome } from "@expo/vector-icons";

const ProfileAccountScreen = () => {
  const [userInfo, setUserInfo] = useState<any>(null);
  const auth = getAuth();
  const db = getFirestore();
  const router = useRouter();

  useEffect(() => {
    const fetchUserInfo = async () => {
      if (auth.currentUser) {
        const userDocRef = doc(db, "users", auth.currentUser.uid);
        const userDocSnap = await getDoc(userDocRef);
        if (userDocSnap.exists()) {
          setUserInfo(userDocSnap.data());
        }
      }
    };

    fetchUserInfo();
  }, []);

  if (!userInfo) {
    return <Text>Loading...</Text>;
  }

  const { role, email, nom, prenom, adresse, codePostale, pays, ville } =
    userInfo;

  return (
    <View style={styles.container}>
      <View style={styles.circleBlue1}></View>
      <View style={styles.circleBlue2}></View>
      <View style={styles.circleBlue3}></View>
      <View style={styles.circleBlue4}></View>
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <MaterialIcons name="arrow-back" size={24} color="black" />
      </TouchableOpacity>
      <TouchableOpacity style={styles.profileButton}>
        <FontAwesome name="user" size={80} color="white" />
      </TouchableOpacity>
      {role === "superadmin" && (
        <View>
          <Text style={styles.email}>{email}</Text>
          <Text style={styles.role}>SuperAdmin</Text>
        </View>
      )}

      {role === "admin" && (
        <View>
          <Text style={styles.nom}>
            {prenom} {nom}
          </Text>
          <Text style={styles.email}>{email}</Text>
          <Text style={styles.role}>Admin</Text>
        </View>
      )}

      {role === "user" && (
        <View>
          <Text style={styles.nom}>
            {prenom} {nom}
          </Text>
          <Text style={styles.email}>{email}</Text>
          <Text style={styles.adresse}>
            {codePostale} {ville}
          </Text>
          <Text style={styles.pays}>{pays}</Text>
        </View>
      )}
      <TouchableOpacity
        style={styles.button}
        onPress={() => router.replace("./LoginScreen")}
      >
        <Text style={styles.buttonText}>Disconnect</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "white",
  },
  profileButton: {
    backgroundColor: "#56AEFF",
    borderRadius: 100,
    width: 130,
    height: 130,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    top: 75,
    transform: [{ translateX: -65 }],
    left: "50%",
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
  backButton: {
    position: "absolute",
    top: 40,
    left: 20,
    padding: 10,
  },
  text: {
    fontSize: 18,
    marginBottom: 10,
  },
  email: {
    fontSize: 16,
    textAlign: "center",
    color: "black",
    fontWeight: "bold",
  },
  nom: {
    fontSize: 20,
    textAlign: "center",
    color: "black",
    fontWeight: "bold",
  },
  role: {
    fontSize: 16,
    textAlign: "center",
    color: "black",
  },
  adresse: {
    fontSize: 16,
    textAlign: "center",
    color: "black",
  },
  pays: {
    fontSize: 16,
    textAlign: "center",
    color: "black",
  },
  button: {
    position: "absolute",
    bottom: 35,
    left: "5%",
    borderRadius: 10,
    backgroundColor: "white",
    paddingVertical: 15,
    paddingHorizontal: 40,
    marginTop: 20,
    width: "90%",
    borderWidth: 3,
    borderColor: "red",
  },
  buttonText: {
    color: "red",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default ProfileAccountScreen;
