import React, {Component} from 'react';
import {StatusBar, Dimensions, StyleSheet, KeyboardAvoidingView, View, Text, TextInput, Image, Platform} from 'react-native';
import TotoIconButton from '../components/TotoIconButton';
import TRC from 'toto-react-components';
import SupermarketAPI from '../services/SupermarketAPI';
import user from '../User';
import * as config from '../Config';

const windowWidth = Dimensions.get('window').width;

const android = Platform.OS == 'android';

export default class ItemDetailScreen extends Component {

  // Define the Navigation options
  static navigationOptions = ({navigation}) => {

    return {
      headerStyle: {
        backgroundColor: TRC.TotoTheme.theme.COLOR_THEME
      },
      headerLeft: null,
      headerTitle: <TRC.TotoTitleBar
                      title={navigation.getParam('item').name}
                      back={true}
                      />
    }
  }

  constructor(props) {
    super(props);

    // Get the object from the navigation
    this.state = {
      item: props.navigation.getParam('item'),
      itemNote: props.navigation.getParam('item').note,
    }

    // Set some props
    this.grabbable = props.navigation.getParam('grabbable');

    // Bind functions
    this.deleteItem = this.deleteItem.bind(this);
    this.updateItem = this.updateItem.bind(this);
    this.grabItem = this.grabItem.bind(this);

  }

  /**
   * On component mount
   */
  componentDidMount() {

  }

  /**
   * On component unmount
   */
  componentWillUnmount() {

  }

  /**
   * Deletes the item from the supermarket list
   */
  deleteItem() {
    // Delete the item
    new SupermarketAPI().deleteItemFromCurrentList(this.state.item.id).then(() => {

      // Throw the right event
      TRC.TotoEventBus.bus.publishEvent({name: config.EVENTS.currentListItemDeleted, context: {item: this.state.item}});

      // Go Back
      this.props.navigation.goBack();
    });
  }

  /**
   * Updates the item of the supermarket list
   */
  updateItem() {

    // Define the data
    let data = {
      note: this.state.itemNote,
      noteBy: user.userInfo.email,
      noteByGivenName: user.userInfo.givenName
    }

    // Update
    new SupermarketAPI().updateItemOfCurrentList(this.state.item.id, data).then(() => {

      // Throw the right event
      TRC.TotoEventBus.bus.publishEvent({name: config.EVENTS.currentListItemUpdated, context: {item: this.state.item}});

      // Go Back
      this.props.navigation.goBack();
    });
  }

  /**
   * Grab the item and remove it from the supermarket list
   */
  grabItem() {
    // Publish event
    TRC.TotoEventBus.bus.publishEvent({name: config.EVENTS.itemGrabbed, context: {item: this.state.item}});

    // Mark as grabbed
    new SupermarketAPI().grabItem(this.state.item.id);

    // Go back
    this.props.navigation.goBack();
  }

  /**
   * Render the component
   */
  render() {

    // Define the buttons that can be shown
    let buttons = [];

    // If the item is grabbable, then it means this detail screen is opened as
    // part of the execution of the list, then only show the "grab" button
    if (this.grabbable) {
      buttons.push((
        <TotoIconButton   image={require('../../img/add-to-cart.png')}
                          onPress={this.grabItem}
                          key='GrabItem-detail'
                          />
      ))
    }
    // If the item is not grabbable, show the "save" and "delete" buttons
    else {
      buttons.push((
        <TotoIconButton   image={require('../../img/tick.png')}
                          onPress={this.updateItem}
                          key='UpdateItem-detail'
                          />
      ));
      buttons.push((
        <TotoIconButton   image={require('../../img/trash.png')}
                          onPress={this.deleteItem}
                          key='DeleteItem-detail'
                          />
      ));
    }

    // Manually categorize
    buttons.push((
      <TotoIconButton   image={require('../../img/carrot.png')}
                        onPress={() => {this.props.navigation.navigate('CategorizeScreen', {item: this.state.item})}}
                        key='CategorizeItem'
                        />
    ));

    return (
      <KeyboardAvoidingView style={styles.container} behavior={android ? null : 'height'}>

        <StatusBar backgroundColor={TRC.TotoTheme.theme.COLOR_THEME} barStyle="default" />

        <View style={styles.noteContainer}>

          <Image  style={styles.noteImage}
                  source={require('../../img/user.png')} />

          <Image  style={styles.noteArrowImage}
                  source={require('../../img/left-arrow.png')} />

          <View style={styles.noteTextContainer}>
            <TextInput  style={styles.noteText}
                        keyboardType='default'
                        autoCapitalize='sentences'
                        placeholder='There are no notes for this item'
                        placeholderTextColor={TRC.TotoTheme.theme.COLOR_TEXT + '40'}
                        onChangeText={(text) => {this.setState({itemNote: text})}}
                        value={this.state.itemNote}
                        multiline={true}
                        width={windowWidth - 90}
                        />
          </View>
        </View>

        <View style={styles.buttonsContainer}>
          {buttons}
        </View>


      </KeyboardAvoidingView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: TRC.TotoTheme.theme.COLOR_THEME,
    paddingVertical: 12,
  },
  noteContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 12,
  },
  noteImage: {
    width: 32,
    height: 32,
    tintColor: TRC.TotoTheme.theme.COLOR_THEME_LIGHT,
  },
  noteArrowImage: {
    width: 16,
    height: 16,
    marginRight: -5,
    marginTop: 4,
    tintColor: TRC.TotoTheme.theme.COLOR_THEME_LIGHT,
  },
  noteTextContainer: {
    backgroundColor: TRC.TotoTheme.theme.COLOR_THEME_LIGHT,
    borderRadius: 5,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  noteText: {
    color: TRC.TotoTheme.theme.COLOR_TEXT
  },
  buttonsContainer: { 
    flexDirection: 'row',
    flex: 1,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
})
