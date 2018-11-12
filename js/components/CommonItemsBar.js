import React, {Component} from 'react';
import {TouchableOpacity, View, Text, StyleSheet, ScrollView} from 'react-native';
import TRC from 'toto-react-components';
import SupermarketAPI from '../services/SupermarketAPI';
import * as config from '../Config';

export default class CommonItemsBar extends Component {

  constructor(props) {
    super(props);

    this.state = {
      commonItems: []
    }

    // Bindings
    this.addCommonItemToList = this.addCommonItemToList.bind(this);
    this.removeItem = this.removeItem.bind(this);
  }

  /**
   * Initilialize everything
   */
  componentDidMount() {
    // Load the data
    this.loadCommonItems();
  }

  /**
   * Adds the common item to the supermarket list
   */
  addCommonItemToList(item) {

    new SupermarketAPI().postItemInCurrentList({name: item.name}).then((data) => {
      // Post an event to notify that the item has been added
      TRC.TotoEventBus.bus.publishEvent({name: config.EVENTS.itemAdded, context: {item: item.name}});

      // TODO remove the item from the common items list
      this.removeItem(item);
    });

  }

  /**
   * Removes the item from the list of common items
   */
  removeItem(item) {

    let commonItems = [];

    for (var i = 0; i < this.state.commonItems.length; i++) {

      let commonItem = this.state.commonItems[i];

      if (commonItem.name != item.name) commonItems.push(commonItem);
    }

    // Update the state
    this.setState({commonItems: commonItems});
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

  /**
   * Creates the tags of the common items to be displayed in the
   * common items bar
   */
  createItems(items) {

    if (items == null || items.length == 0) return;

    let shapes = [];

    for (var i = 0; i < items.length; i++) {

      let item = items[i];

      let shape = (
        <TouchableOpacity style={styles.itemContainer} key={'CommonItem-' + Math.random()} onPress={() => {this.addCommonItemToList(item)}}>
          <Text style={styles.itemText}>{items[i].name}</Text>
        </TouchableOpacity>
      )

      shapes.push(shape);
    }

    return shapes;
  }

  render() {

    let items = this.createItems(this.state.commonItems);

    return (
      <View>
        <ScrollView style={styles.container} horizontal={true} showsHorizontalScrollIndicator={false}>
          {items}
        </ScrollView>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: TRC.TotoTheme.theme.COLOR_THEME_DARK + 50,
    paddingHorizontal: 3,
  },
  itemContainer: {
    backgroundColor: TRC.TotoTheme.theme.COLOR_THEME_DARK,
    justifyContent: 'center',
    paddingHorizontal: 12,
    marginBottom: 12,
    marginHorizontal: 3,
    borderRadius: 5,
    paddingVertical: 9,
  },
  itemText: {
    color: '#fff',
  },
})
