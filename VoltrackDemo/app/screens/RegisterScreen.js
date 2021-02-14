import React, { useState, Component } from 'react';
import { ImageBackground, StyleSheet, View, Button, Image, Text, TouchableOpacity, ToastAndroid} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Actions, Router, Scene } from "react-native-router-flux";
import { TextInput } from 'react-native-gesture-handler';
// import Toast from 'react-native-simple-toast';

// TODO: this login system is not secure despite hashing passwords before sending. We need to add a layer of device authentication or use something else like key pairs

class RegisterScreen extends Component {
    state = {
        firstName: '',
        lastName: '',
        phone: '',
        email: '',
        username: '',
        password: '',
    }

    render() {
        var bcrypt = require("react-native-bcrypt"); // for hashing passwords
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
                    <Text style={styles.logo}>Register</Text>
                    <View style={styles.mainPanel}>
                        {/* Username Textbox */}
                        <TextInput
                            style={styles.inputBox}
                            placeholder="First Name"
                            placeholderTextColor={'black'}
                            onChangeText={(firstName) => this.setState({firstName})}
                            value={this.state.firstName}
                        />
                        {/* Password Textbox */}
                        <TextInput
                            style={styles.inputBox}
                            placeholder="Last Name"
                            placeholderTextColor={'black'}
                            secureTextEntry={false}
                            onChangeText={(lastName) => this.setState({lastName})}
                            value={this.state.lastName}
                        />
                        <TextInput
                            style={styles.inputBox}
                            placeholder="Mobile Number"
                            placeholderTextColor={'black'}
                            secureTextEntry={false}
                            onChangeText={(phone) => this.setState({phone})}
                            value={this.state.phone}
                        />
                        <TextInput
                            style={styles.inputBox}
                            placeholder="Email"
                            placeholderTextColor={'black'}
                            secureTextEntry={false}
                            autoCapitalize={"none"}
                            onChangeText={(email) => this.setState({email})}
                            value={this.state.email}
                        />
                            <TextInput
                            style={styles.inputBox}
                            placeholder="Username"
                            placeholderTextColor={'black'}
                            secureTextEntry={false}
                            autoCapitalize={"none"}
                            onChangeText={(username) => this.setState({username})}
                            value={this.state.username}
                        />
                                            <TextInput
                            style={styles.inputBox}
                            placeholder="Password"
                            placeholderTextColor={'black'}
                            secureTextEntry={true}
                            autoCapitalize={"none"}
                            onChangeText={(password) => this.setState({password})}
                            value={this.state.password}
                        />
                    </View>
                </View>
                {/* Register Button */}
                <View style={styles.registerButton}>
                    <TouchableOpacity
                    style={styles.buttonTouchableOpacity}
                        onPress={() => {
                            // showToast();
                            // Hash password before sending
                            var salt = bcrypt.genSaltSync(10);
                            var hashedPass = bcrypt.hashSync(this.state.password, salt);
                            connection.getSocket().emit('account_register', this.state.firstName, this.state.lastName, this.state.phone, this.state.email, this.state.username, hashedPass);
                        }}
                    >
                        <Text style={styles.btnTextWhite}>Register</Text>
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
//         "Register!", 
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
    registerButton: {
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
        marginTop: 20,
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


export default RegisterScreen;
