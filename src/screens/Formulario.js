/* @flow */

import React, {Component} from 'react';
import {View, Text, StyleSheet, Dimensions, Picker, Alert, TouchableOpacity, ScrollView, Animated} from 'react-native';
import {Input, Icon} from 'react-native-elements';
import DatePicker from 'react-native-date-picker';
import firebase from 'firebase';
import LayoutMesas from '../components/layouts/Mesas/Layout.js'
import LayoutSillas from '../components/layouts/Sillas/Layout.js'

var width = Dimensions.get('window').width;
var height = Dimensions.get('window').height;

export default class Formulario extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fecha: new Date(),
      horario: 'manana',
      espacio: 1,
      cant: '1',
      name: '',
      id: '',
      counter: 0,
      limite: 2,  // Cantidad de reservas permitidas en una semana por seccion
      horas: 2,  // Maximo de horas de anticipacion a una reserva
      animation: new Animated.Value(0),
      mesa: 0,
      silla: 'E'
    };
  }

  reservarCowork = () => {
    console.log("Funcion en construccion")
    this.handleClose()
    this.onButtonPress()
  }

  handleClickSilla = (id) => {

    this.setState({
      silla: id
    }, () => {
      Alert.alert(
        '¿Estas seguro?',
        '\nEstás a punto de reservar el asiento ' + this.state.silla + ' de la mesa número ' + this.state.mesa + ' ¿quieres continuar? \n',
        [
          {
            text: 'Volver',
            style: 'cancel',
          },
          {text: 'OK', onPress: () => this.reservarCowork()},
        ],

      );
    })

  }

  handleOpen = (id) => {

    Animated.timing(this.state.animation, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();

    this.setState({
      mesa: id
    })

    console.log('xd')

  };

  handleClose = () => {
    Animated.timing(this.state.animation, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };

  getConfig = () => {
    var configRef = firebase.database().ref('config/')
    let thus = this
    configRef.once('value').then(function(snapshot) {
        var limiteReservas = snapshot.child('limiteReservas').val()
        var horasMinimas = snapshot.child('horasMinimas').val()

        thus.setState({
          limite: limiteReservas
        })

        thus.setState({
          horas: horasMinimas
        })

    })

  }

  getCurrentUser = () => {
    var thus = this;
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        thus.setState({name: user.displayName});
        thus.setState({id: user.uid});
      } else {
        console.log('NO HAY USUARIO');
      }
    });
  };

  componentDidMount() {
    this.getCurrentUser();
    this.getConfig()
  }

  parseDate(date) {
    dia = date.getDate();
    mes = date.getMonth() + 1;
    anio = date.getFullYear();

    if (mes.toString().length == 2 && dia.toString().length == 2) {
      return '' + anio + '-' + mes + '-' + dia + '';
      //mes : 2 digitos -- dia : 1 digito
    } else if (mes.toString().length == 2 && dia.toString().length == 1) {
      return '' + anio + '-' + mes + '-0' + dia + '';
      // mes: 1 digito -- dia: 2 digitos
    } else if (mes.toString().length == 1 && dia.toString().length == 2) {
      return '' + anio + '-0' + mes + '-' + dia + '';
      // ambos 1 digito
    } else {
      return '' + anio + '-0' + mes + '-0' + dia + '';
    }
  }

  getToday() {
    d = new Date();
    d.setHours(0, 0, 0, 0);

    dia = d.getDate();
    mes = d.getMonth() + 1;
    anio = d.getFullYear();

    //YYYY-MM-DD

    // si ambos tienen dos digitos
    if (mes.toString().length == 2 && dia.toString().length == 2) {
      return '' + anio + '-' + mes + '-' + dia + '';
      //mes : 2 digitos -- dia : 1 digito
    } else if (mes.toString().length == 2 && dia.toString().length == 1) {
      return '' + anio + '-' + mes + '-0' + dia + '';
      // mes: 1 digito -- dia: 2 digitos
    } else if (mes.toString().length == 1 && dia.toString().length == 2) {
      return '' + anio + '-0' + mes + '-' + dia + '';
      // ambos 1 digito
    } else {
      return '' + anio + '-0' + mes + '-0' + dia + '';
    }
  }

  getNextWeek() {
    d = new Date();

    dia = d.getDate() + 7;
    mes = d.getMonth();
    anio = d.getFullYear();

    totalDias = new Date(anio, mes + 1, 0);

    if (dia > totalDias.getDate()) {
      dia = dia - totalDias.getDate();
      mes += 1;
    }

    return new Date(anio, mes, dia, 20, 0, 0, 0);
  }

  checkWeek = async (userDatesRef, callback) => {
    var monthSelected = this.state.fecha.getMonth();
    var anioSelected = this.state.fecha.getFullYear();

    var aux = 0;
    var counter = 0;
    var diaSemana = await this.state.fecha.getDay();

    if (diaSemana == 0) {
      diaSemana = 7;
    }

    var firstDay = this.state.fecha.getDate() - (diaSemana - 1);
    var totalDias = await new Date(anioSelected, monthSelected + 1, 0);

    thus = this;

    userDatesRef.on('value', function(data) {
      for (var i = 0; i <= 6; i++) {

        if (firstDay + aux > totalDias.getDate()) {
          firstDay = 1;
          aux = 0;
          monthSelected += 1;

          if (monthSelected > 11) {
            monthSelected = 0;
            anioSelected = anioSelected + 1;
          }
        }

        //Recorremos todos los días de la semana

        var fechaFinal = thus.parseDate(
          new Date(anioSelected, monthSelected, firstDay + aux),
        );

        console.log(fechaFinal);

        if (data.hasChild(fechaFinal)) {
          counter += 1;
        }

        aux++;
      }

      aux = 0;

      thus.setState({counter});

      if (thus.state.counter >= thus.state.limite) {
        Alert.alert(
          'No se puede reservar',
          'El límite de reservas por semana corresponde a ' + thus.state.limite,
        );
      } else {
        callback(); //Llama a writeData()
      }

      userDatesRef.off('value'); //Apaga el listener para que no se repita
    });
  };

  writeData = (fechaRef, userRef, sectionId) => {

    var horario = this.state.horario

    // Sala de Eventos
    if (sectionId == 0) {
      fechaRef.child(horario).set({
        nombre: this.state.name,
        cantidad: this.state.cant,
        id_duenio: this.state.id,
      });

      userRef.child(horario).set({
        nombre: this.state.name,
        cantidad: this.state.cant,
      });

      Alert.alert(
        '¡Genial!',
        'Se ha agregado  la fecha exitosamente. Puedes revisar todas tus reservas en su seccion en el menú desplegable',
      );

    //Sala de Reuniones
    } else if (sectionId == 1) {
      fechaRef.child(horario).set({
        nombre: this.state.name,
        cantidad: this.state.cant,
        id_duenio: this.state.id,
      });

      userRef.child(horario).set({
        nombre: this.state.name,
        cantidad: this.state.cant,
      });

      Alert.alert(
        '¡Genial!',
        'Se ha agregado  la fecha exitosamente. Puedes revisar todas tus reservas en su seccion en el menú desplegable',
      );

    //Cowork
    } else if (sectionId == 2) {

      let thus = this
      var userId = this.state.id

      fechaRef.once('value').then(function(data) {

        var horarioExists = data.hasChild(horario)
        var cupos = ''
        var ownerId = data.child(horario+'/id_duenio').val()

        if (horarioExists) { //El horario seleccionado existe
          cupos = data.child(horario+'/cupos').val() //get de los cupos en firebase

          if (userId == ownerId) {
            cuposRestantes = parseInt(cupos, 10)
          } else {
            cuposRestantes = parseInt(cupos, 10) - 1
          }

        } else { //El horario no existe

          cupos = 32  //Cupos por defecto
          cuposRestantes = cupos - 1

        }

        console.log("Cupos restantes: " + cuposRestantes)

        if (cuposRestantes > 0) {

          fechaRef.child(horario+'/'+thus.state.mesa+'/'+thus.state.silla).set({
            nombre: thus.state.name,
          })

          userRef.child(horario).set({
            nombre: thus.state.name,
            cantidad: thus.state.cant,
          });

          Alert.alert(
            '¡Genial!',
            'Se ha agregado  la fecha exitosamente. Puedes revisar todas tus reservas en su seccion en el menú desplegable',
          );

        } else {
          Alert.alert(
            'Sin cupos',
            'No queda ningún cupo disponible en el espacio de Co-work'
          )
        }

      })

    } else {
      console.log("No llegó ningun sectionId")
    }

  }

/*  writeData = (fechaRef, userRef, sectionId) => {


    // Si tiene un hijo que contenga el contador de cupos que verifique cuanto queda
    // Si no tiene un hijo que contenga el contador de cupos, lo escribe a tope

    var horario = this.state.horario;
    var horario_2 = ''

    if (horario == 'manana') {
      horario_2 = 'tarde'
    } else {
      horario_2 = 'manana'
    }

    thus = this;

    fechaRef.once('value').then(function(data) {
      var hasHorario = data.hasChild(horario);
      var hasHorario_2 = data.hasChild(horario_2);
      var cupos = null

      console.log(data.child(horario).val().id_duenio)

      if (hasHorario) {
        if (thus.state.id == data.child(horario).val().id_duenio) {
          if (sectionId == 2) {

            cupos = data.child(horario).val().cupos

            fechaRef.child(horario).set({
              nombre: thus.state.name,
              cantidad: thus.state.cant,
              cupos: cupos
            });

            userRef.child(horario).set({
              nombre: thus.state.name,
              cantidad: thus.state.cant,
            });
          } else {
            fechaRef.child(horario).set({
              nombre: thus.state.name,
              cantidad: thus.state.cant,
              id_duenio: thus.state.id,
            });

            userRef.child(horario).set({
              nombre: thus.state.name,
              cantidad: thus.state.cant,
            });
          }

          Alert.alert(
            '¡Genial!',
            'Se ha editado la fecha exitosamente. Puedes revisar todas tus reservas en su seccion en el menú desplegable',
          );
        } else {
          Alert.alert(
            'Este horario ya está reservado por otra persona',
            'Revise la disponibilidad y seleccione otra fecha u horario del día',
          );
        }
      } else {
        if (hasHorario_2) {
          if (thus.state.id == data.child(horario_2).val().id_duenio) {
            Alert.alert(
              'Lo sentimos',
              'Solo puedes reservar un espacio por medio día, es decir, lo puedes reservar solo para mañana o solo para la tarde. Revisa nuestra sección de preguntas frecuentes para más dudas'
            );
          } else {
            fechaRef.child(horario).set({
              nombre: thus.state.name,
              cantidad: thus.state.cant,
              id_duenio: thus.state.id,
            });
            userRef.child(horario).set({
              nombre: thus.state.name,
              cantidad: thus.state.cant,
            });
            Alert.alert(
              '¡Genial!',
              'Se ha agregado la fecha exitosamente. Puedes revisar todas tus reservas en su seccion en el menu desplegable',
            );
          }
        } else {
          fechaRef.child(horario).set({
            nombre: thus.state.name,
            cantidad: thus.state.cant,
            id_duenio: thus.state.id,
          });
          userRef.child(horario).set({
            nombre: thus.state.name,
            cantidad: thus.state.cant,
          });
          Alert.alert(
            '¡Genial!',
            'Se ha agregado la fecha exitosamente. Puedes revisar todas tus reservas en su seccion en el menu desplegable',
          );
        }
      }
    });
  };
*/

  onButtonPress = async () => {

    const {navigation} = this.props
    const itemId = navigation.getParam('itemId', '0')
    const today = await new Date()
    var userId = await this.state.id
    var fechaRef = firebase.database().ref()
    var horario = this.state.horario
    var seccion = ''
    thus = this


    if (this.state.horario == 'manana') {
      this.state.fecha.setHours(8, 59, 0, 0);
    } else if (this.state.horario == 'tarde') {
      this.state.fecha.setHours(14, 59, 0, 0);
    }

    var diaSemana = await this.state.fecha.getDay();
    var fechaSeleccionada = this.parseDate(this.state.fecha);

    console.log("Fecha selecc: " + this.state.fecha)
    console.log("Horario selecc: " + this.state.horario)

    if (itemId == 0) {
      seccion = 'eventos'
    } else if (itemId == 1) {
      seccion = 'reuniones'
    } else if (itemId == 2) {
      seccion = 'cowork'
    } else {
      seccion = ''
    }

    fechaRef = firebase.database().ref('fechas/'+seccion+'/' + fechaSeleccionada)
    userRef = firebase.database().ref('usuarios/'+userId+'/reservas/'+seccion+'/'+ fechaSeleccionada)
    userDatesRef = firebase.database().ref('usuarios/'+userId+'/reservas/'+seccion)

    if (this.state.fecha - today < this.state.horas*(3.6*(Math.pow(10,6)))) {

      Alert.alert(
        '¡Lo sentimos!',
        'Las reservas deben realizarse a lo mucho con 2 horas de anticipación, previo al uso del espacio.',
      );
    } else {

      // Comprobamos condiciones para escribir

      fechaRef.once('value').then(function(data) {

        var horarioExists = data.hasChild(horario);
        var ownerId = data.child(horario+'/id_duenio').val()

        // Si la seccion de ID es de cowork lo del horario no corre

        if (itemId !== 2){

          if (horarioExists) { // El horario escogido ya existe

            if (userId !== ownerId) { //El ID del dueño de es diferente al ID del usuario actual
              Alert.alert(
                'Horario ocupado por otra persona',
                'Revisa la disponibilidad y selecciona otra fecha u horario'
              )
            } else { // El ID dueño es el mismo que el usuario actual

              thus.checkWeek(userDatesRef, function() {
                thus.writeData(fechaRef, userRef, itemId);
              });

            }

          } else { //Cowork

            thus.checkWeek(userDatesRef, function() {
              thus.writeData(fechaRef, userRef, itemId);

            });

          }

        } else {

          thus.checkWeek(userDatesRef, function() {
            thus.writeData(fechaRef, userRef, itemId);
          });

        }

      })

    }
  };

  static navigationOptions = {
    title: 'Formulario de Reserva',
  };

  render() {
    const {navigation} = this.props;
    const itemId = navigation.getParam('itemId', '0');
    var texto = '';

    isDisabled = false;
    if (itemId == 0 || itemId == 1) {
      texto = 'Cantidad de personas';
    } else {
      texto =
        'La reserva en este caso es solo de un espacio, si quiere usar más de uno otro usuario debe registrarlo.';
      isDisabled = true;
    }

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
            outputRange: [0, -1 * screenHeight],
            extrapolate: "clamp",
          }),
        },
      ],
    };

    if (itemId == 0 || itemId == 1) {
      return (
        <View style={styles.container}>
          <View style={styles.datepicker}>
            <Text
              style={{
                fontSize: 16,
                fontWeight: 'bold',
                color: '#878F9B',
                padding: 20,
              }}>
              Seleccione la fecha:{' '}
            </Text>
            <DatePicker
              mode="date"
              locale="spa"
              date={this.state.fecha}
              minimumDate={new Date(this.getToday())}
              maximumDate={this.getNextWeek()}
              onDateChange={fecha => this.setState({fecha})}
            />
          </View>
          <View style={styles.picker}>
            <Text style={{fontSize: 16, fontWeight: 'bold', color: '#878F9B'}}>
              Seleccione un horario:{' '}
            </Text>
            <Picker
              selectedValue={this.state.horario}
              onValueChange={h => this.setState({horario: h})}
              mode="dropdown">
              <Picker.Item label="Mañana" value="manana" />
              <Picker.Item label="Tarde" value="tarde" />
            </Picker>
          </View>
          <View style={styles.input}>
            <Text style={{fontSize: 16, fontWeight: 'bold', color: '#878F9B'}}>
              {texto}
            </Text>
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Input
                value={this.state.cant}
                placeholder="1"
                inputContainerStyle={{width: 30}}
                containerStyle={{width: 30}}
                disabled={isDisabled}
                onChangeText={t => this.setState({cant: t})}
                keyboardType={'numeric'}
              />
            </View>
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              onPress={this.onButtonPress.bind(this)}
            >
              <View style={styles.button}>
                <Text style={styles.buttonText}>RESERVAR</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      );
    } else {
      return (
        <View style={styles.container}>
          <ScrollView style={styles.container}>
            <View style={[styles.datepicker, {marginVertical: 0}]}>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: 'bold',
                  color: '#878F9B',
                  padding: 20,
                }}>
                Seleccione la fecha:{' '}
              </Text>
              <DatePicker
                mode="date"
                locale="spa"
                date={this.state.fecha}
                minimumDate={new Date(this.getToday())}
                maximumDate={this.getNextWeek()}
                onDateChange={fecha => this.setState({fecha})}
              />
            </View>
            <View style={styles.picker}>
              <Text style={{fontSize: 16, fontWeight: 'bold', color: '#878F9B'}}>
                Seleccione un horario:{' '}
              </Text>
              <Picker
                selectedValue={this.state.horario}
                onValueChange={h => this.setState({horario: h})}
                mode="dropdown">
                <Picker.Item label="Mañana" value="manana" />
                <Picker.Item label="Tarde" value="tarde" />
              </Picker>
            </View>
            <View style={styles.input}>
              <Text style={{fontSize: 16, fontWeight: 'bold', color: '#878F9B', paddingVertical: 10}}>
                {texto}
              </Text>
              <View
                style={styles.container}>
                <LayoutMesas onPress={this.handleOpen}>
                </LayoutMesas>
              </View>
            </View>

          </ScrollView>

          <Animated.View style={[StyleSheet.absoluteFill, styles.cover, backdrop]}>


            <View style={[styles.sheet]}>

              <Animated.View style={[styles.popup, slideUp]}>

                  <Text style={{fontSize: 18, fontWeight: '200'}}>Mesa {this.state.mesa}</Text>
                  <Text style={{fontSize: 14, fontWeight: '200',  marginHorizontal: width*0.1, marginTop: 20}}>Para reservar tu espacio presiona uno de los que se encuentre disponible aquí abajo</Text>

                  <LayoutSillas onPress={this.handleClickSilla} />

                  <TouchableOpacity onPress={this.handleClose} style={{width: width*0.7, alignItems: 'center'}}>
                    <View style={[styles.button, {width: width * 0.7}]}>
                      <Text style={[styles.buttonText, {color: 'white'}]}> VOLVER </Text>
                    </View>
                  </TouchableOpacity>

              </Animated.View>

            </View>

          </Animated.View>

        </View>
      );
    }


  }
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
  },
  picker: {
    marginHorizontal: '5%',
    flex: 0.3,
  },
  input: {
    marginHorizontal: '5%',
    flex: 0.3,
  },
  datepicker: {
    marginVertical: 10,
    alignItems: 'center',
  },
  buttonContainer: {
    flex: 0.5,
    marginHorizontal: '10%',
    justifyContent: 'center',
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

    elevation: 9,
  },
  buttonText: {
    padding: 9,
    color: 'white',
    fontSize: 15
  },
  cover: {
    backgroundColor: "rgba(0,0,0,.5)",
  },
  sheet: {
    position: "absolute",
    top: Dimensions.get("window").height,
    left: 0,
    right: 0,
    height: "100%",
    justifyContent: "flex-end",
    flex: 1
  },
  popup: {
    backgroundColor: "#FFF",
    marginHorizontal: 15,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    minHeight: '10%'
  },
});