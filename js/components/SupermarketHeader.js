import React, {Component} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import TRC from 'toto-react-components';
import Swiper from 'react-native-swiper';
import TotoIconButton from './TotoIconButton';

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
