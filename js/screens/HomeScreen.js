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

        <View style={styles.addContainer}>
          <View style={styles.addButton}>
            <Image style={styles.addImage} source={require('../../img/add.png')} />
          </View>
        </View>

        <View style={styles.listContainer}>
        </View>

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
  addContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 48,
  },
  addButton: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 120,
    height: 120,
    borderRadius: 60,
    borderColor: TRC.TotoTheme.theme.COLOR_ACCENT,
    borderWidth: 3,
  },
  addImage: {
    tintColor: TRC.TotoTheme.theme.COLOR_ACCENT,
    width: 48,
    height: 48,
  },
  listContainer: {
    flex: 1,
  }
});
