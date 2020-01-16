/* @flow */

import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';

import { Icon } from 'react-native-elements'

export default class Perfil extends Component {

  static navigationOptions = ({ navigation }) => ({
    title: 'Perfil',
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
      <View style={styles.container}>
        <Text>I'm the Perfil component</Text>
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
