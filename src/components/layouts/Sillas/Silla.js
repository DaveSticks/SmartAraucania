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
      isDisabled: false
    }
  }

  componentDidUpdate(nextProps) {

     const { fbref } = this.props
     if ( nextProps.fbref !== fbref ) {

       console.log(this.props.fbref.toString())

       this.props.fbref.on('value', (snapshot) => {

         if (snapshot.child(this.props.id).exists()){
           this.setState({
             isDisabled: true
           })
         } else {
           this.setState({
             isDisabled: false
           })
         }

       })

     }

    }


  render() {

    var id = this.props.id

    return (
        <TouchableOpacity style={{marginHorizontal: 50}} onPress={() => this.props.onPress(id)} disabled={this.state.isDisabled}>
          <View style={this.state.isDisabled ? styles.buttonDisabled : styles.buttonEnabled}>
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
    backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center'
  },
  buttonText: {
    color: 'white'
  },
});
