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
import MenuAdmin from './MenuAdmin';
import stylesLogin, {globalAssets} from './globalExports';
import {stylesAdmin} from './globalExports';
//import Login from './Login';
var GLOB_IP_PROD='http://52.27.104.46'
var GLOB_IP_DEV='http://127.0.0.1:8000'

var IP_IN_USE=GLOB_IP_PROD

const allClass = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];
const allSec = ['A', 'B', 'C'];

//type Props = {};
export default class StudentAddAdmin extends React.Component{
  
  constructor(props){
    super(props);
    this.state={
      'user_session':{},
      'user_id':'',
      'drawerClosed':true,
      'user_token':'',
      'subjectName':'',
      'subjectCode':'',
      'isMajor':'Major',
      'fullname':'',
      'emailid':'',
      'phone':'',
      'generatedPWD':'',
      'loginType':'Admin',
      'selectedClass':'1',
      'selectedSec':'A',
      'roll_number':'',
      'user_pwd':'',
      'father_name':'',
      'mother_name':'',
      'enrollment_number':'',
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
      this.setState({'user_id':obj_value.admin_id});

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
      if (obj_value == '"Admin"'){
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
          renderNavigationView={() => <MenuAdmin 
              _goToProfilePage={()=>this.goToProfilePage()}
              _goToStudentPage={()=>this.goToStudentPage()}
              _goToSubjectPage={()=>this.goToSubjectPage()}
              _goToTeacherPage={()=>this.goToTeacherPage()}
              _goToAssignSubjectToClassPage={()=>this.goToAssignSubjectToClassPage()}
              _goToExamsPage={()=>this.goToExamsPage()}
              _goToNoticePage={()=>this.goToNoticePage()}
              _goToViewNoticePage={()=>this.goToViewNoticePage()}
              _logout={()=>this.logout()}
              schoolName={this.state.schoolName}
            />}
        >
          <ActionBar
            containerStyle={stylesAdmin.bar}
            backgroundColor="#33cc33"
            leftIconName={'menu'}
            onLeftPress={this.toggleDrawer}/>
        <ScrollView style={stylesAdmin.Container}>
        
          
          <Text style={stylesAdmin.HeadingText}>Add Students to Class: {this.state.selectedClass}, Sec: {this.state.selectedSec} </Text>
          
          <View style={stylesAdmin.InputContainer}>
            <View style={{flex:1, 
              flexDirection:'row',
              justifyContent:'space-between',
              alignItems:'center',
            }}>
              <Text>Select Class: </Text>
              <ModalDropdown options={allClass} defaultValue={allClass[0]} onSelect={this.selectedClassMethod}
                style={{
                  borderWidth: 0,
                  borderRadius: 3,
                  width:60,
                  backgroundColor: 'cornflowerblue',
                }}
                dropdownStyle={{
                  flex:1, width: 60, height: 420,
              }}>          
              </ModalDropdown>
              <Text>Select Section: </Text>
              <ModalDropdown options={allSec} defaultValue={allSec[0]} onSelect={this.selectedSecMethod}
                style={{
                  borderWidth: 0,
                  borderRadius: 3,
                  width:60,
                  backgroundColor: 'cornflowerblue',
                }}
              >
          
              </ModalDropdown>
            </View>
            <TextInput style={stylesAdmin.Input} onChangeText={(roll_number)=>this.setState({roll_number})} value={this.state.roll_number}  placeholder='Roll Number of the student'></TextInput>
            <TextInput style={stylesAdmin.Input} onChangeText={(fullname)=>this.setState({fullname})} value={this.state.fullname}  placeholder='Full Name of the student'></TextInput>
            <TextInput onChangeText={(emailid)=>this.setState({emailid})} value={this.state.emailid} style={stylesAdmin.Input} placeholder='Email ID of the student'></TextInput>
            <TextInput style={stylesAdmin.Input} onChangeText={(phone)=>this.setState({phone})} value={this.state.phone}  placeholder='Mobile Number of the student'></TextInput>
            <TextInput style={stylesAdmin.Input} onChangeText={(user_pwd)=>this.setState({user_pwd})} value={this.state.user_pwd}  placeholder='Student Password'></TextInput>
            <TextInput style={stylesAdmin.Input} onChangeText={(enrollment_number)=>this.setState({enrollment_number})} value={this.state.enrollment_number}  placeholder='Enrollment number, also username'></TextInput>
            <TextInput style={stylesAdmin.Input} onChangeText={(father_name)=>this.setState({father_name})} value={this.state.father_name}  placeholder='Students Father Name'></TextInput>
            <TextInput style={stylesAdmin.Input} onChangeText={(mother_name)=>this.setState({mother_name})} value={this.state.mother_name}  placeholder='Students Mother name'></TextInput>
            <Text> </Text>           
            <TouchableOpacity onPress={() => this.addStudentsAlert()} style={stylesAdmin.ButtonContainer}>
              <Text style={stylesAdmin.ButtonText}>ADD Student</Text>
            </TouchableOpacity>
          </View>    
        </ScrollView>
      </DrawerLayout>
      
    );  
  }
  addStudentsAlert = () =>{
    //alert(a);
    Alert.alert(
      'Confirm Add Student',
      'Do you want to add the student ' + this.state.fullname + '?',
      [
        {text: 'No', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
        {text: 'Yes', onPress: () => this.addStudents()},
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
  addStudents = () =>{
    try{
      //alert("a"); 
      fetch(globalAssets.IP_IN_USE+'/addStudents/'+ this.state.user_token+'/'+ this.state.schoolName + '/', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: this.state.user_id,
          loginType: this.state.loginType,
          fullname: this.state.fullname,
          emailid: this.state.emailid,
          phone: this.state.phone,
          class: this.state.selectedClass,
          roll_number: this.state.roll_number,
          section: this.state.selectedSec,
          user_pwd: this.state.user_pwd,
          father_name: this.state.father_name,
          mother_name: this.state.mother_name,
          enrollment_number: this.state.enrollment_number,
        }),
      })
      .then((response) => response.json())
      .then((res) => {
        //console.log(res);
        //alert(res.success);
        //alert("a");
        if (res.success === 1){
          alert("Student added successfully.")

        }
        else{alert("Error adding student, student name or email or phone might exist already.");}
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
    this.props.navigation.navigate('Adminarea');
  }
  goToStudentPage = () =>{
    //alert("student page");
    this.props.navigation.navigate('StudentViewAdmin');
  }
  goToSubjectPage = () =>{
    //alert("subject page");
    this.props.navigation.navigate('SubjectViewAdmin');
  }
  goToTeacherPage = () =>{
    //alert("teacher page");
    this.props.navigation.navigate('TeacherViewAdmin');
  }
  goToAssignSubjectToClassPage = () =>{
    //alert("assign subject to Class");
    this.props.navigation.navigate('AddSubjectToClassAdmin');
  }
  goToExamsPage = () =>{
    //alert("Already on Exams page");
    this.props.navigation.navigate('ExamViewAdmin');
  }
  goToNoticePage = () =>{
    //alert("notice page");
    this.props.navigation.navigate('CreateNoticeAdmin');
  }
  goToViewNoticePage = () =>{
    //alert("notice page");
    this.props.navigation.navigate('NoticeViewAdmin');
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

}

