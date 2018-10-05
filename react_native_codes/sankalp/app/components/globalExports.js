import React, { Component } from 'react';
import {StyleSheet} from 'react-native';

var GLOB_IP_PROD='http://52.27.104.46/api'
var GLOB_IP_DEV='http://127.0.0.1:8000/api'

export const globalAssets = {
  background: require('../img/kva_background.jpg'),
  IP_IN_USE: GLOB_IP_DEV,
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
    paddingBottom: 5,
    alignSelf: 'stretch',
    borderWidth: 1,
    borderColor: '#000000',
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
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
    borderRadius: 10,
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
  },
  RegisterContainer:{
    //flex: 1,
    color: '#ffffff',

  },
  RegisterText:{
    color: '#ffffff',
    
  },
  RegisterTextBold:{
    color: '#ffffff',
    fontWeight: 'bold',
  }
});

export const stylesAdmin = StyleSheet.create({
  Container:{
    flex:1,
    padding:20,
    backgroundColor: '#d1d55e',
  },
  InputContainer:{
    margin:5,
    marginBottom: 10,
    padding: 5,
    paddingBottom: 0,
    alignSelf: 'stretch',
    borderWidth: 1,
    borderColor: '#33cc33',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
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
    padding: 15,
    backgroundColor: 'blue',
    borderWidth: 1,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255, 0.6)',
    alignItems: 'center',
    //fontSize: 20,
  },
  ButtonText:{
    fontSize:20,
  },
  HeadingText:{
    fontSize: 15,
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
  },
  AssignLinkText:{
    fontWeight:'bold',
    color:'#228b22',
  },
  NavigateLinkText:{
    fontWeight:'bold',
    color:'#a020f0',
  },
  DeleteLinkText:{
    fontWeight:'bold',
    color:'#b22222',
  },
  ButtonContainerBackground:{
    backgroundColor: '#d1d55e',
  },
  VersionMessageStyleUN:{
    color:'#ff0000',
    fontSize:10,
  },
  VersionMessageStyle:{
    color:'#3333cc',
    fontSize:10,
  }
});

export default stylesLogin;