import React, { Component } from 'react';
import { ImageBackground, StyleSheet, View, Button, Image, Text, TouchableOpacity} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Actions, Router, Scene } from "react-native-router-flux";
import { ScrollView, TextInput } from 'react-native-gesture-handler';
import MapView, {Marker} from 'react-native-maps';
import {SafeAreaView} from 'react-native';
import FlashMessage from "react-native-flash-message";
import { showMessage, hideMessage } from "react-native-flash-message";
import { StackActions } from '@react-navigation/native';


class EventInfoScreen extends Component {

    constructor(props) {
        super(props);
        this.state = { 
            eventid: '',
            eventName: '',
            eventDescription: '',
            eventLocation: '',
        }
        
    }

    componentDidMount() {
        var connection = this.props.socket; // get our connection
        
        var that = this; // save the context so we can access it in a function

    }

    render(){

        return (
            <ImageBackground
                style={styles.background}
                source={require('../assets/splash.png')}
            >
                <LinearGradient
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
                <View style={ styles.flexcontainer }>
                <FlashMessage ref="myLocalFlashMessage"/>
                </View>
                <View style={styles.container}>
                    <Text style={styles.logo}>Event Information</Text>
                    <View style={styles.mainPanel}>
                        
                        <Text style={styles.title3}> 
                        {this.state.eventName}
                        </Text>

                        <Text style={styles.title}> 
                        Description
                        </Text>
                        {/* event description Textbox */}
                            <Text style={styles.DesBox}>
                            {this.state.eventDescription}
                            </Text>
                        <Text style={styles.title2}> 
                        Members
                        </Text>
                        {/* members Textbox */}
                            <Text style={styles.DesBox2}>
                                We got
                                Laura,
                                Carlos,
                                Hao,
                                Tyler.
                                The whole crew.
                            </Text>
                        <Text style={styles.emptyBox}>
                        </Text>
                                <MapView
                                    style={styles.mapStyle}
                                    initialRegion={{
                                        latitude: 48.7343,
                                        longitude: -122.4866,
                                        latitudeDelta: 0.0922,
                                        longitudeDelta: 0.0421,
                                    }}
                                    customMapStyle={mapStyle}>
                                    <Marker
                                        coordinate={{
                                        latitude: 48.7343,
                                        longitude: -122.4866,
                                        }}
                                        title={'Event location'}
                                        description={'The written address of the location'}
                                    />
                                </MapView>
                    </View>
                </View>
                {/* Back Button */}
                <View style={styles.backButton}>
                    <TouchableOpacity
                    style={styles.buttonTouchableOpacity}
                        onPress={() => {
                            Actions.pop()
                        }}
                    >
                    <Text style={styles.btnTextWhite}>X</Text>
                    </TouchableOpacity>
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
                 {/* Map Button */}
                <View style={styles.JoinEventButton}>
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
                <View style={styles.JoinEventButton}>
                    <TouchableOpacity
                    style={styles.buttonTouchableOpacity}
                        onPress={() => {
                            Actions.pop()
                            Actions.pop()
                        }}
                    >
                        <Text style={styles.btnTextWhite}>Home</Text>
                    </TouchableOpacity>
                </View>
                {/* Your Events Button */}
                <View style={styles.JoinEventButton}>
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
                <View style={styles.JoinEventButton}>
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
                    {/* Accept Button */}
                    <View style={styles.AcceptEventButton}>
                    <TouchableOpacity
                        style={styles.buttonTouchableOpacity}
                            onPress={() => {
                                //flash message
                                showMessage({
                                    message: "SUCCESS",
                                    description: "you have joined the event",
                                    type: "success",
                                  });
                            }}
                        >
                        <Text style={styles.btnTextWhite}>Accept</Text>
                    </TouchableOpacity>
                 </View>
            </ImageBackground>

        );
    }
}






const mapStyle = [
    {elementType: 'geometry', stylers: [{color: '#242f3e'}]},
    {elementType: 'labels.text.fill', stylers: [{color: '#746855'}]},
    {elementType: 'labels.text.stroke', stylers: [{color: '#242f3e'}]},
    {
      featureType: 'administrative.locality',
      elementType: 'labels.text.fill',
      stylers: [{color: '#d59563'}],
    },
    {
      featureType: 'poi',
      elementType: 'labels.text.fill',
      stylers: [{color: '#d59563'}],
    },
    {
      featureType: 'poi.park',
      elementType: 'geometry',
      stylers: [{color: '#263c3f'}],
    },
    {
      featureType: 'poi.park',
      elementType: 'labels.text.fill',
      stylers: [{color: '#6b9a76'}],
    },
    {
      featureType: 'road',
      elementType: 'geometry',
      stylers: [{color: '#38414e'}],
    },
    {
      featureType: 'road',
      elementType: 'geometry.stroke',
      stylers: [{color: '#212a37'}],
    },
    {
      featureType: 'road',
      elementType: 'labels.text.fill',
      stylers: [{color: '#9ca5b3'}],
    },
    {
      featureType: 'road.highway',
      elementType: 'geometry',
      stylers: [{color: '#746855'}],
    },
    {
      featureType: 'road.highway',
      elementType: 'geometry.stroke',
      stylers: [{color: '#1f2835'}],
    },
    {
      featureType: 'road.highway',
      elementType: 'labels.text.fill',
      stylers: [{color: '#f3d19c'}],
    },
    {
      featureType: 'transit',
      elementType: 'geometry',
      stylers: [{color: '#2f3948'}],
    },
    {
      featureType: 'transit.station',
      elementType: 'labels.text.fill',
      stylers: [{color: '#d59563'}],
    },
    {
      featureType: 'water',
      elementType: 'geometry',
      stylers: [{color: '#17263c'}],
    },
    {
      featureType: 'water',
      elementType: 'labels.text.fill',
      stylers: [{color: '#515c6d'}],
    },
    {
      featureType: 'water',
      elementType: 'labels.text.stroke',
      stylers: [{color: '#17263c'}],
    },
  ];











const styles = StyleSheet.create({
    background: {
        flex: 1,
        justifyContent: "flex-end",
        alignItems: "center",
    },
    DesBox: {
        width: 380,
        height: 120,
        backgroundColor: "pink",
        marginTop: 5,
        borderWidth: 1,
        textAlign: "left",
    },
    DesBox2: {
        width: 300,
        height: 140,
        backgroundColor: "pink",
        marginTop: 30,
        borderWidth: 1,
        textAlign: "left",
    },
    emptyBox: {
        width: "90%",
        height: 180,
        marginTop: 20,
        borderRadius: 5,
        textAlign: "left",
    },
    scrollView: {
        marginHorizontal: 20,

    },
    title: {
        bottom: "1%",
        fontSize: 18,
        fontWeight: "bold",
        marginTop: 0,
        color: "black",
        textAlign: "center",
    },
    title2: {
        top: "3%",
        fontSize: 18,
        fontWeight: "bold",
        marginTop: 0,
        color: "black",
        textAlign: "center",
    },
    title3: {
        bottom: "7%",
        fontSize: 45,
        fontWeight: "bold",
        marginTop: 0,
        color: "black",
        textAlign: "center",
    },
    membersBox: {
        width: "90%",
        height: 40,
        backgroundColor: "rgba(50,50,50,0.5)",
        marginTop: 20,
        borderRadius: 5,
        textAlign: "left",
        overflow: "scroll",
    },
    inputBox: {
        width: "90%",
        height: 40,
        backgroundColor: "rgba(50,50,50,0.5)",
        marginTop: 20,
        borderRadius: 5,
        textAlign: "center",
    },
    registerButton: {
        width: '100%',
        height: 70,
        backgroundColor: "rgba(0,0,0,0.3)",
        alignItems: "center",
        justifyContent: "center",
    },
    backButton: {
        width: "10%",
        height: 43,
        bottom: 800,
        left: 170,
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
        width: "100%",


    },
    mainPanel: {
        marginTop: 20,
        alignItems: "center",
        justifyContent: "center",
        width: "100%"
    },
    image: {
        flex: 1,
        height: 100,
        resizeMode: "contain",
    },
    mapStyle: {
        position: 'absolute',
        marginTop: 380,
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        borderWidth: 6,
        borderStyle: "solid",
        borderColor: "gray",
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
    buttonTouchableOpacity: {
        width: "100%",
        height: "100%",
        alignItems: "center",
        justifyContent: "center",
    },
    JoinEventButton: {
        width: '48%',
        height: 120,
        backgroundColor: "rgba(0,0,0,0.3)",
        justifyContent: "center",
        fontWeight: "bold",
        alignItems: "center",
    },
    AcceptEventButton: {
        width: '38%',
        height: 60,
        bottom: 137,
        backgroundColor: "rgba(0,0,0,0.3)",
        justifyContent: "center",
        fontWeight: "bold",
        alignItems: "center",
    },
    flexcontainer: {
        display: 'flex',
        flexDirection: 'row',
        width: '100%',
        bottom: 823,
        
      },
});

export default EventInfoScreen;
