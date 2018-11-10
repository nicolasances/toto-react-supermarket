import React, {Component} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import TRC from 'toto-react-components';
import Swiper from 'react-native-swiper';
import TotoIconButton from './TotoIconButton';

/**
 * Header of the supermarket home page
 * Properties:
 * - onExecuteButtonPress     : callback function to be called when the button to start executing the list is pressed
 */
export default class SupermarketHeader extends Component {

  constructor(props) {
    super(props);

    // Set default properties
    this.height = this.props.height == null ? 120 : this.props.height;
  }

  render() {
    return (
      <View style={styles.container} height={this.height}>
        <Swiper showsPagination={false}>

          <View style={styles.overviewContainer}>

            <TotoIconButton
                  image={require('../../img/supermarket.png')}
                  size='xl'
                  onPress={this.props.onExecuteButtonPress}
                  />

          </View>

        </Swiper>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: TRC.TotoTheme.theme.COLOR_THEME_DARK,
  },
  overviewContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  }
})
