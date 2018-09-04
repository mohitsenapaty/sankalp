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
import ModalDropdown from 'react-native-modal-dropdown';
import DrawerLayout from 'react-native-drawer-layout';
import MenuAdmin from './MenuAdmin';
import stylesLogin, {globalAssets} from './globalExports';
import {stylesAdmin} from './globalExports';
//import Login from './Login';
var GLOB_IP_PROD='http://52.27.104.46';
var GLOB_IP_DEV='http://127.0.0.1:8000';

var IP_IN_USE=GLOB_IP_PROD;

const allClass = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];
const allSec = ['A', 'B', 'C'];
//type Props = {};
export default class StudentViewAdmin extends React.Component{
  
  constructor(props){
    super(props);
    this.state={
      'user_session':{},
      'user_id':'',
      'drawerClosed':true,
      'user_token':'',
      'numberOfTeachers':0,
      'teacherDataList':[],
      'studentDict':{},
      'studentDataList':[],
      'selectedClass':'1',
      'selectedSec':'A',
      'loginType':'Teacher',
      'subjectObject':props.navigation.state.params.i,
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

    try{
      //alert("aaa" + this.state.user_id); 
      fetch(globalAssets.IP_IN_USE+'/fetchAllStudentsForSubjectTeacher/'+this.state.user_token+'/', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: this.state.user_id,
          loginType: this.state.loginType,
          subject_id: this.state.subjectObject.subject_id,
          class: this.state.subjectObject.class,
          section: this.state.subjectObject.section,
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
          //this.setState({'numberOfTeachers':res.data.length,'teacherDataList':res.data});
          this.setState({'studentDataList':res.data});
          //alert(this.state.studentDict);
        }
        else{alert("Invalid Login details");}
      })
      .done();
    }
    catch(error){
      alert(error);
    }

    this.timer = setInterval(()=> this.refreshStudents(), 30000);

  }
  refreshStudents = async() =>{
    //alert("refresh");
    var isFocused = this.props.navigation.isFocused();    
    //alert(isFocused);
    if (!isFocused)
      return;
    try{
      //alert("aaa" + this.state.user_id); 
      fetch(globalAssets.IP_IN_USE+'/fetchAllStudentsForSubjectTeacher/'+this.state.user_token+'/', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: this.state.user_id,
          loginType: this.state.loginType,
          subject_id: this.state.subjectObject.subject_id,
          class: this.state.subjectObject.class,
          section: this.state.subjectObject.section,
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
          //this.setState({'numberOfTeachers':res.data.length,'teacherDataList':res.data});

          this.setState({'studentDataList':res.data});
          //alert(this.state.studentDict);
        }
        else{alert("Invalid Login details");}
      })
      .done();
    }
    catch(error){
      alert(error);
    }

  }
  displayStudentByRow(){
    return this.state.studentDataList.map((row_set, i)=>{
      return (
        <View key={i} style={{
          flex:1,
          borderBottomColor: 'black',
          borderBottomWidth: 1,
        }}>
          <Text>Full Name: {row_set.fullname} </Text>
          <Text>Class:     {row_set.class}</Text>
          <Text>Section:   {row_set.section}</Text>
          <Text>RollNumber:{row_set.roll_number}</Text>
          <Text onPress={()=>{this.goToSendNotice(row_set)}}>Send Notice to Student</Text>

        </View>
      );
    });
  }
  displayStudents(){
    //fetch list of subjects
    //alert(this.state.studentDict[this.state.selectedClass][this.state.selectedSec].length);
    if (this.state.studentDataList.length == 0){
      return(
        <View style={stylesAdmin.InputContainer}>
          <Text>Currently no students have been added yet.</Text>

        </View>
      );
    }
    else{
      //alert(this.state.subjectDataList);
      //alert(this.state.studentDict[this.state.selectedClass][this.state.selectedSec].length);
      return(
        <View style={stylesAdmin.InputContainer}>
          <Text>Currently these students have been added yet.</Text>
          { this.displayStudentByRow() }
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
          renderNavigationView={() => <MenuAdmin 
              _goToProfilePage={()=>this.goToProfilePage()}
              _goToStudentPage={()=>this.goToStudentPage()}
              _goToSubjectPage={()=>this.goToSubjectPage()}
              _goToTeacherPage={()=>this.goToTeacherPage()}
              _logout={()=>this.logout()}
            />}
        >
          <ActionBar
            containerStyle={stylesAdmin.bar}
            backgroundColor="#33cc33"
            leftIconName={'menu'}
            onLeftPress={this.toggleDrawer}/>
        <View style={{flex:1,}}>
          <ScrollView style={stylesAdmin.Container}>
          
            <Text>Students of Class: {this.state.selectedClass}, Sec: {this.state.selectedSec} </Text>
            <Text>Subject: {this.state.subjectObject.subject_name}</Text>
            {this.displayStudents()}
                 
          </ScrollView>
          <View>
            <TouchableOpacity onPress={this.goBack} style={stylesAdmin.ButtonContainer}>
              <Text>Click here to go back</Text>
            </TouchableOpacity> 
          </View>
        </View>
    </DrawerLayout>
      
    );  
  }
  goBack = () =>{
    this.props.navigation.navigate('SubjectViewTeacher');
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
  goToSendNotice = (i) => {
    this.props.navigation.navigate('SendNoticeIndividualStudentTeacher', {i},);
  }
  goToProfilePage = () =>{
    this.props.navigation.navigate('Teacherarea');
  }
  goToStudentPage = () =>{
    alert("already on student page");
  }
  goToSubjectPage = () =>{
    //alert("subject page");
    this.props.navigation.navigate('SubjectViewTeacher');
  }
  goToTeacherPage = () =>{
    //alert("teacher page");
    this.props.navigation.navigate('TeacherViewAdmin');
  }

}

