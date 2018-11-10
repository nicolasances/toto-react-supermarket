import React, {Component} from 'react';
import {View, Text, StyleSheet, Image, TouchableOpacity} from 'react-native';
import TRC from 'toto-react-components';
import SupermarketAPI from '../services/SupermarketAPI';
import TotoFlatList from './TotoFlatList';
import * as config from '../Config';

const defaultImage = require('../../img/groceries/groceries-bag.png');
const infoSign = require('../../img/info.png');

/**
 * Shows the current supermarket list
 * Props:
 *
 * - onItemPress      : (optional) function to be called when an item is pressed
 */
export default class SupermarketList extends Component {

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
    this.onItemDeleted = this.onItemDeleted.bind(this);
    this.onItemAdded = this.onItemAdded.bind(this);
    this.onItemUpdated = this.onItemUpdated.bind(this);
    this.onItemGrabbed = this.onItemGrabbed.bind(this);
  }

  /**
   * On mount of the component
   */
  componentDidMount() {
    // Load the data
    this.loadData();

    // Register to events
    TRC.TotoEventBus.bus.subscribeToEvent(config.EVENTS.itemAdded, this.onItemAdded);
    TRC.TotoEventBus.bus.subscribeToEvent(config.EVENTS.currentListItemDeleted, this.onItemDeleted);
    TRC.TotoEventBus.bus.subscribeToEvent(config.EVENTS.currentListItemUpdated, this.onItemUpdated);
    TRC.TotoEventBus.bus.subscribeToEvent(config.EVENTS.itemGrabbed, this.onItemGrabbed);
  }

  /**
   * When unmounting
   */
  componentWillUnmount() {

    // Unregister to events
    TRC.TotoEventBus.bus.unsubscribeToEvent(config.EVENTS.itemAdded, this.onItemAdded);
    TRC.TotoEventBus.bus.unsubscribeToEvent(config.EVENTS.currentListItemDeleted, this.onItemDeleted);
    TRC.TotoEventBus.bus.unsubscribeToEvent(config.EVENTS.currentListItemUpdated, this.onItemUpdated);
    TRC.TotoEventBus.bus.unsubscribeToEvent(config.EVENTS.itemGrabbed, this.onItemGrabbed);
  }

  /**
   * React to receiving the "item added" event by refreshing the list
   */
  onItemAdded(event) {
    // Refresh
    this.loadData();
  }

  /**
   * Reacts to the deletion of an item
   */
  onItemDeleted(event) {
    // Reload the data
    this.loadData();
  }

  /**
   * Reacts to the update of an item
   */
  onItemUpdated(event) {
    // Reload the data
    this.loadData();
  }

  /**
   * Reacts to the update of an item
   */
  onItemGrabbed(event) {
    // Remove the element from the list
    let list = this.state.items;

    for (var i = 0; i < list.length; i++) {
      if (list[i].name == event.context.item.name) {
        list.splice(i, 1);
        break;
      }
    }

    // Reset the state
    this.setState({items: []}, () => {this.setState({items: list})});
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
      this.setState({items: []}, () => {this.setState({items: items})});

    });
  }

  /**
   * Creates an item of the list
   */
  createItem(item) {

    let image = item.item.image != null ? item.item.image : defaultImage;
    let sign = item.item.note != null ? infoSign : null;

    return {
      title: item.item.name,
      avatar: {
        type: 'image',
        value: image
      },
      sign: sign
    }

  }

  /**
   * Renders the data
   */
  render() {

    // Show the empty message if the list is empty and if one has been set
    let emptyMessage;

    if ((this.state.items == null || this.state.items.length == 0) && this.props.titleOnEmpty != null) emptyMessage = (
      <View style={styles.emptyMessageContainer}>
        <TouchableOpacity style={styles.emptyMessageImageContainer}>
          <Image style={styles.emptyMessageImage} source={this.props.imageOnEmpty} />
        </TouchableOpacity>
        <Text style={styles.emptyMessageTitle}>{this.props.titleOnEmpty}</Text>
        <Text style={styles.emptyMessage}>{this.props.messageOnEmpty}</Text>
      </View>
    )

    return (

      <View>
        {emptyMessage}

        <TotoFlatList
              data={this.state.items}
              dataExtractor={this.createItem}
              onItemPress={this.props.onItemPress}
              />
      </View>
    )
  }

}

const styles = StyleSheet.create({
  container: {
  },
  rowContainer: {
    flexDirection: 'row'
  },
  emptyMessageContainer: {
    marginVertical: 32,
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  emptyMessageImageContainer: {
    borderColor: TRC.TotoTheme.theme.COLOR_THEME_DARK,
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  emptyMessageImage: {
    width: 48,
    height: 48,
    tintColor: TRC.TotoTheme.theme.COLOR_THEME_DARK,
  },
  emptyMessageTitle: {
    fontSize: 22,
    color: TRC.TotoTheme.theme.COLOR_TEXT,
    marginBottom: 12,
  },
  emptyMessage: {
    fontSize: 14,
    color: TRC.TotoTheme.theme.COLOR_TEXT,
    opacity: 0.8,
    textAlign: 'center'
  },
})
