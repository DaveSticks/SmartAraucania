/* @flow */

import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity
} from 'react-native';

import firebase from 'firebase';

export default class Silla extends Component {


  constructor(props) {
    super(props);
    this.state = {
      status: this.props.status(this.props.id)
    }
  }

  componentDidMount() {
    var id = this.props.id
    console.log("Status silla: " + this.props.status(id))
  }

  render() {

    var id = this.props.id

    return (
        <TouchableOpacity style={{marginHorizontal: 50}} onPress={() => this.props.onPress(id)} disabled={this.state.status}>
          <View style={this.state.status ? styles.buttonDisabled : styles.buttonEnabled}>
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
  buttonEnabled: {
    height: 40,
    width: 40,
    borderRadius: 100,
    backgroundColor: '#87D68D',
    justifyContent: 'center',
    alignItems: 'center'
  },
  buttonDisabled: {
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
