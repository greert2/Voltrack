import React, { useState } from 'react';
import { ImageBackground, StyleSheet, View, Button, Image, Text, TouchableOpacity, FlatList} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Actions, Router, Scene } from "react-native-router-flux";
import { TextInput } from 'react-native-gesture-handler';


function LoginScreen(props) {
    const [people, setPeople] = useState([
        { name: 'Hao', key: '1'},
        { name: 'Tyler', key: '2'},
        { name: 'Carlos', key: '3'},
        { name: 'Laura', key: '4'},
    ]);

    return (
        <ImageBackground 
            style={styles.background} 
            source={require('../assets/splash.png')}
        >
            <LinearGradient
                // Background Linear Gradient
                // colors={['#f94244', '#ff9f3e']}
                colors={['rgba(255,78,80,1)', 'rgba(249,212,35,1)']}
                start={{ x: 0, y: 0.75 }}
                end={{ x: 0, y: 1 }}
                style={{
                position: 'absolute',
                left: 0,
                right: 0,
                top: 0,
                height: '100%',
                }}
            />
            <View style={styles.container}>
                <Image style={styles.image} source={require('../assets/voltrackLogo.png')}/>
                <FlatList 
                    data={people}
                    renderItem={({ item }) => (
                    <Text style={styles.item}>{item.name}</Text>
                )}
                />
            </View>
            <View style={styles.buttonContainer}>
            {/* Join Event Button */}
            <View style={styles.JoinEventButton}>
                <TouchableOpacity
                style={styles.buttonTouchableOpacity}
                    onPress={() => {
                        Actions.JoinEventScreen()
                    }}
                >
                    <Text style={styles.btnTextWhite}>Join Event</Text>
                </TouchableOpacity>
            </View>
            {/* Create Event Button */}
             <View style={styles.CreateEventButton}>
                <TouchableOpacity
                style={styles.buttonTouchableOpacity}
                    onPress={() => {
                        Actions.CreateEventScreen()
                    }}
                >
                    <Text style={styles.btnTextWhite}>Create Event</Text>
                </TouchableOpacity>
            </View>
            </View> 
            {/* Profile Button */}
            <View style={styles.profileButton}>
                <TouchableOpacity
                style={styles.buttonTouchableOpacity}
                    onPress={() => {
                        Actions.UserSettingsScreen();
                    }}
                >
                <Image style={styles.image} source={require('../assets/profilePic.png')}/>
                </TouchableOpacity>
            </View>

        </ImageBackground>
        
    );
}


const styles = StyleSheet.create({
    background: {
        flex: 1,
        justifyContent: "flex-end",
        alignItems: "center",
    },
    inputBox: {
        width: "90%",
        height: 40,
        backgroundColor: "rgba(50,50,50,0.5)",
        marginTop: 20,
        borderRadius: 5,
        textAlign: "center",
    },
    CreateEventButton: {
        width: '50%',
        height: 70,
        backgroundColor: "rgba(0,0,0,0.3)",
        justifyContent: "center",
        alignItems: "center",
    },
    JoinEventButton: {
        width: '50%',
        height: 70,
        backgroundColor: "rgba(0,0,0,0.3)",
        justifyContent: "center",
        alignItems: "center",
    },
    profileButton: {
        position: 'absolute',
        width: "25%",
        height: 50,
        top: 50,
        left: 0,
        backgroundColor: "rgba(0,0,0,0)",
    },
    buttonTouchableOpacity: {
        width: "100%",
        height: "100%",
        alignItems: "center",
        justifyContent: "center",
    },
    btnTextWhite: {
        color: "#ffffff",
        fontSize: 24,
    },
    btnTextBlack: {
        color: "gray",
        fontSize: 24,
    },
    container: {
        position: 'absolute',
        top: 70,
        alignItems: "center",
        width: "100%",
        // flex: 1,
        // paddingTop: 40,
        // paddingHorizontal: 20,
    },
    buttonContainer: {
        position: 'absolute',
        alignItems: "center",
        width: "100%",
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    mainPanel: {
        marginTop: 70,
        alignItems: "center",
        justifyContent: "center",
        width: "100%"
    },
    image: {
        flex: 1,
        height: 100,
        resizeMode: "contain",
    },
    item: {
        color: "white",
        flex: 1,
        marginHorizontal: 10,
        marginTop: 24,
        padding: 30,
        backgroundColor: 'pink',
        fontSize: 24,
    }
});

export default LoginScreen;