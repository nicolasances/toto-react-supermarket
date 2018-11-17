import React, {Component} from 'react';
import {Animated, Easing, View, Text, ART, Dimensions, StyleSheet} from 'react-native';
import * as scale from 'd3-scale';
import * as shape from 'd3-shape';
import * as array from 'd3-array';
import * as path from 'd3-path';
import moment from 'moment';
import TRC from 'toto-react-components';

const {Group, Shape, Surface} = ART;
const d3 = {scale, shape, array, path};
const window = Dimensions.get('window');

/**
 * Creates a bar chart
 * Requires the following:
 * - data                   : the data to create the chart in the following form:
     *                        [ { x: numeric, x value,
 *                                y: numeric, y value,
 *                                   temporary: boolean, optional, if true will highlight this element as a temporary one
 *                              }, {...} ]
 * - valueLabelTransform    : a function, optional, (value) => {transforms the value to be displayed on the bar (top part)}
 * - xAxisTransform         : a function to be called with the x axis value to generate a label to put on the bar (bottom part)
 * - height                 : (optional, default 250), height of the chart
 * - showValuePoints        : (optional, default true), shows the value points (circles)
 * - valuePointsBackground  : (optional, default THEME color), defines the background color of the value points (Circles)
 * - valuePointsSize        : (optional, default 6), defines the radius of the circle value points
 * - curveCardinal          : (optional, default true), shows the curve as a curve cardinal. If set to false it will use the basic curve (curveLinear)
 * - leaveMargins           : (optional, default true), leave a 24 margin horizontally on each side of tthe graph
 * - areaColor              : (optional, default no color), colors the area underlying the graph with the specified color
 * - yLines                 : (optional) the y values for which to draw a horizontal line (to show the scale)
 *                            if passed, it's an [y1, y2, y3, ...]
 *                            each value will correspond to a horizontal line
 */
export default class TotoLineChart extends Component {

  /**
   * Constructor
   */
  constructor(props) {
    super(props);

    // Init the state!
    this.state = {
      data: null,
      yLines: [],
      // Graph settings
      settings: {
        lineColor: TRC.TotoTheme.theme.COLOR_THEME_LIGHT,
        valueLabelColor: TRC.TotoTheme.theme.COLOR_TEXT,
        valueCircleColor: TRC.TotoTheme.theme.COLOR_THEME_LIGHT,
      }
    }

    // Default properties
    this.showValuePoints = this.props.showValuePoints == null ? true : this.props.showValuePoints;
    this.curveCardinal = this.props.curveCardinal == null ? true : this.props.curveCardinal;
    this.graphMargin = (this.props.leaveMargins == null || this.props.leaveMargins) ? 24 : -2;
    this.areaColor = this.props.areaColor;
    this.valuePointsBackground = this.props.valuePointsBackground == null ? TRC.TotoTheme.theme.COLOR_THEME : this.props.valuePointsBackground;
    this.valuePointsSize = this.props.valuePointsSize == null ? 6 : this.props.valuePointsSize;

  }

  /**
   * Mount the component
   */
  componentDidMount() {
    this.mounted = true;
  }

  /**
  * Unmount the component
  */
  componentWillUnmount() {
    this.mounted = false;
  }

  /**
   * Receives updated properties
   */
  componentWillReceiveProps(props) {

    // Set height
    this.height = props.height == null ? 250 : props.height;

    // Set the barWidth
    if (!this.mounted) return;

    if (props.data == null || props.data.length == 0) return;

    // Define the min and max x values
    let xMin = d3.array.min(props.data, (d) => {return d.x});
    let xMax = d3.array.max(props.data, (d) => {return d.x});

    // Define the min and max y values
    let yMin = d3.array.min(props.data, (d) => {return d.y});
    let yMax = d3.array.max(props.data, (d) => {return d.y});

    // Update the scales
    this.x = d3.scale.scaleLinear().range([this.graphMargin, window.width - this.graphMargin]).domain([xMin, xMax]);
    this.y = d3.scale.scaleLinear().range([0, this.height - this.valuePointsSize - 12]).domain([0, yMax]);

    // Update the state with the new data
    this.setState({data: [], yLines: []}, () => {this.setState({data: props.data, yLines: props.yLines})});

  }
  /**
   * Creates the horizontal y scale lines as requested in the property yLines
   */
  createYLines(ylines) {

    if (ylines == null) return;

    let shapes = [];

    for (var i = 0; i < ylines.length; i++) {

      let line = d3.shape.line()
          .x((d) => {return d.x})
          .y((d) => {return d.y});

      let path = line([{x: 0, y: this.height - this.y(ylines[i])}, {x: window.width, y: this.height - this.y(ylines[i])}]);

      shapes.push(this.createShape(path, TRC.TotoTheme.theme.COLOR_THEME_LIGHT + 50, null, 1));
    }

    return shapes;

  }

  /**
   * Creates the labels to put on the ylines, if any
   */
  createYLinesLabels(ylines) {

    if (ylines == null) return;

    let shapes = [];

    for (var i = 0; i < ylines.length; i++) {

      let key = 'Label-YLine-' + Math.random();

      // Create the text element
      let element = (
        <View key={key} style={{position: 'absolute', left: 6, top: this.height + 3 - this.y(ylines[i])}}>
          <Text style={styles.yAxisLabel}>{ylines[i]}</Text>
        </View>
      );

      shapes.push(element);
    }

    return shapes;

  }

  /**
   * Transforms cartesian coord in polar coordinates
   */
  polarCoord(centerX, centerY, radius, angleInDegrees) {

    var angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;

    return {
      x: centerX + (radius * Math.cos(angleInRadians)),
      y: centerY + (radius * Math.sin(angleInRadians))
    }
  }

  /**
   * Creates a circle path
   */
  circlePath(cx, cy, radius) {

    let startAngle = 0;
    let endAngle = 360;

    var start = this.polarCoord(cx, cy, radius, endAngle * 0.9999);
    var end = this.polarCoord(cx, cy, radius, startAngle);
    var largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';
    var d = [
      'M', start.x, start.y,
      'A', radius, radius, 0, largeArcFlag, 0, end.x, end.y
    ]

    return d.join();

  }

  /**
   * Returns a shape drawing the provided path
   */
  createShape(path, color, fillColor) {

    let key = 'TotoLineChartShape-' + Math.random();

    return (
      <Shape key={key} d={path} strokeWidth={2} stroke={color} fill={fillColor} />
    )
  }

  /**
   * Create the labels with the values
   */
  createValueLabels(data) {

    if (data == null) return;

    // The labels
    let labels = [];

    // For each point, create a bar
    for (var i = 0; i < data.length; i++) {

      if (data[i].y == 0) continue;

      // The single datum
      let value = data[i].y;

      // Transform the value if necessary
      if (this.props.valueLabelTransform) value = this.props.valueLabelTransform(value);

      // Positioning of the text
      let x = this.x(data[i].x);
      let y = this.y(data[i].y);
      let key = 'Label-' + Math.random();
      let label;

      if (this.props.valueLabelTransform) label = (
        <Text style={styles.valueLabel}>{value}</Text>
      )

      // Create the text element
      let element = (
        <View key={key} style={{position: 'absolute', left: x - 8, top: this.height - y - 28, alignItems: 'center'}}>
          {label}
        </View>
      );

      labels.push(element);
    }

    return labels;
  }

  /**
   * Create the x axis labels
   */
  createXAxisLabels(data) {

    if (data == null) return;
    if (this.props.xAxisTransform == null) return;

    // The labels
    let labels = [];

    // For each point, create a bar
    for (var i = 0; i < data.length; i++) {

      // The single datum
      let value = data[i].x;

      // Transform the value if necessary
      value = this.props.xAxisTransform(value);

      // Positioning of the text
      let x = this.x(data[i].x) - 10;
      let key = 'Label-X-' + Math.random();

      // Create the text element, only if there's a value to display
      if (value != null) {

        let element = (
          <View key={key} style={{position: 'absolute', left: x, top: this.height - 20, width: 20, alignItems: 'center'}}>
            <Text style={styles.xAxisLabel}>{value}</Text>
          </View>
        );

        labels.push(element);
      }
    }

    return labels;
  }

  /**
   * Creates the bars
   */
  createLine(data) {

    // Don't draw if there's no data
    if (data == null) return;

    var line = d3.shape.line();

    line.x((d) => {return this.x(d.x)})
        .y((d) => {return this.height - this.y(d.y)})
        .curve(this.curveCardinal ? d3.shape.curveCardinal : d3.shape.curveLinear);

    var path = line([...data]);

    // Return the shape
    return this.createShape(path, this.state.settings.lineColor);

  }

  /**
   * Creates the area chart
   */
  createArea(data) {

    // Don't draw if there's no data
    if (data == null) return;

    var area = d3.shape.area();

    area.x((d) => {return this.x(d.x)})
        .y1((d) => {return this.height - this.y(d.y)})
        .y0(this.height - this.y(0) + 2)
        .curve(this.curveCardinal ? d3.shape.curveCardinal : d3.shape.curveLinear);

    var path = area([...data]);

    // Return the shape
    return this.createShape(path, this.state.settings.lineColor, this.areaColor);

  }

  /**
   * Creates the circles for every value
   */
  createCircles(data) {

    if (data == null) return;

    let circles = [];

    for (var i = 0; i < data.length; i++) {

      let datum = data[i];

      let circle = this.circlePath(this.x(datum.x), this.height-this.y(datum.y), this.valuePointsSize);

      circles.push(this.createShape(circle, this.state.settings.valueCircleColor, this.valuePointsBackground));
    }

    return circles;

  }

  /**
   * Renders the component
   */
  render() {

    let line = this.areaColor ? this.createArea(this.state.data) : this.createLine(this.state.data);
    let circles = this.showValuePoints ? this.createCircles(this.state.data) : null;
    let labels = this.createValueLabels(this.state.data);
    let xLabels = this.createXAxisLabels(this.state.data);
    let ylines = this.createYLines(this.state.yLines);
    let ylinesLabels = this.createYLinesLabels(this.state.yLines);

    return (
      <View style={styles.container}>
        <Surface height={this.props.height} width={window.width}>
          {ylines}
          {line}
          {circles}
        </Surface>
        {labels}
        {ylinesLabels}
        {xLabels}
      </View>
    )
  }

}

/**
 * Stylesheets
 */
const styles = StyleSheet.create({
  container: {
  },
  valueLabel: {
    color: TRC.TotoTheme.theme.COLOR_TEXT,
    fontSize: 10,
  },
  xAxisLabel: {
    color: TRC.TotoTheme.theme.COLOR_TEXT + '50',
    fontSize: 10,
  },
  yAxisLabel: {
    color: TRC.TotoTheme.theme.COLOR_THEME_LIGHT,
    fontSize: 10,
  },
});
