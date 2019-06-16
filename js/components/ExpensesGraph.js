import React, {Component} from 'react';
import {Animated, Text, View, StyleSheet, Dimensions, ART} from 'react-native';
import * as scale from 'd3-scale';
import * as shape from 'd3-shape';
import * as array from 'd3-array';
import * as path from 'd3-path';
import TRC from 'toto-react-components';
import ExpensesAPI from '../services/ExpensesAPI';
import TotoLineChart from './TotoLineChart';
import moment from 'moment';
import user from '../User';

const {Group, Shape, Surface} = ART;
const d3 = {scale, shape, array, path};
const window = Dimensions.get('window');

export default class ExpensesGraph extends Component {

  constructor(props) {
    super(props);

    // Define default width and height
    this.width = window.width;
    this.height = (this.props.height ? this.props.height : 250) - 12; // 12 cause I want some padding on the top

    // The view can be 'years', 'months', 'weeks'
    // Years means that the graph will show the last x years
    // Months means that the graph will show the last x months
    // Weeks means that the graph will show the last x weeks
    this.view = this.props.view == null ? 'years' : this.props.view;

    // Prospection: the meaning depends of the "view" property
    this.prospection = this.props.prospection == null ? 2 : this.props.prospection;

    // Bind functions
    this.refreshData = this.refreshData.bind(this);
    this.onDataLoaded = this.onDataLoaded.bind(this);
    this.xAxisLabel = this.xAxisLabel.bind(this);

    // Init state
    this.state = {
      charData: []
    }
  }

  /**
   * Load component stuff
   */
  componentDidMount() {

    // Load the data for the graph
    this.refreshData();
  }

  /**
   * Unmount stuff
   */
  componentWillUnmount() {

  }

  /**
   * Reloads the data from the APIs
   */
  refreshData() {

    if (this.view == 'years') {

      let yearMonthGte = moment().subtract(this.prospection * 12, 'months').format('YYYYMM');

      // TODO : replace with a getSupermarketExpensesPerMonth
      // Get the weekly expenses for SUPERMARKET
      if (user && user.userInfo)
        new ExpensesAPI().getSupermarketExpensesPerMonth(user.userInfo.email, yearMonthGte).then(this.onDataLoaded);
    }
    else if (this.view == 'months') {
      // Get the weekly expenses
      new ExpensesAPI().getSupermarketExpensesPerWeek(this.prospection * 4).then(this.onDataLoaded);
    }
    else {
      // Get the weekly expenses
      new ExpensesAPI().getSupermarketExpensesPerWeek(this.prospection).then(this.onDataLoaded);
    }
  }

  /**
   * When the data is loaded, create the chart data and put it in the state
   */
  onDataLoaded(data) {

    if (data == null) return;

    let chartData = [];

    for (var i = 0; i < data.months.length; i++) {

      let month = data.months[i];

      chartData.push({
        x: new Date(moment(month.yearMonth + '01', 'YYYYMMDD')),
        y: month.amount
      });
    }

    this.setState({chartData: []}, () => {this.setState({chartData: chartData})});

  }

  /**
   * Defines the label of the x axis for the specified datum.
   * Only shows the values when it's the month change: the goal is to show the months
   */
  xAxisLabel(datum) {

    let date = moment(datum);
    let month = date.format('M');
    let monthOfPreviousWeek = date.subtract(7, 'days').format('M');

    if (month != monthOfPreviousWeek) {

      if (this.view == 'years') return moment(datum).format('MMM').substring(0, 1)
      else return moment(datum).format('MMM')
    }

  }

  render() {

    return (
      <View style={styles.container}>
        <TotoLineChart  data={this.state.chartData}
                        height={this.height}
                        showValuePoints={this.view != 'years'}
                        valuePointsBackground={TRC.TotoTheme.theme.COLOR_THEME_DARK}
                        valuePointsSize={3}
                        leaveMargins={this.view != 'years'}
                        xAxisTransform={this.xAxisLabel}
                        yLines={this.view == 'years' ? [100, 200] : [100]}
                        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 12
  },
});
