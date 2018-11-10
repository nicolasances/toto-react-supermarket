import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, TouchableOpacity, Image, Dimensions, StatusBar, TextInput, FlatList, Keyboard} from 'react-native';
import TRC from 'toto-react-components';
import TotoIconButton from '../components/TotoIconButton';
import CustomItem from '../components/CustomItem';
import CommonItemsBar from '../components/CommonItemsBar';
import SupermarketList from '../components/SupermarketList';
import SupermarketHeader from '../components/SupermarketHeader';
import SupermarketAPI from '../services/SupermarketAPI';
import * as config from '../Config';

const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;

const largeDevice = windowWidth > 600 ? true : false;

export default class ExecutionScreen extends Component<Props> {

    // Define the Navigation options
    static navigationOptions = ({navigation}) => {

      return {
        headerLeft: null,
        headerStyle: {
          elevation: 0,
          backgroundColor: TRC.TotoTheme.theme.COLOR_THEME_DARK,
        },
        headerTitle: <TRC.TotoTitleBar
                        title="Let's shop!"
                        color={TRC.TotoTheme.theme.COLOR_THEME_DARK}
                        back={true}
                        titleColor={TRC.TotoTheme.theme.COLOR_TEXT_LIGHT}
                        />
      }
    }

  /**
   * Constructor of the Home Screen
   */
  constructor(props) {
    super(props);

    this.state = {
      itemsCount: 0,
      grabbedItemsCount: 0
    }

    // Bindings
    this.onSupermarketListItemPress = this.onSupermarketListItemPress.bind(this);
    this.navigateToExecutionCost = this.navigateToExecutionCost.bind(this);
    this.getCurrentList = this.getCurrentList.bind(this);
    this.onItemGrabbed = this.onItemGrabbed.bind(this);
  }

  /**
   * When the component mount
   */
  componentDidMount() {
    // Load data
    this.getCurrentList();

    // Add event listeners
    TRC.TotoEventBus.bus.subscribeToEvent(config.EVENTS.itemGrabbed, this.onItemGrabbed);
  }

  /**
   * Unmounting
   */
  componentWillUnmount() {

    // Remove event listeners
    TRC.TotoEventBus.bus.unsubscribeToEvent(config.EVENTS.itemGrabbed, this.onItemGrabbed);
  }

  /**
   * Reacts to the update of an item
   */
  onItemGrabbed(event) {
    // Refresh the counts
    this.getCurrentList();
  }

  /**
   * Retrieve the current supermarket list
   */
  getCurrentList() {

    new SupermarketAPI().getItemsFromCurrentList().then((data) => {

      let grabbedItemsCount = 0;

      // Count the number of grabbed items
      for (var i = 0; i < data.items.length; i++) {

          if (data.items[i].grabbed) grabbedItemsCount++;
      }

      // Update the state
      this.setState({
        itemsCount: data.items.length,
        grabbedItemsCount: grabbedItemsCount
      })
    })
  }

  /**
   * Called on item press.
   * Behavior depends whether there are notes on the item or not
   */
  onSupermarketListItemPress(item) {

    // If the item doesn't have notes, mark it as grabbed!
    if (item.item.note == null) {
      // Mark as grabbed
      new SupermarketAPI().grabItem(item.item.id).then(() => {

        // Publish event
        TRC.TotoEventBus.bus.publishEvent({name: config.EVENTS.itemGrabbed, context: {item: item.item}});
      });
    }
    // If the item has notes, go to the item detail screen
    else {
      this.props.navigation.navigate('ItemDetailScreen', {item: item.item, grabbable: true});
    }
  }

  /**
   * Navigate to execution cost screen
   */
  navigateToExecutionCost() {
    this.props.navigation.navigate('ExecutionCostScreen');
  }

  /**
   * Renders the home screen
   */
  render() {

    // Buttons
    let doneButton;
    let cartButton;

    // Show the done button only if the current list has some items (grabbed or not, it doesn't matter)
    if (this.state.itemsCount > 0) doneButton = (
      <TotoIconButton   image={require('../../img/tick.png')}
                        size='m'
                        onPress={() => {this.props.navigation.navigate('ExecutionCostScreen')}}
                        label='Done!'
                        />
    )

    // Show the cart button only if the current list has some items (grabbed)
    if (this.state.grabbedItemsCount > 0) cartButton = (
      <TotoIconButton   image={require('../../img/add-to-cart.png')}
                        size='m'
                        label='Items in cart'
                        onPress={() => {this.props.navigation.navigate('GrabbedItemsScreen')}}
                        />
    )

    return (
      <View style={styles.container}>

        <StatusBar backgroundColor={TRC.TotoTheme.theme.COLOR_THEME_DARK} barStyle="light-content" />

        <View style={styles.buttonContainer}>
          {doneButton}
          {cartButton}
        </View>

        <SupermarketList  onItemPress={this.onSupermarketListItemPress}
                          style={{flex: 1}}
                          titleOnEmpty="You're done!"
                          messageOnEmpty="Press the 'done!' button to close the supermarket list and put the price!"
                          imageOnEmpty={require('../../img/tick.png')}
                          onImageOnEmptyPress={this.navigateToExecutionCost}
                          />

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
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: TRC.TotoTheme.theme.COLOR_THEME_DARK,
    paddingVertical: 24,
    marginBottom: 12,
  }
});
