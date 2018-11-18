import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, TouchableOpacity, Image, Dimensions, StatusBar, TextInput, FlatList, Keyboard} from 'react-native';
import TRC from 'toto-react-components';
import TotoIconButton from '../components/TotoIconButton';
import TotoFlatList from '../components/TotoFlatList';
import SupermarketAPI from '../services/SupermarketAPI';
import * as config from '../Config';
import moment from 'moment';

const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;

const largeDevice = windowWidth > 600 ? true : false;

export default class PastListsScreen extends Component<Props> {

    // Define the Navigation options
    static navigationOptions = ({navigation}) => {

      return {
        headerLeft: null,
        headerStyle: {
          backgroundColor: TRC.TotoTheme.theme.COLOR_THEME,
        },
        headerTitle: <TRC.TotoTitleBar
                        title='Past lists'
                        back={true}
                        />
      }
    }

  /**
   * Constructor of the Home Screen
   */
  constructor(props) {
    super(props);

    this.state = {
      lists: []
    }

    // Bindings
    this.refreshData = this.refreshData.bind(this);
    this.onListSelect = this.onListSelect.bind(this);
    this.onListPaid = this.onListPaid.bind(this);
  }

  /**
   * When the component mount
   */
  componentDidMount() {
    // Add event listeners
    TRC.TotoEventBus.bus.subscribeToEvent(config.EVENTS.listPaid, this.onListPaid)

    // Load data
    this.refreshData();
  }

  componentWillUnmount() {
    // REmove event listeners
    TRC.TotoEventBus.bus.unsubscribeToEvent(config.EVENTS.listPaid, this.onListPaid);
  }

  /**
   * Refreshes the list
   */
  refreshData() {

    new SupermarketAPI().getPastLists().then((data) => {

      // Set the state
      if (this.state.lists.length == 0) this.setState({lists: data.lists});
      else list.setState({lists: []}, () => {this.setState({lists: data.lists})});

    });
  }

  /**
   * When a list is paid
   */
  onListPaid(event) {

    // Set the list as 'paid'
    let lists = [...this.state.lists];

    for (var i = 0; i < lists.length; i++) {
      if (lists[i].id == event.context.list.id) {
        lists[i].paid = true;
        break;
      }
    }

    // Update the state
    this.setState({lists: lists});
  }

  /**
   * Extracts the required data from the item
   */
  dataExtractor(item) {

    return {
      title: moment(item.item.date, 'YYYYMMDD').format('Do MMMM YYYY'),
      avatar: {
        type: 'number',
        value: parseFloat(item.item.cost),
        unit: 'DKK'
      },
      sign: item.item.paid ? require('../../img/tick.png') : null
    }
  }

  /**
   * Reacts to the click of an item
   */
  onListSelect(item) {

    this.props.navigation.navigate('PastListDetailScreen', {list: item.item});
  }

  /**
   * Renders the home screen
   */
  render() {

    return (
      <View style={styles.container}>

        <StatusBar backgroundColor={TRC.TotoTheme.theme.COLOR_THEME} barStyle="default" />

        <TotoFlatList data={this.state.lists}
                      dataExtractor={this.dataExtractor}
                      onItemPress={this.onListSelect}
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
    paddingTop: 12,
  },
});
