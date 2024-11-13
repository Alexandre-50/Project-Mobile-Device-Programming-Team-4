import React from 'react';
import { View, Text, StyleSheet, ImageBackground, TouchableOpacity } from 'react-native';

const App: React.FC = () => {
  return (
    <View style={styles.container}>
      

      <ImageBackground
    source={require('../../assets/images/page_accueil.png')} // Chemin de votre image
    style={styles.background} // Utilisez un style pour ajuster la taille
    resizeMode="contain" //permet de garder les dimensions de l image
      >
        {/* Le reste de votre contenu */}
      </ImageBackground>
      {/* Background Circles with Overlapping Effect */}
      <View style={styles.circleLarge} />
      <View style={styles.circleSmall} />

      {/* Main Title */}
      <Text style={styles.title}>Participez, gagnez, soutenez !</Text>

      {/* Description */}
      <Text style={styles.description}>
        Chaque mois, tentez de remporter un maillot collector rare ou signé ! Pour participer, rejoignez
        notre loto solidaire : les premiers inscrits bénéficient de tarifs réduits, et une partie des
        recettes est reversée à nos associations partenaires. Une chance unique pour vous de gagner, tout
        en soutenant une bonne cause.
      </Text>

      {/* Button */}
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>C'est Parti !</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  background: {
    flex: 1,
    top:50,
    width: '100%',
    height: '80%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  // Styles for the blue circles with lower opacity
  circleLarge: {
    position: 'absolute',
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: '#4a90e2',
    top: -20,
    left: -60,
    opacity:0.6,
  },
  circleSmall: {
    position: 'absolute',
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: '#4a90e2',
    top: -70,
    left: 0,
    opacity:0.6,
  },
  illustration: {
    width: 150,
    height: 150,
    resizeMode: 'contain',
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 10,
  },
  description: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginVertical: 15,
    lineHeight: 20,
    paddingHorizontal: 20,
  },
  button: {
    backgroundColor: '#4a90e2',
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginTop: 20,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default App;
