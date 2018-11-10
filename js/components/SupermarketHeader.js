import React, {Component} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import TRC from 'toto-react-components';
import Swiper from 'react-native-swiper';
import TotoIconButton from './TotoIconButton';
import SupermarketAPI from '../services/SupermarketAPI';

/**
 * Header of the supermarket home page
 * Properties:
 * - onExecuteButtonPress     : callback function to be called when the button to start executing the list is pressed
 */
export default class SupermarketHeader extends Component {

  constructor(props) {
    super(props);

    this.state = {
      lastCost: null
    }

    // Set default properties
    this.height = this.props.height == null ? 120 : this.props.height;
  }

  /**
   * When mounted
   */
  componentDidMount() {
    // Load the data
    this.loadData();
  }

  /**
   * Loads the data
   */
  loadData() {

    new SupermarketAPI().getLastList().then((data) => {

      if (data.lists == null || data.lists.length == 0) return;

      // Set the last cost in the state
      this.setState({
        lastCost: parseFloat(data.lists[0].cost).toFixed(2)
      });

    })
  }

  /**
   * Renders the component
   */
  render() {

    // Left area of the header
    let left = (
      <View style={{flex: 1}}></View>
    );

    if (this.state.lastCost != null) left = (
      <TouchableOpacity style={styles.lastCostContainer}>
        <Text style={styles.lastCostLabel}>Last cost</Text>
        <Text style={styles.lastCostValue}>{this.state.lastCost}</Text>
      </TouchableOpacity>
    )

    return (
      <View style={styles.container} height={this.height}>
        <Swiper showsPagination={false}>

          <View style={styles.overviewContainer}>

            {left}

            <View style={styles.buttonContainer}>
              <TotoIconButton
                    image={require('../../img/supermarket.png')}
                    size='xl'
                    onPress={this.props.onExecuteButtonPress}
                    />
            </View>

            <View style={{flex: 1}}></View>

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
  },
  buttonContainer: {
    flex: 1,
    alignItems: 'center'
  },
  lastCostContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  lastCostLabel: {
    fontSize: 10,
    color: TRC.TotoTheme.theme.COLOR_TEXT_LIGHT,
  },
  lastCostValue: {
    fontSize: 20,
    color: TRC.TotoTheme.theme.COLOR_ACCENT,
  },
})
