import React from 'react';
import { ImageBackground, StyleSheet, View, Button, Image, Text, TouchableOpacity} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Actions, Router, Scene } from "react-native-router-flux";


const MainScreen = () => {
    return (
        <ImageBackground 
            style={styles.background} 
            source={require('../assets/splash.png')}
        >
            <LinearGradient
                // Background Linear Gradient
                colors={['rgba(255,78,80,1)', 'rgba(249,212,35,1)']} // ff4e50, f9d423
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{
                position: 'absolute',
                left: 0,
                right: 0,
                top: 0,
                height: '100%',
                }}
            />
            <View style={styles.logoContainer}>
                <Image style={styles.image} source={require('../assets/voltrackLogo.png')}/>
                <Text style={styles.logo}>Voltrack</Text>
            </View>
            {/* Login Button */}
            <View style={styles.loginButton}>
                <TouchableOpacity
                    style={styles.buttonTouchableOpacity}
                    onPress={() => {
                        Actions.LoginScreen()
                    }}
                >
                    <Text style={styles.btnTextWhite}>Login</Text>

                </TouchableOpacity>
                
            </View>
            {/* Register Button */}
            <View style={styles.registerButton}>
                <TouchableOpacity
                style={styles.buttonTouchableOpacity}
                    onPress={() => {
                        Actions.MapScreen()
                    }}
                >
                <Text style={styles.btnTextWhite}>Register</Text>
                </TouchableOpacity>
            </View>
        </ImageBackground>
        
    );
};

const styles = StyleSheet.create({
    background: {
        flex: 1,
        justifyContent: "flex-end",
        // alignItems: "center",
    },
    buttonTouchableOpacity: {
        width: "100%",
        height: "100%",
        alignItems: "center",
        justifyContent: "center",
    },
    loginButton: {
        width: '100%',
        height: 70,
        // backgroundColor: "#99aec1", //#99aec1
        backgroundColor: "rgba(0,0,0,0.3)",
    },
    registerButton: {
        width: "100%",
        height: 80,
        // backgroundColor: "#403540", //#403540
        backgroundColor: "rgba(0,0,0,0.5)",
        justifyContent: "center",
        alignItems: "center",
    },
    btnTextWhite: {
        color: "white",
        fontSize: 24,
    },
    btnTextBlack: {
        color: "gray",
        fontSize: 24,
    },
    logoContainer: {
        // position: 'absolute',
        top: -200,
        alignItems: "center",
        width: "100%",
        height: "50%",
    },
    logo: {
        // marginTop: 40,
        // position: "absolute",
        fontSize: 24,
        top: -30,
        fontWeight: "bold",
        color: "black",
        width: 100,
    },
    image: {
        flex: 1,
        width: 300,
        height: 100,
        resizeMode: "contain",
    }
    
});

export default MainScreen;