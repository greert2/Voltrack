import React, { useState, Component } from 'react';
import { ImageBackground, StyleSheet, View, Button, Image, Text, TouchableOpacity, KeyboardAvoidingView} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Actions, Router, Scene } from "react-native-router-flux";
import { TextInput } from 'react-native-gesture-handler';
import global from './Globals';
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
                <KeyboardAvoidingView 
                    style={styles.container}
                    behavior="padding"
                >
                    <Image style={styles.image} source={require('../assets/voltrackLogo.png')}/>
                    <Text style={styles.logo}>Register</Text>
                    <View style={styles.mainPanel}>
                        {/* First Name Textbox */}
                        <TextInput
                            style={styles.inputBox}
                            placeholder="First Name"
                            placeholderTextColor={'black'}
                            onChangeText={(firstName) => this.setState({firstName})}
                            value={this.state.firstName}
                            maxLength={30}
                            onEndEditing={(e)=>handleValidFirstName(e.nativeEvent.text)}
                        />
                        {global.isValidFirstName ? null :
                        <Text style={styles.errorMsg}>First Name field must only contain letters</Text>
                        }
                        {/* Last Name Textbox */}
                        <TextInput
                            style={styles.inputBox}
                            placeholder="Last Name"
                            placeholderTextColor={'black'}
                            secureTextEntry={false}
                            onChangeText={(lastName) => this.setState({lastName})}
                            value={this.state.lastName}
                            maxLength={30}
                            onEndEditing={(e)=>handleValidLastName(e.nativeEvent.text)}
                        />
                        {global.isValidLastName ? null :
                        <Text style={styles.errorMsg}>Last Name field must only contain letters</Text>
                        }
                        {/* Mobile Number Textbox */}
                        <TextInput
                            style={styles.inputBox}
                            placeholder="Mobile Number"
                            placeholderTextColor={'black'}
                            secureTextEntry={false}
                            onChangeText={(phone) => this.setState({phone})}
                            value={this.state.phone}
                            keyboardType="phone-pad"
                            maxLength={12}
                            onEndEditing={(e)=>handleValidMobileNumber(e.nativeEvent.text)}
                        />
                        {global.isValidMobileNumber ? null :
                        <Text style={styles.errorMsg}>Mobile Number field must only contain digits</Text>
                        }
                        {/* Email Textbox */}
                        <TextInput
                            style={styles.inputBox}
                            placeholder="Email"
                            placeholderTextColor={'black'}
                            secureTextEntry={false}
                            autoCapitalize={"none"}
                            onChangeText={(email) => this.setState({email})}
                            value={this.state.email}
                            keyboardType="email-address"
                            maxLength={40}
                            onEndEditing={(e)=>handleValidEmail(e.nativeEvent.text)}
                        />
                        {global.isValidEmail ? null :
                        <Text style={styles.errorMsg}>You have entered an invalid email address</Text>
                        }
                        {/* Username Textbox */}
                        <TextInput
                            style={styles.inputBox}
                            placeholder="Username"
                            placeholderTextColor={'black'}
                            secureTextEntry={false}
                            autoCapitalize={"none"}
                            onChangeText={(username) => this.setState({username})}
                            value={this.state.username}
                            maxLength={16}
                            onEndEditing={(e)=>handleValidUsername(e.nativeEvent.text)}
                        />
                        {global.isValidUsername ? null :
                        <Text style={styles.errorMsg}>Username must only contain letters and digits</Text>
                        }
                        {/* Password Textbox */}
                        <TextInput
                            style={styles.inputBox}
                            placeholder="Password"
                            placeholderTextColor={'black'}
                            secureTextEntry={true}
                            autoCapitalize={"none"}
                            onChangeText={(password) => this.setState({password})}
                            value={this.state.password}
                            maxLength={60}
                            onEndEditing={(e)=>handleValidPassword(e.nativeEvent.text)}
                        />
                        {global.isValidPassword ? null :
                        <Text style={styles.errorMsg}>Password field must not have contain white space</Text>
                        }
                    </View>
                </KeyboardAvoidingView>
                {/* Register Button */}
                <View style={styles.registerButton}>
                    <TouchableOpacity
                    style={styles.buttonTouchableOpacity}
                        onPress={() => {
                            // showToast();
                            // Hash password before sending
                            var salt = bcrypt.genSaltSync(10);
                            var hashedPass = bcrypt.hashSync(this.state.password, salt);
                            //connection.getSocket().emit('account_register', this.state.firstName, this.state.lastName, this.state.phone, this.state.email, this.state.username, hashedPass)
                            connection.accountRegister(this.state.firstName, this.state.lastName, this.state.phone, this.state.email, this.state.username, hashedPass)
                            .then(function(res) {
                                // successfully registered account
                                alert("Successfully registered account!");
                                Actions.pop();
                            })
                            .catch(function(err) {
                                alert("Failed to register account!");
                                Actions.pop();
                            })
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

const onlyNumbersANDLetters = /^[0-9a-zA-Z]+$/;
const onlyNumbers = /^[0-9]+$/;
const onlyLetters = /^[a-zA-Z]+$/;
const hasWhiteSpace = /\s/;
const emailCheck = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

const handleValidFirstName = (val) => {
    if(onlyLetters.test(val)) {
       global.isValidFirstName = true;
    }
    else {
        global.isValidFirstName = false;
    }
}

const handleValidLastName = (val) => {
    if(onlyLetters.test(val)) {
       global.isValidLastName = true;
    }
    else {
        global.isValidLastName = false;
    }
}

const handleValidMobileNumber = (val) => {
    if(onlyNumbers.test(val)) {
       global.isValidMobileNumber = true;
    }
    else {
        global.isValidMobileNumber= false;
    }
}

const handleValidUsername = (val) => {
    if(onlyNumbersANDLetters.test(val)) {
       global.isValidUsername = true;
    }
    else {
        global.isValidUsername = false;
    }
}

const handleValidEmail = (val) => {
    if(emailCheck.test(val)) {
       global.isValidEmail = true;
    }
    else {
        global.isValidEmail= false;
    }
}

const handleValidPassword = (val) => {
    if(hasWhiteSpace.test(val)) {
       global.isValidPassword = true;
    }
    else {
        global.isValidPassword= false;
    }
}


const styles = StyleSheet.create({
    errorMsg: {
        color: '#FF0000',
        fontSize: 14,
    },
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
        height: 60,
        backgroundColor: "rgba(0,0,0,0.3)",
        alignItems: "center",
        justifyContent: "center",
    },
    backButton: {
        width: "100%",
        height: 60,
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
