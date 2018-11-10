import React, {Component} from 'react';
import {Dimensions, StyleSheet, KeyboardAvoidingView, View, Text, TextInput, Image, StatusBar} from 'react-native';
import TotoIconButton from '../components/TotoIconButton';
import TRC from 'toto-react-components';
import SupermarketAPI from '../services/SupermarketAPI';
import user from '../User';
import * as config from '../Config';

const windowWidth = Dimensions.get('window').width;

export default class ExecutionCostScreen extends Component {

  // Define the Navigation options
  static navigationOptions = ({navigation}) => {

    return {
      headerStyle: {
        backgroundColor: TRC.TotoTheme.theme.COLOR_THEME
      },
      headerLeft: null,
      headerTitle: <TRC.TotoTitleBar
                      title='How much was it?'
                      back={true}
                      />
    }
  }

  constructor(props) {
    super(props);

    // Get the object from the navigation
    this.state = {
      cost: null
    }

    // Bind functions
    this.saveCost = this.saveCost.bind(this);
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
   * Saves the cost of the supermarket execution and closes the list
   */
  saveCost() {
    // Close the list
    new SupermarketAPI().closeList(this.state.cost).then(() => {

      // Throw the event
      TRC.TotoEventBus.bus.publishEvent({name: config.EVENTS.listClosed});

      // Go back to the home screen
      this.props.navigation.popToTop();

      // TODO : send a notification
    })
  }

  /**
   * Render the component
   */
  render() {

    return (
      <KeyboardAvoidingView style={styles.container} behavior='height'>

        <StatusBar backgroundColor={TRC.TotoTheme.theme.COLOR_THEME} barStyle="default" />

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Cost</Text>
          <TextInput  style={styles.inputValue}
                      onChangeText={(text) => this.setState({cost: text.replace(',', '.')})}
                      keyboardType='numeric' />
        </View>

        <View style={styles.buttonsContainer}>
          <TotoIconButton   image={require('../../img/tick.png')}
                            onPress={this.saveCost}
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
  inputContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    paddingVertical: 12,
  },
  inputLabel: {
    color: TRC.TotoTheme.theme.COLOR_TEXT,
    paddingBottom: 6,
  },
  inputValue: {
    color: TRC.TotoTheme.theme.COLOR_TEXT,
    width: 100,
    height: 100,
    borderRadius: 50,
    borderColor: TRC.TotoTheme.theme.COLOR_THEME_LIGHT,
    borderWidth: 6,
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    fontSize: 24
  },
  buttonsContainer: { 
    flexDirection: 'row',
    flex: 1,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
})
