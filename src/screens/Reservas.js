/* @flow */

import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SectionList,
  Dimensions,
  ActivityIndicator,
} from 'react-native';

import firebase from 'firebase';

import { Icon, Image, Badge, Tooltip } from 'react-native-elements'
import IconManana from '../resources/mañana.png'
import IconTarde from '../resources/tarde.png'
import IconAmbas from '../resources/ambas.png'

const WIDTH = Dimensions.get('window').width
const HEIGHT = Dimensions.get('window').height


export default class Reservas extends Component {

  constructor(props){
    super(props)
    this.state = {
      id: '',
      isLoading: true,
      isEmpty: false,
    }
    var database = firebase.database();

    this.itemsEve = [];
    this.itemsReu = [];
    this.itemsCwrk = [];

    this.imgEve = 'https://s7d5.scene7.com/is/image/FalabellaCO/hero_estudio_oficina_mobile_cr?$Hero_Mobile_right$'
    this.imgReu = 'http://as01.epimg.net/deporteyvida/imagenes/2018/02/28/portada/1519830649_122505_1519830777_noticia_normal.jpg'
    this.imgCwrk = 'http://folio.news/wp-content/uploads/2017/04/oficinas.jpg'


    this.fechas = [];

  }

  static navigationOptions = ({ navigation }) => ({
    title: 'Mis reservas',
    headerLeft: (
        <Icon type="ionicon" name="md-menu" onPress={navigation.getParam('toggleDrawer')} containerStyle={{marginHorizontal: 20}}/>
      ),
  });

  async componentDidMount() {

    const currentUser = await firebase.auth().currentUser
    this.setState({ id: currentUser.uid })

    console.log(this.state.id)

    var database = firebase.database();

    this.props.navigation.setParams({ toggleDrawer: this._toggleDrawer });

    this.eveRef = database.ref('usuarios/'+this.state.id+'/reservas/eventos')
    this.reuRef = database.ref('usuarios/'+this.state.id+'/reservas/reuniones')
    this.cwrkRef = database.ref('usuarios/'+this.state.id+'/reservas/cowork')
    this.reservasRef = database.ref('usuarios/'+this.state.id+'/reservas')

    this.handleDataFlow(this.eveRef, this.itemsEve)
    this.handleDataFlow(this.reuRef, this.itemsReu)
    this.handleDataFlow(this.cwrkRef, this.itemsCwrk)

    this.reservasRef.on('child_added', (data) => {
      this.setState({ isLoading: false })
      this.setState({ isEmpty: false })
    })


    const { navigation } = this.props;

    setTimeout(() => {
      if (this.state.isLoading) {
        this.setState({ isLoading: false, isEmpty: true })
      }
    }, 3000)

  }

  handleDataFlow = (ref, data) => {

    ref.on('child_added', (snapshot) => {
      data.push({fecha: snapshot.key, horarios: snapshot.val()})
      this.forceUpdate()
      console.log("Se agrego un hijo en la referencia"  )
    })

    ref.on('child_removed', (snapshot) => {
      data = data.filter((x) => x !== snapshot.key);
      this.forceUpdate()
      this.setState({ isLoading: false })
      this.setState({ isEmpty: false })
    })

  }

  _toggleDrawer = () => {
    this.props.navigation.openDrawer();
  }

  getToday = () => {

    dia = new Date().getDate();
    mes = new Date().getMonth()+1;
    anio = new Date().getFullYear();

    var currentDate = new Date(anio, mes, dia)
    return currentDate

  }

  renderItemIcon = (horario) => {
    if (horario == 'Tarde'){
      return <Image source={IconTarde} style={styles.icon}/>
    } else if (horario == 'Mañana'){
      return <Image source={IconManana} style={styles.icon}/>
    } else {
      return <Image source={IconAmbas} style={styles.icon}/>
    }
  }

  renderItem = ({item, index, section: {titulo}}) => {

    var size = Object.keys(item.horarios).length
    var texto = ''
    var estado = 'error'
    var stringDate = item.fecha

    var anio = stringDate.substring(0,4)
    var mes = stringDate.substring(5,7)
    var dia = stringDate.substring(8,10)
    var date = new Date(anio, mes, dia)

    if (date < this.getToday()) {
      estadoColor = 'error'
    } else if ((date.getDate() == this.getToday().getDate()) &&
               (date.getMonth()+1 == this.getToday().getMonth()+1) &&
               (date.getFullYear() == this.getToday().getFullYear())) {
      estadoColor = 'success'
    } else {
      estadoColor = 'primary'
    }

    //Si no hay mañana
    if(item.horarios.manana == undefined && item.horarios.tarde !== undefined) {
      texto = 'Tarde'
    //Si no hay tarde
    } else if (item.horarios.manana !== undefined && item.horarios.tarde == undefined) {
      texto = 'Mañana'
    } else if (item.horarios.manana !== undefined && item.horarios.tarde !== undefined) {
      texto = 'Ambas'
    }

    console.log(item.horarios)

    return (
      <View style={{flex: 1, flexDirection: 'row', borderColor: 'gray', borderWidth: 0.2, borderTopWidth: 0, paddingVertical: 10}}>
        <View style={styles.leftContainer}>
          {this.renderItemIcon(texto)}
        </View>
        <View style={styles.centerContainer}>
          <Text key={index}>{item.fecha}</Text>
        </View>
        <View style={styles.rightContainer}>
          <Badge status={estadoColor} badgeStyle={{height: 10, width: 10, borderRadius: 100}}/>
        </View>
      </View>
    )
  }

  renderNoContent = (section) => {
     if(section.data.length == 0){
        return(
          <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
            <Text>No hay reservas aún en esta sección</Text>
          </View>
        )
     }
     return null
  }

  render() {
    if(this.state.isLoading){
      return(
        <View style={[styles.container, {justifyContent: 'center', alignItems: 'center'}]}>
          <ActivityIndicator />
        </View>
      )
    } else if (this.state.isEmpty) {
      return(
        <View style={[styles.container, {justifyContent: 'center', alignItems: 'center'}]}>
          <Text>No hay ninguna reserva registrada aún</Text>
        </View>
      )
    } else {
      return (
        <ScrollView style={styles.container}>
          <SectionList
            renderSectionFooter={({section}) => this.renderNoContent(section)}
            renderItem={this.renderItem}
            sections={[
              {titulo: 'Eventos', img: this.imgEve, data: this.itemsEve},
              {titulo: 'Reuniones', img: this.imgReu, data: this.itemsReu},
              {titulo: 'Cowork', img: this.imgCwrk, data: this.itemsCwrk},
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
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginBottom: '10%'
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
  leftContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  rightContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    height: 25,
    width: 25,
  }
});
