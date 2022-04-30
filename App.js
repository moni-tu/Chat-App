import React, { Component } from 'react';
import { StyleSheet, View, Text, TextInput, Button, Alert, ScrollView } from 'react-native';
// importing screens we want to navigate between
import Start from './components/Start';
import Chat from './components/Chat';

// import react native gesture handler
import 'react-native-gesture-handler';

// import react Navigation
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
// import async storage
import AsyncStorage from '@react-native-async-storage/async-storage';

// create navigator
const Stack = createStackNavigator();

export default class App extends React.Component {

  render() {
    return (
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Start"
        >
          <Stack.Screen
            name="Start" component={Start}
          />
          <Stack.Screen
            name="Chat" component={Chat}
          />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
}

// style sheet at the bottom
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});