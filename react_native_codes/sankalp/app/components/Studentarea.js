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
import MenuStudent from './MenuStudent';
import stylesLogin, {globalAssets} from './globalExports';
import {stylesAdmin} from './globalExports';
var version_package = require('./../../package.json');
//import Login from './Login';
var GLOB_IP_PROD='http://52.27.104.46'
var GLOB_IP_DEV='http://127.0.0.1:8000'

var IP_IN_USE=GLOB_IP_PROD

//type Props = {};
export default class Studentarea extends React.Component{
  
  constructor(props){
    super(props);
    this.state={
      'user_session':{},
      'drawerClosed':true,
      'user_token':'',
      'latest_version':'',
      'current_version':'',
      'user_id':'',
      'loginType':'Student',  
      'schoolName':'',    
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
    this.setState({'current_version':version_package.version});
    var value = await AsyncStorage.getItem('user_session');
    if (value !== null){
      //json_value = JSON.stringify(value);
      //alert(json_value);
      obj_value = JSON.parse(value);
      this.setState({'user_session':obj_value});
      this.setState({'user_id':obj_value.student_id});

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

    value = await AsyncStorage.getItem('schoolName');
    if (value !== null){
      //json_value = JSON.stringify(value);
      //alert(json_value);
      //obj_value = JSON.parse(value);
      this.setState({'schoolName':value});
      //alert(this.state.schoolName);
    }
    else{
      this.props.navigation.navigate('Login');
    }

    value = await AsyncStorage.getItem('session_type');
    //alert(value);
    if (value !== null){
      obj_value = JSON.stringify(value);

      //alert(obj_value);
      if (obj_value == '"Student"'){
        //alert("1");
      }
      else{
        this.props.navigation.navigate('Login');
      }
      //alert(this.state.user_token);
    }
    else{
      this.props.navigation.navigate('Login');
    }
    
    try{
      //alert("aaa" + this.state.user_id); 
      fetch(globalAssets.IP_IN_USE+'/fetchVersionInfo/', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: this.state.user_id,
          loginType: this.state.loginType,
        }),
      })
      .then((response) => response.json())
      .then((res) => {
        //console.log(res);
        //alert(res.success);
        //alert("a");
        if (res.success === 1){
          var ret_data = JSON.stringify(res.data);
          //this.state.numberOfSubjects=ret_data.length;
          //alert(ret_data);
          this.setState({'latest_version':res.data});
          //this.setState({'subjectDataList':res.data});
          //alert(this.state.subjectDataList);
        }
        else{alert("Invalid Login details");}
      })
      .catch((err)=>{
        alert("Network error. Please try again.");
      })
      .done();
    }
    catch(error){
      alert(error);
    }

    //alert(Platform.OS);
    this.timer = setInterval(()=> this.refreshVersion(), 30000);
  }
  refreshVersion = async() =>{
    var isFocused = this.props.navigation.isFocused();    
    //alert(isFocused);
    if (!isFocused)
      return;
    this.setState({'current_version':version_package.version});
    try{
      //alert("aaa" + this.state.user_id); 
      fetch(globalAssets.IP_IN_USE+'/fetchVersionInfo/', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: this.state.user_id,
          loginType: this.state.loginType,
        }),
      })
      .then((response) => response.json())
      .then((res) => {
        //console.log(res);
        //alert(res.success);
        //alert("a");
        if (res.success === 1){
          var ret_data = JSON.stringify(res.data);
          //this.state.numberOfSubjects=ret_data.length;
          //alert(ret_data);
          this.setState({'latest_version':res.data});
          //this.setState({'subjectDataList':res.data});
          //alert(this.state.subjectDataList);
        }
        else{alert("Invalid Login details");}
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
  displayVersionMessage(){
    if (this.state.latest_version != this.state.current_version){
      return (
        <View>
          <Text>Your version is not upto date with the latest version.</Text>
          <Text>Please download latest version from https://play.google.com/store/apps/details?id=com.sankalp.sankalpschool</Text>
          <Text>Current version: {this.state.current_version}</Text>
          <Text>Latest version: {this.state.latest_version}</Text>
        </View>
      );

    }
    else{
      return (
        <View>
          <Text>Your version is upto date with the latest version.</Text>
          <Text>Current version: {this.state.current_version}</Text>
          <Text></Text>
        </View>
      );
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
          renderNavigationView={() => <MenuStudent
              _goToProfilePage={()=>this.goToProfilePage()}
              _goToSubjectPage={()=>this.goToSubjectPage()}
              _goToExamPage={()=>this.goToExamPage()}
              _goToReceivedNoticePage={()=>this.goToReceivedNoticePage()}
              _logout={()=>this.logout()}
            />}
        >
          <ActionBar
            containerStyle={stylesAdmin.bar}
            backgroundColor="#33cc33"
            leftIconName={'menu'}
            onLeftPress={this.toggleDrawer}/>
        <ScrollView style={stylesAdmin.Container}>
        {this.displayVersionMessage()}
        <Text>Welcome      {this.state.user_session.student_id}</Text>
        <Text>Fullname:    {this.state.user_session.fullname}</Text>
        <Text>EmailID:     {this.state.user_session.emailid}</Text>
        <Text>Mobile:      {this.state.user_session.phone}</Text>
        <Text>Class:       {this.state.user_session.class}</Text>
        <Text>Section:     {this.state.user_session.section}</Text>
        <Text>Roll_number: {this.state.user_session.roll_number}</Text>        
        <TouchableOpacity onPress={this.logout} style={stylesAdmin.ButtonContainer}>
          <Text>LOG OUT</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={this.goToSubjectPage} style={stylesAdmin.ButtonContainer}>
          <Text>View Subjects</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={this.goToReceivedNoticePage} style={stylesAdmin.ButtonContainer}>
          <Text>View Received Notices.</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={this.goToExamPage} style={stylesAdmin.ButtonContainer}>
          <Text>View Exams</Text>
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
    this.props.navigation.navigate('Studentarea');
  }
  goToStudentPage = () =>{
    //alert("student page");

  }
  goToSubjectPage = () =>{
    //alert("subject page");
    this.props.navigation.navigate('SubjectViewStudent');
  }
  goToExamPage = () =>{
    //alert("exam page");
    this.props.navigation.navigate('ExamViewStudent');
  }
  goToTeacherPage = () =>{
    //alert("teacher page");
    //this.props.navigation.navigate('TeacherViewAdmin');
  }
  goToReceivedNoticePage = () =>{
    this.props.navigation.navigate('ReceivedNoticeViewStudent');
  }

}


