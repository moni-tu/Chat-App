import React from 'react';
import { StyleSheet, View, Text, Platform, KeyboardAvoidingView } from 'react-native';
import { GiftedChat, Bubble } from 'react-native-gifted-chat'

// import Firestore
const firebase = require('firebase');
require('firebase/firestore');


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

  componentDidMount() {
    this.setState({
      messages: [
        {
          _id: 1,
          text: "Hello developer",
          createdAt: new Date(),
          user: {
            _id: 2,
            name: "React Native",
            avatar: "https://placeimg.com/140/140/any",
          },
        },
        {
          _id: 2,
          text: 'This is a system message',
          createdAt: new Date(),
          system: true,
        },
      ],
    });
  }

  onSend(messages = []) {
    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, messages),
    }))
  }

  renderBubble(props) {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            backgroundColor: '#000'
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
          _id: 1,
          name: this.state.name
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