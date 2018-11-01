import React, {Component} from 'react';
import {View, Text, TextInput, StyleSheet} from 'react-native';
import TRC from 'toto-react-components';
import SupermarketAPI from '../services/SupermarketAPI';
import * as config from '../Config';

export default class CustomItem extends Component {

  constructor(props) {
    super(props);

    this.state = {
      customItemName: null
    }

    // Bindings
    this.addCustomItem = this.addCustomItem.bind(this);
  }

  /**
   * Adds a custom item to the supermarket list
   */
  addCustomItem() {

    // Save the new custom item to the supermarket list
    new SupermarketAPI().postItemInCurrentList({name: this.state.customItemName}).then((data) => {
      // Post an event to notify that the item has been added
      TRC.TotoEventBus.bus.publishEvent({name: config.EVENTS.itemAdded});

      // Clear the text field
      this._textInput.setNativeProps({text: ''});
    });

  }

  render() {
    return (
      <View style={styles.container}>

        <View style={styles.avatarContainer}>
        </View>

        <View style={styles.textContainer}>
          <TextInput
            style={styles.text}
            ref={component => this._textInput = component}
            keyboardType='default'
            autoCapitalize='sentences'
            placeholder='Add some to the supermarket list!'
            placeholderTextColor={TRC.TotoTheme.theme.COLOR_TEXT + '50'}
            onChangeText={(text) => {this.setState({customItemName: text})}}
            onSubmitEditing={this.addCustomItem}
            />
        </View>

      </View>
    )
  }

}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    alignContent: 'center',
    backgroundColor: TRC.TotoTheme.theme.COLOR_THEME_DARK + 50,
    padding: 12
  },
  avatarContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderColor: TRC.TotoTheme.theme.COLOR_THEME_DARK,
    borderWidth: 2
  },
  textContainer: {
    marginLeft: 12,
    alignItems: 'center',
    alignContent: 'center',
  },
  text: {
    color: TRC.TotoTheme.theme.COLOR_TEXT
  },
})
