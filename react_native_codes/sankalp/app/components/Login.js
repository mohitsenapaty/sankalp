import React, { Component } from 'react';
import {
  AppRegistry,
  Platform,
  StyleSheet,
  Text,
  View,
  Image,
  ImageBackground,
  TextInput,
  TouchableOpacity,
  AsyncStorage,

} from 'react-native';
//import Memberarea from './Memberarea';
//import {StackNavigator} from 'react-navigation';
import {StackNavigator} from 'react-navigation';
import ModalDropdown from 'react-native-modal-dropdown';
import stylesLogin, {globalAssets} from './globalExports';

var GLOB_IP_PROD='http://52.27.104.46'
var GLOB_IP_DEV='http://127.0.0.1:8000'

var IP_IN_USE=GLOB_IP_PROD

type Props = {};
export default class Login extends React.Component{
  
  render() {

    return (
      <View style={stylesLogin.Container}>
        <ImageBackground source={globalAssets.background} style={stylesLogin.BackgroundImage}>
          <View style={stylesLogin.Content}>
            <Text style={stylesLogin.Logo}> -SANKALP-
            </Text>
            <View style={stylesLogin.InputContainer}>
              <TextInput style={stylesLogin.Input} onChangeText={(username)=>this.setState({username})} value={this.state.username}  placeholder='Username'></TextInput>
              <TextInput secureTextEntry={true} onChangeText={(password)=>this.setState({password})} value={this.state.password} style={stylesLogin.Input} placeholder='Password'></TextInput>
              <Text>Login as: </Text>
              <ModalDropdown options={['Teacher', 'Student', 'Admin']} defaultValue='Teacher' onSelect={this.selectedPayMethod}>
          
              </ModalDropdown>
              <TouchableOpacity onPress={this.login} style={stylesLogin.ButtonContainer}>
                <Text>LOG IN</Text>
              </TouchableOpacity>
            </View>
            <View style={stylesLogin.RegisterContainer}>
              <Text>
                Don't have an account? <Text style={stylesLogin.RegisterText} onPress={this.register}>Register Here</Text>
              </Text>
            </View>
          </View>
        </ImageBackground>
      </View>
    );
  }

  constructor(props){
    super(props);
    this.state = {username:'', password:'', loginType:'Teacher'};
  }

  componentDidMount(){
    this._loadInitialState().done();
  }
  _loadInitialState = async() => {
    var value = await AsyncStorage.getItem('user_session');
    var session_type = await AsyncStorage.getItem('session_type');
    if (value !== null){
      //json_value = JSON.stringify(value);
      //alert(json_value);
      if (session_type == 'Admin') this.props.navigation.navigate('Adminarea');
      else if (session_type == 'Teacher') this.props.navigation.navigate('Teacherarea');
    }
  }

  register = () => {
    alert("Register");
    this.props.navigation.navigate('Registerarea');
  }

  selectedPayMethod = (idx, value) => {
    //alert({idx} + " " + {value});
    //alert("1");
    this.setState({'loginType':value});
  }
  login1 = () => {
    alert("Hello " + this.state.username + this.state.password + this.state.loginType);
  }
  login = () => {
    //alert('login' + this.state.username + this.state.password);

    try{
      //alert("a"); 
      fetch(globalAssets.IP_IN_USE+'/login/', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: this.state.username,
          password: this.state.password,
          loginType: this.state.loginType,
        }),
      })
      .then((response) => response.json())
      .then((res) => {
        //console.log(res);
        //alert(res.success);
        //alert("a");
        if (res.success === 1){
          
          if (this.state.loginType=='Admin'){
            
            alert("Login Success");
            alert(res.data.user_name + " " + res.data.admin_id + " " + res.data.name + " " + res.data.email + " " + res.data.phone)
            user_session = JSON.stringify(res.data);
            
            user_token = JSON.stringify(res.token);
            //AsyncStorage.setItem('user_session', user_session);
            //AsyncStorage.setItem('user_token', user_token);
            //AsyncStorage.setItem('session_type', 'Admin');
            //this.props.navigation.navigate('Adminarea');
            AsyncStorage.setItem('user_session', user_session)
            .then((res1)=>{
              AsyncStorage.setItem('user_token', user_token)
              .then((res2)=>{
                AsyncStorage.setItem('session_type', 'Admin')
                .then((res)=>{ 
                  this.props.navigation.navigate('Adminarea')
                })
              })
            });
          }
          else if (this.state.loginType=='Teacher'){
            alert("Login Success");
            alert(res.data.user_name + " " + res.data.admin_id + " " + res.data.name + " " + res.data.email + " " + res.data.phone)
            user_session = JSON.stringify(res.data);

            user_token = JSON.stringify(res.token);

            AsyncStorage.setItem('user_session', user_session)
            .then((res1)=>{
              AsyncStorage.setItem('user_token', user_token)
              .then((res2)=>{
                AsyncStorage.setItem('session_type', 'Teacher')
                .then((res)=>{ 
                  this.props.navigation.navigate('Teacherarea')
                })
              })
            });

          }
          else if (this.state.loginType=='Student'){
            alert("Login Success");
            alert(res.data.user_name + " " + res.data.admin_id + " " + res.data.name + " " + res.data.email + " " + res.data.phone)
            user_session = JSON.stringify(res.data);

            user_token = JSON.stringify(res.token);

            AsyncStorage.setItem('user_session', user_session)
            .then((res1)=>{
              AsyncStorage.setItem('user_token', user_token)
              .then((res2)=>{
                AsyncStorage.setItem('session_type', 'Student')
                .then((res)=>{ 
                  this.props.navigation.navigate('Studentarea')
                })
              })
            });

          }
          else{
            //this.props.navigation.navigate('Adminarea');
          }

        }
        else{alert("Invalid Login details");}
      })
      .done();
    }
    catch(error){
      alert(error);
    }
    
  }
  
}
