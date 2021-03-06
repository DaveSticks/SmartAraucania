/* @flow */

import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView
} from 'react-native';

import { Icon } from 'react-native-elements'

export default class FAQ extends Component {

  static navigationOptions = ({ navigation }) => ({
    title: 'FAQ',
    headerLeft: (
        <Icon type="ionicon" name="md-menu" onPress={navigation.getParam('toggleDrawer')} containerStyle={{marginHorizontal: 20}}/>
      ),
  });

  componentDidMount() {
    this.props.navigation.setParams({ toggleDrawer: this._toggleDrawer });
  }

  _toggleDrawer = () => {
    this.props.navigation.openDrawer();
  }

  render() {
    return (
      <ScrollView style={styles.container} contentContainerStyle={{
          justifyContent: 'center',
          alignItems: 'flex-start'}}>
        <View style={[styles.container, {marginHorizontal: '10%', marginVertical: '5%'}]}>
          <Text style={styles.titulo}>
            ¿Cuantas reservas puedo hacer en una misma semana?
          </Text>
          <Text></Text>
          <Text style={styles.normal}>
            El limite de reservas por semana varía según el permiso de usuario
            que tengas. Por defecto para un usuario común son 4 reservas.
            Pronto podrás consultarlo en una sección aparte.
          </Text>
          <Text></Text>
          <Text style={styles.titulo}>
            ¿Que tan anticipada puede ser mi reserva?
          </Text>
          <Text></Text>
          <Text style={styles.normal}>
            Al igual que el límite de reservas por semana varía según el
            permiso del usuario, esta anticipación también varía dependiendo
            del nivel de usuario. Por defecto corresponde a 2 horas.
          </Text>
          <Text></Text>
          <Text style={styles.titulo}>
            ¿Que significa cada color en la sección de Mis Reservas?
          </Text>
          <Text></Text>
          <Text style={styles.normal}>
            Rojo indica que ya expiró, celeste indica que está pendiente y
            verde que está activa actualmente
          </Text>
          <Text></Text>
          <Text style={styles.titulo}>
            ¿Como funcionan los horarios del Co-work?
          </Text>
          <Text></Text>
          <Text style={styles.normal}>
            Tenemos el horario de mañana que corresponde de 9:00 a 13:00 y el
            horario tarde que comprende desde las 15:00 hasta las 19:00
          </Text>
          <Text></Text>
          <Text style={styles.titulo}>
            ¿Mi información personal está siendo utilizada por medio de esta app?
          </Text>
          <Text></Text>
          <Text style={styles.normal}>
            No, en caso de que hayas iniciado sesión con los servicios de Google
            solo se ha extraído una credencial y la foto de perfil de tu cuenta
            para fines estéticos, puedes cambiar la misma cuando quieras.
          </Text>
          <Text></Text>
          <Text style={styles.titulo}>
            ¿Que es esa combinación de numeros y letras debajo de mi correo en el menú desplegable?
          </Text>
          <Text></Text>
          <Text style={styles.normal}>
            Este corresponde a tu ID de usuario, si tienes algún problema
            relacionado a la aplicación usa este para ponerte en contacto
            enviando un correo a: CORREO_AQUI
          </Text>
          <Text></Text>
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,

  },
  titulo: {
    fontWeight: 'bold',
    fontSize: 18,
    color: '#2DC4BF'
  },
  normal: {
    fontWeight: '100',
    fontSize: 14
  }
});
