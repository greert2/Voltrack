import React, { Component } from 'react';
import { Actions, Router, Scene } from "react-native-router-flux";
import mainScreen from './app/screens/MainScreen';
import loginScreen from './app/screens/LoginScreen';
import mapScreen from './app/screens/MapScreen';
import createEventScreen from './app/screens/CreateEventScreen';
import registerScreen from './app/screens/RegisterScreen';
import homeScreen from './app/screens/HomeScreen';
import joinEventScreen from './app/screens/JoinEventScreen';
import eventInfoScreen from './app/screens/EventInfoScreen';
import userSettingsScreen from './app/screens/UserSettings';
import setLocationScreen from './app/screens/SetLocationScreen';
import socketIO from 'socket.io-client';


export default function App() {

    // NOTE: we should probably connect to the server here ONE TIME, and then pass the connection
    //      between the screeens.

    // Connect to server here (DOES NOT WORK)
    // var connection = require('./app/scripts/serverConnection.js');
    // connection.connect();

    // global.socket = connection;


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
      <Scene key="EventInfoScreen" component={eventInfoScreen} hideNavBar />
      <Scene key="UserSettingsScreen" component={userSettingsScreen} hideNavBar />
      <Scene key="SetLocationScreen" component={setLocationScreen} hideNavBar />
    </Scene>
  </Router>
);




