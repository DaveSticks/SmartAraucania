/* @flow */

import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Picker,
  TouchableOpacity,
  TextInput,
  ScrollView,
  SectionList,
  Clipboard
} from 'react-native';

import { Icon, Input, SearchBar } from 'react-native-elements'

import _ from "lodash"

import firebase from 'firebase'

import Item from '../components/list/Item.js'

export default class UsersConfig extends Component {

  constructor(props) {
    super(props);
    this.state = {
      level: 'user',
      query: '',
      users: [],
      fullUsers: []
    };

    this.usersRef = firebase.database().ref('usuarios')


  }

  static navigationOptions = ({ navigation }) => ({
    title: 'Ajustes de usuarios',
    headerLeft: (
        <Icon type="ionicon" name="md-menu" onPress={navigation.getParam('toggleDrawer')} containerStyle={{marginHorizontal: 20}}/>
      ),
  });

  componentDidMount() {
    this.props.navigation.setParams({ toggleDrawer: this._toggleDrawer });
    this.handleDataFlow(this.usersRef, this.state.users, this.state.fullUsers)
  }

  _toggleDrawer = () => {
    this.props.navigation.openDrawer();
    this.forceUpdate()
  }

  setUserLevel = () => {
    var userRef = firebase.database().ref('usuarios/'+this.state.selectedId)
    userRef.update({
      level: this.state.level
    })
  }

  handleDataFlow = (ref, data, fulldata) => {

    ref.on('child_added', (snapshot) => {
      data.push({id: snapshot.key, nombre: snapshot.val().nombre, email: snapshot.val().email})
      fulldata.push({id: snapshot.key, nombre: snapshot.val().nombre, email: snapshot.val().email})
      this.forceUpdate()
    })

    ref.on('child_removed', (snapshot) => {
      data = data.filter((x) => x !== snapshot.key);
      fulldata = fulldata.filter((x) => x !== snapshot.key)
      this.forceUpdate()
      this.setState({ isLoading: false })
      this.setState({ isEmpty: false })
    })

  }

  handleSearch = (text) => {

    const contains = ({ nombre, id }, query) => {

      if (nombre.includes(query) || id.includes(query)){
        return true
      }

      return false
    }

    const formatQuery = text

    const data = _.filter(this.state.fullUsers, user => {
      return contains(user, formatQuery)
    })

    this.setState({query: formatQuery, users: data})

  }


  renderNoContent = (section) => {
     if(section.data.length == 0){
        return(
          <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
            <Text>No hay usuarios</Text>
          </View>
        )
     }
     return null
  }

  copyToClipboard = () => {
    Clipboard.setString();
  }

  renderItem = ({item, index}) => {


    return (
      <View style={{borderColor: 'gray', borderWidth: 0.2, paddingVertical: 10, borderTopWidth: 0, alignItems: 'center'}}>
        <Text style={{fontSize: 16}}>{item.nombre}</Text>

        <TouchableOpacity style={{flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}} onPress={() => {
          Clipboard.setString(item.id)
        }}>
          <Text style={{fontSize: 12}}>{item.id}</Text>
          <Icon type="ionicon" name="md-clipboard" containerStyle={{marginLeft: 10}} size={16}/>
        </TouchableOpacity>

      </View>
    )
  }

  render() {
    return (
      <ScrollView style={styles.container}>
        <SearchBar
          placeholder="Introducir nombre o id"
          lightTheme
          onChangeText={this.handleSearch}
          value={this.state.query}
        />
        <SectionList
          renderSectionFooter={({section}) => this.renderNoContent(section)}
          renderItem={this.renderItem}
          sections={[
            {titulo: 'Usuarios', data: this.state.users},
          ]}
          keyExtractor={(item, index) => item + index}
          renderSectionHeader={({ section: { titulo } }) => (
            <View style={styles.header}>
              <Text style={styles.headerText}>{titulo}</Text>
            </View>
          )}
        />
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: '5%'
  },
  headerText: {
    fontSize: 16,
    fontWeight: 'bold',
    padding: 5,
    color: '#2DC4BF'
  },
});
