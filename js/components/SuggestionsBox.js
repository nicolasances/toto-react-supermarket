import React, {Component} from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Animated, Dimensions, Easing, ScrollView, Platform, TextInput, Image} from 'react-native';
import { Header } from 'react-navigation';
import TRC from 'toto-react-components';
import TotoIconButton from './TotoIconButton';
import Swiper from 'react-native-swiper';

const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;
const headerHeight = Header.HEIGHT;
const androidAdditionalHeight = Platform.OS == 'android' ? 24 : 0;

class SuggestionsBox extends Component {

  /**
   * Constructor
   */
  constructor(props) {
    super(props);

    this.state = {
      animatedTop: new Animated.Value(windowHeight),
      top: windowHeight - headerHeight,
      commonItems: [
        {name: 'Chicken'},
        {name: 'Milk'},
        {name: 'Eggs'},
        {name: 'Zucchine'},
        {name: 'Broccoli'},
        {name: 'Onions'},
        {name: 'Carots'},
        {name: 'Bacon i tern'},
        {name: 'Bacon slices'},
        {name: 'Bread'},
        {name: 'Greek Yogurt'}
      ]
    }

    // Add a listener to the animatedTop to update the top value of the box
    this.state.animatedTop.addListener((progress) => {
      this._container.setNativeProps({top: progress.value});
    });

    // Define the default sizes
    this.buttonsContainerHeight = 48 + 12 + 12 + androidAdditionalHeight;
    this.commonItemsContainerHeight = this.props.height == null ? 150 : this.props.height;
    this.height = this.commonItemsContainerHeight + this.buttonsContainerHeight;

    // Bind functions to this
    this.onAddItemClicked = this.onAddItemClicked.bind(this);
    this.onCloseBox = this.onCloseBox.bind(this);
    this.onNewItemFocus = this.onNewItemFocus.bind(this);
    this.onNewItemBlur = this.onNewItemBlur.bind(this);
  }

  /**
   * When the component mounts..
   * - listen to events
   */
  componentDidMount() {
    TRC.TotoEventBus.bus.subscribeToEvent('addItemClicked', this.onAddItemClicked);
  }

  /**
   * When the component unmounts, remove the event listeners
   */
  componentWillUnmount() {
    TRC.TotoEventBus.bus.unsubscribeToEvent('addItemClicked', this.onAddItemClicked);
  }

  /**
   * Shows the box if not already shown
   */
  onAddItemClicked(event) {
    // If the component is not already there...
    if (this.state.top == windowHeight - headerHeight) {
      Animated.timing(this.state.animatedTop, {
        toValue: windowHeight - this.height - headerHeight,
        easing: Platform.OS == 'android' ? Easing.linear : Easing.bounce,
        duration: Platform.OS == 'android' ? 100 : 1000,
        useNativeDriver: true,
      }).start();
    }
  }

  /**
   * Close the suggestion box
   */
  onCloseBox() {
    // Animate back
    Animated.timing(this.state.animatedTop, {
      toValue: windowHeight - headerHeight,
      easing: Easing.linear,
      duration: 100,
      useNativeDriver: true,
    }).start();

  }

  /**
   * Invoked when the user focus goes on the text input to inser a new item
   */
  onNewItemFocus() {
    Animated.timing(this.state.animatedTop, {
      toValue: 0,
      easing: Easing.linear,
      duration: 100,
      useNativeDriver: true,
    }).start();
  }

  onNewItemBlur() {
    Animated.timing(this.state.animatedTop, {
      toValue: windowHeight - this.height - headerHeight,
      easing: Easing.linear,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }

  /**
   * Create the tags for the common selected items
   */
  createCommonItems(items) {

    let shapes = [];

    for (var i = 0; i < items.length; i++) {

      let key = items[i].name + '-' + Math.random();

      let shape = (
        <TouchableOpacity key={key} style={styles.tagContainer}>
          <Text style={styles.tagText}>{items[i].name}</Text>
        </TouchableOpacity>
      )

      shapes.push(shape);
    }

    return shapes;
  }

  /**
   * Renders the component
   */
  render() {
    // List of commonly picked items
    let commonItems = this.createCommonItems(this.state.commonItems);

    return (
      <ScrollView style={styles.container}
                  ref={component => this._container = component}
                  top={this.state.top}
                  height={this.height}
                  pagingEnabled={true}
                  horizontal={true}
                  >

        <View style={{width: windowWidth}}>
          <View style={styles.commonItemsContainer}>
            <View style={styles.tagsContainer}>
              {commonItems}
            </View>
          </View>

          <View style={styles.buttonsContainer}>
            <TotoIconButton
                  image={require('../../img/close.png')}
                  label='Close'
                  onPress={this.onCloseBox}
                  />
          </View>
        </View>

        <View style={{width: windowWidth}}>
          <View style={styles.nameTextInputContainer}>
            <TextInput
              style={styles.nameTextInput}
              onChangeText={this.onChangeName}
              keyboardType='default'
              autoCapitalize='sentences'
              placeholder='Write the grocery name here'
              placeholderTextColor={TRC.TotoTheme.theme.COLOR_TEXT + '50'}
              onFocus={this.onNewItemFocus}
              onBlur={this.onNewItemBlur}
              />
          </View>

          <View style={styles.newButtonsContainer}>
            <TotoIconButton
                image={require('../../img/close.png')}
                label='Close'
                onPress={this.onCloseBox}
                />
            <TotoIconButton
                image={require('../../img/tick.png')}
                label='Add'
                onPress={this.onAddCustomItem}
                 />
          </View>
        </View>

      </ScrollView>
    )
  }
}

export default Animated.createAnimatedComponent(SuggestionsBox);

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    shadowColor: "#000",
    shadowOffset: {
	      width: 0,
	      height: 9,
    },
    shadowOpacity: 0.60,
    shadowRadius: 12,
    elevation: 15,
    backgroundColor: TRC.TotoTheme.theme.COLOR_THEME_DARK,
  },
  buttonsContainer: {
    alignItems: 'center',
    flex: 1,
  },
  commonItemsContainer: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 9,
    justifyContent: 'center',
  },
  tagContainer: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginHorizontal: 3,
    marginVertical: 3,
    borderRadius: 12,
    backgroundColor: TRC.TotoTheme.theme.COLOR_THEME
  },
  tagText: {
    fontSize: 14,
    color: TRC.TotoTheme.theme.COLOR_TEXT
  },
  nameTextInputContainer: {
    marginTop: 48,
    marginBottom: 24,
    alignItems: 'center',
  },
  nameTextInput: {
    fontSize: 18,
    color: TRC.TotoTheme.theme.COLOR_TEXT,
    textAlign: 'center',
    borderBottomColor: TRC.TotoTheme.theme.COLOR_THEME,
    borderBottomWidth: 1,
    width: 250
  },
  newButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 48,
  },
});
