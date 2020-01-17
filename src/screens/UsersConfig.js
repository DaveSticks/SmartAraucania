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
  Clipboard,
  Dimensions,
  Animated,
  Alert
} from 'react-native';

import MaterialInitials from 'react-native-material-initials/native';

import { Icon, Input, SearchBar, Badge, Card } from 'react-native-elements'

import _ from "lodash"

import firebase from 'firebase'

import Item from '../components/list/Item.js'

const WIDTH = Dimensions.get('window').width
const HEIGHT = Dimensions.get('window').height

export default class UsersConfig extends Component {

  constructor(props) {
    super(props);
    this.state = {
      level: 'user',
      query: '',
      users: [],
      fullUsers: [],
      img: '',
      animation: new Animated.Value(0),
      nombre: '',
      id: '',
      email: '',
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
    console.log(this.state.users.toString())
  }

  _toggleDrawer = () => {
    this.props.navigation.openDrawer();
    this.forceUpdate()
  }

  handleDataFlow = (ref, data, fulldata) => {

    ref.on('child_added', (snapshot) => {
      data.push({id: snapshot.key, nombre: snapshot.val().nombre, email: snapshot.val().email, level: snapshot.val().level})
      fulldata.push({id: snapshot.key, nombre: snapshot.val().nombre, email: snapshot.val().email, level: snapshot.val().level})
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

    const contains = ({ nombre, id, level }, query) => {

      if (nombre.includes(query) || id.includes(query) || level.includes(query)){
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

  randomizeColor = () => {
    const rand = Math.floor(Math.random() * 10)
    if(rand == 0){
      return '#C0B7B1'
    } else if (rand == 1) {
      return '#56E39F'
    } else if (rand == 2){
      return '#38E4AE'
    } else if (rand == 3){
      return '#7C90DB'
    } else if (rand == 4){
      return '#8FC0A9'
    } else if (rand == 5){
      return '#68B0AB'
    } else if (rand == 6){
      return '#D6A99A'
    } else if (rand == 7){
      return '#43AA8B'
    } else if (rand == 8){
      return '#FF6F59'
    } else {
      return '#7272AB'
    }
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

  handleOpen = (id, nombre, email, level) => {
    this.setState({
      id, nombre, email, level
    }, () => {
      Animated.timing(this.state.animation, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }).start();
    })
  }

  handleClose = () => {
    Animated.timing(this.state.animation, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }

  sendPasswordChangeEmail = () => {
    firebase.auth().sendPasswordResetEmail(this.state.email).then(() => {
      console.log("Correo enviado a " + this.state.email)
      Alert.alert('Correo enviado', 'Se ha enviado un correo para restablecer la contraseña a ' + this.state.email)
    }).catch((error) => {
      Alert.alert('Error', error)
    })
  }

  deleteUser = () => {

    var user = firebase.auth().currentUser;

    if (user.uid === this.state.id) {
      Alert.alert("¡Cuidado!", "No puedes eliminarte a ti mismo de la lista de usuarios aún, hazlo directamente desde la consola de Firebase o ponte en contacto con un administrador")
    } else {

      Alert.alert(
        '¿Estas seguro?',
        '\nEstás a punto de eliminar a este usuario de forma definitiva y permanente, no podrás deshacer los cambios ',
        [
          {
            text: 'Volver',
            style: 'cancel',
          },
          {text: 'OK', onPress: (() => {
            this.usersRef.child(this.state.id).remove()
            aux = this.state.users.filter((x) => x.id !== this.state.id);
            this.setState({
              users: aux,
              fullUsers: aux
            }, () => {
              this.handleClose()
            })
          })},
        ],

      );
    }

  }

  renderItem = ({item, index}) => {

    var level = item.level
    var firstChar = level.charAt(0).toUpperCase();

    return (
      <View style={{borderColor: 'gray', borderWidth: 0.2, paddingVertical: 10, borderTopWidth: 0, alignItems: 'center', flexDirection: 'row'}}>

        <View style={{flex: 1, alignItems: 'center'}}>

          <Text style={{fontSize: 16}}>{item.nombre}</Text>
          <TouchableOpacity style={{flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}} >
            <Text style={{fontSize: 12}}>{item.id}</Text>
            <Icon type="ionicon" name="md-clipboard" containerStyle={{marginLeft: 10}} size={16}/>
          </TouchableOpacity>

        </View>

        <View style={{position: 'absolute', left: WIDTH * .10}}>
          <Badge status='primary' value={firstChar} badgeStyle={{width: 25, height: 25, borderRadius: 100}}/>
        </View>

        <View style={{position: 'absolute', left: WIDTH * .83}}>
          <Icon
            type="font-awesome"
            name="edit"
            color="#2DC4BF"
            reverse={true}
            raised
            size={12}
            onPress={() => this.handleOpen(item.id, item.nombre, item.email, item.level)}
          />
        </View>

      </View>
    )
  }

  render() {

    const screenHeight = Dimensions.get("window").height;

    const backdrop = {
      transform: [
        {
          translateY: this.state.animation.interpolate({
            inputRange: [0, 0.01],
            outputRange: [screenHeight, 0],
            extrapolate: "clamp",
          }),
        },
      ],
      opacity: this.state.animation.interpolate({
        inputRange: [0.01, 0.5],
        outputRange: [0, 1],
        extrapolate: "clamp",
      }),
    };

    const slideUp = {
      transform: [
        {
          translateY: this.state.animation.interpolate({
            inputRange: [0.01, 1],
            outputRange: [0, screenHeight * -0.025],
            extrapolate: "clamp",
          }),
        },
      ],
    };

    return (
      <View style={{flex: 1}}>

        <SearchBar
          placeholder="Introducir nombre, id o nivel"
          lightTheme
          onChangeText={this.handleSearch}
          value={this.state.query}
          containerStyle={{backgroundColor: 'white'}}
        />

        <ScrollView style={styles.container}>

          <SectionList
            renderSectionFooter={({section}) => this.renderNoContent(section)}
            renderItem={this.renderItem}
            sections={[
              {titulo: 'Lista de usuarios', data: this.state.users},
            ]}
            keyExtractor={(item, index) => item + index}
            renderSectionHeader={({ section: { titulo } }) => (
              <View style={styles.header}>
                <Text style={styles.headerText}>{titulo}</Text>
              </View>
            )}
          />

        </ScrollView>

        <Animated.View style={[StyleSheet.absoluteFill, styles.cover, backdrop]}>

          <Animated.View style={[styles.popup, slideUp]}>
            <Card
              title='Perfil del usuario'>
              <MaterialInitials
                style={{alignSelf: 'center'}}
                backgroundColor={this.randomizeColor()}
                color={'white'}
                size={45}
                text={this.state.nombre}
                single={false}
              />
              <Text></Text>
              <Text style={styles.titulo}>Datos básicos {'\n'}</Text>
              <Text style={{marginBottom: 10}}>
                 Nombre: {this.state.nombre}
                {'\n'} {'\n'}
                 Email: {this.state.email}
                {'\n'} {'\n'}
                 ID: {this.state.id}
                {'\n'}
              </Text>
              <Text style={styles.titulo}>Rol asignado</Text>
              <Picker
                selectedValue={this.state.level}
                onValueChange={level => this.setState({level}, () => {
                  var userRef = firebase.database().ref('usuarios/'+this.state.id)
                  userRef.update({
                    level: level
                  })

                  for (var i = 0; i < this.state.users.length; i++) {
                    if (this.state.users[i].id === this.state.id) {
                      this.state.users[i].level = level
                    }
                  }

                })}
                mode="dropdown">
                <Picker.Item label="Usuario" value="user" />
                <Picker.Item label="Becado" value="becado" />
                <Picker.Item label="Administrador" value="admin" />
              </Picker>

              <Text style={styles.titulo}>Opciones de cuenta </Text>

              <View style={{flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10}}>
                <TouchableOpacity onPress={this.sendPasswordChangeEmail} style={{alignSelf: 'center'}}>
                  <View style={[styles.button, {width: WIDTH*.5}]}>
                    <Text style={[styles.buttonText, {color: 'white'}]}>CAMBIAR CONTRASEÑA</Text>
                  </View>
                </TouchableOpacity>
                <Icon
                  type="ionicon"
                  name="md-trash"
                  color="#FF6663"
                  raised
                  onPress={this.deleteUser}
                />
              </View>


              <TouchableOpacity style={{marginVertical: 10}} onPress={this.handleClose}>
                <View style={styles.button}>
                  <Text style={[styles.buttonText, {color: 'white'}]}> VOLVER </Text>
                </View>
              </TouchableOpacity>
            </Card>
          </Animated.View>

        </Animated.View>

      </View>

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
  cover: {
    backgroundColor: "rgba(0,0,0,.5)",
    justifyContent: 'center',
  },
  popup: {
    backgroundColor: "rgba(0,0,0,0)",
    marginHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 80,
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2196F3',
    borderRadius: 2,
    shadowColor: "#000",
    shadowOffset: {
    	width: 0,
    	height: 2,
    },
    shadowOpacity: 0.32,
    shadowRadius: 3,

    elevation: 5,

    width: WIDTH*0.75
  },
  buttonText: {
    padding: 10,
    color: 'white'
  },
  titulo: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#2DC4BF'
  },
});
