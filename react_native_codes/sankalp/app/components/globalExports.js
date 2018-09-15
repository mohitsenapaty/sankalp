import React, { Component } from 'react';
import {StyleSheet} from 'react-native';

var GLOB_IP_PROD='http://52.27.104.46/api'
var GLOB_IP_DEV='http://127.0.0.1:8000/api'

export const globalAssets = {
  background: require('../img/background_cc.jpg'),
  IP_IN_USE: GLOB_IP_PROD,
}

const stylesLogin = StyleSheet.create({
  Container:{
    flex:1,
  },
  BackgroundImage:{
    flex:1,
    alignSelf:'stretch',
    width:null,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center'
  },
  Content:{
    alignItems:'center',
  },
  Logo:{
    color:'black',
    fontSize: 40,
    fontWeight: 'bold',
    textShadowColor: '#ffffff',
    textShadowOffset: {width:2, height:2},
    textShadowRadius: 15,
    marginBottom: 20,
  },
  InputContainer:{
    margin:20,
    marginBottom: 0,
    padding: 20,
    paddingBottom: 0,
    alignSelf: 'stretch',
    borderWidth: 1,
    borderColor: '#000000',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  Input:{
    backgroundColor: 'rgba(255, 255, 255, 1)',
    fontSize: 12,
    marginBottom: 10,
    padding: 10,
    height: 40,
  },
  ButtonContainer:{
    alignSelf: 'stretch',
    margin: 20,
    padding: 20,
    backgroundColor: 'blue',
    borderWidth: 1,
    backgroundColor: 'rgba(255,255,255, 0.6)',
    alignItems: 'center'
  },
  ModalDropDownStyleThin:{
    borderWidth: 0,
    borderRadius: 3,
    width:20,
    backgroundColor: 'cornflowerblue',
  },
  ModalDropDownStyleMedium:{
    borderWidth: 0,
    borderRadius: 3,
    width:60,
    backgroundColor: 'cornflowerblue',
  },
  ModalDropDownStyleThick:{
    borderWidth: 0,
    borderRadius: 3,
    width:100,
    backgroundColor: 'cornflowerblue',
  }
});

export const stylesAdmin = StyleSheet.create({
  Container:{
    flex:1,
    padding:20,

  },
  screen: {
    backgroundColor: '#33cc33',
    flex: 1,
    paddingTop: 10,
    alignItems: 'center',
    //padding: 10
  },
  ButtonContainer:{
    alignSelf: 'stretch',
    margin: 20,
    padding: 20,
    backgroundColor: 'blue',
    borderWidth: 1,
    backgroundColor: 'rgba(255,255,255, 0.6)',
    alignItems: 'center'
  },
  ModalDropDownStyleThin:{
    borderWidth: 0,
    borderRadius: 3,
    width:20,
    backgroundColor: 'cornflowerblue',
  },
  ModalDropDownStyleMedium:{
    borderWidth: 0,
    borderRadius: 3,
    width:60,
    backgroundColor: 'cornflowerblue',
  },
  ModalDropDownStyleThick:{
    borderWidth: 0,
    borderRadius: 3,
    width:100,
    backgroundColor: 'cornflowerblue',
  }
});

export default stylesLogin;