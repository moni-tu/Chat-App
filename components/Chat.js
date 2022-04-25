import React from 'react';
import { StyleSheet, View, Text, Platform, KeyboardAvoidingView } from 'react-native';
import { GiftedChat, Bubble } from 'react-native-gifted-chat'

// import Firestore
const firebase = require('firebase');
require('firebase/firestore');

// import async storage
import AsyncStorage from '@react-native-community/async-storage';

export default class Chat extends React.Component {

  constructor() {
    super();
    this.state = {
      messages: [],
      uid: 0,
      user: {
        _id: "",
        name: "",
        avatar: "",
      },
    };

    //information for the database
    if (!firebase.apps.length) {
      firebase.initializeApp({
        apiKey: "AIzaSyAv32VWewXrMup-cRjJnxvQ_ZZiz8N_6uk",
        authDomain: "chatapp-c0a0d.firebaseapp.com",
        projectId: "chatapp-c0a0d",
        storageBucket: "chatapp-c0a0d.appspot.com",
        messagingSenderId: "1022347094695",
        appId: "1:1022347094695:web:25f32ca6a4c739bca24982",
        measurementId: "G-8R3H32XG2F"
      });
    }

    //references the database
    this.referenceChatMessages = firebase.firestore().collection("messages");
  };
  // retrieves the chat messages from async storage
  async getMessages() {
    let messages = '';
    try {
      messages = await AsyncStorage.getItem('messages') || [];
      this.setState({
        messages: JSON.parse(messages)
      });
    } catch (error) {
      console.log(error.message);
    }
  }

  async saveMessages() {
    
  }

  componentDidMount() {

    this.getMessages();

    const name = this.props.route.params.name;
    this.props.navigation.setOptions({ title: name});

    this.authUnsubscribe = firebase.auth().onAuthStateChanged((user) => {
      if (!user) {
        firebase.auth().signInAnonymously();
      }

      this.setState({
        uid: user.uid,
        messages: [],
        user: {
          _id: user.uid,
          name: name,
          avatar: "https://placeimg.com/140/140/any"
        }
      });

      this.unsubscribe = this.referenceChatMessages
       .orderBy("createdAt", "desc")
       .onSnapshot(this.onCollectionUpdate);

    });
  } 

  onCollectionUpdate = (querySnapshot) => {
    const messages = [];
    // go through each document
    querySnapshot.forEach((doc) => {
      // get the QueryDocumentSnapshot's data
      var data = doc.data();
      messages.push({
        _id: data._id,
        text: data.text,
        createdAt: data.createdAt.toDate(),
        user: {
          _id: data.user._id,
          name: data.user.name,
          avatar: data.user.avatar
        },
      });
    });
    this.setState({
      messages: messages,
    });
  }

  //adding messages to the database
  addMessage() {
    const message = this.state.messages[0];

    this.referenceChatMessages.add({
      _id: message._id,
      createdAt: message.createdAt,
      text: message.text,
      user: this.state.user
    });
  };
  //when a message is sent, save its current state into asyncStorage
  onSend(messages = []) {
    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, messages),
    }),() => {
      this.saveMessages();
    })
  }

  componentWillUnmount() {
    if (this.state.isConnected) {
      this.authUnsubscribe();
      this.unsubscribe();
    }
  }

  renderBubble(props) {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            backgroundColor: '#000'
          },
          left: {
            backgroundColor: '#fff'
          }
        }}
      />
    )
  }

  render() {
    return (
      <View style={styles.chatView}>
        <GiftedChat
        renderBubble={this.renderBubble.bind(this)}
        messages={this.state.messages}
        onSend={messages => this.onSend(messages)}
        user={{
          _id: this.state.user._id,
          name: this.state.name,
          avatar: this.state.user.avatar,
        }}
      />
      {/* this avoids the keyboard to overlap pver the typed text in android */}
      { Platform.OS === 'android' ? <KeyboardAvoidingView behavior="height" /> : null }
      </View>
    )
  }
}

const styles = StyleSheet.create({
  chatView: {
    flex: 1,
  }

})