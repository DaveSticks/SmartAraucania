/* @flow */

import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  PanResponder,
  Dimensions,
  UIManager,
  LayoutAnimation
} from 'react-native';

export default class Item extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Text>I'm the Item component</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
