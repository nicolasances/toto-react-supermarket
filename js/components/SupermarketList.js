import React, {Component} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import TRC from 'toto-react-components';
import SupermarketAPI from '../services/SupermarketAPI';
import TotoFlatList from './TotoFlatList';
import * as config from '../Config';

const defaultImage = require('../../img/groceries/groceries-bag.png');

export default class CustomItem extends Component {

  constructor(props) {
    super(props);

    // State init
    this.state = {
      items: [],
    }

    // Bind this
    this.loadData = this.loadData.bind(this);
    this.onItemAdded = this.onItemAdded.bind(this);
    this.createItem = this.createItem.bind(this);
  }

  /**
   * On mount of the component
   */
  componentDidMount() {
    // Load the data
    this.loadData();

    // Register to events
    TRC.TotoEventBus.bus.subscribeToEvent(config.EVENTS.itemAdded, this.onItemAdded);
  }

  /**
   * When unmounting
   */
  componentWillUnmount() {

    // Unregister to events
    TRC.TotoEventBus.bus.unsubscribeToEvent(config.EVENTS.itemAdded, this.onItemAdded);
  }

  /**
   * React to receiving the "item added" event by refreshing the list
   */
  onItemAdded(event) {
    // Refresh
    this.loadData();
  }

  /**
   * Loads the data from the API
   */
  loadData() {

    // Call the API to retrieve the items of the current supermarket list
    new SupermarketAPI().getItemsFromCurrentList().then((data) => {

      if (data == null || data.items == null) return;

      let items = data.items;

      // For every item assign the image
      for (var i = 0; i < items.length; i++) {

        // Get the category of the item, if any
        let categoryId = items[i].category;

        // If there's a category id, retrieve the image of that category
        let category = categoryId != null ? new DietAPI().getGroceryCategory(categoryId) : null;

        // Assign the image to the item
        items[i].image = category == null ? defaultImage : category.image;
      }

      // Update the state with the retrieved items
      this.setState({
        items: items
      });

    });
  }

  /**
   * Creates an item of the list
   */
  createItem(item) {

    let image = item.item.image != null ? item.item.image : defaultImage;

    return {
      title: item.item.name,
      avatar: {
        type: 'image',
        value: image
      }
    }

  }

  /**
   * Renders the data
   */
  render() {
    return (
      <TotoFlatList
            data={this.state.items}
            dataExtractor={this.createItem}
            />
    )
  }

}

const styles = StyleSheet.create({
  container: {
  },
  rowContainer: {
    flexDirection: 'row'
  },
})
