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

export default class HomeScreen extends Component<Props> {

    // Define the Navigation options
    static navigationOptions = ({navigation}) => {

      return {
        headerTitle: <TRC.TotoTitleBar
                        title='Supermarket List'
                        color={TRC.TotoTheme.theme.COLOR_THEME_DARK}
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
      currentListOpacity: 1,
      showCommonItems: false,
    }

    // Bindings
    this.showCommonItems = this.showCommonItems.bind(this);
    this.hideCommonItems = this.hideCommonItems.bind(this);
    this.onSupermarketListItemPress = this.onSupermarketListItemPress.bind(this);
    this.onExecuteButtonPress = this.onExecuteButtonPress.bind(this);
  }

  /**
   * When the component mount
   */
  componentDidMount() {
    // Add event listeners
    TRC.TotoEventBus.bus.subscribeToEvent(config.EVENTS.commonItemsRequested, this.showCommonItems)
    TRC.TotoEventBus.bus.subscribeToEvent(config.EVENTS.commonItemsDismissed, this.hideCommonItems)
  }

  componentWillUnmount() {
    // REmove event listeners
    TRC.TotoEventBus.bus.unsubscribeToEvent(config.EVENTS.commonItemsRequested, this.showCommonItems)
    TRC.TotoEventBus.bus.unsubscribeToEvent(config.EVENTS.commonItemsDismissed, this.hideCommonItems)
  }

  /**
   * When the supermarket item is pressed, go to the detail page
   */
  onSupermarketListItemPress(item) {

    // Navigate!
    this.props.navigation.navigate('ItemDetailScreen', {item: item.item});
  }

  /**
   * When the execute button is pressed
   */
  onExecuteButtonPress(item) {
    // Navigate
    this.props.navigation.navigate('ExecutionScreen');
  }

  /**
   * Show the common items bar
   */
  showCommonItems() {
    this.setState({
      showCommonItems: true
    })
  }

  /**
   * Show the common items bar
   */
  hideCommonItems() {
    this.setState({
      showCommonItems: false
    })
  }

  /**
   * Renders the home screen
   */
  render() {

    // Define the common items bar, that will be only visible
    // when you explicitly request it
    let dynamicCommonItemsBar;
    if (this.state.showCommonItems) dynamicCommonItemsBar = (<CommonItemsBar />);

    return (
      <View style={styles.container}>

        <StatusBar backgroundColor={TRC.TotoTheme.theme.COLOR_THEME_DARK} barStyle="light-content" />

        <SupermarketHeader onExecuteButtonPress={this.onExecuteButtonPress} />

        <CustomItem />

        {dynamicCommonItemsBar}

        <SupermarketList  onItemPress={this.onSupermarketListItemPress}
                          style={{flex: 1}}
                          titleOnEmpty="The list is empty!"
                          messageOnEmpty="Start adding groceries to the list by writing on the top part of the screen or by selecting one of the commonly used groceries.."
                          imageOnEmpty={require('../../img/carrot.png')}
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
