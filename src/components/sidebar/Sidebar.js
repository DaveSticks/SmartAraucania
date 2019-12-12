/* @flow */

import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Button,
  ImageBackground,
  ActivityIndicator,
} from 'react-native';
import {Avatar, Divider, Icon} from 'react-native-elements';
import ImagePicker from 'react-native-image-picker';
import {GoogleSignin} from 'react-native-google-signin';
import firebase from 'firebase';
import RNFetchBlob from 'react-native-fetch-blob';

const HEIGHT = Dimensions.get('window').height;
const WIDTH = Dimensions.get('window').width;
const Blob = RNFetchBlob.polyfill.Blob;
const fs = RNFetchBlob.fs;
window.XMLHttpRequest = RNFetchBlob.polyfill.XMLHttpRequest;
window.Blob = Blob;

export default class Sidebar extends Component {
  _isMounted = false;

  constructor(props) {
    super(props);
    this.state = {
      img: 'https://s3.amazonaws.com/uifaces/faces/twitter/ladylexy/128.jpg',
      name: null,
      email: 'DEFAULT',
      id: '',
      isLoading: true,
      isEmpty: false,
      userLevel: '',
    };
  }

  getCurrentUser = () => {
    var thus = this;
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        var userRef = firebase.database().ref('usuarios/' + user.uid);

        thus.setState({img: user.photoURL});
        thus.setState({email: user.email});
        thus.setState({id: user.uid});
        thus.setState({name: user.displayName});

        userRef.once('value').then(function(data) {
          var userLevel = data.child('level').val();
          thus.setState({
            userLevel,
          });
          console.log('Nivel de usuario: ' + thus.state.userLevel);
        });
      } else {
        console.log('NO HAY USUARIO');
      }
    });
  };

  componentDidMount() {
    this._isMounted = true;
    if (this._isMounted) {
      this.getCurrentUser();
      this.props.navigation.setParams({signOut: this._signOut});
      if (this.state.img && this.state.email && this.state.name) {
        this.setState({
          isLoading: false,
        });
      } else {
        var thus = this;
        var user = firebase.auth().currentUser;
        setTimeout(function() {
          thus.setState({name: user.displayName});
        }, 3000);
        this.setState({
          isLoading: false,
        });
      }
    }
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  revokeAccess = async () => {
    try {
      await GoogleSignin.revokeAccess();
      console.log('REVOKED ACCESS');
    } catch (error) {
      console.log(error);
    }
  };

  _signOut = async () => {
    const isSignedIn = await GoogleSignin.isSignedIn();

    if (isSignedIn) {
      this.revokeAccess();
    }

    firebase
      .auth()
      .signOut()
      .then(function() {
        console.log('SESION CERRADA');
      })
      .catch(function(error) {
        console.log(error);
      });
  };

  navLink(nav, text) {
    return (
      <TouchableOpacity
        style={{height: 50}}
        onPress={() => this.props.navigation.navigate(nav)}>
        <Text style={styles.links}>{text}</Text>
      </TouchableOpacity>
    );
  }

  updateUserProfile = (downloadURL, sessionId) => {
    let currentUser = firebase.auth().currentUser;
    thus = this;
    const imageRef = firebase
      .storage()
      .ref('usuarios')
      .child(currentUser.uid);
    currentUser
      .updateProfile({
        photoURL: downloadURL,
      })
      .then(function() {
        thus.setState({
          img: downloadURL,
        });
        console.log('URL DE LA FOTO: ' + currentUser.photoURL);
      });
  };

  uploadImage = (uri, mime = 'image/jpeg') => {
    return new Promise((resolve, reject) => {
      let currentUser = firebase.auth().currentUser;
      const uploadUri =
        Platform.OS === 'ios' ? uri.replace('file://', '') : uri;
      const sessionId = new Date().getTime();
      let uploadBlob = null;
      var thus = this;
      const imageRef = firebase
        .storage()
        .ref('usuarios')
        .child(currentUser.uid);

      fs.readFile(uploadUri, 'base64')
        .then(data => {
          return Blob.build(data, {type: `${mime};BASE64`});
        })
        .then(blob => {
          uploadBlob = blob;
          return imageRef.put(blob, {contentType: mime});
        })
        .then(() => {
          uploadBlob.close();
          return imageRef.getDownloadURL();
        })
        .then(url => {
          resolve(url);
          thus.updateUserProfile(url, sessionId);
        })
        .catch(error => {
          reject(error);
        });
    });
  };

  changeAvatar = () => {
    thus = this;

    ImagePicker.showImagePicker(options, response => {
      //console.log('Response = ', response.data);
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        thus.uploadImage(response.uri);
      }
    });
  };

  render() {
    if (this.state.isLoading) {
      return (
        <View style={styles.container}>
          <View style={styles.top}>
            <ActivityIndicator />
          </View>
          <View style={styles.middle}>
            {this.navLink('Reservas', 'Mis reservas')}
            {this.navLink('Home', 'Selección de espacio')}
            {this.navLink('FAQ', 'FAQ')}
            {this.state.userLevel == 'admin' ? this.navLink('Administracion', 'Ajustes de aplicación') : console.log("No es admin")}
            <Divider style={{backgroundColor: 'gray'}} />
          </View>
          <Icon
            type="ionicon"
            name="md-exit"
            color="#FF6663"
            raised
            containerStyle={{marginHorizontal: 20, marginVertical: 10}}
            onPress={this.props.navigation.getParam('signOut')}
          />
          <Divider style={{backgroundColor: 'gray'}} />
          <View style={styles.footer}>
            <Text style={{margin: 10, fontSize: 10}}>
              Agenda Cowork - Smart Araucanía{' '}
            </Text>
          </View>
        </View>
      );
    }
    return (
      <View style={styles.container}>
        <View style={styles.top}>
          <ImageBackground
            source={{uri: this.state.img}}
            blurRadius={10}
            style={{
              width: '100%',
              height: '100%',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Avatar
              containerStyle={{margin: 10}}
              rounded
              size="large"
              source={{uri: this.state.img}}
              showEditButton
              onPress={this.changeAvatar.bind(this)}
            />
            <Text style={{color: 'white'}}>{this.state.name}</Text>
            <Text style={{color: 'white'}}>{this.state.email}</Text>
            <Text style={{color: 'white', fontSize: 12}}>{this.state.id}</Text>
          </ImageBackground>
        </View>
        <View style={styles.middle}>
          {this.navLink('Reservas', 'Mis reservas')}
          {this.navLink('Home', 'Selección de espacio')}
          {this.navLink('FAQ', 'Preguntas frecuentes')}
          {this.state.userLevel == 'admin' ? this.navLink('Administracion', 'Ajustes de aplicación') : console.log("No es admin")}
          <Divider style={{backgroundColor: 'gray'}} />
        </View>
        <Icon
          type="ionicon"
          name="md-exit"
          color="#FF6663"
          raised
          containerStyle={{marginHorizontal: 20, marginVertical: 10}}
          onPress={this.props.navigation.getParam('signOut')}
        />
        <Divider style={{backgroundColor: 'gray'}} />
        <View style={styles.footer}>
          <Text style={{margin: 10, fontSize: 10}}>
            Agenda de Reservas - Smart Araucanía{' '}
          </Text>
        </View>
      </View>
    );
  }
}

const options = {
  title: 'Selecciona una opción',
  storageOptions: {
    path: 'images_uploaded',
    cameraRoll: true,
  },
  cancelButtonTitle: 'Ya no quiero',
  takePhotoButtonTitle: 'Tomar foto',
  chooseFromLibraryButtonTitle: 'Escoger foto de la galería',
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  top: {
    height: HEIGHT * 0.25,
    backgroundColor: 'black',
    alignItems: 'center',
    justifyContent: 'center',
  },
  middle: {
    flex: 1,
    marginTop: 10,
  },
  footer: {
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: 'black',
  },
  links: {
    flex: 1,
    fontSize: 16,
    padding: 5,
    paddingLeft: 10,
    margin: 5,
    textAlign: 'left',
  },
});
