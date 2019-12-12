/* @flow */

import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';

export default class Footer extends Component {

  constructor(props){
    super(props)
  }

  onPressButton = () => {
    this.props.onPressButton()
  }

  render() {
    return (
      <View style={styles.container}>
        <TouchableOpacity onPress={this.onPressButton}>
          <Text>¿No estás registrado? ¡Haz click aquí!</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
