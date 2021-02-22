import React, { Component } from 'react';
import { ImageBackground, StyleSheet, View, Button, Image, Text, TouchableOpacity} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Actions, Router, Scene } from "react-native-router-flux";
import { TextInput } from 'react-native-gesture-handler';
// import Toast from 'react-native-simple-toast';


class CreateEventScreen extends Component {
    
    state = {
        eventName: "",
        passcode: "",
        description: "",
        location: "default location"
    }
    
    render () {

        // Connect to server here
        var connection = require('../scripts/serverConnection.js');
        connection.connect();
        
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
                    {/* Back Button */}
                    <View style={styles.backButton}>
                        <TouchableOpacity
                            style={styles.buttonTouchableOpacity}
                            onPress={() => {
                                Actions.pop()
                            }}
                        >
                            <Text style={styles.btnTextBlack, { fontSize: 30, marginLeft: 15 }}>&larr;</Text>
                        </TouchableOpacity>
                    </View>
                    <Image style={styles.image} source={require('../assets/voltrackLogo.png')}/>
                    <Text style={styles.logo}>Create Event</Text>
                    <View style={styles.mainPanel}>
                        {/* Event Name Textbox */}
                        <TextInput
                            style={styles.inputBox}
                            placeholder="Event Name"
                            placeholderTextColor={'black'}
                            onChangeText={(eventName) => this.setState({eventName})}
                        />
                        {/* Password Textbox */}
                        <TextInput
                            style={styles.inputBox}
                            placeholder="Passcode"
                            placeholderTextColor={'black'}
                            secureTextEntry={true}
                            onChangeText={(passcode) => this.setState({passcode})}
                        />
                        <TextInput
                            style={styles.inputBox_eventDescription}
                            placeholder="Event Description "
                            placeholderTextColor={'black'}
                            onChangeText={(description) => this.setState({description})}
                        />
                    </View>
                </View>
                {/* Continue Button */}
                <View style={styles.loginButton}>
                    <TouchableOpacity
                    style={styles.buttonTouchableOpacity}
                        onPress={() => {
                            // alert("Event Created!")
                            // connection.createEvent(this.state.eventName, this.state.passcode, this.state.description, this.state.location);
                            // Actions.pop();
                            
                            // Check for user inputs
                            if(this.state.eventName != '' && this.state.passcode != '' && this.state.description != '') {
                                Actions.SetLocationScreen({eventName: this.state.eventName, passcode: this.state.passcode, description: this.state.description});
                                // Actions.pop();
                            }else {
                                // showToast()
                            }                           
                        }}
                    >
                        <Text style={styles.btnTextWhite}>Continue</Text>
                    </TouchableOpacity>
                </View>
            </ImageBackground>
        )
    }
}

// const showToast = () => (
//     Toast.showWithGravity(
//         "Event Created!", 
//         Toast.SHORT, 
//         Toast.TOP,
//     )
// )

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
    inputBox_eventDescription: {
        width: "90%",
        height: 70,
        backgroundColor: "rgba(50,50,50,0.5)",
        marginTop: 20,
        borderRadius: 5,
        textAlign: "center",
    },
    loginButton: {
        width: '100%',
        height: 100,
        backgroundColor: "rgba(0,0,0,0.3)",
        alignItems: "center",
        justifyContent: "center",
    },
    backButton: {
        width: '10%',
        height: 40,
        position: 'absolute',
        alignSelf: 'flex-start',
        zIndex: 2
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
    logo: {
        marginTop: 40,
        fontSize: 24,
        fontWeight: "bold",
        color: "black",
    },
    container: {
        position: 'absolute',
        top: 70,
        alignItems: "center",
        width: "100%"
    },
    mainPanel: {
        marginTop: 35,
        alignItems: "center",
        justifyContent: "center",
        width: "100%"
    },
    image: {
        flex: 1,
        height: 100,
        resizeMode: "contain",
    },
    buttonContainer: {
        position: 'absolute',
        alignItems: "center",
        bottom: 2,
        left: 0,
        flex: 1,
        width: 179,
        height:110,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    JoinEventButton: {
        width: '48%',
        height: 120,
        backgroundColor: "rgba(0,0,0,0.3)",
        justifyContent: "center",
        fontWeight: "bold",
        alignItems: "center",
    },
});

export default CreateEventScreen;
