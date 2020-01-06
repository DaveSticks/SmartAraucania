/* @flow */

import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Picker,
  TouchableOpacity,
  Dimensions
} from 'react-native';

const WIDTH = Dimensions.get('window').width
const HEIGHT = Dimensions.get('window').height

import { Icon, Input } from 'react-native-elements'

import firebase from 'firebase'

export default class AppConfig extends Component {

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
    var configRef = firebase.database().ref('config/'+this.state.level)
    configRef.update({
      limiteReservas: this.state.limiteReservas
    })
  }

  setHorasMinimas = () => {
    var configRef = firebase.database().ref('config/'+this.state.level)
    configRef.update({
      horasMinimas: this.state.horasMinimas
    })
  }

  setRoleConfig = () => {
    this.setLimiteReservas()
    this.setHorasMinimas()
  }


  render() {
    return (
      <View style={styles.wrapper}>
        <Text style={styles.titulo}>Rol a modificar</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={this.state.level}
            onValueChange={l => this.setState({level: l})}
            style={{width: WIDTH * 0.9, alignItems: 'center', alignSelf: 'center', justifyContent: 'center'}}
            mode="dropdown">
            <Picker.Item label="Usuario" value="user" />
            <Picker.Item label="Becado" value="becado" />
            <Picker.Item label="Administrador" value="admin" />
          </Picker>
        </View>
        <Text style={styles.titulo}>Reservas</Text>
        <View style={styles.container}>
            <View style={styles.textContainer}>
              <Text>Máximo de reservas permitidas por semana</Text>
            </View>
            <View style={styles.inputContainer}>
              <Input
                textAlign={'center'}
                value={this.state.limiteReservas}
                onChangeText={limiteReservas => this.setState({limiteReservas})}
                keyboardType={'numeric'}
              />
            </View>
        </View>
        <View style={styles.container}>
            <View style={styles.textContainer}>
              <Text>Mínimo de horas antes de reservar</Text>
            </View>
            <View style={styles.inputContainer}>
              <Input
                textAlign={'center'}
                value={this.state.horasMinimas}
                onChangeText={horasMinimas => this.setState({horasMinimas})}
                keyboardType={'numeric'}
              />
            </View>
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity onPress={this.setRoleConfig}
          >
            <View style={styles.button}>
              <Text style={styles.buttonText}>GUARDAR CAMBIOS</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: '10%'
  },
  titulo: {
    fontSize: 20,
    fontWeight: '300',
    marginLeft: 20,
    marginTop: 20,
    color: '#2DC4BF'
  },
  textContainer: {
    flex: 0.6,
    marginLeft: 30,
    alignItems: 'center'
  },
  inputContainer: {
    flex: 0.3,
    marginHorizontal: 20,
    alignItems: 'center'
  },
  pickerContainer: {
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'center',
    marginTop: '10%'
  },
  buttonContainer: {
    flex: 1,
    marginHorizontal: '10%',
    marginTop: '10%'
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
