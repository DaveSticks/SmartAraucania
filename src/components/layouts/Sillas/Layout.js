/* @flow */

import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions
} from 'react-native';

import Silla from './Silla.js'

var width = Dimensions.get('window').width;

export default class Layout extends Component {
  render() {
    return (
      <View style={styles.container}>
        <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around' }}>
          <Silla id='A' onPress={this.props.onPress} />
          <Silla id='B' onPress={this.props.onPress} />
        </View>

        <View style={{width: width*0.7, height: '40%', borderWidth: 0.6, borderColor: 'gray', marginVertical: 10}} />

        <View style={{flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', }}>
          <Silla id='C' onPress={this.props.onPress} />
          <Silla id='D' onPress={this.props.onPress} />
        </View>
      </View>
    );
  }

}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center'
  },
});
