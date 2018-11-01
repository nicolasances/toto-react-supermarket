import React, {Component} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import TRC from 'toto-react-components';

export default class CommonItems extends Component {

  constructor(props) {
    super(props);

    this.state = {
      commonItems: []
    }

    // Bindings
    this.addCommonItemToList = this.addCommonItemToList.bind(this);
  }

  /**
   * Adds the common item to the supermarket list
   */
  addCommonItemToList(item) {

    new SupermarketAPI().postItemInCurrentList({name: item.item.name}).then((data) => {
      // Post an event to notify that the item has been added
      TRC.TotoEventBus.bus.publishEvent({name: config.EVENTS.itemAdded, context: {item: item.item.name}});
    });

  }

  /**
   * Loads the common items
   */
  loadCommonItems() {

    // Call the API
    new SupermarketAPI().getCommonItems().then((data) => {

      // Update the state
      this.commonItems = data.items;

      // Filter out the components that are already in the supermarket list
      new SupermarketAPI().getItemsFromCurrentList().then((data) => {

        if (data == null || data.items == null) return;

        for (var i = 0; i < data.items.length; i++) {

          let item = data.items[i];

          for (var j = 0; j < this.commonItems.length; j++) {

            // If the item is in the common items list, remove the common item
            if (this.commonItems[j].name == item.name)
              this.commonItems.splice(j, 1);

          }
        }

        // Update the state by updating the common items
        this.setState({commonItems: []}, () => {this.setState({commonItems: this.commonItems})});

      });
    });
  }

  render() {
    return (

    )
  }
}
