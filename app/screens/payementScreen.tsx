import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    Image,
    
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import { FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const PaymentScreen = () => {
    const [cardNumber, setCardNumber] = useState('');
    const [cardName, setCardName] = useState('');
    const [cardCVV, setCardCVV] = useState('');
    const [saveCard, setSaveCard] = useState(false); // Checkbox state
    const router = useRouter();

    return (
        <View style={styles.container}>
            {/* Retour arrière */}
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <MaterialIcons name="arrow-back" size={24} color="black" />
            </TouchableOpacity>
            {/* Cercles décoratifs */}
            <View style={styles.circleBlue1}></View>
            <View style={styles.circleBlue2}></View>
            <View style={styles.circleBlue3}></View>
            <View style={styles.circleBlue4}></View>

            {/* Illustration */}
            <View style={styles.imageContainer}>
                <Image
                    source={{
                        uri: 'https://via.placeholder.com/150', // Remplacez par une vraie image de carte bancaire si nécessaire
                    }}
                    style={styles.cardImage}
                />
            </View>

            {/* Formulaire de paiement */}
            <View style={styles.formContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Numéro de carte"
                    keyboardType="number-pad"
                    value={cardNumber}
                    onChangeText={setCardNumber}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Nom sur la carte"
                    value={cardName}
                    onChangeText={setCardName}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Cryptogramme"
                    keyboardType="number-pad"
                    value={cardCVV}
                    onChangeText={setCardCVV}
                />
                {/* Checkbox personnalisée */}
                <TouchableOpacity
                    style={styles.checkboxContainer}
                    onPress={() => setSaveCard(!saveCard)}
                >
                    <View style={[styles.checkbox, saveCard && styles.checkedCheckbox]}>
                        {saveCard && (
                            <FontAwesome name="check" size={16} color="white" />
                        )}
                    </View>
                    <Text style={styles.checkboxLabel}>Enregistrer la carte</Text>
                </TouchableOpacity>
            </View>

            {/* Bouton de paiement */}
            <TouchableOpacity style={styles.payButton}>
                <Text style={styles.payButtonText}>Payer</Text>
            </TouchableOpacity>
        </View>
    );
};

export default PaymentScreen;

const styles = StyleSheet.create({
    backButton: {
        position: 'absolute',
        top: 40,
        left: 20,
        padding: 10,
    },
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingHorizontal: 16,
        justifyContent: 'space-between',
        alignItems: 'center',
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
    imageContainer: {
        marginTop: 80,
        alignItems: 'center',
    },
    cardImage: {
        width: 200,
        height: 120,
        resizeMode: 'contain',
    },
    formContainer: {
        width: '100%',
        marginVertical: 20,
    },
    input: {
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        paddingVertical: 10,
        marginBottom: 16,
        fontSize: 16,
        color: '#333',
    },
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 16,
    },
    checkbox: {
        width: 20,
        height: 20,
        borderWidth: 2,
        borderColor: '#007bff',
        borderRadius: 4,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 8,
    },
    checkedCheckbox: {
        backgroundColor: '#007bff',
    },
    checkboxLabel: {
        fontSize: 14,
        color: '#555',
    },
    payButton: {
        backgroundColor: '#007bff',
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 8,
        alignItems: 'center',
        width: '100%',
    },
    payButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
