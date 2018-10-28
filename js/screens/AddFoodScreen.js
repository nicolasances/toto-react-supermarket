import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, TouchableOpacity, Image, TextInput} from 'react-native';
import TRC from 'toto-react-components';
import TotoIconButton from '../components/TotoIconButton';
import SuggestionsBox from '../components/SuggestionsBox';

export default class AddFoodScreen extends Component<Props> {

  // Define the Navigation options
  static navigationOptions = ({navigation}) => {

    return {
      headerLeft: null,
      headerTitle: <TRC.TotoTitleBar
                      title='Pick something!'
                      back={true}
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

        <View style={styles.nameTextInputContainer}>
          <TextInput
            style={styles.nameTextInput}
            onChangeText={this.onChangeName}
            keyboardType='default'
            autoCapitalize='sentences'
            placeholder='Write the grocery name here'
            placeholderTextColor={TRC.TotoTheme.theme.COLOR_TEXT + '50'} />
        </View>

        <View style={styles.buttonsContainer}>
          <TotoIconButton
              image={require('../../img/tick.png')}
              label='Add'
              onPress={this.onAddCustomItem}
               />
        </View>

        <View style={{flex: 1}}>
        </View>

        <SuggestionsBox />

      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignContent: 'center',
    backgroundColor: TRC.TotoTheme.theme.COLOR_THEME,
  },
  nameTextInputContainer: {
    marginTop: 48,
    marginBottom: 24,
  },
  nameTextInput: {
    fontSize: 18,
    color: TRC.TotoTheme.theme.COLOR_TEXT,
    textAlign: 'center'
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 48,
  },
});
