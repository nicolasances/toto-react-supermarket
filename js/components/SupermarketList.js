import React, {Component} from 'react';
import {ScrollView, View, Text, StyleSheet, Image, TouchableOpacity, AppState} from 'react-native';
import TRC from 'toto-react-components';
import SupermarketAPI from '../services/SupermarketAPI';
import TotoFlatList from './TotoFlatList';
import TotoIconButton from './TotoIconButton';
import * as config from '../Config';
import foodCategories from '../services/FoodCategoriesAPI';

const defaultImage = require('../../img/groceries/groceries-bag.png');
const infoSign = require('../../img/info.png');

/**
 * Shows the current supermarket list
 * Props:
 *
 * - onItemPress          : (optional) function to be called when an item is pressed
 * - titleOnEmpty         : (optional) the title to show when the list is empty
 * - messageOnEmpty       : (optional) the message to show when the list is empty
 * - imageOnEmpty         : (optional) the image to show when the list is empty
 * - grabbed              : (optional, default = false) true to show the items that
 *                          have been grabbed and put in the cart
 * - onImageOnEmptyPress  : (optional) callback to call when the image on empty is pressed
 * - searchAction         : (optioanl, default = null) if I can search in the groceries list, this is the action that will
 *                          be called when pressing the search button.
 */
export default class SupermarketList extends Component {

  constructor(props) {
    super(props);

    // App state init
    this.appState = AppState.currentState;

    // State init
    this.state = {
      items: [],
    }

    // Default values
    this.grabbed = this.props.grabbed != null ? this.props.grabbed : false;

    // Bind this
    this.loadData = this.loadData.bind(this);
    this.onItemAdded = this.onItemAdded.bind(this);
    this.createItem = this.createItem.bind(this);
    this.onItemDeleted = this.onItemDeleted.bind(this);
    this.onItemAdded = this.onItemAdded.bind(this);
    this.onItemUpdated = this.onItemUpdated.bind(this);
    this.onItemGrabbed = this.onItemGrabbed.bind(this);
    this.onSearchPress = this.onSearchPress.bind(this);
    this.handleAppStateChange = this.handleAppStateChange.bind(this);
    this.hasChanged = this.hasChanged.bind(this);
    this.refreshList = this.refreshList.bind(this);
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

    // Register to App State changes
    AppState.addEventListener('change', this.handleAppStateChange);

    // Start a timer to refresh the data
    this.timer = setInterval(this.loadData, 3000);
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

    // Un-Register to App State changes
    AppState.removeEventListener('change', this.handleAppStateChange);

    // Clear the timer that refreshes the data
    clearInterval(this.timer);
  }

  /**
   * Handles changes in the App state.
   * If the app is brought from background to active, check if the list has changed and in case refresh the list.
   */
  handleAppStateChange(nextAppState) {

    // If the new state is 'active', reload the supermarket list
    if (this.appState.match(/inactive|background/) && nextAppState == 'active') {

      // Reload the list
      this.loadData();
    }

    // Set the new State
    this.appState = nextAppState;
  }

  /**
   * Checks if the supermarket list has changed.
   * Compares the this.state.items list with the provided list.
   */
  hasChanged(items) {

    if (items == null) return true;
    if (this.state == null || this.state.items == null) return true;

    // If the length of the list has changed, then the list has definitely changed!
    if (items.length != this.state.items.length) return true;

    // Compare each item
    for (var i = 0; i < items.length; i++) {

      if (items[i].name != this.state.items[i].name ||
          items[i].note != this.state.items[i].note ||
          items[i].grabbed != this.state.items[i].grabbed ||
          items[i].category != this.state.items[i].category)
          return true;

    }

    return false;
  }

  /**
   * Refreshes the supermarket list with the provided items
   */
  refreshList(items) {

    if (items == null) return;

    // Update the state with the retrieved items
    this.setState({items: []}, () => {this.setState({items: items})});

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
   * When the seach button is pressed, call the appropriate action
   */
  onSearchPress() {

    if (!this.props.searchAction) return;

    // Go to the grocery selection
    this.props.searchAction();
  }

  /**
   * Loads the data from the API.
   * Checks if the data has changed with the current version present in this.state.items
   */
  loadData() {

    // Call the API to retrieve the items of the current supermarket list
    new SupermarketAPI().getItemsFromCurrentList(this.grabbed).then((data) => {

      // Check if the list has changed
      if (this.hasChanged(data.items)) {

        // Refresh the list
        this.refreshList(data.items);
      }

    });
  }

  /**
   * Creates an item of the list
   */
  createItem(item) {

    let sign = item.item.note != null ? infoSign : null;

    return {
      title: item.item.name,
      avatar: {
        type: 'image'
      },
      sign: sign
    }

  }

  /**
   * Image loader for the specified item
   */
  avatarImageLoader(item) {

    let categoryId = item.item.category;

    let img = foodCategories.getImage(categoryId);

    let image = img != null ? img.img20 : (
      <Image source={defaultImage} style={{width: 20, height: 20, tintColor: TRC.TotoTheme.theme.COLOR_TEXT}} />
    );

    return image;

  }

  /**
   * Renders the data
   */
  render() {

    // Show the empty message if the list is empty and if one has been set
    let emptyMessage;

    if ((this.state.items == null || this.state.items.length == 0) && this.props.titleOnEmpty != null) emptyMessage = (
      <View style={styles.emptyMessageContainer}>
        <TouchableOpacity style={styles.emptyMessageImageContainer} onPress={this.props.onImageOnEmptyPress}>
          <Image style={styles.emptyMessageImage} source={this.props.imageOnEmpty} />
        </TouchableOpacity>
        <Text style={styles.emptyMessageTitle}>{this.props.titleOnEmpty}</Text>
        <Text style={styles.emptyMessage}>{this.props.messageOnEmpty}</Text>
      </View>
    )

    // Show the search button if this list is modifiable
    let searchButton;

    let searchButtonStyle = {alignItems: 'flex-start', paddingHorizontal: 3, paddingVertical: 6};

    if (emptyMessage) searchButtonStyle.alignItems = 'center';

    if (this.props.searchAction) searchButton = (
      <View style={searchButtonStyle}>
        <TotoIconButton size='m'
                        image={require('../../img/search.png')}
                        onPress={this.onSearchPress}
                        />
      </View>
    )

    return (

      <ScrollView showsVerticalScrollIndicator={false}>
        {emptyMessage}

        <TotoFlatList
              data={this.state.items}
              dataExtractor={this.createItem}
              onItemPress={this.props.onItemPress}
              avatarImageLoader={this.avatarImageLoader}
              />

        {searchButton}

      </ScrollView>
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
