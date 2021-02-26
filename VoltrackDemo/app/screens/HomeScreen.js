import React, { useState, Component } from 'react';
import { ImageBackground, StyleSheet, View, Button, Image, Text, TouchableOpacity, FlatList} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Actions, Router, Scene } from "react-native-router-flux";
import { TextInput } from 'react-native-gesture-handler';
import { getUsersInEvent } from '../scripts/serverConnection';


class HomeScreen extends Component {


    constructor(props) {
        super(props);
        this.state = { 
            id: '',
            username: '',
            firstName: '',
            lastName: '',
            phone: '',
            event: {
                id: '',
                name: 'no event joined :(',
                users: []
            },
            inEvent: false
        }
        
    }

    componentDidMount() {
        var connection = this.props.socket; // get our connection
        
        var that = this; // save the context so we can access it in a function

        connection.getAccountInfo({username: this.props.username})
        .then(function(result) {
            // Got user account info
            that.setState({
                 id: result.id,
                 firstName: result.firstName,
                 lastName: result.lastName,
                 phone: result.phone
            })
        })
        .then(function() {
            // Check if the user is in an event
            connection.isUserInEvent(that.state.id)
            .then(function(result) {
                // user is in an event
                console.log("Got user event!");
                that.setState({
                    event: {
                        id: result.eventid,
                        name: result.name
                    }
                })
            })
            .then(function() {
                // Get the users in the event
                connection.getUsersInEvent(that.state.event.id)
                .then(function(result) {
                    // got users in event
                    that.setState({
                        event: {
                            ...that.state.event, // spread operator to keep what was in the object
                            users: result
                        },
                        inEvent: true
                    })
                })
                .catch(function(err) {
                    console.log(err);
                })
            })
            .catch(function(err) {
                console.log(err);
            })
        })
        .catch(function(err) {
            console.log(err);
        })
    }

    

    render() {


        let people = [
            { name: 'Hao', key: '1'},
            { name: 'Tyler', key: '2'},
            { name: 'Carlos', key: '3'},
            { name: 'Laura', key: '4'},
        ]
        console.log("id: " + this.state.id);
        
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
                    <Image style={styles.image} source={require('../assets/voltrackLogo.png')}/>
                    <View style={styles.textLeft}>
                        <Text style={styles.text}>Welcome {this.state.firstName}!</Text>
                    </View>
                    <Text style={styles.heading}>Your Event</Text>
                    <View style={styles.listItemContainer}>
                        <Text style={styles.eventItem}>{this.state.event.name}</Text>
                    </View>
                    { this.state.inEvent ? <View style={styles.fullWidth}>
                        <Text style={styles.heading}>Volunteers</Text>
                        <FlatList 
                            data={this.state.event.users}
                            renderItem={({ item }) => (
                                <View style={styles.listItemContainer}>
                                    <Text style={styles.volunteerName}>{item.firstname} {item.lastname}</Text>
                                    <View style={styles.volunteerButton}>
                                        <TouchableOpacity
                                            style={styles.buttonTouchableOpacity}
                                                onPress={() => {
                                                    alert("ping this: " + item.phone) // REMOVE THIS AND REPLACE WITH ACTUAL IMPLEMENTATION
                                                }}
                                            >
                                            <Text style={styles.volunteerButtonText}>📡</Text>
                                        </TouchableOpacity>
                                    </View>
                                    <View style={styles.volunteerButton}>
                                        <TouchableOpacity
                                            style={styles.buttonTouchableOpacity}
                                                onPress={() => {
                                                    alert("call this: " + item.phone) // REMOVE THIS AND REPLACE WITH ACTUAL IMPLEMENTATION
                                                }}
                                            >
                                            <Text style={styles.volunteerButtonText}>📞</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>

                        )}
                        />
                    </View> : null }
                </View>
                <View style={styles.buttonContainer}>
                {/* Join Event Button */}
                <View style={styles.JoinEventButton}>
                    <TouchableOpacity
                    style={styles.buttonTouchableOpacity}
                        onPress={() => {
                            Actions.JoinEventScreen({userid: this.state.id})
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
                            Actions.CreateEventScreen({userid: this.state.id});
                        }}
                    >
                        <Text style={styles.btnTextWhite}>Create Event</Text>
                    </TouchableOpacity>
                </View>
                </View> 
                {/* User Settings Button */}
                <View style={styles.profileButton}>
                    <TouchableOpacity
                    style={styles.buttonTouchableOpacity}
                        onPress={() => {
                            Actions.UserSettingsScreen({socket: this.props.connection, username: this.props.username, firstName: this.state.firstName, 
                                lastName: this.state.lastName, phone: this.state.phone});
                        }}
                    >
                    <Image style={styles.image} source={require('../assets/profilePic.png')}/>
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
    CreateEventButton: {
        width: '50%',
        height: 70,
        backgroundColor: "rgba(0,0,0,0.3)",
        justifyContent: "center",
        alignItems: "center",
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
        top: 70,
        alignItems: "center",
        width: "100%",
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
    image: {
        flex: 1,
        height: 100,
        resizeMode: "contain",
    },
    listItemContainer: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "center"
    },
    volunteerName: {
        color: "black",
        marginTop: 10,
        width: '50%',
        padding: 30,
        backgroundColor: 'pink',
        fontSize: 18,
        textAlign: 'center',
        justifyContent: "center"
    },
    eventItem: {
        color: "black",
        marginTop: 10,
        width: '100%',
        padding: 25,
        backgroundColor: 'pink',
        fontSize: 15,
        textAlign: 'center',
    },
    volunteerButton: {
        color: "white",
        marginLeft: 4,
        marginTop: 10,
        width: '20%',
        backgroundColor: 'pink',
    },
    volunteerButtonText: {
        fontSize: 24,
        textAlign: 'center'
    },
    fullWidth: {
        width: '100%'
    },
    textLeft: {
        textAlign: "left"
    },
    heading: {
        fontSize: 24,
        alignSelf: 'flex-start',
        marginLeft: 10,
        marginTop: 20
    },
    list: {
        width: "100%",
        height: 280,
    }
});

export default HomeScreen;
