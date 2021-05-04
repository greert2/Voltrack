import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default class App extends React.Component {
  render(){
    return (
      <View style={styles.container}>
        <Text>Open up App.js to start working on your app!</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});



// import React, { Component } from 'react';
// import { Platform, StyleSheet, Text, View } from 'react-native';
// import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
// import LoginScreen from "./app/screens/LoginScreen.js";
// export default
// class App extends React.Component {
//   render() {
//     return (
//       <LoginScreen>
//         <MapView
//          style={{ flex: 1 }}
//          provider={PROVIDER_GOOGLE}
//          showsUserLocation
//          initialRegion={{
//          latitude: 37.78825,
//          longitude: -122.4324,
//          latitudeDelta: 0.0922,
//          longitudeDelta: 0.0421}}
//       />
//       </LoginScreen>
      
//     );
//   }
// }