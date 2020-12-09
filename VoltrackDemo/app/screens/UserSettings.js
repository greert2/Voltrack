import React from 'react';
import { ImageBackground, StyleSheet, View, Button, Image, Text, TouchableOpacity} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Actions, Router, Scene } from "react-native-router-flux";
import { TextInput } from 'react-native-gesture-handler';
// import { Dropdown } from 'react-native-material-dropdown-v2';
import { Picker } from '@react-native-picker/picker';


function UserSettings(props) {
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
                <Text style={styles.nameText}>Test Name</Text>
                <View style={styles.mainPanel}>
                    <Text style={{marginBottom:-70, marginLeft: -200}}>I am currently...</Text>
                    {/* Dropdown Status Selector */}
                    <Picker
                        // selectedValue={this.state.status}
                        style={{height: 50, width: 100, marginBottom: 170}}
                        //onValueChange={(itemValue, itemIndex) =>
                            //toggleSwitch = () => {
                                //this.setState({status: itemValue})
                            //}
                            
                        //}
                        >
                        <Picker.Item label="Task #1" value="task1" />
                        <Picker.Item label="Task #2" value="task2" />
                        <Picker.Item label="Task #3" value="task3" />
                        <Picker.Item label="Task #4" value="task4" />
                        <Picker.Item label="Task #5" value="task5" />
                    </Picker>
                    <Text style={{marginLeft: -200}}>Contact Information</Text>
                    {/* Name Textbox */}
                    <TextInput
                        style={styles.inputBox}
                        placeholder="Test Name"
                        placeholderTextColor={'black'}
                    />
                    {/* Phone Textbox */}
                    <TextInput
                        style={styles.inputBox}
                        placeholder="(555) 555-1234"
                        placeholderTextColor={'black'}
                        secureTextEntry={true}
                    />
                </View>
                
                    
            </View>

            
            
            
             {/* <View style={styles.loginButton}>
                <TouchableOpacity
                style={styles.buttonTouchableOpacity}
                    onPress={() => {
                        alert("log in!")
                    }}
                >
                    <Text style={styles.btnTextWhite}>Login</Text>
                </TouchableOpacity>
            </View> */}
            {/* Delete Button */}
            <View style={styles.deleteButton}>
                <TouchableOpacity
                style={styles.buttonTouchableOpacity}
                    onPress={() => {
                        Actions.pop()
                    }}
                >
                <Text style={styles.btnTextWhite}>Delete Account</Text>
                </TouchableOpacity>
            </View>
        </ImageBackground>
        
    );
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
    },
    loginButton: {
        width: '100%',
        height: 70,
        backgroundColor: "rgba(0,0,0,0.3)",
        alignItems: "center",
        justifyContent: "center",
    },
    deleteButton: {
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