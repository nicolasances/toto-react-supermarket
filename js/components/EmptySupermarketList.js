import React, {Component} from 'react';
import {StyleSheet, View, Text, Image} from 'react-native';
import TRC from 'toto-react-components';

export default class EmptySupermarketList extends Component {

  constructor(props) {
    super(props);
  }

  /**
   * Renders this component
   */
  render() {

    return (
      <View style={styles.container}>
        <Text style={styles.mainText}>The Supermarket List is empty!!</Text>
        <Text style={styles.instructions}>Add an item by writing on the top part of the screen or by selecting one of the commonly used groceries..</Text>
        <Image source={require('../../img/carrot.png')} style={styles.image} />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 12,
  },
  mainText: {
    fontSize: 18,
    color: TRC.TotoTheme.theme.COLOR_TEXT,
    marginBottom: 6,
  },
  instructions: {
    fontSize: 12,
    color: TRC.TotoTheme.theme.COLOR_TEXT,
    opacity: 0.8
  },
  image: {
    width: 80,
    height: 80,
    marginVertical: 32,
    opacity: 0.5
  },
})
