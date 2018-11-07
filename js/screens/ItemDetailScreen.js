import React, {Component} from 'react';
import {Dimensions, StyleSheet, KeyboardAvoidingView, View, Text, TextInput, Image} from 'react-native';
import TotoIconButton from '../components/TotoIconButton';
import TRC from 'toto-react-components';
import SupermarketAPI from '../services/SupermarketAPI';

const windowWidth = Dimensions.get('window').width;

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
      item: props.navigation.getParam('item')
    }

    // Bind functions
    this.deleteItem = this.deleteItem.bind(this);
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
      TRC.TotoEventBus.bus.publishEvent({name: 'currentListItemDeleted', context: {item: this.state.item}});

      // Go Back
      this.props.navigation.goBack();
    });
  }

  /**
   * Render the component
   */
  render() {
    return (
      <KeyboardAvoidingView style={styles.container} behavior='height'>

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
                        multiline={true}
                        width={windowWidth - 90}
                        />
          </View>
        </View>

        <View style={styles.buttonsContainer}>

          <TotoIconButton   image={require('../../img/tick.png')} />
          <TotoIconButton   image={require('../../img/trash.png')}
                            onPress={this.deleteItem}
                            />

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
