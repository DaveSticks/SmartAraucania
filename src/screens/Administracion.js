/* @flow */

import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Picker,
  TouchableOpacity
} from 'react-native';

import { Icon, Input } from 'react-native-elements'

import firebase from 'firebase'

export default class Config extends Component {

  constructor(props) {
    super(props);
    this.state = {
      level: 'user',
      limiteReservas: 0,
      horasMinimas: 0,
      selectedId: ''
    };
  }

  static navigationOptions = ({ navigation }) => ({
    title: 'Ajustes de aplicación',
    headerLeft: (
        <Icon type="ionicon" name="md-menu" onPress={navigation.getParam('toggleDrawer')} containerStyle={{marginHorizontal: 20}}/>
      ),
  });

  componentDidMount() {
    this.props.navigation.setParams({ toggleDrawer: this._toggleDrawer });
  }

  _toggleDrawer = () => {
    this.props.navigation.openDrawer();
    this.forceUpdate()
  }

  setLimiteReservas = () => {
    var configRef = firebase.database().ref('config/')
    configRef.update({
      limiteReservas: this.state.limiteReservas
    })
  }

  setHorasMinimas = () => {
    var configRef = firebase.database().ref('config/')
    configRef.update({
      horasMinimas: this.state.horasMinimas
    })
  }

  setUserLevel = () => {
    var userRef = firebase.database().ref('usuarios/'+this.state.selectedId)
    userRef.update({
      level: this.state.level
    })
  }

  render() {
    return (
      <View style={styles.wrapper}>
        <Text style={styles.titulo}>Reservas</Text>
        <View style={styles.container}>
            <View style={styles.textContainer}>
              <Text>Máx. reservas por semana</Text>
            </View>
            <View style={styles.inputContainer}>
              <Input
                textAlign={'center'}
                value={this.state.limiteReservas}
                onChangeText={limiteReservas => this.setState({limiteReservas})}
                keyboardType={'numeric'}
              />
            </View>
            <View style={[styles.buttonContainer, {marginHorizontal: 30}]}>
              <TouchableOpacity onPress={this.setLimiteReservas}
              >
                <View style={styles.button}>
                  <Text style={styles.buttonText}>GUARDAR</Text>
                </View>
              </TouchableOpacity>
            </View>
        </View>
        <View style={styles.container}>
            <View style={styles.textContainer}>
              <Text>Mín. horas antes de reservar</Text>
            </View>
            <View style={styles.inputContainer}>
              <Input
                textAlign={'center'}
                value={this.state.horasMinimas}
                onChangeText={horasMinimas => this.setState({horasMinimas})}
                keyboardType={'numeric'}
              />
            </View>
            <View style={[styles.buttonContainer, {marginHorizontal: 30 }]}>
              <TouchableOpacity onPress={this.setHorasMinimas}
              >
                <View style={styles.button}>
                  <Text style={styles.buttonText}>GUARDAR</Text>
                </View>
              </TouchableOpacity>
            </View>
        </View>
        <Text style={styles.titulo}>Herramientas de administración</Text>
        <View style={styles.container}>
            <View style={styles.textContainer}>
              <Text>Asignar rango a usuario</Text>
            </View>
            <View style={styles.inputContainer}>
              <Input
                placeholder='ID'
                textAlign={'center'}
                value={this.state.selectedId}
                onChangeText={selectedId => this.setState({selectedId})}
              />
            </View>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={this.state.level}
                onValueChange={l => this.setState({level: l})}
                style={{width: 150}}
                mode="dropdown">
                <Picker.Item label="Usuario" value="user" />
                <Picker.Item label="Becado" value="green" />
                <Picker.Item label="Administrador" value="admin" />
              </Picker>
            </View>
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity onPress={this.setUserLevel}
          >
            <View style={styles.button}>
              <Text style={styles.buttonText}>ASIGNAR RANGO</Text>
            </View>
          </TouchableOpacity>
        </View>

      </View>
    );
  }
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1
  },
  container: {
    flex: .5,
    flexDirection: 'row',
    justifyContent: 'space-between', //replace with flex-end or center,
    alignItems: 'center'
  },
  titulo: {
    fontSize: 20,
    fontWeight: '300',
    marginLeft: 20,
    marginTop: 20,
    color: '#2DC4BF'
  },
  textContainer: {
    flex: .3,
    marginLeft: 30,
    alignItems: 'center'
  },
  inputContainer: {
    flex: .3,
    marginHorizontal: 20,
    alignItems: 'center'
  },
  pickerContainer: {
    flex: .5,
    marginHorizontal: 10,
    alignItems: 'flex-end',
  },
  buttonContainer: {
    flex: .4,
    marginHorizontal: '10%',
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2DC4BF',
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
    padding: 11,
    color: 'white',
    fontSize: 15
  },
});
