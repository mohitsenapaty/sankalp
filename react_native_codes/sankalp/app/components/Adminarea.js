/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  Platform,
  StyleSheet,
  Text,
  View,
  AsyncStorage,
  TouchableOpacity,
  ScrollView,

} from 'react-native';
//import { Navigator } from 'react-native-deprecated-custom-components';
import {StackNavigator} from 'react-navigation';
import ActionBar from 'react-native-action-bar';
import DrawerLayout from 'react-native-drawer-layout';
import MenuAdmin from './MenuAdmin';
//import Login from './Login';
var GLOB_IP_PROD='http://52.27.104.46'
var GLOB_IP_DEV='http://127.0.0.1:8000'

//type Props = {};
export default class Adminarea extends React.Component{
  
  constructor(props){
    super(props);
    this.state={
      'user_session':{},
      'drawerClosed':true,
      'user_token':'',
    };
    this.toggleDrawer = this.toggleDrawer.bind(this);
    this.setDrawerState = this.setDrawerState.bind(this);

    this.goToProfilePage = this.goToProfilePage.bind(this);
    //this.goToBankPage = this.goToBankPage.bind(this);
    //this.goToMarketPage = this.goToMarketPage.bind(this);
    //this.goToWalletPage = this.goToWalletPage.bind(this);
    //this.goToTradePage = this.goToTradePage.bind(this);
    this.goToStudentPage = this.goToStudentPage.bind(this);
    this.goToSubjectPage = this.goToSubjectPage.bind(this);
    this.goToTeacherPage = this.goToTeacherPage.bind(this);
  }
  setDrawerState() {
    this.setState({
      drawerClosed: !this.state.drawerClosed,
    });
  }

  toggleDrawer = () => {
    if (this.state.drawerClosed) {
      this.DRAWER.openDrawer();
    } else {
      this.DRAWER.closeDrawer();
    }
  }
  componentDidMount(){
    this._loadInitialState().done();
  }
  _loadInitialState = async() => {
    //search for KYC/bank status using async
    var value = await AsyncStorage.getItem('user_session');
    if (value !== null){
      //json_value = JSON.stringify(value);
      //alert(json_value);
      obj_value = JSON.parse(value);
      this.setState({'user_session':obj_value});

    }
    else{
      this.props.navigation.navigate('Login');
    }

    value = await AsyncStorage.getItem('user_token');
    if (value !== null){
      //json_value = JSON.stringify(value);
      //alert(json_value);
      obj_value = JSON.parse(value);
      this.setState({'user_token':obj_value});
      //alert(this.state.user_token);
    }
    else{
      this.props.navigation.navigate('Login');
    }

    value = await AsyncStorage.getItem('session_type');
    //alert(value);
    if (value !== null){
      obj_value = JSON.stringify(value);

      //alert(obj_value);
      if (obj_value == '"Admin"'){
        alert("1");
      }
      else{
        this.props.navigation.navigate('Login');
      }
      //alert(this.state.user_token);
    }
    else{
      this.props.navigation.navigate('Login');
    }
    
  }
  render() {

    return (
      
      <DrawerLayout
          drawerWidth={300}
          ref={drawerElement => {
            this.DRAWER = drawerElement;
          }}
          drawerPosition={DrawerLayout.positions.left}
          onDrawerOpen={this.setDrawerState}
          onDrawerClose={this.setDrawerState}
          renderNavigationView={() => <MenuAdmin 
              _goToProfilePage={()=>this.goToProfilePage()}
              _goToStudentPage={()=>this.goToStudentPage()}
              _goToSubjectPage={()=>this.goToSubjectPage()}
              _goToTeacherPage={()=>this.goToTeacherPage()}
              _logout={()=>this.logout()}
            />}
        >
          <ActionBar
            containerStyle={styles.bar}
            backgroundColor="#33cc33"
            leftIconName={'menu'}
            onLeftPress={this.toggleDrawer}/>
        <ScrollView style={styles.Container}>
        
        <Text>Welcome {this.state.user_session.user_name}</Text>
        <Text>Welcome {this.state.user_session.name}</Text>
        <Text>Welcome {this.state.user_session.email}</Text>
        <Text>Welcome {this.state.user_session.phone}</Text>
        <TouchableOpacity onPress={this.logout} style={styles.ButtonContainer}>
          <Text>LOG OUT</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={this.goToStudentPage} style={styles.ButtonContainer}>
          <Text>Student Details</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={this.goToTeacherPage} style={styles.ButtonContainer}>
          <Text>Teacher Details</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={this.goToSubjectPage} style={styles.ButtonContainer}>
          <Text>Subject Details</Text>
        </TouchableOpacity>      
      </ScrollView>
    </DrawerLayout>
      
    );  
  }
  logout = () => {
    try{
      AsyncStorage.removeItem('user_session')
        .then((res1)=>{
          AsyncStorage.removeItem('session_type')
          .then((res2)=>{
            AsyncStorage.removeItem('user_token')
            .then((res)=>{ 
              this.props.navigation.navigate('Login');
            })
          })
        });
      //AsyncStorage.removeItem('user_session').then((res) => this.props.navigation.navigate('Login'));
    }
    catch(error){alert(error);};
    //navigate('Login');
    //alert("logging out");
    //this.props.navigation.navigate('Login');
  }

  goToProfilePage = () =>{
    this.props.navigation.navigate('Adminarea');
  }
  goToStudentPage = () =>{
    alert("student page");

  }
  goToSubjectPage = () =>{
    alert("subject page");
    this.props.navigation.navigate('SubjectViewAdmin');
  }
  goToTeacherPage = () =>{
    alert("teacher page");
  }
  /*
  goToKYCPage = () =>{
    this.props.navigation.navigate('KYCarea');
  }
  goToBankPage = () =>{
    this.props.navigation.navigate('Bankarea');
  }
  goToMarketPage = () =>{
    this.props.navigation.navigate('Marketarea');
  }
  goToWalletPage = () =>{
    this.props.navigation.navigate('Walletarea');
  }
  goToTradePage = () =>{
    this.props.navigation.navigate('Tradearea');
  }*/

}


const styles = StyleSheet.create({
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
});

/*
<TouchableOpacity onPress={this.goToKYCPage} style={styles.ButtonContainer}>
          <Text>KYC Status:{this.state.kycDone}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={this.goToBankPage} style={styles.ButtonContainer}>
          <Text>Payment details</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={this.goToMarketPage} style={styles.ButtonContainer}>
          <Text>Market</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={this.goToWalletPage} style={styles.ButtonContainer}>
          <Text>Wallet</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={this.goToTradePage} style={styles.ButtonContainer}>
          <Text>Trade</Text>
        </TouchableOpacity>    
*/
