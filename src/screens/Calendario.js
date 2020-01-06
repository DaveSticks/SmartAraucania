/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import { Platform, StyleSheet, Text, View, Card, Button, ActivityIndicator, Dimensions } from 'react-native';
import { Calendar, CalendarList, Agenda, LocaleConfig } from 'react-native-calendars';
import MaterialInitials from 'react-native-material-initials/native';
import firebase from 'firebase';
import { Icon } from 'react-native-elements'

const WIDTH = Dimensions.get('window').width
const HEIGHT = Dimensions.get('window').height

function getToday(){

  dia = new Date().getDate();
  mes = new Date().getMonth()+1;
  anio = new Date().getFullYear();

  //YYYY-MM-DD

  // si ambos tienen dos digitos
  if(mes.toString().length == 2 && dia.toString().length == 2){
    return '' + anio + '-' + mes + '-' + dia + '';
    //mes : 2 digitos -- dia : 1 digito
  } else if (mes.toString().length == 2 && (dia.toString().length == 1)) {
    return '' + anio + '-' + mes + '-0' + dia + '';
    // mes: 1 digito -- dia: 2 digitos
  } else if (mes.toString().length == 1 && (dia.toString().length == 2)) {
    return '' + anio + '-0' + mes + '-' + dia + '';
    // ambos 1 digito
  } else {
    return '' + anio + '-0' + mes + '-0' + dia + '';
  }

}

function getNextWeek(){

  d = new Date();

  dia = d.getDate()+7;
  mes = d.getMonth()+1;
  anio = d.getFullYear();

  //YYYY-MM-DD

  // si ambos tienen dos digitos
  if(mes.toString().length == 2 && dia.toString().length == 2){
    return '' + anio + '-' + mes + '-' + dia + '';
    //mes : 2 digitos -- dia : 1 digito
  } else if (mes.toString().length == 2 && (dia.toString().length == 1)) {
    return '' + anio + '-' + mes + '-0' + dia + '';
    // mes: 1 digito -- dia: 2 digitos
  } else if (mes.toString().length == 1 && (dia.toString().length == 2)) {
    return '' + anio + '-0' + mes + '-' + dia + '';
    // ambos 1 digito
  } else {
    return '' + anio + '-0' + mes + '-0' + dia + '';
  }

}

class Calendario extends Component<Props> {

  constructor(props){
    super(props);

    this.state = {
      selectedDay: getToday(),
      isLoading: true,
    }
    var database = firebase.database();

    this.eveRef = database.ref('fechas/eventos')
    this.reuRef = database.ref('fechas/reuniones')
    this.cwrkRef = database.ref('fechas/cowork')

    this.itemsEve = {};
    this.itemsReu = {};
    this.itemsCwrk = {};

  }

  static navigationOptions = {
    header: null,
  }

  componentDidMount(){

    this.handleDataFlow(this.eveRef, this.itemsEve)
    this.handleDataFlow(this.reuRef, this.itemsReu)
    this.handleDataFlow(this.cwrkRef, this.itemsCwrk)

  }

  handleDataFlow(ref, data) {

  var aux = []

    ref.on("child_added", (snapshot) => {

      aux.push(snapshot.val()) //Mañana y tarde almacenados como arreglo.

      data[snapshot.key] = aux; // this.items[fecha] = arreglo aux

      aux = [];

      this.setState({isLoading: false})
      this.forceUpdate()
    })

    ref.on("child_removed", (snapshot) => {
      delete data[snapshot.key]
      this.forceUpdate()
    })

    ref.on("child_changed", (snapshot) => {

      aux = [];
      data[snapshot.key] = [];

      aux.push(snapshot.val())

      data[snapshot.key] = aux;

      aux = [];
      this.forceUpdate()
    })

  }

  randomizeColor(){
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

  renderItem(item) {

    const { navigation } = this.props;
    const itemId = navigation.getParam('itemId', '0');

    var text = ''

    if(itemId == 0 || itemId == 1) {
      text = 'personas'
    } else {
      text = 'espacios'
    }

    console.log("Item: " + item.manana.cantidad)

    if (item.manana !== undefined && item.tarde !== undefined) {
      return (
        <View style={{flex: 1, flexDirection: 'column'}}>
          <View style={{flex: 1, flexDirection: 'column'}}>
            <View style={[styles.item, {height: item.height, width: WIDTH*0.80}]}>
              <View style={{width: WIDTH*0.60}}>
                <Text style={{fontWeight: 'bold', fontSize: 15}}>Mañana</Text>
                <Text style={{fontSize: 14}}>{item['manana'].cantidad} {text}</Text>
                <Text style={{fontSize: 14}}>{item['manana'].nombre}</Text>
              </View>
              <View style={{justifyContent: 'center'}}>
                <MaterialInitials
                  style={{alignSelf: 'center'}}
                  backgroundColor={this.randomizeColor()}
                  color={'white'}
                  size={40}
                  text={item['manana'].nombre}
                  single={false}
                />
              </View>
            </View>
          </View>
          <View style={{flex: 1, flexDirection: 'column'}}>
            <View style={[styles.item, {height: item.height, width: WIDTH*0.80}]}>
              <View style={{width: WIDTH*0.60}}>
                <Text style={{fontWeight: 'bold', fontSize: 15}}>Tarde</Text>
                <Text style={{fontSize: 14}}>{item['tarde'].cantidad} {text}</Text>
                <Text style={{fontSize: 14}}>{item['tarde'].nombre}</Text>
              </View>
              <View style={{justifyContent: 'center'}}>
                <MaterialInitials
                  style={{alignSelf: 'center'}}
                  backgroundColor={this.randomizeColor()}
                  color={'white'}
                  size={40}
                  text={item['manana'].nombre}
                  single={false}
                />
              </View>
            </View>
          </View>
        </View>
      );
    } else if (item.manana !== undefined && item.tarde == undefined) {
      return (
          <View style={{flex: 1, flexDirection: 'column'}}>
            <View style={[styles.item, {height: item.height, width: WIDTH*0.80}]}>
              <View style={{width: WIDTH*0.60}}>
                <Text style={{fontWeight: 'bold', fontSize: 15}}>Mañana</Text>
                <Text style={{fontSize: 14}}>{item['manana'].cantidad} {text}</Text>
                <Text style={{fontSize: 14}}>{item['manana'].nombre}</Text>
              </View>
              <View style={{justifyContent: 'center'}}>
                <MaterialInitials
                  style={{alignSelf: 'center'}}
                  backgroundColor={this.randomizeColor()}
                  color={'white'}
                  size={40}
                  text={item['manana'].nombre}
                  single={false}
                />
              </View>
            </View>
          </View>
      );
    } else if (item.tarde !== undefined && item.manana == undefined){
      return (
          <View style={{flex: 1, flexDirection: 'column'}}>
            <View style={[styles.item, {height: item.height, width: WIDTH*0.80}]}>
              <View style={{width: WIDTH*0.60}}>
                <Text style={{fontWeight: 'bold', fontSize: 15}}>Tarde</Text>
                <Text style={{fontSize: 14}}>{item['tarde'].cantidad} {text}</Text>
                <Text style={{fontSize: 14}}>{item['tarde'].nombre}</Text>
              </View>
              <View style={{justifyContent: 'center'}}>
                <MaterialInitials
                  style={{alignSelf: 'center'}}
                  backgroundColor={this.randomizeColor()}
                  color={'white'}
                  size={40}
                  text={item['tarde'].nombre}
                  single={false}
                />
              </View>
            </View>
          </View>
      );
    }

  }

  renderEmptyData() {
    if (this.state.isLoading) {
      return(
        <View style={[styles.container, {justifyContent: 'center', alignItems: 'center'}]}>
          <ActivityIndicator />
        </View>
      )
    } else {
      return (
        <View style={[styles.container, {justifyContent: 'center', alignItems: 'center'}]}>
          <Text>Nada agendado para esta fecha aún</Text>
        </View>
      )
    }
  }

  rowHasChanged(r1, r2) {
    return r1.text !== r2.text;
  }

  onDayPress(day) {
    this.setState({selectedDay: day.dateString})
  }

  renderAgenda = (data) => {
    const { navigation } = this.props;
    const itemId = navigation.getParam('itemId', '0');
    return (
      <View style={styles.container}>
        <Agenda
          onDayPress={this.onDayPress.bind(this)}
          items={data}
          renderItem={this.renderItem.bind(this)}
          rowHasChanged={this.rowHasChanged.bind(this)}
          selected={this.state.selectedDay}
          pastScrollRange={1}
          futureScrollRange={1}
          renderEmptyData = {this.renderEmptyData.bind(this)}
          refreshing={true}
          theme={{
            textMonthFontSize: 20,
            arrowColor: 'white',
            'stylesheet.agenda.main': {
              knobContainer: {
                flex: 1,
                position: 'absolute',
                left: 0,
                right: 0,
                height: '3%',
                bottom: 0,
                alignItems: 'center',
              }
            }
          }}
          firstDay={1}
        />
        <View style={{ position: 'absolute', top: HEIGHT*0.8, left: WIDTH*0.7}}>
          <Icon
            type="ionicon" name="ios-add" color="green"
            raised
            containerStyle={{marginHorizontal: 20}}
            onPress={() => navigation.navigate('Formulario', {
              itemId: itemId
            })}/>
        </View>
      </View>
    );
  }

  render() {
    // itemId viene del Home pasado como prop
    const { navigation } = this.props;
    const itemId = navigation.getParam('itemId', '0');

    switch (itemId) {
      // Sala de eventos
      case 0:
        return (
          this.renderAgenda(this.itemsEve)
        )
        break;
      //Sala de reuniones
      case 1:
        return (
          this.renderAgenda(this.itemsReu)
        )
        break;
      //Co-work
      case 2:
        return (
          this.renderAgenda(this.itemsCwrk)
        )
        break;
      default:
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  item: {
    justifyContent: 'center',
    backgroundColor: 'white',
    flex: 1,
    flexDirection: 'row',
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
    marginTop: 17
  },
});

LocaleConfig.locales['es'] = {
  monthNames: ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'],
  monthNamesShort: ['Ene.','Feb.','Mar.','Abr.','May.','Jun.','Jul.','Ago.','Sept.','Oct.','Nov.','Dic.'],
  dayNames: ['Domingo','Lunes','Martes','Miércoles','Jueves','Viernes','Sábado'],
  dayNamesShort: ['Dom.','Lun.','Mar.','Mier.','Jue.','Vie.','Sáb.']
};

LocaleConfig.defaultLocale = 'es';

export default Calendario;
