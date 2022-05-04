import React from "react";
//  import PropTypes
import PropTypes from "prop-types";
//import necessary components from react-native
import { TouchableOpacity, View, Text, StyleSheet } from "react-native";
//import permissions and imagepicker
import * as Permissions from 'expo-permissions';
import * as ImagePicker from 'expo-image-picker';
import * as Location from "expo-location";
// import Firestore
const firebase = require('firebase');
require('firebase/firestore');

export default class CustomActions extends React.Component {

    imagePicker = async () => {
        const { status } = await Permissions.askAsync(Permissions.MEDIA_LIBRARY);
        try {
            if(status === 'granted') {
            let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images, // only images are allowed
            }).catch(error => console.log(error));
        
            if (!result.cancelled) {
                const imageUrl = await this.uploadImageFetch(result.uri);
                this.props.onSend({ image: imageUrl });  
            }
            }
        } catch (error) {
            console.log(error.message);
        }
    };

    takePhoto = async () => {
        const { status } = await Permissions.askAsync(Permissions.MEDIA_LIBRARY, Permissions.CAMERA);
        try {
            if(status === 'granted') {
                let result = await ImagePicker.launchCameraAsync({
                    mediaTypes: ImagePicker.MediaTypeOptions.Images,
                }).catch(error => console.log(error));
            
                if (!result.cancelled) {
                    const imageUrl = await this.uploadImageFetch(result.uri);
                    this.props.onSend({ image: imageUrl }); 
                }
            }
        }catch (error) {
            console.log(error.message);
        }
    };

    getLocation = async () => {
        const { status } = await Permissions.askAsync(Permissions.LOCATION_FOREGROUND);
        if(status === 'granted') {
          let result = await Location.getCurrentPositionAsync({});
     
          if (result) {
            this.setState({
              location: result
            });
          }
        }
    }
    // Upload images to firebase
    uploadImageFetch = async (uri) => {
        const blob = await new Promise((resolve, reject) => {
          const xhr = new XMLHttpRequest();
          xhr.onload = function () {
            resolve(xhr.response);
          };
          xhr.onerror = function (e) {
            console.log(e);
            reject(new TypeError("Network request failed"));
          };
          xhr.responseType = "blob";
          xhr.open("GET", uri, true);
          xhr.send(null);
        });
    
        const imageNameBefore = uri.split("/");
        const imageName = imageNameBefore[imageNameBefore.length - 1];
    
        const ref = firebase.storage().ref().child(`images/${imageName}`);
    
        const snapshot = await ref.put(blob);
    
        blob.close();
    
        return await snapshot.ref.getDownloadURL();
    };

    // Handling all communication features
    onActionPress = () => {
        const options = ['Choose From Library', 'Take Picture', 'Send Location', 'Cancel'];
        const cancelButtonIndex = options.length - 1;
        this.context.actionSheet().showActionSheetWithOptions(
          {
            options,
            cancelButtonIndex,
          },
          async (buttonIndex) => {
            switch (buttonIndex) {
              case 0:
                console.log('user wants to pick an image');
                return this.imagePicker();
              case 1:
                console.log('user wants to take a photo');
                return this.takePhoto();
              case 2:
                console.log('user wants to get their location');
                /* return this.getLocation(); */
            }
          },
        );
    };

    render() {
        return (
            <TouchableOpacity 
                style={[styles.container]} 
                onPress={this.onActionPress}
            >
            <View style={[styles.wrapper, this.props.wrapperStyle]}>
              <Text style={[styles.iconText, this.props.iconTextStyle]}>+</Text>
            </View>
          </TouchableOpacity>
        );
    }
}

const styles = StyleSheet.create({
    container: {
      width: 26,
      height: 26,
      marginLeft: 10,
      marginBottom: 10,
    },
    wrapper: {
      borderRadius: 13,
      borderColor: '#b2b2b2',
      borderWidth: 2,
      flex: 1,
    },
    iconText: {
      color: '#b2b2b2',
      fontWeight: 'bold',
      fontSize: 16,
      backgroundColor: 'transparent',
      textAlign: 'center',
      textAlignVertical:'center'
    },
});


CustomActions.contextTypes = {
    actionSheet: PropTypes.func,
};