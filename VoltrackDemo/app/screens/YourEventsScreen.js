import React, { useState, Component } from 'react';
import { ImageBackground, StyleSheet, View, Button, Image, Text, TouchableOpacity, FlatList} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Actions, Router, Scene } from "react-native-router-flux";
import { TextInput } from 'react-native-gesture-handler';


class YourEventsScreen extends Component {


    constructor(props) {
        super(props);
        this.state = { 
            username: '',
            firstName: '',
            lastName: '',
            phone: ''
        }
        
    }

    componentDidMount() {
        var connection = this.props.socket; // get our connection
    }

    render() {

        //make connection here to what is in the database
        let currentEvents = [
            { name: 'Fun run', key: '1'},
            { name: 'Food bank', key: '2'},
            { name: 'dog sitting', key: '3'},
            { name: 'blankets for babies', key: '4'},
        ]

        let pastEvents = [
            { name: 'baking for elderly', key: '1'},
            { name: 'olympics', key: '2'},
            { name: 'Transporting homeless', key: '3'},
            { name: 'book reading for prisoners', key: '4'},
        ]
        
        return (

            <ImageBackground 
                style={styles.background} 
                source={require('../assets/splash.png')}
            >
                <LinearGradient
                    // Background Linear Gradient
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
                    <Image style={styles.image1} source={require('../assets/voltrackLogo.png')}/>
                    <View style={styles.textLeft}>
                        <Text style={styles.text}>Current Events</Text>
                    </View>
                    <FlatList style={styles.list}
                        data={currentEvents}
                        renderItem={({ item }) => (
                        <TouchableOpacity
                        onPress={() => {
                            Actions.EventPageScreen()
                            /*go to that events communication page*/
                            /*different page if it is the person that made the event
                            so check for the start on the side*/
                        }}
                        >
                        <Text style={styles.item}>{item.name}</Text>
                        </TouchableOpacity>
                    )}
                    />
                     <View style={styles.textLeft}>
                        <Text style={styles.text}>Past Events</Text>
                    </View>
                    <FlatList style={styles.list}
                        data={pastEvents}
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
    JoinEventButton: {
        width: '48%',
        height: 120,
        backgroundColor: "rgba(0,0,0,0.3)",
        justifyContent: "center",
        fontWeight: "bold",
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
        top: 22,
        alignItems: "center",
        width: "100%",
        // flex: 1,
        // paddingTop: 40,
        // paddingHorizontal: 20,
    },
    leftContainer: {
        position: 'absolute',
        top: 70,
        width: "100%",
        textAlign: "left",
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
    mainPanel: {
        marginTop: 70,
        alignItems: "center",
        justifyContent: "center",
        width: "100%"
    },
    image1: {
        flex: 1,
        left: 164,
        height: 100,
        resizeMode: "contain",
    },
    image:{
        flex: 1,
        height: 100,
        resizeMode: "contain",
    },
    item: {
        color: "black",
        flex: 1,
        fontWeight: "bold",
        marginHorizontal: 10,
        padding: 30,
        borderColor: "grey",
        borderWidth: 1,
        backgroundColor: 'pink',
        borderBottomWidth: 1,
        fontSize: 24,
    },
    textLeft: {
        textAlign: "left",
    },
    text: {
        fontSize: 33,
        color: "black",
        marginTop: 10,
        fontWeight: "bold",
    },
    list: {
        width: "100%",
        height: 280,
    }
});

export default YourEventsScreen;