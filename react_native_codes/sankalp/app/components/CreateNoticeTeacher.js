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
  TextInput,
  Alert,

} from 'react-native';
//import { Navigator } from 'react-native-deprecated-custom-components';
import {StackNavigator} from 'react-navigation';
import ActionBar from 'react-native-action-bar';
import ModalDropdown from 'react-native-modal-dropdown';
import DrawerLayout from 'react-native-drawer-layout';
import MenuTeacher from './MenuTeacher';
import stylesLogin, {globalAssets} from './globalExports';
import {stylesAdmin} from './globalExports';
import CheckBox from 'react-native-check-box';
//import Login from './Login';
var GLOB_IP_PROD='http://52.27.104.46'
var GLOB_IP_DEV='http://127.0.0.1:8000'

var IP_IN_USE=GLOB_IP_PROD


//type Props = {};
export default class CreateNoticeTeacher extends React.Component{
  
  constructor(props){
    super(props);
    this.state={
      'user_session':{},
      'user_id':'',
      'drawerClosed':true,
      'user_token':'',
      'subject':'',
      'message':'',
      'loginType':'Teacher',
      'selectedClass':'1',
      'selectedSec':'A',
      'roll_number':'',
      'noticeFor':'Student',
      isAllClassesChecked:true,
      classesCheckedArray:{},
      isAllSectionsChecked:true,
      sectionsCheckedArray:{},
      'noticeObject':props.navigation.state.params.i,
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
    var value = await AsyncStorage.getItem('user_session');
    if (value !== null){
      //json_value = JSON.stringify(value);
      //alert(json_value);
      obj_value = JSON.parse(value);
      this.setState({'user_session':obj_value});
      this.setState({'user_id':obj_value.teacher_id});

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
              _goToExamsPage={()=>this.goToExamPage()}
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
        
          
          <Text>Create Notice For: {this.state.noticeFor}</Text>
          
          <View style={stylesAdmin.InputContainer}>
            <View style={{flex:1, 
              flexDirection:'row',
              justifyContent:'space-between',
              alignItems:'center',
            }}>
              <Text>Notice For:  {this.state.noticeObject.class} {this.state.noticeObject.section}</Text>
              <Text>Class Subject: {this.state.noticeObject.subject_name}</Text>
            </View>
            <TextInput style={stylesAdmin.Input} onChangeText={(subject)=>this.setState({subject})} value={this.state.subject}  placeholder='Subject (within 100 words)'></TextInput>
            <TextInput style={stylesAdmin.Input} multiline style={{ height: 100, backgroundColor: '#ccc' }}
            onChangeText={(message)=>this.setState({message})} value={this.state.message}  placeholder='Full message within 450 words'></TextInput>
            <Text> </Text>           
            
          </View> 
          <TouchableOpacity onPress={() => this.addNoticeAlert()} style={stylesAdmin.ButtonContainer}>
            <Text>Create Notice</Text>
          </TouchableOpacity>   
        </ScrollView>
      </DrawerLayout>
      
    );  
  }
  addNoticeAlert = () =>{
    //alert(a);
    Alert.alert(
      'Confirm Add Notice',
      'Do you want to add the Notice with the given details?',
      [
        {text: 'No', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
        {text: 'Yes', onPress: () => this.addNotice()},
      ],
      { cancelable: false }
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
  addNotice = () =>{

    var classes_selected = [this.state.noticeObject.class];
    var sections_selected = [this.state.noticeObject.section];
    try{
      //alert("a"); 
      fetch(globalAssets.IP_IN_USE+'/addNotice/'+ this.state.user_token+'/'+ this.state.schoolName + '/', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: this.state.user_id,
          loginType: this.state.loginType,
          all_class_selected: false,
          classes_selected: classes_selected,
          all_section_selected: false,
          sections_selected: sections_selected,
          noticeFor: this.state.noticeFor,
          subject: this.state.subject,
          message: this.state.message,
          singleStudent: false,

        }),
      })
      .then((response) => response.json())
      .then((res) => {
        //console.log(res);
        //alert(res.success);
        //alert("a");
        if (res.success === 1){
          alert("Notice added successfully.")

        }
        else{alert("Error adding notice.");}
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
  selectedSecMethod = (idx, value) => {
    //alert({idx} + " " + {value});
    //alert("1");
    this.setState({'selectedSec':value});
  }
  selectedClassMethod = (idx, value) => {
    //alert({idx} + " " + {value});
    //alert("1");
    this.setState({'selectedClass':value});
  }
  selectedNoticeForMethod = (idx, value) => {
    this.setState({'noticeFor':value});
  }

}

