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
                        />
      }
    }

  /**
   * Constructor of the Home Screen
   */
  constructor(props) {
    super(props);

    this.state = {
    }

    // Bindings
    this.onSupermarketListItemPress = this.onSupermarketListItemPress.bind(this);
  }

  /**
   * When the component mount
   */
  componentDidMount() {
    // Add event listeners
    // TRC.TotoEventBus.bus.subscribeToEvent(config.EVENTS.commonItemsRequested, this.showCommonItems)
  }

  componentWillUnmount() {
    // REmove event listeners
    // TRC.TotoEventBus.bus.unsubscribeToEvent(config.EVENTS.commonItemsRequested, this.showCommonItems)
  }

  /**
   * Called on item press.
   * Behavior depends whether there are notes on the item or not
   */
  onSupermarketListItemPress(item) {

    // If the item doesn't have notes, mark it as grabbed!
    if (item.item.note == null) {
      // Publish event
      TRC.TotoEventBus.bus.publishEvent({name: config.EVENTS.itemGrabbed, context: {item: item.item}});

      // Mark as grabbed
      new SupermarketAPI().grabItem(item.item.id);
    }
    // If the item has notes, go to the item detail screen
    else {
      this.props.navigation.navigate('ItemDetailScreen', {item: item.item, grabbable: true});
    }
  }

  /**
   * Renders the home screen
   */
  render() {

    return (
      <View style={styles.container}>

        <StatusBar backgroundColor={TRC.TotoTheme.theme.COLOR_THEME_DARK} barStyle="light-content" />

        <View style={styles.buttonContainer}>

          <TotoIconButton   image={require('../../img/tick.png')}
                            size='m'
                            />

          <TotoIconButton   image={require('../../img/trash.png')}
                            size='m'
                            />
        </View>

        <SupermarketList onItemPress={this.onSupermarketListItemPress} style={{flex: 1}}/>

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
