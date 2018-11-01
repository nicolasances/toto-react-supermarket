import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, TouchableOpacity, Image, Dimensions, StatusBar, TextInput, FlatList, Keyboard} from 'react-native';
import TRC from 'toto-react-components';
import CurrentSupermarketListPreview from '../components/CurrentSupermarketListPreview';
import TotoIconButton from '../components/TotoIconButton';
import CustomItem from '../components/CustomItem';
import SupermarketList from '../components/SupermarketList';
import SupermarketHeader from '../components/SupermarketHeader';
import SupermarketAPI from '../services/SupermarketAPI';
import * as config from '../Config';

const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;

const largeDevice = windowWidth > 600 ? true : false;


export default class HomeScreen extends Component<Props> {

    // Define the Navigation options
    static navigationOptions = ({navigation}) => {

      return {
        headerTitle: <TRC.TotoTitleBar
                        title='Supermarket List'
                        color={TRC.TotoTheme.theme.COLOR_THEME_DARK}
                        />
      }
    }

  /**
   * Constructor of the Home Screen
   */
  constructor(props) {
    super(props);

    this.state = {
      currentListOpacity: 1,
      commonItems: []
    }

    // Bindings
    this.showCurrentList = this.showCurrentList.bind(this);
    this.hideCurrentList = this.hideCurrentList.bind(this);
    this.addCommonItemToList = this.addCommonItemToList.bind(this);
    this.onItemAdded = this.onItemAdded.bind(this);
    this.onItemRemoved = this.onItemRemoved.bind(this);

    // Load the commonly used items
    this.loadCommonItems();
  }

  /**
   * When the component mount
   */
  componentDidMount() {
    // Add keyboard listeners
    this.keyboardWillShowListener = Keyboard.addListener('keyboardWillShow', this.hideCurrentList);
    this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this.showCurrentList);

    // Add event listeners
    TRC.TotoEventBus.bus.subscribeToEvent(config.EVENTS.itemAdded, this.onItemAdded);
    TRC.TotoEventBus.bus.subscribeToEvent(config.EVENTS.itemRemoved, this.onItemRemoved);
  }

  componentWillUnmount() {
    this.keyboardWillShowListener.remove();
    this.keyboardDidHideListener.remove();

    // REmove event listeners
    TRC.TotoEventBus.bus.unsubscribeToEvent(config.EVENTS.itemAdded, this.onItemAdded);
    TRC.TotoEventBus.bus.unsubscribeToEvent(config.EVENTS.itemRemoved, this.onItemRemoved);
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
   * Shows the current supermarket list
   */
  hideCurrentList() {

    this.setState({
      currentListOpacity: 0
    })
  }

  /**
   * Hides the current supermarket list
   */
  showCurrentList() {

    this.setState({
      currentListOpacity: 1
    })
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
   * Reacts to items added to the supermarket list.
   * Basically:
   * - if the item added is a common item, remove it from the common items list
   */
  onItemAdded(event) {

    // If the item added is a common item, refresh the common items list (to have it removed)
    if (event.context != null && event.context.item != null) this.loadCommonItems()
  }

  /**
   * React to receiving the "item removed" event by refreshing the list
   * of common items
   */
  onItemRemoved(event) {
    // Refresh
    this.loadCommonItems()
  }

  /**
   * Renders the home screen
   */
  render() {

    return (
      <View style={styles.container}>

        <StatusBar backgroundColor={TRC.TotoTheme.theme.COLOR_THEME_DARK} barStyle="light-content" />

        <SupermarketHeader />

        <CustomItem />

        <SupermarketList />

      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    backgroundColor: TRC.TotoTheme.theme.COLOR_THEME,
  },
  currentListContainer: {
    height: 250,
  },
  addSomeContainer: {
    marginVertical: 24,
    alignItems: 'center',
  },
  addSomeImage: {
    width: 48,
    height: 48,
    tintColor: TRC.TotoTheme.theme.COLOR_THEME_DARK,
    marginBottom: 12,
  },
  addSomeText: {
    fontSize: 16,
    borderBottomColor: TRC.TotoTheme.theme.COLOR_THEME_DARK,
    borderBottomWidth: 1,
    paddingBottom: 6
  },
  pickSomeItemContainer: {
    margin: 6,
    paddingHorizontal: 12,
    height: largeDevice ? 40 : 30,
    borderRadius: largeDevice ? 20 : 115,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: TRC.TotoTheme.theme.COLOR_THEME_LIGHT,
  },
  pickSomeItemText: {
    color: TRC.TotoTheme.theme.COLOR_TEXT,
    fontSize: largeDevice ? 16 : 14,
  },
});
