/* @flow */

import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity
} from 'react-native';

export default class Silla extends Component {
  render() {

    var id = this.props.id

    return (
        <TouchableOpacity style={{marginHorizontal: 50}} onPress={() => this.props.onPress(id)}>
          <View style={styles.button}>
            <Text style={styles.buttonText}>{this.props.id}</Text>
          </View>
        </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  button: {
    height: 40,
    width: 40,
    borderRadius: 100,
    backgroundColor: '#87D68D',
    justifyContent: 'center',
    alignItems: 'center'
  },
  buttonText: {
    color: 'white'
  },
});
