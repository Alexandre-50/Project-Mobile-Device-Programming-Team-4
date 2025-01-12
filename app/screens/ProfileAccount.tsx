import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Image, Button,TouchableOpacity } from "react-native";
import { getAuth } from "firebase/auth";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { initializeApp } from "firebase/app";
import { firebaseConfig } from "../../firebaseConfig";
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { AntDesign, FontAwesome } from '@expo/vector-icons';

// Initialiser Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

type UserInfo = {
  role: string;
  prenom: string;
  nom: string;
  email: string;
};

const getUserInfo = async (): Promise<UserInfo | null> => {
  const user = auth.currentUser; // Récupérer l'utilisateur connecté
  if (!user) {
    console.error("Utilisateur non connecté.");
    return null;
  }

  try {
    const usersRef = collection(db, "users"); // Référence à la collection 'users'
    const querySnapshot = await getDocs(usersRef); // Récupérer tous les documents de la collection

    // Parcourir les documents pour trouver les informations de l'utilisateur
    for (const doc of querySnapshot.docs) {
      const userData = doc.data();
      if (userData.email === user.email) {
        console.log("Utilisateur trouvé :", {
          role: userData.role,
          prenom: userData.prenom,
          nom: userData.nom,
          email:userData.email,

        });
        return {
          role: userData.role,
          prenom: userData.prenom,
          nom: userData.nom,
          email : userData.email,
        }; // Retourne les informations de l'utilisateur
      }
    }

    console.warn("Utilisateur non trouvé dans la base de données.");
    return null;
  } catch (error) {
    console.error("Erreur lors de la récupération des informations :", error);
    return null;
  }
};

const ProfilePage: React.FC = () => {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);

  useEffect(() => {
    const fetchUserInfo = async () => {
      const info = await getUserInfo(); // Appel de la fonction
      setUserInfo(info); // Stocker les informations dans un état
    };

    fetchUserInfo();
  }, []);
    const router = useRouter();
  
  return (
    <View style={styles.container}>
      {/* Header */}
      <TouchableOpacity onPress={() => router.back()} style={styles.header}>
              <MaterialIcons name="arrow-back" size={24} color="black" />
            </TouchableOpacity>

      {/* Profile Section */}
      <View style={styles.profile}>
      <View style={styles.iconContainer}>
          <FontAwesome name="user" size={24} color="white" />
        </View>
        {userInfo ? (
          <>
            <Text style={styles.name}>
              {userInfo.prenom} {userInfo.nom}
            </Text>
            <Text style={styles.role}>Rôle : {userInfo.role}</Text>
            <Text style={styles.role}>E-mail : {userInfo.email}</Text>
          </>
        ) : (
          <Text style={styles.loading}>Chargement des informations...</Text>
        )}
        <View style={styles.contentPlaceholder} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  iconContainer: {
    marginBottom: 20,
    backgroundColor: "#3498db",
    borderRadius: 50,
    padding: 20,
  },
  
  header: {
    width: "100%",
    backgroundColor: "#87ceeb",
    padding: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  profile: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    marginTop: 20,
  },
  avatarImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#dcdcdc",
    marginBottom: 20,
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  role: {
    fontSize: 18,
    color: "#555",
    marginBottom: 10,
  },
  loading: {
    fontSize: 16,
    color: "#888",
    marginBottom: 20,
  },
  contentPlaceholder: {
    width: "90%",
    height: 200,
    backgroundColor: "#dcdcdc",
    borderRadius: 5,
    marginTop: 20,
  },
});

export default ProfilePage;
