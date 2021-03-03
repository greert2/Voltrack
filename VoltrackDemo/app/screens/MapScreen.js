import React, { Component, useState, useEffect } from 'react';
import { ImageBackground, StyleSheet, View, Button, Image, Text, TextView, TouchableOpacity} from 'react-native';
import MapView, { Marker, MarkerAnimated, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';
import iconImg from '../assets/profilePic.png';
import * as TaskManager from 'expo-task-manager';

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

    let connection = props.socket;

    useEffect(() => {
        const timer = setInterval(() => getLocations(), 30000); // get the locations every 30 seconds

        // This Task will not work on iOS as we have it.
        TaskManager.defineTask("VOLTRACK_LOCATION", ({ data: { locations }, error }) => {
            if (error) {
              // check `error.message` for more details.
              return;
            }
            // Update location on server
            let locationUpdate = correctPrecision(locations[0].coords.latitude) + "," + correctPrecision(locations[0].coords.longitude);
            connection.updateLocation(props.userid, locationUpdate);
            console.log("LocationUpdate: " + locationUpdate);
            // console.log('Received new locations', locations);
        });


        (async() => {
            let { status } = await Location.requestPermissionsAsync();
            if(status !== 'granted') {
                setErrorMsg("Permission to access location was denied");
                alert("Issue with location");
                return;
            }

            // Register for background updates
            Location.startLocationUpdatesAsync("VOLTRACK_LOCATION", {
                'accuracy': 4,
                'timeInterval': 30000,
                "deferredUpdatesInterval": 30000
            })

            let location = await Location.getCurrentPositionAsync({});
            // Update location on server
            let locationUpdate = correctPrecision(location.coords.latitude) + "," + correctPrecision(location.coords.longitude);
            // This sets the location rapidly on change.. Not good for real use but good for testing. Also works on iOS
            connection.updateLocation(props.userid, locationUpdate);
            console.log("LocationUpdate: " + locationUpdate);
            setLocation(location);
            getLocations();
        })();


        return () => clearInterval(timer); // stop updating after dom is unmounted
    }, []);


    async function getLocations() {

        await connection.getLocations(props.eventid)
        .then(function(result) {
            console.log("a result:" + result[0].location);

            let newRes = result.map(createMarkerObject);
            console.log("result:" + JSON.stringify(newRes[0]));
            // setMarkers([...markers, newRes]);
            setMarkers(newRes);
        })
        .catch(function(err) {
            console.log("didn't work. err: " + err);
        })

        // console.log("otherLocations: " + otherLocations[0].coordinate.latitude);
        //
        // setMarkers(otherLocations);
    }

    
    // Given a decimal, return it with 5 decimal places
    function correctPrecision(decimal) {
        if(decimal >= 100 || decimal <= -100) {
            return decimal.toPrecision(8);
        }
        return decimal.toPrecision(7);
    } 

    // given one object from the array returned by connection.getLocations()
    // returns a marker object
    function createMarkerObject(item, index) {
        let locationArr = item.location.split(',');

        let markerObj = {
            key: item.firstname + ' ' + item.lastname,
            coordinate: {
                latitude: parseFloat(locationArr[0]),
                longitude: parseFloat(locationArr[1])
            }
        };

        // otherLocations.push(markerObj);
        // setMarkers([markerObj]);
        return markerObj;
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
                        // setMarkers([
                        //     {
                        //         key: 'test1',
                        //         coordinate: {
                        //             latitude: 48.73300,
                        //             longitude: -122.48051
                        //         }
                        //      },
                        //      {
                        //         key: 'test2',
                        //         coordinate: {
                        //             latitude: 48.74223,
                        //             longitude: -122.48514
                        //         }
                        //     }
                        //     ]);
                        getLocations();
                        console.log("state markers: " + JSON.stringify(markers));
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