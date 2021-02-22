import React, { Component } from 'react';
import { ImageBackground, StyleSheet, View, Button, Image, Text, TouchableOpacity } from 'react-native';
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

    render() {

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
                    <Image style={styles.image} source={require('../assets/voltrackLogo.png')} />
                    <Text style={styles.logo}>Join Event</Text>
                    <View style={styles.mainPanel}>
                        {/* EventID Textbox */}
                        <TextInput
                            style={styles.inputBox}
                            placeholder="Event ID"
                            placeholderTextColor={'black'}
                            secureTextEntry={false}
                            onChangeText={(eventid) => this.setState({ eventid })}
                        />
                        {/* Passcode Textbox */}
                        <TextInput
                            style={styles.inputBox}
                            placeholder="Passcode"
                            placeholderTextColor={'black'}
                            secureTextEntry={true}
                            onChangeText={(passcode) => this.setState({ passcode })}
                        />
                    </View>
                </View>
                {/* Join Event Button */}
                <View style={styles.joinEventButton}>
                    <TouchableOpacity
                        style={styles.buttonTouchableOpacity}
                        onPress={() => {
                            var that = this; // store context

                            connection.canJoinEvent(this.state.eventid, this.state.passcode)
                                .then(function (result) {
                                    // Update the state
                                    that.setState({
                                        eventName: result.name,
                                        eventDescription: result.description,
                                        eventLocation: result.location
                                    })
                                    Actions.EventInfoScreen({ userid: that.props.userid, eventid: that.state.eventid, eventName: that.state.eventName, eventDescription: that.state.eventDescription, eventLocation: that.state.eventLocation, socket: connection });
                                })
                                .catch(function (err) {
                                    console.log(err);
                                })



                        }}
                    >
                        <Text style={styles.btnTextWhite}>Join Event</Text>
                    </TouchableOpacity>
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
    joinEventButton: {
        width: '100%',
        height: 100,
        backgroundColor: "rgba(0,0,0,0.3)",
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
        height: 110,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
});

export default JoinEventScreen;
