/* @flow */

import React, {Component} from 'react';
import {View, Text, StyleSheet, Dimensions, Alert, Button, TouchableOpacity} from 'react-native';
import {Input} from 'react-native-elements';
import firebase from 'firebase';

var width = Dimensions.get('window').width;
var height = Dimensions.get('window').height;

export default class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      correo: '',
      pass: '',
      pass2: '',
      nombre: '',
      apellido: '',
      error: '',
      algo: '',
    };
  }

  static navigationOptions = {
    title: 'Formulario de Registro',
  };

  onPressButton = () => {
    var displayName = this.state.nombre + ' ' + this.state.apellido;
    const nav = this.props.navigation;

    if (this.state.pass !== this.state.pass2) {
      this.setState({error: 'Las contraseñas no coinciden'});
    } else if (this.state.nombre == '') {
      Alert.alert('Error en el nombre', 'Rellena el nombre');
    } else if (this.state.apellido == '') {
      Alert.alert("Error en el apellido", 'Rellena el apellido');
    } else if (this.state.pass == '' || this.state.pass2 == '') {
      Alert.alert('Error en la contraseña', 'Rellena la contraseña');
    } else {
      firebase
        .auth()
        .createUserWithEmailAndPassword(this.state.correo, this.state.pass)
        .then(function() {
          Alert.alert('¡Genial!', 'El usuario ha sido creado con éxito');
          var user = firebase.auth().currentUser;
          var userId = user.uid
          var userRef = firebase.database().ref('usuarios/'+userId)

          user.updateProfile({
            displayName: displayName,
          });

          userRef.set({
            level: 'user'
          })

        })
        .catch(function(error) {
          // Handle Errors here.
          var errorCode = error.code;
          var errorMessage = error.message;
          if (errorCode == 'auth/weak-password') {
            Alert.alert('Error en la contraseña', 'Contraseña demasiado débil');
          } else if (errorCode == 'auth/email-already-in-use') {
            Alert.alert(
              'Error en el correo',
              '¡Ya existe una cuenta con ese correo!',
            );
          } else if (errorCode == 'auth/invalid-email') {
            Alert.alert('Error en el correo', '¡Correo inválido!');
          } else {
            Alert.alert('Error desconocido', errorMessage);
          }
        });
    }
  };

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.containerInput}>
          <Input
            value={this.state.correo}
            label="Tu correo electrónico"
            inputContainerStyle={styles.inputContainerStyle}
            containerStyle={styles.containerStyle}
            onChangeText={correo => this.setState({correo})}
            leftIcon={{ type: 'font-awesome', name: 'envelope', color:'gray' }}
            placeholder="correo@electronico.com"
            leftIconContainerStyle={{paddingRight: 10}}
            keyboardType={'email-address'}
          />

          <Input
            value={this.state.nombre}
            label="Nombre"
            inputContainerStyle={styles.inputContainerStyle}
            containerStyle={styles.containerStyle}
            onChangeText={nombre => this.setState({nombre})}
            leftIcon={{ type: 'font-awesome', name: 'address-card', color:'gray' }}
            leftIconContainerStyle={{paddingRight: 10}}
          />

          <Input
            value={this.state.apellido}
            label="Apellido"
            inputContainerStyle={styles.inputContainerStyle}
            containerStyle={styles.containerStyle}
            onChangeText={apellido => this.setState({apellido})}
            leftIcon={{ type: 'font-awesome', name: 'address-card', color:'gray' }}
            leftIconContainerStyle={{paddingRight: 10}}
          />

          <Input
            value={this.state.pass}
            label="Contraseña"
            inputContainerStyle={styles.inputContainerStyle}
            containerStyle={styles.containerStyle}
            secureTextEntry={true}
            onChangeText={pass => this.setState({pass})}
            leftIcon={{ type: 'font-awesome', name: 'lock', color:'gray', size: 24 }}
            leftIconContainerStyle={{paddingRight: 20}}
          />

          <Input
            value={this.state.pass2}
            label="Repetir Contraseña"
            inputContainerStyle={styles.inputContainerStyle}
            containerStyle={styles.containerStyle}
            errorMessage={this.state.error}
            secureTextEntry={true}
            onChangeText={pass2 => this.setState({pass2})}
            leftIcon={{ type: 'font-awesome', name: 'lock', color:'gray' }}
            leftIconContainerStyle={{paddingRight: 20}}
          />
        </View>
        <View style={styles.containerButton}>
          <TouchableOpacity onPress={this.onPressButton.bind(this)}>
            <View style={styles.button}>
              <Text style={styles.buttonText}>COMPLETAR REGISTRO</Text>
            </View>
          </TouchableOpacity>

        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  containerInput: {
    flex: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: '20%'
  },
  inputContainerStyle: {
    width: '80%'
  },
  containerStyle: {
    padding: '3%'
  },
  containerButton: {
    flex: 0.5,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#32bcbd',
    borderRadius: 2,
    shadowColor: "#000",
    shadowOffset: {
    	width: 0,
    	height: 2,
    },
    shadowOpacity: 0.32,
    shadowRadius: 3,
    elevation: 9,
  },
  buttonText: {
    paddingHorizontal: '10%',
    paddingVertical: '2.5%',
    color: 'white',
    fontSize: 15
  }
});
