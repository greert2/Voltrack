import React, { Component } from 'react';
import { ImageBackground, StyleSheet, View, Button, Image, Text, TouchableOpacity} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Actions, Router, Scene } from "react-native-router-flux";
import { TextInput } from 'react-native-gesture-handler';
class JoinEventScreen extends Component {

    state = {
        eventid: '',
        passcode: '',
        eventName: '',
        eventDescription: '',
        eventLocation: '',
    }

    render(){

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
                    <Image style={styles.image} source={require('../assets/voltrackLogo.png')}/>
                    <Text style={styles.logo}>Join Event</Text>
                    <View style={styles.mainPanel}>
                        {/* EventID Textbox */}
                        <TextInput
                            style={styles.inputBox}
                            placeholder="Event ID"
                            placeholderTextColor={'black'}
                            secureTextEntry={false}
                            onChangeText={(eventid) => this.setState({eventid})}
                        />
                        {/* Passcode Textbox */}
                        <TextInput
                            style={styles.inputBox}
                            placeholder="Passcode"
                            placeholderTextColor={'black'}
                            secureTextEntry={true}
                            onChangeText={(eventid) => this.setState({eventid})}
                        />
                    </View>
                </View>
                {/* Join Event Button */}
                <View style={styles.joinEventButton}>
                    <TouchableOpacity
                    style={styles.buttonTouchableOpacity}
                        onPress={() => {

                            connection.canJoinEvent(this.state.eventid, this.state.passcode)
                            .then(results => {                                
                                // Update the state
                                that.setState({
                                     eventName: results[0],
                                     eventDescription: results[1],
                                     eventLocation: results[2]
                                })
                                    //Actions.EventInfoScreen({eventid: this.state.eventid, eventName: this.state.eventName, eventDescription: this.state.eventDescription, eventLocation: this.state.eventLocation, socket: connection});
                            }, error => {
                                return{error};
                            })
                            Actions.EventInfoScreen({eventid: this.state.eventid, eventName: this.state.eventName, eventDescription: this.state.eventDescription, eventLocation: this.state.eventLocation, socket: connection});

                                        
                        }}
                    >
                        <Text style={styles.btnTextWhite}>Join Event</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.buttonContainer}>
                {/* Join Event Button */}
                <View style={styles.JoinEventScreenButton}>
                    <TouchableOpacity
                    style={styles.buttonTouchableOpacity}
                        onPress={() => {
                            Actions.JoinEventScreen()
                        }}
                    >
                        <Text style={styles.btnTextWhite}>Join Event</Text>
                    </TouchableOpacity>
                </View>
                 {/* Map Button */}
                <View style={styles.JoinEventScreenButton}>
                    <TouchableOpacity
                        style={styles.buttonTouchableOpacity}
                            onPress={() => {
                                Actions.MapScreen({firstName: this.state.firstName, lastName: this.state.lastName});
                            }}
                        >
                        <Text style={styles.btnTextWhite}>Map</Text>
                    </TouchableOpacity>
                 </View>
                {/* Home Button */}
                <View style={styles.JoinEventScreenButton}>
                    <TouchableOpacity
                    style={styles.buttonTouchableOpacity}
                        onPress={() => {
                            Actions.pop()
                        }}
                    >
                        <Text style={styles.btnTextWhite}>Home</Text>
                    </TouchableOpacity>
                </View>
                {/* Your Events Button */}
                <View style={styles.JoinEventScreenButton}>
                    <TouchableOpacity
                        style={styles.buttonTouchableOpacity}
                            onPress={() => {
                                Actions.YourEventsScreen();
                            }}
                        >
                        <Text style={styles.btnTextWhite}>Your Events</Text>
                    </TouchableOpacity>
                 </View>

                {/* Create Event Button */}
                <View style={styles.JoinEventScreenButton}>
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
            </ImageBackground>
            
        );
     }
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
    joinEventButton: {
        width: '100%',
        height: 70,
        bottom: 140,
        backgroundColor: "rgba(0,0,0,0.3)",
        alignItems: "center",
        justifyContent: "center",
    },
    backButton: {
        width: "100%",
        height: 80,
        backgroundColor: "rgba(0,0,0,0.5)",
        justifyContent: "center",
        alignItems: "center",
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
    JoinEventScreenButton: {
        width: '48%',
        height: 120,
        backgroundColor: "rgba(0,0,0,0.3)",
        justifyContent: "center",
        fontWeight: "bold",
        alignItems: "center",
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
});

export default JoinEventScreen;
