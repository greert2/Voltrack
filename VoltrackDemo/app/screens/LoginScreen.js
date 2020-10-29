import React from 'react';
import { ImageBackground, StyleSheet, View, Image, Text} from 'react-native';

function LoginScreen(props) {
    return (
        <ImageBackground 
            style={styles.background} 
            source={require('../assets/splash.png')}
        >
            <View style={styles.logoContainer}>
            <Image style={styles.logo} source={require('../assets/icon.png')}/>
            <Text>Voltrack</Text>
            </View>
            <View style={styles.loginButton}></View>
            <View style={styles.registerButton}></View>
        </ImageBackground>
        
    );
}

const styles = StyleSheet.create({
    background: {
        flex: 1,
        justifyContent: "flex-end",
        alignItems: "center",
    },
    loginButton: {
        width: '100%',
        height: 70,
        backgroundColor: "red",
    },
    logo: {
        width: 100,
        height: 100,
    },
    logoContainer: {
        position: 'absolute',
        top: 70,
        alignItems: "center",
    },
    registerButton: {
        width: "100%",
        height: 70,
        backgroundColor: "#5ecdc4",
    },
});

export default LoginScreen;