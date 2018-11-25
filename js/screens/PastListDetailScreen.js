import React, {Component} from 'react';
import {StyleSheet, Text, View, Image, Dimensions, StatusBar} from 'react-native';
import TRC from 'toto-react-components';
import TotoIconButton from '../components/TotoIconButton';
import TotoFlatList from '../components/TotoFlatList';
import TotoCircleValue from '../components/TotoCircleValue';
import SupermarketAPI from '../services/SupermarketAPI';
import ExpensesAPI from '../services/ExpensesAPI';
import * as config from '../Config';
import moment from 'moment';
import foodCategories from '../services/FoodCategoriesAPI';

const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;
const defaultImage = require('../../img/groceries/groceries-bag.png');
const infoSign = require('../../img/info.png');

const largeDevice = windowWidth > 600 ? true : false;

export default class PastListDetailScreen extends Component<Props> {

    // Define the Navigation options
    static navigationOptions = ({navigation}) => {

      return {
        headerLeft: null,
        headerStyle: {
          backgroundColor: TRC.TotoTheme.theme.COLOR_THEME,
        },
        headerTitle: <TRC.TotoTitleBar
                        title={moment(navigation.getParam('list').date, 'YYYYMMDD').format('Do MMM YYYY')}
                        back={true}
                        />
      }
    }

  /**
   * Constructor of the Home Screen
   */
  constructor(props) {
    super(props);

    this.state = {
      list: props.navigation.getParam('list'),
    }

    // Bindings
    this.pay = this.pay.bind(this);
    this.onListPaid = this.onListPaid.bind(this);
    this.refreshData = this.refreshData.bind(this);
    this.onListItemPress = this.onListItemPress.bind(this);
    this.onItemCategorized = this.onItemCategorized.bind(this);
  }

  /**
   * When the component mount
   */
  componentDidMount() {
    // Add event listeners
    TRC.TotoEventBus.bus.subscribeToEvent(config.EVENTS.listPaid, this.onListPaid);
    TRC.TotoEventBus.bus.subscribeToEvent(config.EVENTS.itemCategorized, this.onItemCategorized);

    // Load data
    this.refreshData();
  }

  componentWillUnmount() {
    // REmove event listeners
    TRC.TotoEventBus.bus.unsubscribeToEvent(config.EVENTS.listPaid, this.onListPaid);
    TRC.TotoEventBus.bus.unsubscribeToEvent(config.EVENTS.itemCategorized, this.onItemCategorized);
  }

  /**
   * When an item gets categorized, update pictures
   */
  onItemCategorized(event) {

    // Get the data from the event
    let itemName = event.context.itemName;
    let categoryId = event.context.newCategoryId;

    let items = this.state.items.slice(0);

    // Find the right item and update it
    for (var i = 0; i < items.length; i++) {

      if (items[i].name == itemName) items[i].category = categoryId;

    }

    // Update the state
    this.setState({items: items});

  }

  /**
   * Refreshes the list
   */
  refreshData() {

    // Get the list items
    new SupermarketAPI().getPastList(this.state.list.id).then((data) => {

      // Update the state with the list items
      this.setState({items: data.items});

      // Retrieve the expense detail
      if (data.paymentId) {

        new ExpensesAPI().getExpense(data.paymentId).then((payment) => {
          // Update the state
          this.setState({payment: payment});
        });
      }
    });
  }

  /**
   * Triggers the payment of the list
   */
  pay() {

    new SupermarketAPI().payList(this.state.list).then((data) => {

      // Trigger an event
      TRC.TotoEventBus.bus.publishEvent({name: config.EVENTS.listPaid, context: {list: this.state.list}});
    })

  }

  /**
   * Reacts to the LIST PAID event
   */
  onListPaid(event) {

    let list = {...this.state.list};

    // Update the paid property of the list
    list.paid = true;

    // 1. Updates the list
    this.setState({
      list: list
    }, () => {

      // 2. Refresh the detail of the list
      setTimeout(this.refreshData, 1500);
    });
  }

  /**
   * Extract the data for the items of the list
   */
  itemDataExtractor(item) {

    let image = item.item.image != null ? item.item.image : defaultImage;
    let sign = item.item.note != null ? infoSign : null;

    return {
      title: item.item.name,
      avatar: {
        type: 'image',
      },
      sign: sign
    }

  }

  /**
   * When a list item gets pressed, go to the detail
   */
  onListItemPress(item) {
    // Navigate!
    this.props.navigation.navigate('ItemDetailScreen', {item: item.item, pastListId: this.state.list.id});
  }

  /**
   * Image loader for the avatar of the list items
   */
  avatarImageLoader(item) {

    let categoryId = item.item.category;

    let img = foodCategories.getImage(categoryId);

    let image = img != null ? img.img20 : (
      <Image source={defaultImage} style={{width: 20, height: 20, tintColor: TRC.TotoTheme.theme.COLOR_TEXT}} />
    );

    return image;

  }

  /**
   * Renders the home screen
   */
  render() {

    // Button: can be the indicator that the list has been paid or a button to pay
    let payButton;

    if (this.state.list.paid) payButton = (
      <TotoIconButton image={require('../../img/tick.png')} size='m' label='PAID'/>
    )
    else payButton = (
      <TotoIconButton image={require('../../img/dollar.png')} size='m' onPress={this.pay} label='PAY!'/>
    )

    // Payment detail element
    // only visible if there is a payment
    let paymentDetail;

    if (this.state.payment != null) paymentDetail = (
      <View style={styles.paymentContainer}>
        <View style={styles.paymentImgContainer}>
          <Image source={require('../../img/expenses.png')} style={{width: 28, height: 28, tintColor: TRC.TotoTheme.theme.COLOR_THEME_LIGHT}} />
        </View>
        <View style={{flex: 1, marginRight: 12, justifyContent: 'center'}}>
          <Text style={styles.paymentDesc}>{this.state.payment.description}</Text>
          <Text style={styles.paymentCat}>{this.state.payment.category}</Text>
        </View>
        <View style={{alignItems: 'flex-end', justifyContent: 'center'}}>
          <View style={{flexDirection: 'row', alignItems: 'flex-end'}}>
            <Text style={styles.paymentCurrency}>{this.state.payment.currency}</Text>
            <Text style={styles.paymentAmount}>{this.state.payment.amount != null ? this.state.payment.amount.toFixed(2) : ''}</Text>
          </View>
          <View style={{flexDirection: 'row', alignItems: 'flex-end'}}>
            <Text style={styles.paymentCurrencyEuro}>€</Text>
            <Text style={styles.paymentAmountEuro}>{this.state.payment.amountInEuro != null ? this.state.payment.amountInEuro.toFixed(2) : ''}</Text>
          </View>
        </View>
      </View>
    )
    else paymentDetail = (<View style={{height: 12}}></View>)

    return (
      <View style={styles.container}>

        <View style={{flexDirection: 'row'}}>
          <View style={{flex: 1, justifyContent: 'center'}}>
            <TotoCircleValue  width={windowWidth/2}
                              height={120}
                              radius={50}
                              radiusWidth={6}
                              color={TRC.TotoTheme.theme.COLOR_THEME_LIGHT}
                              value={parseFloat(this.state.list.cost)}
                              unit='DKK'
                              />
          </View>
          <View style={{flex: 1, justifyContent: 'center'}}>
            {payButton}
          </View>
        </View>

        {paymentDetail}

        <TotoFlatList data={this.state.items}
                      dataExtractor={this.itemDataExtractor}
                      onItemPress={this.onListItemPress}
                      avatarImageLoader={this.avatarImageLoader}
                      />

      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    backgroundColor: TRC.TotoTheme.theme.COLOR_THEME,
    paddingTop: 24,
  },
  paymentContainer: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingVertical: 24,
    marginVertical: 12,
    backgroundColor: TRC.TotoTheme.theme.COLOR_THEME_DARK + 50
  },
  paymentImgContainer: {
    marginRight: 12,
    borderColor: TRC.TotoTheme.theme.COLOR_THEME_LIGHT,
    borderWidth: 2,
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center'
  },
  paymentDesc: {
    fontSize: 16,
    color: TRC.TotoTheme.theme.COLOR_TEXT,
  },
  paymentCat: {
    fontSize: 10,
    color: TRC.TotoTheme.theme.COLOR_TEXT,
    opacity: 0.8,
    marginTop: 3,
  },
  paymentCurrency: {
    fontSize: 10,
    color: TRC.TotoTheme.theme.COLOR_TEXT,
    marginRight: 3,
  },
  paymentAmount: {
    fontSize: 16,
    color: TRC.TotoTheme.theme.COLOR_TEXT,
  },
  paymentCurrencyEuro: {
    fontSize: 8,
    color: TRC.TotoTheme.theme.COLOR_TEXT,
    opacity: 0.9,
    marginRight: 3,
  },
  paymentAmountEuro: {
    fontSize: 10,
    color: TRC.TotoTheme.theme.COLOR_TEXT,
    opacity: 0.9,
  },
});
