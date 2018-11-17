import React, {Component} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native';
import TRC from 'toto-react-components';
import Swiper from 'react-native-swiper';
import TotoIconButton from './TotoIconButton';
import SupermarketAPI from '../services/SupermarketAPI';
import ExpensesGraph from './ExpensesGraph';
import * as config from '../Config';

/**
 * Header of the supermarket home page
 * Properties:
 * - onExecuteButtonPress     : callback function to be called when the button to start executing the list is pressed
 */
export default class SupermarketHeader extends Component {

  constructor(props) {
    super(props);

    this.state = {
      lastCost: null,
      currentListItemsCount: 0
    }

    // Set default properties
    this.height = this.props.height == null ? 120 : this.props.height;

    this.getCurrentList = this.getCurrentList.bind(this);
    this.onItemAdded = this.onItemAdded.bind(this);
    this.onItemDeleted = this.onItemDeleted.bind(this);
    this.onListClosed = this.onListClosed.bind(this);

  }

  /**
   * When mounted
   */
  componentDidMount() {
    // Load the data
    this.loadData();
    this.getCurrentList();

    // Events
    TRC.TotoEventBus.bus.subscribeToEvent(config.EVENTS.itemAdded, this.onItemAdded);
    TRC.TotoEventBus.bus.subscribeToEvent(config.EVENTS.currentListItemDeleted, this.onItemDeleted);
    TRC.TotoEventBus.bus.subscribeToEvent(config.EVENTS.listClosed, this.onListClosed);
  }

  /**
   * When unmounting
   */
  componentWillUnmount() {

    // Unregister to events
    TRC.TotoEventBus.bus.unsubscribeToEvent(config.EVENTS.itemAdded, this.onItemAdded);
    TRC.TotoEventBus.bus.unsubscribeToEvent(config.EVENTS.currentListItemDeleted, this.onItemDeleted);
    TRC.TotoEventBus.bus.unsubscribeToEvent(config.EVENTS.listClosed, this.onListClosed);
  }

  /**
   * React to receiving the "item added" event by refreshing the list
   */
  onItemAdded(event) {
    // Refresh
    this.getCurrentList();
  }

  /**
   * Reacts to the deletion of an item
   */
  onItemDeleted(event) {
    // Reload the data
    this.getCurrentList();
  }

  /**
   * React to receiving the "item added" event by refreshing the list
   */
  onListClosed(event) {
    // Refresh
    this.loadData();
    this.getCurrentList();
  }

  /**
   * Loads the data
   */
  loadData() {

    new SupermarketAPI().getLastList().then((data) => {

      if (data.lists == null || data.lists.length == 0) return;

      // Set the last cost in the state
      this.setState({
        lastCost: parseFloat(data.lists[0].cost).toFixed(2)
      });

    })
  }

  /**
   * Retrieves the list of current items and defines if the button should be disabled
   */
  getCurrentList() {

    new SupermarketAPI().getItemsFromCurrentList().then((data) => {

      this.setState({
        currentListItemsCount: data.items.length
      });
    })
  }

  /**
   * Renders the component
   */
  render() {


    return (
      <View style={styles.container} >
        <Swiper showsPagination={false}>

          <ExpensesGraph height={140} view='years' prospection={2} />

          <ExpensesGraph height={140} view='months' prospection={5} />

        </Swiper>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: TRC.TotoTheme.theme.COLOR_THEME_DARK,
    height: 140,
  },
})
