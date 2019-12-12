/* @flow */

import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image
} from 'react-native';
import FondoLayout from '../../../resources/layout.png'
import Mesa from './Mesa.js'

export default class Layout extends Component {
  render() {
    return (
        <View style={styles.container}>
          <Image source={FondoLayout}
                 style={{width: null , height: 170, marginVertical: 30}}
                 resizeMode='stretch' />
          <Mesa id='1' top={'17%'} left={'37%'} onPress={this.props.onPress} isVertical={true}/>
          <Mesa id='2' top={'34%'} left={'37%'} onPress={this.props.onPress} isVertical={true}/>
          <Mesa id='3' top={'17%'} left={'61%'} onPress={this.props.onPress} isVertical={true}/>
          <Mesa id='4' top={'34%'} left={'61%'} onPress={this.props.onPress} isVertical={true}/>
          <Mesa id='5' top={'30%'} left={'78%'} onPress={this.props.onPress} isVertical={false}/>
          <Mesa id='6' top={'30%'} left={'88%'} onPress={this.props.onPress} isVertical={false}/>
          <Mesa id='7' top={'61%'} left={'78%'} onPress={this.props.onPress} isVertical={false}/>
          <Mesa id='8' top={'61%'} left={'88%'} onPress={this.props.onPress} isVertical={false}/>
        </View>
    );
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
