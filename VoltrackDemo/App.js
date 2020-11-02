import React, { Component } from 'react';
import { View } from "react-native";
import { Actions, Router, Scene } from "react-native-router-flux";
import mainScreen from './app/screens/MainScreen';
import loginScreen from './app/screens/LoginScreen';
import mapScreen from './app/screens/MapScreen';

export default function App() {
  return <mainScreen />;
  // return <MapScreen />;
};

App = () => (
  <Router>
    <Scene key="app">
      <Scene key="MainScreen" component={mainScreen} hideNavBar />
      <Scene key="MapScreen" component={mapScreen} hideNavBar />
      <Scene key="LoginScreen" component={loginScreen} hideNavBar />
    </Scene>
  </Router>
);




