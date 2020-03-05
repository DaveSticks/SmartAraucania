/* @flow */

import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  ActivityIndicator
} from 'react-native';
import { Icon, Card } from 'react-native-elements'
import Carousel from 'react-native-snap-carousel'

var width = Dimensions.get('window').width;
var height = Dimensions.get('window').height;

export default class Home extends Component {

  constructor(props){
    super(props);
    this.state = {
      selectedIndex: 0,
      buttonIsLoading: false,
      entries: [
        {
          titulo: 'Sala de Eventos',
          imagen: 'https://s7d5.scene7.com/is/image/FalabellaCO/hero_estudio_oficina_mobile_cr?$Hero_Mobile_right$',
          desc: 'Amplio espacio ubicado  en el cuarto piso del edificio capacitado para un numero moderado de gente especializado en eventos, cuenta con X cantidad de asientos y aire acondicionado que permite una mayor comodidad. Imagen de referencia, no guiarse por la misma.'
        },
        {
          titulo: 'Sala de Reuniones',
          imagen: 'http://as01.epimg.net/deporteyvida/imagenes/2018/02/28/portada/1519830649_122505_1519830777_noticia_normal.jpg',
          desc: 'Espacio ubicado en el cuarto piso del edificio especializado para reuniones contando con las características necesarias para que los participantes se sientan cómodos. Cuenta con un gran mesón y aire acondicionado. Imagen de referencia, no guiarse por la misma.'
        },
        {
          titulo: 'Co-work',
          imagen: 'http://folio.news/wp-content/uploads/2017/04/oficinas.jpg',
          desc: 'Espacio muy amplio de X metros cuadrados ubicado en el tercer piso del edificio y especializado en el trabajo colaborativo contando con las comidades para el mismo, en las que se incluye aire acondicionados. Imagen de referencia, no guiarse por la misma.'
        },
      ]
    }
  }

  static navigationOptions = ({ navigation }) => ({
    title: 'Seleccion de espacio',
    headerLeft: (
        <Icon type="ionicon" name="md-menu" onPress={navigation.getParam('toggleDrawer')} containerStyle={{marginHorizontal: 20}}/>
      ),
  });

  componentDidMount() {
    this.props.navigation.setParams({ toggleDrawer: this._toggleDrawer });
  }

  _toggleDrawer = () => {
    this.props.navigation.openDrawer();
    this.forceUpdate()
  }

  onSnapToItem = (i) => {
    this.setState({selectedIndex: i})
  }

  render() {

    const normalText = <Text style={styles.buttonText}>SELECCIONAR</Text>
    const loadingText = <ActivityIndicator />

    return (
      <View style={styles.container}>
          <Carousel
                  layout={'default'}
                  ref={(c) => { this._carousel = c; }}
                  data={this.state.entries}
                  renderItem={({item, index}) => {
                    return (
                      <View style={styles.container}>
                        <Card
                        title={item.titulo}
                        image={{uri: item.imagen}}>
                        <Text />
                        <Text style={{padding: 10}}>
                          {item.desc}
                        </Text>
                        <Text />
                        <TouchableOpacity
                          onPress={() => {
                          this.setState({
                            buttonIsLoading: true
                          }, () => {
                            this.props.navigation.navigate('Calendario', {
                              itemId: this.state.selectedIndex,
                            });

                            this.setState({
                              buttonIsLoading: false
                            })
                          })
                        }}>
                          <View style={styles.button}>
                            {this.state.buttonIsLoading ? loadingText : normalText}
                          </View>
                        </TouchableOpacity>
                        <Text />
                        </Card>
                      </View>
                    )
                  }}
                  sliderWidth={width}
                  itemWidth={width-100}
                  firstItem={this.state.selectedIndex}
                  onSnapToItem={this.onSnapToItem}
          />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
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
    padding: 10,
    color: 'white'
  }
});
