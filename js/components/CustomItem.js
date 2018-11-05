import React, {Component} from 'react';
import {View, Text, TextInput, StyleSheet, Image, TouchableOpacity} from 'react-native';
import TRC from 'toto-react-components';
import SupermarketAPI from '../services/SupermarketAPI';
import * as config from '../Config';

export default class CustomItem extends Component {

  constructor(props) {
    super(props);

    this.state = {
      customItemName: null,
      showingCommonItems: false
    }

    // Bindings
    this.addCustomItem = this.addCustomItem.bind(this);
    this.showCommonItems = this.showCommonItems.bind(this);
    this.hideCommonItems = this.hideCommonItems.bind(this);
    this.toggleCommonItemsVisibility = this.toggleCommonItemsVisibility.bind(this);
  }

  /**
   * Toggles the visibiliy of the common items bar
   */
  toggleCommonItemsVisibility() {

    if (this.state.showingCommonItems) this.hideCommonItems();
    else this.showCommonItems();
  }

  /**
   * Shows the common items
   */
  showCommonItems() {
    // Send an event
    TRC.TotoEventBus.bus.publishEvent({name: config.EVENTS.commonItemsRequested});

    // Update the state
    this.setState({
      showingCommonItems: true
    })
  }

  /**
   * Hides the common items picker
   */
  hideCommonItems() {
    // Send an event
    TRC.TotoEventBus.bus.publishEvent({name: config.EVENTS.commonItemsDismissed});

    // Update the state
    this.setState({
      showingCommonItems: false
    })
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

  /**
   * Renders the component
   */
  render() {

    // Define the icon to show the common items
    let moreItemsIcon = require('../../img/more.png');

    if (this.state.showingCommonItems) moreItemsIcon = require('../../img/up-arrow.png');

    return (
      <View style={styles.container}>

        <View style={styles.avatarContainer}>
        </View>

        <View style={styles.textContainer}>
          <TextInput  style={styles.text}
                      ref={component => this._textInput = component}
                      keyboardType='default'
                      autoCapitalize='sentences'
                      placeholder='Add some to the supermarket list!'
                      placeholderTextColor={TRC.TotoTheme.theme.COLOR_TEXT + '50'}
                      onChangeText={(text) => {this.setState({customItemName: text})}}
                      onSubmitEditing={this.addCustomItem}
            />

        </View>

        <View style={{backgroundColor: 'blue', flex: 1}}></View>

        <TouchableOpacity onPress={this.toggleCommonItemsVisibility}>
          <Image  style={styles.moreImage}
                  source={moreItemsIcon}
                  />
        </TouchableOpacity>

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
    flexDirection: 'row',
  },
  text: {
    color: TRC.TotoTheme.theme.COLOR_TEXT
  },
  moreImage: {
    tintColor: TRC.TotoTheme.theme.COLOR_ACCENT,
    width: 20,
    height: 20
  },
})
