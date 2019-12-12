/* @flow */

import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated
} from 'react-native';

export default class Mesa extends Component {

  render() {

    var id = this.props.id

    return (
      <View style={[styles.container, {top: this.props.top, bottom: this.props.bottom, left: this.props.left, right: this.props.right}]}>
        <TouchableOpacity onPress={() => this.props.onPress(id)}>
          <View style={this.props.isVertical ? styles.vertical : styles.horizontal}>
            <Text style={styles.buttonText}>{this.props.id}</Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
  },
  vertical: {
    padding: 5,
    height:35,
    width: 25,
    backgroundColor: '#87D68D',
    justifyContent: 'center',
    alignItems: 'center'
  },
  horizontal: {
    padding: 5,
    height:25,
    width: 35,
    backgroundColor: '#87D68D',
    justifyContent: 'center',
    alignItems: 'center'
  },
  buttonText: {
    color: 'white'
  },
});
