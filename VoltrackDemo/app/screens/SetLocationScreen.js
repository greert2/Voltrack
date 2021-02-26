import React, { Component } from 'react';
import { ImageBackground, StyleSheet, View, Button, Image, Text, TouchableOpacity} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Actions, Router, Scene } from "react-native-router-flux";
import { TextInput } from 'react-native-gesture-handler';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';

// TODO : add address searching box so that you don't have to move map manually

class SetLocationScreen extends Component {
    
    state = {
        eventName: "",
        passcode: "",
        description: "",
        location: "default location",
        region: {
            latitude: 48.769768,
            longitude: -122.485886,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421
        }
    }
    props = {
        eventName: '',
        passcode: '',
        description: ''
    }

    onRegionChange = (region) => {
        this.setState({ region });
    }

    
    render () {

        

        // Connect to server here
        var connection = require('../scripts/serverConnection.js');
        connection.connect();

        // Given a decimal, return it with 5 decimal places
        function correctPrecision(decimal) {
            if(decimal >= 100 || decimal <= -100) {
                return decimal.toPrecision(8);
            }
            return decimal.toPrecision(7);
        } 

;
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
                    <Text style={styles.logo}>Set Location of Event</Text>
                    <View style={styles.mainPanel}>
                        {/* Map */}
                        <MapView
                                style={{ height: '100%', width: '100%' }}
                                provider={PROVIDER_GOOGLE}
                                showsUserLocation={true}
                                followsUserLocation={true}
                                onRegionChange={this.onRegionChange}
                                initialRegion={this.state.region}
                                
                        />
                         {/* <TextInput
                            style={styles.inputBox}
                            placeholder="Passcode"
                            placeholderTextColor={'black'}
                            secureTextEntry={true}
                            onChangeText={(passcode) => this.setState({passcode})}
                            ></TextInput> */}

                        
                    </View>
                </View>
                {/* Create Event Button */}
                <View style={styles.loginButton}>
                    <TouchableOpacity
                    style={styles.buttonTouchableOpacity}
                        onPress={() => {
                            // alert("Event Created!")
                            let location = correctPrecision(this.state.region.latitude) + "," + correctPrecision(this.state.region.longitude);
                            connection.createEvent(this.props.userid, this.props.eventName, this.props.passcode, this.props.description, location);
                            Actions.popTo('HomeScreen');
                            
                            // alert("precision: " + location);

                        }}
                    >
                        <Text style={styles.btnTextWhite}>Create Event</Text>
                    </TouchableOpacity>
                </View>
                {/* Back Button */}
                <View style={styles.backButton}>
                    <TouchableOpacity
                    style={styles.buttonTouchableOpacity}
                        onPress={() => {
                            Actions.pop()
                        }}
                    >
                    <Text style={styles.btnTextWhite}>Back</Text>
                    </TouchableOpacity>
                </View>
            </ImageBackground>
            
        )
    }
}

const styles = StyleSheet.create({
    background: {
        flex: 1,
        justifyContent: "flex-end",
        alignItems: "center",
    },
    inputBox: {
        position: 'absolute',
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
        height: 70,
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
        marginTop: 0,
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
        width: "100%",
        height: 400
    },
    image: {
        flex: 1,
        height: 100,
        resizeMode: "contain",
    }
});

export default SetLocationScreen;