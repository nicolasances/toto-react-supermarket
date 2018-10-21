import React, {Component} from 'react';
import {StyleSheet, Text, View, TouchableOpacity, Image} from 'react-native';
import * as theme from '../styles/ThemeColors';

const googleImage = require('../../img/google-logo.png');

/**
 * Renders the login button
 * Requires:
 * - onLogin            : a callback function called when the user clicks on the login button
 */
export default class LoginComponent extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View style={styles.container}>
        <TouchableOpacity style={styles.imageContainer} onPress={this.props.onLogin}>
          <Image source={googleImage}  style={{width: 128, height: 128}} />
        </TouchableOpacity>
        <Text style={styles.loginText}>Login</Text>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageContainer: {
    backgroundColor: '#fff',
    width: 156,
    height: 156,
    borderRadius: 78,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  loginText: {
    fontSize: 18,
    color: '#fff',
  }
})
