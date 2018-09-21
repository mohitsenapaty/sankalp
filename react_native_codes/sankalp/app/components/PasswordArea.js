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

const schoolArray = ['Kaanger_Valley_Academy_Raipur',];

type Props = {};
export default class PasswordArea extends React.Component{
  
  render() {

    return (
      <View style={stylesLogin.Container}>
        <ImageBackground source={globalAssets.background} style={stylesLogin.BackgroundImage}>
          <View style={stylesLogin.Content}>
            <Text style={stylesLogin.Logo}> -SANKALP-
            </Text>
            <View style={stylesLogin.InputContainer}>
              <TextInput style={stylesLogin.Input} onChangeText={(username)=>this.setState({username})} value={this.state.username}  placeholder='Enter username (email for teacher/ enrollment_number for student)'></TextInput>
              <TextInput onChangeText={(phone)=>this.setState({phone})} value={this.state.phone} style={stylesLogin.Input} placeholder='Phone number registered to account'></TextInput>
              <Text>Login as: </Text>
              <ModalDropdown options={['Teacher', 'Student', 'Admin']} defaultValue='Teacher' onSelect={this.selectedPayMethod}
                style={stylesLogin.ModalDropDownStyleMedium}
              >
          
              </ModalDropdown>
              <Text>Select School: </Text>
              <ModalDropdown options={schoolArray} defaultValue={schoolArray[0]} onSelect={this.selectedSchoolMethod}
                style={stylesLogin.ModalDropDownStyleMedium}
              >
          
              </ModalDropdown>
              <TouchableOpacity onPress={this.login} style={stylesLogin.ButtonContainer}>
                <Text>Get Password in SMS.</Text>
              </TouchableOpacity>
            </View>
            <View style={stylesLogin.RegisterContainer}>
              <Text>
                Back to Login? <Text style={stylesLogin.RegisterText} onPress={this.register}>Click Here</Text>
              </Text>
            </View>
          </View>

        </ImageBackground>
      </View>
    );
  }

  constructor(props){
    super(props);
    this.state = {username:'', phone:'', loginType:'Teacher', schoolName:schoolArray[0]};
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
      else if (session_type == 'Student') this.props.navigation.navigate('Studentarea');
    }
  }

  register = () =>{
    this.props.navigation.navigate('Login');
  }

  selectedPayMethod = (idx, value) => {
    //alert({idx} + " " + {value});
    //alert("1");
    this.setState({'loginType':value});
  }
  selectedSchoolMethod = (idx, value) => {
    //alert({idx} + " " + {value});
    //alert("1");
    this.setState({'schoolName':value});
  }
  login = () => {
    //alert('login' + this.state.username + this.state.password);

    try{
      //alert("a"); 
      fetch(globalAssets.IP_IN_USE+'/getPasswordSMS/' + this.state.schoolName + '/', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: this.state.username,
          phone: this.state.phone,
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
            alert("Invalid selection");
          }
          else if (this.state.loginType=='Teacher'){
            alert("Password sent to phone number");

          }
          else if (this.state.loginType=='Student'){
            alert("Password sent to phone number");

          }
          else{
            //this.props.navigation.navigate('Adminarea');
          }

        }
        else{alert("Invalid details or tried too many times. Please contact school authorities.");}
      })
      .catch((err)=>{
        alert("Network error. Please try again.");
      })
      .done();
    }
    catch(error){
      alert(error);
    }
    
  }
  
}
