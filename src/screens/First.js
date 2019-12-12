/* @flow */

import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Image,
  ImageBackground,
  Dimensions
} from 'react-native';
import firebase from 'firebase'
import { GoogleSignin } from 'react-native-google-signin';

var WIDTH = Dimensions.get('window').width
var HEIGHT = Dimensions.get('window').height

export default class First extends Component {

  static navigationOptions = {
    header: null
  }

  componentDidMount(){
    this.isSignedIn()
  }

  isSignedIn = () => {
    console.log("CHECK SIGN UP STATE")
    const nav = this.props.navigation
    firebase.auth().onAuthStateChanged(
      function(user) {
        if (user) {
          nav.navigate('Home')
        } else {
          nav.navigate('Login')
        }
      }
    ).bind(this)
  };


  render() {
    return (
      <View style={styles.container}>
          <Image source={require('../resources/logo.png')}
                 style={{width: WIDTH * 0.8, height: HEIGHT * 0.3}}
                 resizeMode='contain' />
          <ActivityIndicator color="#50C5B7" />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
});
