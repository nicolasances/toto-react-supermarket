import React, {Component} from 'react';
import {View, StyleSheet, AppState} from 'react-native';
import { createStackNavigator } from 'react-navigation';
import TRC from 'toto-react-components';

// Navigation import
import HomeScreen from './js/screens/HomeScreen';

// Client Id
const clientId = '209706877536-p9b1uhqemeiujcd6j92edh9f48nj43m1.apps.googleusercontent.com';

/**
 * Navigation Stack
 */
const RootStack = createStackNavigator({

  HomeScreen: {screen: HomeScreen},

}, {
  initialRouteName: 'HomeScreen',
  navigationOptions: {
    headerStyle: {
      elevation: 0,
      backgroundColor: TRC.TotoTheme.theme.COLOR_THEME,
    },
  }
});

/**
 * App
 */
export default class App extends Component {

  constructor(props) {
    super(props);

    // Instantiate the sign in utility
    this.totoSignIn = new TRC.TotoSignIn(clientId);

    // Init so that the signed in check is set as 'in progress'
    this.state = {
      isSignedIn: null
    }

    // Bind functions
    this.onLogin = this.onLogin.bind(this);

    // Check if the user is signed in already
    this.totoSignIn.isSignedIn().then((result) => {

      // If there is a result && the result is the user info (and not false)
      if (result != null && result != false) {
        // Update the state and set the user info
        this.setState({
          isSignedIn: true,
          result // userInfo
        })
      }
      // If the result is false then it means the user is not logged in
      else {
        // Update the state and set as "not signed in"
        this.setState({
          isSignedIn: false
        })
      }
    });

  }

  /**
   * Called when the user clicks on the login button
   */
  onLogin() {

    this.totoSignIn.signIn().then((userInfo) => {
      // Update the state with the user info
      this.setState({
        userInfo,
        isSignedIn: true
      })
    })
  }

  render() {

    // If the signed in check is in progress, return an empty page
    if (this.state.isSignedIn == null) return (
      // Eventually put the app logo
      <View style={styles.loginContainer}>
      </View>
    )

    // If the user isn't signed in, return a login page
    if (!this.state.isSignedIn) return (
      <View style={styles.loginContainer}>
        <TRC.TotoLoginComponent onLogin={this.onLogin} />
      </View>
    )

    return (
      <View style={{flex: 1}}>
        <RootStack />
      </View>
    );
  }
}

/**
 * Styles for the app
 */
const styles = StyleSheet.create({
  loginContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: TRC.TotoTheme.theme.COLOR_THEME,
  }

});
