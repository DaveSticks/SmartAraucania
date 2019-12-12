/* @flow */

import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions
} from 'react-native';

const WIDTH = Dimensions.get('window').width
const HEIGHT = Dimensions.get('window').height

export default class Logo extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Image source={require('../../resources/logo.png')}
               style={{width: WIDTH * 0.8, height: HEIGHT * 0.1}}
               resizeMode='contain' />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
