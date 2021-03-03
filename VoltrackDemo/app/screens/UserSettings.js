import React, { Component } from 'react';
import { ImageBackground, StyleSheet, View, Alert, Image, Text, TouchableOpacity} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Actions, Router, Scene } from "react-native-router-flux";
import { TextInput } from 'react-native-gesture-handler';
// import { Dropdown } from 'react-native-material-dropdown-v2';
import { Picker } from '@react-native-picker/picker';


class UserSettings extends Component {

    constructor(props) {
        super(props);
        this.state = {
            task: '',
            oldTask: ''
        }
    }

    componentDidMount() {
        var connection = this.props.socket;
        var that = this;

        connection.getTask(this.props.id)
        .then(function(result) {
            // got their task
            that.setState({
                task: result,
                oldTask: result
            })
        })
        .catch(function(err) {
            console.log("failed to get task. err: " + err);
        })
    }

    createLogOutAlert = () =>
    Alert.alert(
      "Log Out",
      "Are you sure you want to log out?",
      [
        {
          text: "Yes",
          onPress: () => {
            var connection = this.props.socket;
            var that = this;

            connection.disconnect();
            Actions.popTo("MainScreen");
          }
        },
        { text: "Cancel", onPress: () => console.log("no"), style: 'cancel' }
      ],
      { cancelable: false }
    )


    createDeleteAccountAlert = () =>
    Alert.alert(
      "Delete Account",
      "Are you sure you want to delete your account? This will remove all information .",
      [
        {
          text: "Yes",
          onPress: () => {
            var connection = this.props.socket;
            var that = this;

            if(this.props.inEvent) {
                // Leave event
                connection.leaveEvent(this.props.eventId, this.props.id)
                .then(function(results){
                    console.log("User attempting to delete account has left event.");
                })
                .then(function() {
                    // Delete account
                    connection.deleteAccount(that.props.id)
                    .then(function(result) {
                        connection.disconnect();
                        Actions.popTo("MainScreen");
                    })
                    .catch(function(err) {
                        alert("Issue deleting account. ERR: " + err);
                    })
                })
                .catch(function(err){
                    console.log("Failed to leave event. Err: " + err);                
                })
            }else {
                // Delete account
                connection.deleteAccount(this.props.id)
                .then(function(result) {
                    connection.disconnect();
                    Actions.popTo("MainScreen");
                })
                .catch(function(err) {
                    alert("Issue deleting account. ERR: " + err);
                })
            }

            

            
          }
        },
        { text: "Cancel", onPress: () => console.log("no"), style: 'cancel' }
      ],
      { cancelable: false }
    )


    

    render() {

        let nameBoxText = this.props.firstName + " " + this.props.lastName;

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
                        <Text style={styles.btnTextBlack, {fontSize: 30, marginLeft: 15}}>&larr;</Text>
                        </TouchableOpacity>
                    </View>
                    <Image style={styles.image} source={require('../assets/profile.png')}/>
                    <Text style={styles.nameText}>{this.props.username}</Text>
                    <View style={styles.mainPanel}>
                        <Text style={{alignSelf: 'left', marginLeft: 20}}>I am currently: {this.state.oldTask}</Text>
                        {/* Task Textbox */}
                        <TextInput
                            style={styles.inputBox}
                            placeholder={"Enter Task Here"}
                            placeholderTextColor={'black'}
                            onChangeText={(task) => this.setState({task})}
                        />
                        {/* Accept Button */}
                        <View style={styles.UpdateButton}>
                                <TouchableOpacity
                                    style={styles.buttonTouchableOpacity}
                                        onPress={() => {
                                            if(!this.props.inEvent) {
                                                alert("You must first join an event to set your task!");
                                            }else {
                                                // Set task in server
                                                if(this.state.oldTask == this.state.task) {
                                                    // User is trying to update to the same task they already have
                                                    alert("Your task is already set to: " + this.state.task);
                                                }else {
                                                    var connection = this.props.socket;
                                                    var that = this;

                                                    connection.setTask(this.props.id, this.state.task)
                                                    .then(function(result) {
                                                        // Task was set
                                                        that.setState({ 
                                                            oldTask: that.state.task
                                                        })
                                                        alert('Your task was set successfully');
                                                    })
                                                    .catch(function(err) {
                                                        // Failed to set task
                                                        console.log("Failed to set task. ERR: " + err);
                                                        alert('Failed to set task.');
                                                })
                                                }

                                                
                                            }
                                        }}
                                    >
                                    <Text style={styles.btnTextWhite}>Update</Text>
                                </TouchableOpacity>
                            </View>

                        <Text style={{marginLeft: -200, marginTop: 50}}>Contact Information</Text>
                        {/* Name Textbox */}
                        <TextInput
                            style={styles.inputBox}
                            placeholder={nameBoxText}
                            placeholderTextColor={'black'}
                        />
                        {/* Phone Textbox */}
                        <TextInput
                            style={styles.inputBox}
                            placeholder={this.props.phone}
                            placeholderTextColor={'black'}
                            secureTextEntry={true}
                        />
                    </View>
                    
                        
                </View>
    
                
                
                
                <View style={styles.twoBar}>
                    {/* Log Out Button */}
                    <View style={styles.logoutButton}>
                        <TouchableOpacity
                        style={styles.buttonTouchableOpacity}
                            onPress={() => {
                                this.createLogOutAlert();
                            }}
                        >
                        <Text style={styles.btnTextWhite}>Log Out</Text>
                        </TouchableOpacity>
                    </View>
                    {/* Delete Button */}
                    <View style={styles.deleteButton}>
                        <TouchableOpacity
                        style={styles.buttonTouchableOpacity}
                            onPress={() => {
                                this.createDeleteAccountAlert();
                            }}
                        >
                        <Text style={styles.btnTextWhite}>Delete Account</Text>
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
    twoBar: {
        flexDirection: 'row',
    },
    UpdateButton: {
        width: '38%',
        height: 60,
        marginTop: 20,
        backgroundColor: "rgba(0,0,0,0.3)",
        justifyContent: "center",
        fontWeight: "bold",
        alignItems: "center",
    },
    backButton: {
        width: '10%',
        height: 40,
        position: 'absolute',
        alignSelf: 'flex-start',
    },
    logoutButton: {
        width: '50%',
        height: 90,
        backgroundColor: "rgba(0,0,0,0.3)",
        alignItems: "center",
        justifyContent: "center",
    },
    deleteButton: {
        width: "50%",
        height: 90,
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
        color: "black",
        fontSize: 24,
    },
    nameText: {
        marginTop: 20,
        fontSize: 24,
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
        width: 100,
        resizeMode: "contain",
        backgroundColor: "black",
        borderRadius: 10,
    }
});

export default UserSettings;