import React, { Component } from 'react';
import { Actions, Router, Scene } from "react-native-router-flux";
import mainScreen from './app/screens/MainScreen';
import loginScreen from './app/screens/LoginScreen';
import mapScreen from './app/screens/MapScreen';
import createEventScreen from './app/screens/CreateEventScreen';
import registerScreen from './app/screens/RegisterScreen';
import homeScreen from './app/screens/HomeScreen';
import joinEventScreen from './app/screens/JoinEventScreen';

export default function App() {
  return <mainScreen />;
};

App = () => (
  <Router>
    <Scene key="app">
      <Scene key="MainScreen" component={mainScreen} hideNavBar />
      <Scene key="MapScreen" component={mapScreen} hideNavBar />
      <Scene key="LoginScreen" component={loginScreen} hideNavBar />
      <Scene key="CreateEventScreen" component={createEventScreen} hideNavBar />
      <Scene key="RegisterScreen" component={registerScreen} hideNavBar />
      <Scene key="HomeScreen" component={homeScreen} hideNavBar />
      <Scene key="JoinEventScreen" component={joinEventScreen} hideNavBar />

    </Scene>
  </Router>
);




