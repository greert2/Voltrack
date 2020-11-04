import React, { Component } from 'react';
import { Button } from 'react-native';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';

function MapScreen(props) {
    return (
        <MapView
         style={{ flex: 1 }}
         provider={PROVIDER_GOOGLE}
         showsUserLocation
         initialRegion={{
         latitude: 48.769768,
         longitude: -122.485886,
         latitudeDelta: 0.0922,
         longitudeDelta: 0.0421}}
      />
      
    );
}

export default MapScreen;