import React from "react";
//  import PropTypes
import PropTypes from "prop-types";
//import necessary components from react-native
import { TouchableOpacity, View, Text, StyleSheet } from "react-native";
//import permissions and imagepicker
import * as Permissions from 'expo-permissions';
import * as ImagePicker from 'expo-image-picker';

export default class CustomActions extends React.Component {

    imagePicker = async () => {
        const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
    
        if(status === 'granted') {
          let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: 'Images',
          }).catch(error => console.log(error));
    
          if (!result.cancelled) {
            this.setState({
              image: result
            });  
          }
        }
    }

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
                /* return this.takePhoto(); */
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