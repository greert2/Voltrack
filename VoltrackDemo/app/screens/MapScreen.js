import React, { Component } from 'react';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';

function MapScreen(props) {
    return (
        <MapView
         style={{ flex: 1 }}
         provider={PROVIDER_GOOGLE}
         showsUserLocation
         initialRegion={{
         latitude: 37.78825,
         longitude: -122.4324,
         latitudeDelta: 0.0922,
         longitudeDelta: 0.0421}}
      />
    );
}

export default MapScreen;