import React, {Component} from 'react';
import {StatusBar, TouchableOpacity, StyleSheet, View, Text, TextInput, Image} from 'react-native';
import TRC from 'toto-react-components';
import SupermarketAPI from '../services/SupermarketAPI';
import TotoAPI from '../services/TotoAPI';
import foodCategories from '../services/FoodCategoriesAPI';
import * as config from '../Config';
import user from '../User';

export default class CategorizeScreen extends Component {

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
      pastListId: props.navigation.getParam('pastListId'),
      categories: []
    }

    // Bind functions
    this.loadCategories = this.loadCategories.bind(this);

  }

  /**
   * On component mount
   */
  componentDidMount() {

    // Load categories
    this.loadCategories();
  }

  /**
   * On component unmount
   */
  componentWillUnmount() {

  }

  /**
   * Retrieve the lists of categories from the /diet API
   */
  loadCategories() {

    // Call the API
    new TotoAPI().fetch('/diet/categories').then((response) => response.json()).then((data) => {

      this.setState({categories: data.categories});

    })

  }

  /**
   * Update the item with the provided category
   */
  updateCategory(categoryId) {

    // Call the API to update the category of the element
    // If it is a past list, update that element
    if (this.state.pastListId) new SupermarketAPI().updateItemOfPastList(this.state.pastListId, this.state.item.name, categoryId, user.userInfo.email);
    // If it's the current list, call another API
    else new SupermarketAPI().updateItemOfCurrentList(this.state.item.id, {itemName: this.state.item.name, category: categoryId, userEmail: user.userInfo.email});

    // throw event
    TRC.TotoEventBus.bus.publishEvent({name: config.EVENTS.itemCategorized, context: {itemName: this.state.item.name, newCategoryId: categoryId}});

    // Go back
    this.props.navigation.goBack();

  }

  /**
   * Builds the elements for picking the categories
   */
  buildCategories(cats) {

    if (cats == null) return;

    let components = [];

    // For each category, get the image and create a button to pick it
    for (var i = 0; i < cats.length; i++) {

      // Get the image
      let image = foodCategories.getImage(cats[i].id);

      let img = image.img;

      let key = image.categoryId;

      // Build the component
      let cmp = (
        <TouchableOpacity key={key} style={styles.categoryContainer} onPress={() => this.updateCategory(image.categoryId)}>
          {img}
        </TouchableOpacity>
      )

      // Add the component to the categories component
      components.push(cmp);
    }

    return components;

  }

  /**
   * Render the component
   */
  render() {

    // Define the categories
    let categories = this.buildCategories(this.state.categories);

    return (
      <View style={styles.container}>

        <Text style={styles.instr}>Pick the new category!</Text>

        <View style={styles.categoriesContainer} horizontal={true} >

          <StatusBar backgroundColor={TRC.TotoTheme.theme.COLOR_THEME} barStyle="default" />

          {categories}

        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: TRC.TotoTheme.theme.COLOR_THEME,
    paddingVertical: 12,
    paddingHorizontal: 6,
    alignItems: 'center',
  },
  instr: {
    color: TRC.TotoTheme.theme.COLOR_TEXT + 50,
    fontSize: 16,
    textAlign: 'center',
  },
  categoriesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginVertical: 12,
  },
  categoryContainer: {
    margin: 12,
    padding: 12,
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: TRC.TotoTheme.theme.COLOR_TEXT,
  },

})
