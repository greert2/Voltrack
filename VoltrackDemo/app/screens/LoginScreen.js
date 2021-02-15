import React, { Component } from 'react';
import { ImageBackground, StyleSheet, View, Button, Image, Text, TouchableOpacity} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Actions, Router, Scene } from "react-native-router-flux";
import { TextInput } from 'react-native-gesture-handler';
import socketIO from 'socket.io-client';
// import { Toast } from 'react-native-simple-toast';




class LoginScreen extends Component {

    state = {
        username: '',
        password: ''
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
                <Text style={styles.logo}>Log In</Text>
                <View style={styles.mainPanel}>
                    {/* Username Textbox */}
                    <TextInput
                        style={styles.inputBox}
                        placeholder="Username"
                        placeholderTextColor={'black'}
                        autoCapitalize={"none"}
                        secureTextEntry={false}
                        onChangeText={(username) => this.setState({username})}
                    />
                    {/* Password Textbox */}
                    <TextInput
                        style={styles.inputBox}
                        placeholder="Password"
                        placeholderTextColor={'black'}
                        autoCapitalize={"none"}
                        secureTextEntry={true}
                        onChangeText={(password) => this.setState({password})}
                    />
                </View>
            </View>
             {/* Login Button */}
             <View style={styles.loginButton}>
                <TouchableOpacity
                style={styles.buttonTouchableOpacity}
                    onPress={() => {
                        connection.authUser(this.state.username, this.state.password);
                        var socket = connection.getSocket();
                        socket.on('authorized', (res) => {
                            if(res === true) {
                                socket.off('authorized'); // remove this listener now, we're done
                                Actions.HomeScreen({username: this.state.username, socket: connection});
                            }else {
                                socket.off('authorized'); // remove this listener now, we're done
                                // showToast()
                            }
                                    
                        });
                    }}
                >
                    <Text style={styles.btnTextWhite}>Log in</Text>
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
        
    );
    }
   
}

// const showToast = () => (
//     Toast.showWithGravity(
//         "This username/password combination is not correct!", 
//         // Toast.SHORT, 
//         1,
//         // Toast.TOP,
//         1
//     )
// );

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
    }
});

export default LoginScreen;