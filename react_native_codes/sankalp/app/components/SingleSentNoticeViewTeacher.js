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
  Alert,

} from 'react-native';
//import { Navigator } from 'react-native-deprecated-custom-components';
import {StackNavigator} from 'react-navigation';
import ActionBar from 'react-native-action-bar';
import DrawerLayout from 'react-native-drawer-layout';
import MenuTeacher from './MenuTeacher';
import stylesLogin, {globalAssets} from './globalExports';
import {stylesAdmin} from './globalExports';
//import Login from './Login';
var GLOB_IP_PROD='http://52.27.104.46'
var GLOB_IP_DEV='http://127.0.0.1:8000'

var IP_IN_USE=GLOB_IP_PROD

//type Props = {};
export default class SingleSentNoticeViewTeacher extends React.Component{
  
  constructor(props){
    super(props);
    this.state={
      'user_session':{},
      'user_id':'',
      'drawerClosed':true,
      'user_token':'',
      'numberOfSubjects':0,
      'subjectDataList':[],
      'loginType':'Teacher',
      current_id:0,
      'noticeObject':props.navigation.state.params.i,
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
      this.setState({'user_id':obj_value.teacher_id});
      //alert(obj_value);
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
    }
    else{
      this.props.navigation.navigate('Login');
    }

    value = await AsyncStorage.getItem('session_type');
    //alert(value);
    if (value !== null){
      obj_value = JSON.stringify(value);

      //alert(obj_value);
      if (obj_value == '"Teacher"'){
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

    //this.timer = setInterval(()=> this.refreshSubjects(), 30000)
    
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
          renderNavigationView={() => <MenuTeacher 
              _goToProfilePage={()=>this.goToProfilePage()}
              _goToSubjectPage={()=>this.goToSubjectPage()}
              _goToExamPage={()=>this.goToExamPage()}
              _goToReceivedNoticePage={()=>this.goToReceivedNoticePage()}
              _goToSentNoticePage={()=>this.goToSentNoticePage()}
              _logout={()=>this.logout()}
            />}
        >
          <ActionBar
            containerStyle={stylesAdmin.bar}
            backgroundColor="#33cc33"
            leftIconName={'menu'}
            onLeftPress={this.toggleDrawer}/>
        <ScrollView style={stylesAdmin.Container}>
          <Text>Notice ID:        {this.state.noticeObject.notification_id} </Text>
          <Text>Notice subject:   {this.state.noticeObject.subject} </Text>
          <Text>Created At:       {this.state.noticeObject.created_at} </Text>
          <Text>Notice For:       {this.state.noticeObject.target_type}</Text>
          <Text>Creator:          {this.state.noticeObject.notification_creator}</Text>
          <Text>Notice Body</Text>
          <Text></Text>
          <Text>{this.state.noticeObject.message}</Text>
        <TouchableOpacity onPress={this.goBack} style={stylesAdmin.ButtonContainer}>
          <Text>Go Back</Text>
        </TouchableOpacity>     
      </ScrollView>
    </DrawerLayout>
      
    );  
  }
  goBack = () =>{
    this.props.navigation.navigate('SentNoticeViewTeacher');
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
    this.props.navigation.navigate('Teacherarea');
  }
  goToStudentPage = () =>{
    //alert("student page");

  }
  goToSubjectPage = () =>{
    //alert("subject page");
    this.props.navigation.navigate('SubjectViewTeacher');
  }
  goToTeacherPage = () =>{
    //alert("teacher page");
    //this.props.navigation.navigate('TeacherViewAdmin');
  }
  goToExamPage = () =>{
    //alert("exam page");
    this.props.navigation.navigate('ExamViewTeacher');
  }
  goToReceivedNoticePage = () =>{
    this.props.navigation.navigate('ReceivedNoticeViewTeacher');
  }
  goToSentNoticePage = () =>{
    this.props.navigation.navigate('SentNoticeViewTeacher');
  }

}