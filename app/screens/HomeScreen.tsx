import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

const HomeScreen = () => {
    const router = useRouter();
    const handlePress = () => {
        router.push('./LoginScreen');
    };

    return (
        <View style={styles.container}>
            <View style={styles.circleBlue1}></View>
            <View style={styles.circleBlue2}></View>
            <View style={styles.circleBlue3}></View>
            <View style={styles.circleBlue4}></View>
            <Image 
                source={require('../../assets/images/app/HomeScreen.png')} 
                style={styles.image}
            />
            <Text style={styles.title}>Participate, win, support !</Text>
            <Text style={styles.description}>
                Each month, try to win a Jersey rare or signed ! To take part, join our solidarity lottery: the first people to sign up benefit from reduced rates, and part of the proceeds are donated to our partner associations. A unique chance for you to win, while supporting a good cause.
            </Text>
            <TouchableOpacity style={styles.button} onPress={handlePress}>
                <Text style={styles.buttonText}>Let's go !</Text>
            </TouchableOpacity>
        </View>
    );
};
/*React*/
    /*React*/
    /*React*/
    /*React*/
    /*React*/
    /*React*/
    /*React*/
    /*React*/
    /*React*/
    /*React*/
    /*React*/
    /*React*/
    /*React*/
    /*React*/
    /*React*/
    /*React*/
    /*React*/
    /*React*/
    /*React*/
    /*React*/
    /*React*/
    /*React*/
    /*React*/
    /*React*/
    /*React*/
    /*React*/
    /*React*/
    /*React*/
    /*React*/
    /*React*/
    /*React*/
    /*React*/
    /*React*/
    /*React*/
    /*React*/
    /*React*/
    /*React*/
    /*React*/
    /*React*/
    /*React*/
    /*React*/
    /*React*/
    /*React*/
    /*React*/
    /*React*/
    /*React*/
    /*React*/
    /*React*/
    /*React*/
    /*React*/
    /*React*/
    /*React*/
    /*React*/
    /*React*/
    /*React*/
    /*React*/
    /*React*/
    /*React*/
    /*React*/
    /*React*/
    /*React*/
    /*React*/
    /*React*/
    /*React*/
    /*React*/
    /*React*/
    /*React*/
    /*React*/
    /*React*/
    /*React*/
    /*React*/
    /*React*/
    /*React*/
    /*React*/
    /*React*/
    /*React*/
    /*React*/
    /*React*/
    /*React*/
    /*React*/
    /*React*/
    /*React*/
    /*React*/
    /*React*/
    /*React*/
    /*React*/
    /*React*/
    /*React*/
    /*React*/
    /*React*/
    /*React*/
    /*React*/
    /*React*/
    /*React*/
    /*React*/
    /*React*/
    /*React*/
    /*React*/
    /*React*/
    /*React*/
    /*React*/
    /*React*/
    /*React*/
    /*React*/
    /*React*/
    /*React*/
    /*React*/
    /*React*/
    /*React*/
    /*React*/
    /*React*/
    /*React*/
    /*React*/
    /*React*/
    /*React*/
    /*React*/
    /*React*/
    /*React*/
    /*React*/
    /*React*/
    /*React*/
    /*React*/
    /*React*/
    /*React*/
    /*React*/
    /*React*/
    /*React*/
    /*React*/
    /*React*/
    /*React*/
    /*React*/
    /*React*/
    /*React*/
    /*React*/
    /*React*/
    /*React*/
    /*React*/
    /*React*/
    /*React*/
    /*React*/
    /*React*/
    /*React*/
    /*React*/
    /*React*/
    /*React*/
    /*React*/

    /*React*/
    /*React*/
    /*React*/
    /*React*/

    /*React*/
    /*React*/
    /*React*/
    /*React*/
    /*React*/

    /*React*/

    /*React*/
    /*React*/
    /*React*/
    /*React*/
    /*React*/

    /*React*/

    /*/*React*/
    /*React*/
    /*React*/
    /*React*//*React*/
    /*React*/
    /*React*//*React*/
    /*React*//*React*/
    /*React*//*React*/
    /*React*//*React*/
    /*React*/
    /*React*/
    /*React*/
    /*React*//*React*/
    /*React*/
    /*React*/
    /*React*//*React*/
    /*React*/
    /*React*/
    /*React*/
    /*React*/
    /*React*/
    /*React*/
    /*React*/
    /*React*/
    /*React*/
    /*React*/
    /*React*/
    /*React*/
    /*React*/
    /*React*/
    /*React*/
    /*React*/
    /*React*/
    /*React*/
    /*React*/
    /*React*/
    /*React*/
    /*React*/
    /*React*/
    /*React*/
    /*React*/
    /*React*/
    /*React*/
    /*React*/
    /*React*/
    /*React*/
    /*React*/
    /*React*/
    /*React*/
    /*React*/
    /*React*/
    /*React*/
    /*React*/
    /*React*/
    /*React*/
    /*React*/
    /*React*/
    /*React*/
    /*React*/
    /*React*/
    /*React*/
    /*React*/
    /*React*/
    /*React*/
    /*React*/
    /*React*/
    /*React*/
    /*React*/
    /*React*/
    /*React*/
    /*React*/
    /*React*/
    /*React*/
    /*React*/
    /*React*/
    /*React*/
    /*React*/
    /*React*/
const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 20,
        backgroundColor: '#ffffff',
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
    image: {
        width: 250,
        height: 200,
        resizeMode: 'contain',
        marginVertical: 0,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 10,
    },
    description: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 20,
    },
    button: {
        backgroundColor: '#56AEFF',
        paddingVertical: 15,
        paddingHorizontal: 40,
        marginTop: 20,
        width:300,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
    },
});

export default HomeScreen;

//React//
//React//
//React//
//React//
//React////React//
//React////React//
//React//
//React//
//React//
//React//
//React//
//React//
//React//
//React//
//React//
//React//
//React//
//React//
//React//
//React//
//React//
//React//
//React//
//React//

