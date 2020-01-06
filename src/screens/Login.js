/* @flow */

import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  StatusBar,
  Button
} from 'react-native';
import Logo from '../components/login/Logo.js'
import Formulario from '../components/login/Formulario.js'
import Footer from '../components/login/Footer.js'
import { GoogleSignin, GoogleSigninButton, statusCodes } from 'react-native-google-signin';
import firebase from 'firebase'

export default class Login extends Component {

  static navigationOptions = {
    header: null
  }

  constructor(props){
    super(props);
    this.state = {
      userInfo: {}
    }
  }

  handlePress = () => {
    this.props.navigation.navigate('Register')
  }

  _signInGoogle = async () => {

    const nav = this.props.navigation

    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      var provider = new firebase.auth.GoogleAuthProvider();
      const credential = provider.credential(userInfo.idToken, userInfo.accessToken)
      firebase.auth().signInAndRetrieveDataWithCredential(credential).then(function(userCredential) {

          nav.navigate('Home')
          var user = firebase.auth().currentUser;
          var userId = user.uid
          var userRef = firebase.database().ref('usuarios/'+userId)
          var isNewUser = userCredential.additionalUserInfo.isNewUser

          if (isNewUser) {
            userRef.set({
              level: 'user',
              nombre: user.displayName,
              email: user.email,
            })
          }

        })
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        console.log("Sign in cancelled")
      } else if (error.code === statusCodes.IN_PROGRESS) {
        console.log("In Progress")
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        console.log("Play services not available")
      } else {
        console.log(error)
      }
    }
  };

  render() {
    return (
      <View style={styles.container}>
        <Logo />
        <Formulario />
        <Footer onPressButton={this.handlePress} />
        <GoogleSigninButton
          style={{ width: 170, height: 55, marginVertical: '7%'}}
          size={GoogleSigninButton.Size.Standard}
          color={GoogleSigninButton.Color.Light}
          onPress={this._signInGoogle}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },

});
