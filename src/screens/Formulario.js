/* @flow */

import React, {Component} from 'react';
import {View, Text, StyleSheet, Dimensions, Picker, Alert, TouchableOpacity, ScrollView, Animated} from 'react-native';
import {Input, Icon} from 'react-native-elements';
import DatePicker from 'react-native-date-picker';
import firebase from 'firebase';
import LayoutMesas from '../components/layouts/Mesas/Layout.js'
import LayoutSillas from '../components/layouts/Sillas/Layout.js'
import ScrollPicker from 'react-native-picker-scrollview'

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
      limite: 0,  // Cantidad de reservas permitidas en una semana por seccion
      horas: 0,  // Maximo de horas de anticipacion a una reserva
      animation: new Animated.Value(0),
      mesa: 0,
      silla: 'E',
      maxCupos: 32,
      status: false,
      config: [],
      level: null,
      horasHorario: ["9:00", "9:30", "10:00", "10:30", "11:00", "11:30", "12:00", "12:30", "13:00"],
      isDisabled: false,
      isWrittable: true
    };

    this.horasManiana = ["9:00", "9:30", "10:00", "10:30", "11:00", "11:30", "12:00", "12:30", "13:00"]
    this.horasTarde = ["15:00", "15:30", "16:00", "16:30", "17:00", "17:30", "18:00", "18:30", "19:00"]
  }

  reservarCowork = () => {
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

    this.forceUpdate();

  };

  handleClose = () => {
    Animated.timing(this.state.animation, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };

  //Fix limite, se actualiza solo cuando hay hijos, ¿y si no los hay?
  handleDataFlow =  (ref, data) => {
    thus = this
    ref.on('child_added', (snapshot) => {
      if (thus.state.level === snapshot.key) {
        thus.setState({
          limite: snapshot.val().limiteReservas,
          horas: snapshot.val().horasMinimas
        })
      }
      // data.push({rol: snapshot.key, horas: snapshot.val().horasMinimas, limite: snapshot.val().limiteReservas})
      this.forceUpdate()

    })

    ref.on('child_changed', (snapshot) => {
      if (thus.state.level === snapshot.key) {
        thus.setState({
          limite: snapshot.val().limiteReservas,
          horas: snapshot.val().horasMinimas
        })
      }
      this.forceUpdate()

    })

  }

  getConfig = () => {

    var configRef = firebase.database().ref('config/')

    this.handleDataFlow(configRef, this.state.config)

  }

  getCurrentUser = () => {
    var thus = this;
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        thus.setState({name: user.displayName});
        thus.setState({id: user.uid});
        userRef = firebase.database().ref('usuarios/'+user.uid)
        userRef.once('value').then((data) => {
          var level = data.child('level').val()
          thus.setState({level}, () => {
            thus.getConfig()
          })
        })
      } else {
        console.log('NO HAY USUARIO');
      }

    });
  };

  componentDidMount() {
    this.getCurrentUser();
  }

  areDatesOverlaping = (ref) => {

    ref.once('value').then( (data) => {
      var arr = []
      arr.push(data.val())

      var keys = Object.keys(data.val())
      /* console.log("Keys: " + keys)
      console.log(keys[0])
      console.log(keys[1]) */

      for (var i = 0; i < keys.length; i++) {

          var periodo = keys[i].split("-")
          var periodoInicio = periodo[0]
          var periodoFinal = periodo[1]

          var arrPeriodoInicio = periodoInicio.split(":")
          var arrPeriodoFinal = periodoFinal.split(":")

          // arr[0] es la hora, arr[1] los minutos

          let horaPeriodoInicio = new Date(1970, 10, 1, arrPeriodoInicio[0], arrPeriodoInicio[1])
          let horaPeriodoFinal = new Date(1970, 10, 1, arrPeriodoFinal[0], arrPeriodoFinal[1])

          // Ahora comparamos la hora obtenida en la data con la que está seleccionada

          var strInicio = this.spHoraInicial.getSelected()
          var arrInicio = strInicio.split(":")
          var strFinal = this.spHoraFinal.getSelected()
          var arrFinal = strFinal.split(":")

          let horaSelectedInicio = new Date(1970, 10, 1, arrInicio[0], arrInicio[1])
          let horaSelectedFinal = new Date(1970, 10, 1, arrFinal[0], arrFinal[1])

          if ((horaPeriodoInicio < horaSelectedFinal) && (horaSelectedInicio < horaPeriodoFinal)) {
            this.setState({isWrittable: false})
            return Alert.alert("¡Cuidado!", "El periodo que escogiste se superpone con un periodo ya reservado previamente, intenta de nuevo con otro periodo o considera reservar otro día")
          }

          if (i === keys.length - 1) {
            console.log("se acabo")
          }
      }

    })

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

      userDatesRef.off('value'); //Apaga el listener para que no se repita, bug de firebase

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

        if (data.hasChild(fechaFinal)) { //Tiene un hijo llamado igual que la fecha

          if (data.child(fechaFinal).hasChildren()){ // El hijo tiene hijos
            counter += data.child(fechaFinal+'/manana').numChildren(); //Se suma la cantidad de hijos al contador
            counter += data.child(fechaFinal+'/tarde').numChildren(); //Se suma la cantidad de hijos al contador
          }

        }

        aux++;
      }

      aux = 0;

      thus.setState({counter}, () => {
        console.log("State Contador: " + thus.state.counter)
      });


      if (thus.state.counter >= thus.state.limite) {
        Alert.alert(
          'No se puede reservar',
          'El límite de reservas por semana corresponde a ' + thus.state.limite,
        );
      } else {
        callback(); //Llama a writeData()
      }

      console.log("TERMINÓ")

    });

  };

  writeData = (fechaRef, userRef, sectionId) => {

    var horario = this.state.horario

    // Sala de Eventos
    if (sectionId == 0) {
      var strInicio = this.spHoraInicial.getSelected()
      var strFinal = this.spHoraFinal.getSelected()

      fechaRef.child(horario+'/'+strInicio+'-'+strFinal).set({
        nombre: this.state.name,
        cantidad: this.state.cant,
        id_duenio: this.state.id,
      });

      userRef.child(horario+'/'+strInicio+'-'+strFinal).set({
        nombre: this.state.name,
        cantidad: this.state.cant,
      });

      Alert.alert(
        '¡Genial!',
        'Se ha agregado  la fecha exitosamente. Puedes revisar todas tus reservas en su seccion en el menú desplegable',
      );

    //Sala de Reuniones
    } else if (sectionId == 1) {
      var strInicio = this.spHoraInicial.getSelected()
      var strFinal = this.spHoraFinal.getSelected()

      fechaRef.child(horario+'/'+strInicio+'-'+strFinal).set({
        nombre: this.state.name,
        cantidad: this.state.cant,
        id_duenio: this.state.id,
      });

      userRef.child(horario+'/'+strInicio+'-'+strFinal).set({
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
      var mesa = this.state.mesa
      var silla = this.state.silla
      var userId = this.state.id
      var cupos = this.state.maxCupos

      fechaRef.once('value').then(function(data) {

        // Son 32 Cupos en total

        var horarioExists = data.hasChild(horario) //El horario escogido existe?
        var hasMesas = data.child(horario).hasChildren()
        var ownerId = data.child(horario+'/'+mesa+'/'+silla+'/id_duenio').val()

        // Si no tiene hijos se coloca por defecto
        // Si existe al menos un hijo, se extrae el total y se le resta uno y se sube

        if (!hasMesas) {

          fechaRef.child(horario).update({
            cupos_restantes: cupos - 1
          })

          fechaRef.child(horario+'/'+mesa+'/'+silla).update({
            nombre: thus.state.name,
            id_duenio: userId
          })

          userRef.child(horario+'/'+mesa+'/'+silla).set({
            nombre: thus.state.name,
          });

          Alert.alert(
            '¡Genial!',
            'Se ha agregado  la fecha exitosamente. Puedes revisar todas tus reservas en su seccion en el menú desplegable',
          );

        } else {

          // Obtiene el anterior y escribe

          var cupos_restantes = data.child(horario+'/cupos_restantes').val()

          userRef.child(horario).once('value').then((data) => {

            if (data.numChildren() > 0) {
              Alert.alert("¡Lo sentimos!", "Ya hay una reserva a tu nombre para esta fecha y/u horario")
            } else {

              cupos_restantes = parseInt(cupos_restantes, 0)

              if ((cupos_restantes - 1) >= 0) {

                fechaRef.child(horario).update({
                  cupos_restantes: (cupos_restantes - 1)
                })

                fechaRef.child(horario+'/'+mesa+'/'+silla).update({
                  nombre: thus.state.name,
                  id_duenio: userId
                })

                userRef.child(horario+'/'+mesa+'/'+silla).set({
                  nombre: thus.state.name,
                });

                Alert.alert(
                  '¡Genial!',
                  'Se ha agregado  la fecha exitosamente. Puedes revisar todas tus reservas en su seccion en el menú desplegable',
                );

              } else {
                Alert.alert("Cupos agotados", "¡Ya no quedan cupos disponibles!")
              }

            }

          })

        }

      })

    } else {
      console.log("No llegó ningun sectionId")
    }

  }

  onButtonPress = async () => {

    const {navigation} = this.props
    const itemId = navigation.getParam('itemId', '0')
    const today = await new Date()
    var userId = await this.state.id
    var fechaRef = firebase.database().ref()
    var horario = this.state.horario
    var seccion = ''
    thus = this

    if (itemId !== 2) {

      var strInicio = this.spHoraInicial.getSelected()
      var arrInicio = strInicio.split(":")
      var strFinal = this.spHoraFinal.getSelected()
      var arrFinal = strFinal.split(":")

      horaInicio = new Date(1970, 10, 1, arrInicio[0], arrInicio[1])
      horaFinal = new Date(1970, 10, 1, arrFinal[0], arrFinal[1])

      resta = (horaFinal - horaInicio) / 36e5

      if (resta <= 0.5) {
        Alert.alert("¡Lo sentimos!", "Debes reservar por lo menos 1 hora para trabajar en este espacio, busca otro horario o considera reservar otro día")
        return
      }

    }

    var strInicio = this.spHoraInicial.getSelected()
    var arrInicio = strInicio.split(":")
    var horaInicio = arrInicio[0]

    if (this.state.horario == 'manana') {
      this.state.fecha.setHours(8, 59, 0, 0);
    } else if (this.state.horario == 'tarde') {
      this.state.fecha.setHours(14, 59, 0, 0);
    }

    console.log("Hora inicial: " + this.spHoraInicial.getSelected())
    console.log("Hora final: " + this.spHoraFinal.getSelected())



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

    console.log("Horas: " + this.state.horas)
    console.log("Limite: " + this.state.limite)

    realHoras = (this.state.fecha - today) / 36e5
    console.log("La fecha escogida es: " +this.state.fecha)
    console.log("Hoy es: " + today)
    console.log("La resta es: " + realHoras)

    this.setState({isWrittable: true})

    await this.areDatesOverlaping(firebase.database().ref('fechas/'+seccion+'/' + fechaSeleccionada+'/'+horario))

    canWrite = this.state.isWrittable

    if (!canWrite) {
      return
    }

    if (((this.state.fecha - today) / 36e5) < this.state.horas) {

      Alert.alert(
        '¡Lo sentimos!',
        'Las reservas deben realizarse a lo mucho con '+ this.state.horas+ ' horas de anticipación, previo al uso del espacio.',
      );

    } else {

      // Comprobamos condiciones para escribir

      fechaRef.once('value').then(function(data) {

        var horarioExists = data.hasChild(horario+'/'+strInicio+'-'+strFinal);
        var ownerId = data.child(horario+'/'+strInicio+'-'+strFinal+'/id_duenio').val()
        console.log("OWNER ID" + ownerId)

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

          } else { // El horario escogido está vacio, no existe.

            thus.checkWeek(userDatesRef, function() {
              thus.writeData(fechaRef, userRef, itemId);

            });

          }

        //Cowork
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

    var fecha = this.parseDate(this.state.fecha);
    var ref = firebase.database().ref('fechas/cowork/'+fecha+'/'+this.state.horario+'/'+this.state.mesa)

    isDisabled = false;
    if (itemId == 0 || itemId == 1) {
      texto = 'Periodo de la reserva';
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
              onValueChange={h => this.setState({horario: h}, () => {
                if (h === 'manana') {
                  this.setState({horasHorario: this.horasManiana}, () => {
                    console.log(JSON.stringify(this.state.horasHorario))
                  })
                } else {
                  this.setState({horasHorario: this.horasTarde}, () => {
                    console.log(JSON.stringify(this.state.horasHorario))
                  })
                }
              })}
              mode="dropdown">
              <Picker.Item label="Mañana" value="manana" />
              <Picker.Item label="Tarde" value="tarde" />
            </Picker>
          </View>
          <Text style={{marginHorizontal: '5%', fontSize: 16, fontWeight: 'bold', color: '#878F9B'}}>
            {texto}
          </Text>

          <View style={styles.scrollpicker}>
            <ScrollPicker
                ref={(spHoraInicial) => {this.spHoraInicial = spHoraInicial}}
                dataSource={this.state.horasHorario}
                selectedIndex={0}
                renderItem={(data, index, isSelected) => {
                  return(
                    <View>
                      <Text>{data}</Text>
                    </View>
                  )
                }}
                onValueChange={(data, selectedIndex) => {

                  if (selectedIndex < this.state.horasHorario.length-3) {
                    this.spHoraFinal.scrollToIndex(selectedIndex+2)
                  } else {
                    this.spHoraFinal.scrollToIndex(this.state.horasHorario.length-1)
                  }

                }}
                wrapperHeight={100}
                wrapperWidth={70}
                wrapperColor={"#FFFFFF"}
                itemHeight={30}
                highlightColor={"#d8d8d8"}
                highlightBorderWidth={2}
                activeItemColor={"#222121"}
                itemColor={"#B4B4B4"}
            />
            <Text style={{paddingHorizontal: 10, alignSelf: 'center', color: '#d8d8d8'}}> hasta </Text>
            <ScrollPicker
                ref={(spHoraFinal) => {this.spHoraFinal = spHoraFinal}}
                dataSource={this.state.horasHorario}
                selectedIndex={2}
                renderItem={(data, index, isSelected) => {
                  return(
                    <View>
                      <Text>{data}</Text>
                    </View>
                  )
                }}
                onValueChange={(data, selectedIndex) => {
                  var strInicio = this.spHoraInicial.getSelected()
                  var arrInicio = strInicio.split(":")
                  var strFinal = data
                  var arrFinal = strFinal.split(":")

                  horaInicio = new Date(1970, 10, 1, arrInicio[0], arrInicio[1])
                  horaFinal = new Date(1970, 10, 1, arrFinal[0], arrFinal[1])

                  resta = (horaFinal - horaInicio) / 36e5

                  if (resta <= 0.5) {

                    newIndex = this.spHoraInicial.getSelectedIndex()+2

                    if(newIndex >= this.state.horasHorario.length-1){
                      newIndex = this.state.horasHorario.length-1
                    }

                    this.spHoraFinal.scrollToIndex(newIndex)

                  }

                }}
                wrapperHeight={100}
                wrapperWidth={70}
                wrapperColor={"#FFFFFF"}
                itemHeight={30}
                highlightColor={"#d8d8d8"}
                highlightBorderWidth={2}
                activeItemColor={"#222121"}
                itemColor={"#B4B4B4"}
            />
          </View>
          <View style={[styles.buttonContainer, {flex: 0.3}]}>
            <TouchableOpacity
              disabled={this.state.isDisabled}
              onPress={() => {
                this.onButtonPress()
              }}
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

                  <LayoutSillas onPress={this.handleClickSilla} fbref={ref}/>

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
  scrollpicker: {
    flexDirection: 'row',
    marginHorizontal: '5%',
    flex: 0.3,
    marginVertical: 20,
    justifyContent: 'center'
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

    elevation: 5,

  },
  buttonText: {
    padding: 10,
    color: 'white'
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
