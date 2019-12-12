/* @flow */

import React, {Component} from 'react';
import {View, Text, StyleSheet, Dimensions, Alert} from 'react-native';
import {Input, Button} from 'react-native-elements';
import firebase from 'firebase';

var WIDTH = Dimensions.get('window').width;
var HEIGHT = Dimensions.get('window').height;

export default class Formulario extends Component {
  constructor(props) {
    super(props);
    this.state = {
      correo: '',
      pass: '',
    };
  }

  _signInFirebase = () => {
    firebase
      .auth()
      .signInWithEmailAndPassword(this.state.correo, this.state.pass)
      .catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // ...

        if (errorCode === 'auth/invalid-email') {
          Alert.alert(
            'Error',
            'La dirección de correo electrónico especificada no es válida',
          );
        } else if (errorCode === 'auth/user-disabled') {
          Alert.alert(
            'Error',
            'El usuario de esta cuenta se encuentra deshabilitado',
          );
        } else if (errorCode === 'auth/user-not-found') {
          Alert.alert('Error', 'El usuario no ha sido encontrado o no existe');
        } else if (errorCode === 'auth/wrong-password') {
          Alert.alert('Error', 'La contraseña es incorrecta para este usuario');
        } else {
          Alert.alert('Error', error.message);
        }
      });
  };

  render() {
    return (
      <View style={styles.container}>
        <Input
          inputContainerStyle={styles.input}
          placeholder="CORREO"
          shake={true}
          onChangeText={correo => this.setState({correo})}
          value={this.state.correo}
          keyboardType={'email-address'}
        />
        <Input
          inputContainerStyle={styles.input}
          placeholder="CONTRASEÑA"
          secureTextEntry={true}
          onChangeText={pass => this.setState({pass})}
          value={this.state.pass}
        />
        <Button
          containerStyle={{width: WIDTH * 0.7, marginVertical: HEIGHT * 0.1}}
          buttonStyle={{backgroundColor: '#32bcbd'}}
          title="INGRESAR"
          onPress={this._signInFirebase}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    marginVertical: HEIGHT * 0.02,
    width: WIDTH * 0.7,
  },
});
