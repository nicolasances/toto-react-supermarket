import React, {Component} from 'react';
import {View} from 'react-native';
import { createStackNavigator } from 'react-navigation';
import * as theme from './js/styles/ThemeColors';

// Navigation import
import HomeScreen from './js/screens/HomeScreen';
import LoginScreen from './js/screens/LoginScreen';

const RootStack = createStackNavigator({

  HomeScreen: {screen: HomeScreen},
  LoginScreen: {screen: LoginScreen},

}, {
  initialRouteName: 'HomeScreen',
  navigationOptions: {
    headerStyle: {
      backgroundColor: theme.color().COLOR_THEME,
    },
  }
});

export default class App extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View style={{flex: 1}}>
        <RootStack />
      </View>
    );
  }
}
