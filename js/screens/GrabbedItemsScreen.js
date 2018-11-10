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

export default class GrabbedItemsScreen extends Component<Props> {

    // Define the Navigation options
    static navigationOptions = ({navigation}) => {

      return {
        headerLeft: null,
        headerStyle: {
          elevation: 0,
          backgroundColor: TRC.TotoTheme.theme.COLOR_THEME,
        },
        headerTitle: <TRC.TotoTitleBar
                        title="In your cart.."
                        color={TRC.TotoTheme.theme.COLOR_THEME}
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
   * Renders the home screen
   */
  render() {

    return (
      <View style={styles.container}>

        <StatusBar backgroundColor={TRC.TotoTheme.theme.COLOR_THEME} barStyle="default" />

        <SupermarketList  onItemPress={this.onSupermarketListItemPress}
                          style={{flex: 1}}
                          grabbed={true}
                          titleOnEmpty="You're done!"
                          messageOnEmpty="Press the 'done!' button to close the supermarket list and put the price!"
                          imageOnEmpty={require('../../img/tick.png')}
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
