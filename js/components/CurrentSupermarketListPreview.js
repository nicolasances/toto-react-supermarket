import React, {Component} from 'react';
import {FlatList, View, StyleSheet, Text, Dimensions, ScrollView, Platform, TouchableOpacity, Image} from 'react-native';
import TRC from 'toto-react-components';
import TotoFlatList from './TotoFlatList';
import Swiper from 'react-native-swiper';
import DietAPI from '../services/DietAPI';
import SupermarketAPI from '../services/SupermarketAPI';
import EmptySupermarketList from './EmptySupermarketList';
import * as config from '../Config';

const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;

const largeDevice = windowWidth > 600 ? true : false;

const defaultImage = require('../../img/groceries/groceries-bag.png');

export default class CurrentSupermarketListPreview extends Component {

  /**
   * Constructor for the class
   */
  constructor(props) {
    super(props);

    // Initializes the state
    this.state = {
      items: []
    }

    // Bind this
    this.loadData = this.loadData.bind(this);
    this.onItemAdded = this.onItemAdded.bind(this);
    this.deleteItem = this.deleteItem.bind(this);
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
   * Deletes the specified item from the current list
   */
  deleteItem(item) {

    new SupermarketAPI().deleteItemFromCurrentList(item).then(() => {

      // Reload the data
      this.loadData();

      // Publish the event
      TRC.TotoEventBus.bus.publishEvent({name: config.EVENTS.itemRemoved});
    });
  }

  /**
   * Create the pages containing the items in the current supermarket list
   */
  createPages(items) {

    if (items == null || items.length == 0) return;

    // Define the number of items per page and the number of pages, based on the device
    const itemsPerPage = largeDevice ? 10 : 8;
    const numOfPages = Math.ceil(items.length / itemsPerPage);

    // Pages container
    let pages = [];

    // For every page, fill it
    for (var i = 0; i < numOfPages; i++) {

      // Page items
      let pageItems = [];

      // Pick the number of items to put in the page
      for (var j = 0; j < itemsPerPage; j++) {

        // Pick the next item
        let item = items[i * itemsPerPage + j];

        // If there is one..
        if (item != null) {

          // Define the item key
          let compKey = 'Comp-' + j + '-' + Math.random();

          // Define the item rendered component
          let comp = (
            <TouchableOpacity style={styles.itemContainer} key={compKey} onPress={() => {this.deleteItem(item.id)}}>
              <View style={styles.avatarContainer}>
                <Image source={item.image} style={styles.avatarImage} />
              </View>
              <Text style={styles.itemText}>{item.name}</Text>
            </TouchableOpacity>
          )

          // Push the item to the page
          pageItems.push(comp);
        }
      }

      // Define the page key
      let pageKey = 'Page-' + i + '-' + Math.random();

      // DEfine the page rendered element
      let pageComp = (
        <View style={styles.page} key={pageKey}>
          {pageItems}
        </View>
      )

      // Add the page to the pages list
      pages.push(pageComp);

    }

    // Return the pages
    return pages;
  }

  /**
   * Renders the component
   */
  render() {

    // Retrieve the pages
    let pages = this.createPages(this.state.items);

    let swiper;

    if (pages != null) {
      swiper = (
        <Swiper showsPagination={true}>
          {pages}
        </Swiper>
      )
    }

    // Define the "Empty list " element
    let emptyList;

    if (pages == null) {
        emptyList = (
          <EmptySupermarketList />
        )
    }

    return (
      <View style={styles.container} >
        {swiper}
        {emptyList}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: TRC.TotoTheme.theme.COLOR_THEME_DARK + 50,
    flex: 1,
  },
  page: {
    width: windowWidth,
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingTop: 24,
    paddingHorizontal: 12,
    justifyContent: 'center',
  },
  itemContainer: {
    flexDirection: 'row',
    margin: 6,
    paddingHorizontal: 12,
    height: largeDevice ? 40 : 30,
    borderRadius: largeDevice ? 20 : 115,
    alignItems: 'center',
    backgroundColor: TRC.TotoTheme.theme.COLOR_ACCENT,
  },
  avatarContainer: {
    backgroundColor: TRC.TotoTheme.theme.COLOR_ACCENT_DARK,
    marginLeft: -12,
    borderTopLeftRadius: largeDevice ? 20 : 15,
    borderBottomLeftRadius: largeDevice ? 20 : 15,
    width: largeDevice ? 40 : 30,
    height: largeDevice ? 40 : 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarImage: {
    width: largeDevice ? 20 : 15,
    height: largeDevice ? 20 : 15,
    tintColor: TRC.TotoTheme.theme.COLOR_TEXT,
  },
  itemText: {
    color: TRC.TotoTheme.theme.COLOR_TEXT,
    fontSize: largeDevice ? 16 : 14,
    marginLeft: 12,
  },
})
