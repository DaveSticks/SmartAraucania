import React, {Component} from 'react';
import { Platform, StyleSheet, Text, View, Card, Button } from 'react-native';
import { createSwitchNavigator, createAppContainer } from "react-navigation";
import { createDrawerNavigator } from 'react-navigation-drawer';
import { createStackNavigator } from 'react-navigation-stack';
import Calendario from './src/screens/Calendario.js'
import Home from './src/screens/Home.js'
import Login from './src/screens/Login.js'
import Register from './src/screens/Register.js'
import Formulario from './src/screens/Formulario.js'
import First from './src/screens/First.js'
import Reservas from './src/screens/Reservas.js'
import FAQ from './src/screens/FAQ.js'
import Administracion from './src/screens/Administracion.js'
import Sidebar from './src/components/sidebar/Sidebar.js'
import firebase from 'firebase'
import { GoogleSignin } from 'react-native-google-signin';
import { firebaseConfig } from './src/config.js'
import { googleConfig } from './src/config.js'

type Props = {};
firebase.initializeApp(firebaseConfig)
GoogleSignin.configure(googleConfig)

console.disableYellowBox = true;

export default class App extends Component<Props> {

  render() {
    return <AppContainer />;
  }
}

const FAQStack = createStackNavigator({
  FAQ: FAQ
})

const AdminStack = createStackNavigator({
  Administracion: Administracion
})

const ReservasStack = createStackNavigator({
  Reservas: Reservas
})

const AppStackNavigator = createStackNavigator({
  Home: Home,
  Calendario: Calendario,
  Formulario: Formulario,
})

const AppDrawerNavigator = createDrawerNavigator({
  Inicio: AppStackNavigator,
  FAQ: FAQStack,
  Administracion: AdminStack,
  Reservas: ReservasStack
}, {
  contentComponent: ({navigation}) => {
    return(<Sidebar navigation={navigation} />)
  }
})

const LoginStackNavigator = createStackNavigator({
  Login: Login,
  Register: Register,
})
const AppSwitchNavigator = createSwitchNavigator({
  First: First,
  LoginStac: LoginStackNavigator,
  StackNav: AppDrawerNavigator,
})

const AppContainer = createAppContainer(AppSwitchNavigator);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center'
  },
});
