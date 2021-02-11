import React, { Component, useState, useEffect } from 'react';
import { ImageBackground, StyleSheet, View, Button, Image, Text, TextView, TouchableOpacity} from 'react-native';
import MapView, { Marker, MarkerAnimated, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';
import iconImg from '../assets/profilePic.png';

function MapScreen(props) {
    // React Native Hooks (similar to state, but notice we are in a functional Component instead of a Class)
    const [location, setLocation] = useState(null);
    const [errorMsg, setErrorMsg] = useState(null);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [markers, setMarkers] = useState([
        {
            key: 'test1',
            coordinate: {
                latitude: 48.73805,
                longitude: -122.48051
            }
        },
        {
            key: 'test2',
            coordinate: {
                latitude: 48.73923,
                longitude: -122.48514
            }
        }
    ]);

    let id = 0;

    useEffect(() => {
        (async() => {
            let { status } = await Location.requestPermissionsAsync();
            if(status !== 'granted') {
                setErrorMsg("Permission to access location was denied");
                alert("Issue with location");
                return;
            }

            let location = await Location.getCurrentPositionAsync({});
            setLocation(location);
            alert("location: " + location.coords.latitude + ", " + location.coords.longitude);
        })();
    }, []);

    // onMapPress(e) {
    //     this.setState({
    //         markers: [
    //         ...markers,
    //         {
    //             coordinate: e.nativeEvent.coordinate,
    //             key: `foo${id++}`,
    //         },
    //         ],
    //     });
    // }

    function test() {
        
    }
    

    return (
        <View style={{
            width: '100%',
            height: '100%'
        }}
        >
            <MapView
            style={{ flex: 1 }}
            provider={PROVIDER_GOOGLE}
            showsUserLocation={true}
            followsUserLocation={true}
            initialRegion={{
            latitude: 48.769768,
            longitude: -122.485886,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421}}
            >
            {markers.map(marker => (
                <Marker
                 title={marker.key}
                 image={iconImg}
                 key={marker.key}
                 coordinate={marker.coordinate}
                />
            ))}
            </MapView>
            <View style={styles.backButton}>
                <TouchableOpacity
                style={styles.buttonTouchableOpacity}
                    onPress={() => {
                        setMarkers([
                            {
                                key: 'test1',
                                coordinate: {
                                    latitude: 48.73300,
                                    longitude: -122.48051
                                }
                             },
                             {
                                key: 'test2',
                                coordinate: {
                                    latitude: 48.74223,
                                    longitude: -122.48514
                                }
                            }
                            ]);
                    }}
                >
                <Text style={styles.btnTextWhite}>Update</Text>
                </TouchableOpacity>
            </View>
        </View>


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
    loginButton: {
        width: '100%',
        height: 70,
        backgroundColor: "rgba(0,0,0,0.3)",
        alignItems: "center",
        justifyContent: "center",
    },
    backButton: {
        position: 'absolute',
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

export default MapScreen;