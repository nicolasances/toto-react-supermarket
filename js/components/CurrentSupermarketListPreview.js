import React, {Component} from 'react';
import {FlatList, View, StyleSheet, Text, Dimensions, ScrollView, Platform, TouchableOpacity, Image} from 'react-native';
import TRC from 'toto-react-components';
import TotoFlatList from './TotoFlatList';
import Swiper from 'react-native-swiper';
import DietAPI from '../services/DietAPI';

const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;

const largeDevice = windowWidth > 600 ? true : false;

export default class CurrentSupermarketListPreview extends Component {

  constructor(props) {
    super(props);

    // Initializes the state
    this.state = {
      items: []
    }

  }

  componentDidMount() {
    this.loadData();
  }

  loadData() {

    let items = [
          {name: 'Carrots', category: 'vegetables'},
          {name: 'Vasellina'},
          {name: 'Dog Shit bags'},
          {name: 'Aspirin and very much stuff', category: 'bread'},
          {name: 'Bed'},
          {name: 'Broccoli', category: 'vegetables'},
          {name: 'Eggs', category: 'dairy'},
          {name: 'Sbirulini'},
          {name: 'Sbirulinaaaai'},
          {name: 'Sbiruldasdasdini'},
          {name: 'Sbir ulini'},
          {name: 'Bed'},
          {name: 'Broccoli', category: 'vegetables'},
          {name: 'Eggs', category: 'dairy'},
          {name: 'Sbirulini'},
          {name: 'Sbirulinaaaai'},
          {name: 'Sbiruldasdasdini'},
          {name: 'Sbir ulini'},
          {name: 'Bed'},
          {name: 'Broccoli'},
          {name: 'Eggs'},
          {name: 'Sbirulini'},
          {name: 'Sbirulinaaaai'},
          {name: 'Sbiruldasdasdini'},
          {name: 'Sbir ulini'},
    ];

    let api = new DietAPI();
    let defaultImage = require('../../img/groceries/groceries-bag.png');

    for (var i = 0; i < items.length; i++) {

      let category = api.getGroceryCategory(items[i].category);

      items[i].image = category == null ? defaultImage : category.image;
    }

    this.setState({
      items: items
    })
  }

  createViews(items) {

    const itemsPerPage = largeDevice ? 10 : 8;
    const numOfPages = Math.ceil(items.length / itemsPerPage);

    let pages = [];

    for (var i = 0; i < numOfPages; i++) {

      let pageItems = [];

      for (var j = 0; j < itemsPerPage; j++) {

        let item = items[i * itemsPerPage + j];

        if (item != null) {

          let compKey = 'Comp-' + j + '-' + Math.random();
          let comp = (
            <TouchableOpacity style={styles.itemContainer} key={compKey}>
              <View style={styles.avatarContainer}>
                <Image source={item.image} style={styles.avatarImage} />
              </View>
              <Text style={styles.itemText}>{item.name}</Text>
            </TouchableOpacity>
          )

          pageItems.push(comp);
        }
      }

      let pageKey = 'Page-' + i + '-' + Math.random();
      let pageComp = (
        <View style={styles.page} key={pageKey}>
          {pageItems}
        </View>
      )

      pages.push(pageComp);

    }

    return pages;

  }

  render() {

    let views = this.createViews(this.state.items);

    return (
      <Swiper style={styles.container} showsPagination={true}>
        {views}
      </Swiper>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: TRC.TotoTheme.theme.COLOR_THEME_DARK + 50,
  },
  page: {
    width: windowWidth,
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingTop: 24,
    paddingHorizontal: 12,
    justifyContent: 'center',
  },
  itemContainer: {
    flexDirection: 'row',
    margin: 6,
    paddingHorizontal: 12,
    height: largeDevice ? 40 : 30,
    borderRadius: largeDevice ? 20 : 115,
    alignItems: 'center',
    backgroundColor: TRC.TotoTheme.theme.COLOR_ACCENT,
  },
  avatarContainer: {
    backgroundColor: TRC.TotoTheme.theme.COLOR_ACCENT_DARK,
    marginLeft: -12,
    borderTopLeftRadius: largeDevice ? 20 : 15,
    borderBottomLeftRadius: largeDevice ? 20 : 15,
    width: largeDevice ? 40 : 30,
    height: largeDevice ? 40 : 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarImage: {
    width: largeDevice ? 20 : 15,
    height: largeDevice ? 20 : 15,
    tintColor: TRC.TotoTheme.theme.COLOR_TEXT,
  },
  itemText: {
    color: TRC.TotoTheme.theme.COLOR_TEXT,
    fontSize: largeDevice ? 16 : 14,
    marginLeft: 12,
  },
})
