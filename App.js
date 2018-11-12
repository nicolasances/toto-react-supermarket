import React, {Component} from 'react';
import {Platform, View, StyleSheet, AppState} from 'react-native';
import { createStackNavigator } from 'react-navigation';
import TRC from 'toto-react-components';
import user from './js/User';

// Navigation import
import HomeScreen from './js/screens/HomeScreen';
import AddFoodScreen from './js/screens/AddFoodScreen';
import ItemDetailScreen from './js/screens/ItemDetailScreen';
import ExecutionScreen from './js/screens/ExecutionScreen';
import ExecutionCostScreen from './js/screens/ExecutionCostScreen';
import GrabbedItemsScreen from './js/screens/GrabbedItemsScreen';

// Client Id
// const clientId = '209706877536-p9b1uhqemeiujcd6j92edh9f48nj43m1.apps.googleusercontent.com';
const clientId = Platform.OS == 'android' ? '209706877536-2hkg1qkvpsokqls7p78lbjahvqfknhh4.apps.googleusercontent.com' : '209706877536-p9b1uhqemeiujcd6j92edh9f48nj43m1.apps.googleusercontent.com';

/**
 * Navigation Stack
 */
const RootStack = createStackNavigator({

  HomeScreen: {screen: HomeScreen},
  AddFoodScreen: {screen: AddFoodScreen},
  ItemDetailScreen: {screen: ItemDetailScreen},
  ExecutionScreen: {screen: ExecutionScreen},
  ExecutionCostScreen: {screen: ExecutionCostScreen},
  GrabbedItemsScreen: {screen: GrabbedItemsScreen},

}, {
  initialRouteName: 'HomeScreen',
  navigationOptions: {
    headerStyle: {
      elevation: 0,
      backgroundColor: TRC.TotoTheme.theme.COLOR_THEME_DARK,
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
        }, () => {
          result().then((r) => {
            // Update the global user
            user.setUserInfo(r.user);
          });
        });
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

      // console.log(userInfo);

      // Set the user
      user.setUserInfo(userInfo);

      // Update the state
      this.setState({
        isSignedIn: true
      })
    });
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
