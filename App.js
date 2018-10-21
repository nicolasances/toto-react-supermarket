/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, Button, TouchableOpacity} from 'react-native';
import { GoogleSignin, GoogleSigninButton, statusCodes } from 'react-native-google-signin';

const clientId = '209706877536-p9b1uhqemeiujcd6j92edh9f48nj43m1.apps.googleusercontent.com';

GoogleSignin.configure({
  scopes: [], // what API you want to access on behalf of the user, default is email and profile
  iosClientId: clientId, // client ID of type WEB for your server (needed to verify user ID and offline access)
  offlineAccess: false, // if you want to access Google API on behalf of the user FROM YOUR SERVER
  // hostedDomain: '', // specifies a hosted domain restriction
  // forceConsentPrompt: true, // [Android] if you want to show the authorization prompt at each login
  // accountName: '', // [Android] specifies an account name on the device that should be used
});

export default class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      isSigninInProgress: false
    }
  }

  componentDidMount() {
  }

  signIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      console.log(userInfo);
      this.setState({ userInfo });
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        // user cancelled the login flow
      } else if (error.code === statusCodes.IN_PROGRESS) {
        // operation (f.e. sign in) is in progress already
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        // play services not available or outdated
      } else {
        // some other error happened
      }
    }
  };

  render() {
    return (
      <View style={styles.container}>
        <GoogleSigninButton
           style={{ width: 48, height: 48 }}
           size={GoogleSigninButton.Size.Icon}
           color={GoogleSigninButton.Color.Dark}
           onPress={this.signIn}
           disabled={this.state.isSigninInProgress} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#00acc1',
  },
});
