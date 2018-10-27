import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, TouchableOpacity, Image, Dimensions} from 'react-native';
import TRC from 'toto-react-components';

export default class HomeScreen extends Component<Props> {

    // Define the Navigation options
    static navigationOptions = ({navigation}) => {

      return {
        headerTitle: <TRC.TotoTitleBar
                        title='Supermarket'
                        />
      }
    }

  /**
   * Constructor of the Home Screen
   */
  constructor(props) {
    super(props);
  }

  /**
   * Renders the home screen
   */
  render() {

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
    backgroundColor: TRC.TotoTheme.theme.COLOR_THEME,
  },

});
