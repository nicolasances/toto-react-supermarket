import React, {Component} from 'react';
import {View, TouchableOpacity, Image, StyleSheet} from 'react-native';
import TRC from 'toto-react-components';

/*+
 * Displays a button as a circle with an icon inside
 * Requires:
 * - onPress        : function called when the button is pressed
 * - secondary      : true if the button should be a secondary button
 * - image          : the image to use
 * - size           : (optional, default: 'm') can be 'l', 'xl', 'm'
 */
export default class TotoIconButton extends Component {

  /*+
   * Constructor
   */
  constructor(props) {
    super(props);
  }

  /**
   * Render the component
   */
  render() {

    let containerSize = 48;
    let iconSize = 20;

    // Change the size based on the 'size' prop
    if (this.props.size == 'l') {
      containerSize = 60;
      iconSize = 32;
    }
    else if (this.props.size == 'xl') {
      containerSize = 72;
      iconSize = 38;
    }

    // Define the sizeStyles
    let containerSizeStyle = {width: containerSize, height: containerSize, borderRadius: containerSize / 2};
    let iconSizeStyle = {width: iconSize, height: iconSize};

    return (

      <TouchableOpacity style={[styles.container, containerSizeStyle]} onPress={this.props.onPress}>
        <Image style={[styles.image, iconSizeStyle]} source={this.props.image} />
      </TouchableOpacity>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: TRC.TotoTheme.theme.COLOR_ACCENT,
    marginHorizontal: 6,
  },
  image: {
    tintColor: TRC.TotoTheme.theme.COLOR_ACCENT,
  },
});
