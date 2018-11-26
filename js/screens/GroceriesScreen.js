import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, Image, TouchableOpacity} from 'react-native';
import GroceriesList from '../components/GroceriesList';
import * as config from '../Config';
import TRC from 'toto-react-components';

/**
 * Shows the list of groceries
 * Accepts the following NAVIGATION PARAMS:
 * - selectionMode     :  an object that specifies if the selection mode is active of the food and provide required additional params:
 *                        { active : true/false,
 *                          referer : the name of the referer screen as registered in the Route provider}
 */
export default class GroceriesScreen extends Component<Props> {

  // Define the Navigation options
  static navigationOptions = ({navigation}) => {

    return {
      headerLeft: null,
      headerTitle: <TRC.TotoTitleBar
                      title={navigation.getParam('categoryName')}
                      back={true}
                      rightButton={
                        { image: require('../../img/add.png'),
                          navData: {
                            screen: 'GroceryDetail',
                            data: {
                              categoryId: navigation.getParam('category')
                            }
                          }
                        }
                      }
                      />

    }
  }

  constructor(props) {
    super(props);

    this.selectionMode = this.props.navigation.getParam('selectionMode');

    this.onItemPress = this.onItemPress.bind(this);
  }

  /**
   * Function to be called when an item of the grocery list is pressed
   */
  onItemPress(item) {

    // If selection mode is enabled
    if (this.selectionMode && this.selectionMode.active) {

      // Publish the event that the grocery has been clicked
      TRC.TotoEventBus.bus.publishEvent({name: config.EVENTS.grocerySelected, context: {grocery: item.item}});

      // Navigate back to the selection screen
      this.props.navigation.goBack(this.selectionMode.referer);
    }
  }

  /**
   * Renders this screen
   */
  render() {
    return (
      <View style={styles.container}>

        <GroceriesList category={this.props.navigation.getParam('category')} onItemPress={this.onItemPress}/>

      </View>
    );
  }
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignContent: 'flex-start',
    backgroundColor: TRC.TotoTheme.theme.COLOR_THEME,
  },
});
