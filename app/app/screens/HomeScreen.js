import React, { useState, Component } from 'react';
import { ImageBackground, StyleSheet, View, Alert, Button, Image, Text, TouchableOpacity, FlatList} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Actions, Router, Scene } from "react-native-router-flux";
import Communications from 'react-native-communications';
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
            inEvent: false,
            textTo: ""
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
                 phone: result.phone,
                 textTo: result.firstName + " is pinging you from Voltrack, contact them as soon as you can!"

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
                        name: result.name,
                    },
                    var1: "Leave Event"

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

      createTwoButtonAlert = () =>
      Alert.alert(
        "Leave Event",
        "Are you sure you want to leave the event?",
        [
          {
            text: "Yes",
            onPress: () => {
                var connection = this.props.socket;
                var that = this;

                connection.leaveEvent(this.state.event.id, this.state.id)
                .then(function(results){
                    that.setState({
                        inEvent: false,
                        event: {
                            id: '',
                            name: 'no event joined :(',
                            users: []
                        }
                    });
                })
                .catch(function(err){
                    //not success :(
                })
            }
          },
          { text: "No", onPress: () => console.log("no") }
        ],
        { cancelable: false }
      );
    

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
                                                    Communications.text(item.phone, this.state.textTo) ////////////////////////////////////
                                                }}
                                            >
                                            <Text style={styles.volunteerButtonText}>📡</Text>
                                        </TouchableOpacity>
                                    </View>
                                    <View style={styles.volunteerButton}>
                                        <TouchableOpacity
                                            style={styles.buttonTouchableOpacity}
                                                onPress={() => {
                                                    Communications.phonecall(item.phone, true)
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
                    { this.state.inEvent ? <View style={styles.BarButton}>
                    {/* Leave Event Button */}
                        <TouchableOpacity
                        style={styles.buttonTouchableOpacity}
                        onPress={this.createTwoButtonAlert}
                        >
                                <Text style={styles.btnTextWhite}>Leave Event</Text>
                        </TouchableOpacity>
                    </View> : null }

                    { ! this.state.inEvent ? <View style={styles.BarButton}>

                    {/* Join Event Button */}
                        <TouchableOpacity
                        style={styles.buttonTouchableOpacity}
                            onPress={() => {
                                Actions.JoinEventScreen({userid: this.state.id})
                            }}
                        >
                                <Text style={styles.btnTextWhite}>Join Event</Text>
                        </TouchableOpacity>
                    </View> : null }
                    {/* Map Button */}
                    { this.state.inEvent ? <View style={styles.BarButton}>
                        <TouchableOpacity
                            style={styles.buttonTouchableOpacity}
                                onPress={() => {
                                    Actions.MapScreen({socket: this.props.socket, userid: this.state.id, eventid: this.state.event.id, firstName: this.state.firstName, lastName: this.state.lastName});
                                }}
                            >
                            <Text style={styles.btnTextWhite}>Map</Text>
                        </TouchableOpacity>
                    </View> : null }
                    {/* Home Button in event*/}
                    { this.state.inEvent ? <View style={styles.BarButton}>
                        <TouchableOpacity
                        style={styles.buttonTouchableOpacity}
                            onPress={() => {
                                
                            }}
                        >
                            <Text style={styles.btnTextWhite}>Home</Text>
                        </TouchableOpacity>
                    </View>: null }
                    {/* Home Button not in event */}
                    { ! this.state.inEvent ? <View style={styles.BarButton}>
                        <TouchableOpacity
                        style={styles.buttonTouchableOpacity}
                            onPress={() => {
                                
                            }}
                        >
                            <Text style={styles.btnTextWhite}>Home</Text>
                        </TouchableOpacity>
                    </View>: null }

                    {/* Create Event Button not in event*/}
                    { ! this.state.inEvent ? <View style={styles.BarButton}>
                        <TouchableOpacity
                        style={styles.buttonTouchableOpacity}
                            onPress={() => {
                                Actions.CreateEventScreen({userid: this.state.id});
                            }}
                        >
                            <Text style={styles.btnTextWhite}>Create Event</Text>
                        </TouchableOpacity>
                    </View>: null }
                </View> 



                {/* User Settings Button */}
                <View style={styles.profileButton}>
                    <TouchableOpacity
                    style={styles.buttonTouchableOpacity}
                        onPress={() => {
                            Actions.UserSettingsScreen({socket: this.props.socket, id: this.state.id, username: this.props.username, firstName: this.state.firstName, 
                                lastName: this.state.lastName, phone: this.state.phone, inEvent: this.state.inEvent, eventId: this.state.event.id});
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
    BarButton: {
        flex: 1,
        height: 120,
        backgroundColor: "rgba(0,0,0,0.3)",
        justifyContent: "center",
        fontWeight: "bold",
        alignItems: "center"
    },
    CreateEventButton: {
        width: '59%',
        height: 120,
        backgroundColor: "rgba(0,0,0,0.3)",
        justifyContent: "center",
        fontWeight: "bold",
        alignItems: "center",
    },
    JoinEventButton: {
        width: '81%',
        height: 120,
        backgroundColor: "rgba(0,0,0,0.3)",
        justifyContent: "center",
        fontWeight: "bold",
        alignItems: "center",
    },
    JoinEventButton2: {
        width: '76%',
        height: 120,
        backgroundColor: "rgba(0,0,0,0.3)",
        justifyContent: "center",
        fontWeight: "bold",
        alignItems: "center",
    },
    CreateEventButton2: {
        width: '81%',
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
        // flex: 1,
        width: '100%',
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
