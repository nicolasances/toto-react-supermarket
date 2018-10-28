import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, TouchableOpacity, Image, Dimensions, StatusBar, TextInput, FlatList} from 'react-native';
import TRC from 'toto-react-components';
import CurrentSupermarketListPreview from '../components/CurrentSupermarketListPreview';
import TotoIconButton from '../components/TotoIconButton';

const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;

const largeDevice = windowWidth > 600 ? true : false;


export default class HomeScreen extends Component<Props> {

    // Define the Navigation options
    static navigationOptions = ({navigation}) => {

      return {
        headerTitle: <TRC.TotoTitleBar
                        title='Supermarket List'
                        />
      }
    }

  /**
   * Constructor of the Home Screen
   */
  constructor(props) {
    super(props);

    this.state = {
      commonItems: [
        {name: 'Chicken'},
        {name: 'Milk'},
        {name: 'Eggs'},
        {name: 'Zucchine'},
        {name: 'Broccoli'},
      ]
    }
  }

  /**
   * Renders the home screen
   */
  render() {

    return (
      <View style={styles.container}>

        <StatusBar backgroundColor={TRC.TotoTheme.theme.COLOR_THEME} barStyle="light-content" />

        <View style={{flex: 1, alignItems: 'center'}}>

          <View style={styles.addSomeContainer}>
            <Image style={styles.addSomeImage} source={require('../../img/write.png')} />
            <TextInput
              style={styles.addSomeText}
              onChangeText={this.onChangeName}
              keyboardType='default'
              autoCapitalize='sentences'
              placeholder='Add some to the supermarket list!'
              placeholderTextColor={TRC.TotoTheme.theme.COLOR_TEXT + '50'}
              />
          </View>

          <FlatList style={styles.pickSomeContainer}
                    horizontal={true}
                    data={this.state.commonItems}
                    renderItem={(item) => <TouchableOpacity style={styles.pickSomeItemContainer}><Text style={styles.pickSomeItemText}>{item.item.name}</Text></TouchableOpacity>}
                    keyExtractor={(item, index) => 'picksomeitem-' + index + '-' + Math.random()}
                    />

        </View>

        <View style={styles.currentListContainer}>
          <CurrentSupermarketListPreview />
        </View>

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
