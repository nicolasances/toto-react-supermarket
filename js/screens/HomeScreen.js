import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, TouchableOpacity, Image, Dimensions} from 'react-native';
import { GoogleSignin, GoogleSigninButton, statusCodes } from 'react-native-google-signin';
import LoginComponent from '../components/LoginComponent';
import TotoTitleBar from '../widgets/TotoTitleBar';
import * as theme from '../styles/ThemeColors';

const clientId = '209706877536-p9b1uhqemeiujcd6j92edh9f48nj43m1.apps.googleusercontent.com';

GoogleSignin.configure({
  scopes: [], // what API you want to access on behalf of the user, default is email and profile
  iosClientId: clientId, // client ID of type WEB for your server (needed to verify user ID and offline access)
  offlineAccess: false, // if you want to access Google API on behalf of the user FROM YOUR SERVER
  // hostedDomain: '', // specifies a hosted domain restriction
  // forceConsentPrompt: true, // [Android] if you want to show the authorization prompt at each login
  // accountName: '', // [Android] specifies an account name on the device that should be used
});

export default class HomeScreen extends Component<Props> {

    // Define the Navigation options
    static navigationOptions = ({navigation}) => {

      return {
        headerTitle: <TotoTitleBar
                        title='Supermarket'
                        />
      }
    }

  /**
   * Constructor of the Home Screen
   */
  constructor(props) {
    super(props);

    this.state = {
      isSignedIn: false
    }

    // Bind functions
    this.onLogin = this.onLogin.bind(this);
  }

  /**
   * When the component is mounted
   */
  componentDidMount() {
    // Check if the user is already signed in
    this.isSignedIn();
  }

  /**
   * Called when the user clicks on the login button
   */
  onLogin() {

    this.signIn();
  }

  /**
   * Google Sign in function
   */
  signIn = async () => {
    // Calls Google for the sign in process
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      this.setState({
        userInfo,
        isSignedIn: true,
      });
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

  /**
   * Retrieve the current user info.
   * To be called only if already signed in!
   */
  getCurrentUserInfo = async () => {

    try {
      const userInfo = await GoogleSignin.signInSilently();

      // Update the state
      this.setState({ userInfo });

    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_REQUIRED) {
        // user has not signed in yet
      } else {
        // some other error
      }
    }
  };

  /**
   * Checks if the user is signed In
   */
  isSignedIn = async () => {

    const isSignedIn = await GoogleSignin.isSignedIn();

    // Update the state
    this.setState({ isSignedIn: isSignedIn });

    // Retrieve the user info
    this.getCurrentUserInfo();

  };

  /**
   * Renders the home screen
   */
  render() {

    if (!this.state.isSignedIn) return (
      <View style={styles.loginContainer}>
        <LoginComponent onLogin={this.onLogin} />
      </View>
    )

    return (
      <View style={styles.container}>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignContent: 'flex-start',
    backgroundColor: theme.color().COLOR_THEME,
  },
  loginContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.color().COLOR_THEME,
  }

});
