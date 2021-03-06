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
  Linking,
  Alert,

} from 'react-native';
//import { Navigator } from 'react-native-deprecated-custom-components';
import {StackNavigator} from 'react-navigation';
import ActionBar from 'react-native-action-bar';
import DrawerLayout from 'react-native-drawer-layout';
import MenuAdmin from './MenuAdmin';
import stylesLogin, {globalAssets} from './globalExports';
import {stylesAdmin} from './globalExports';
var version_package = require('./../../package.json');
//import Login from './Login';
var GLOB_IP_PROD='http://52.27.104.46'
var GLOB_IP_DEV='http://127.0.0.1:8000'

var IP_IN_USE=GLOB_IP_PROD

//type Props = {};
export default class SingleStudentDetailAdmin extends React.Component{
  
  constructor(props){
    super(props);
    this.state={
      'user_session':{},
      'drawerClosed':true,
      'user_token':'',
      'latest_version':'',
      'current_version':'',
      'user_id':'',
      'loginType':'Admin',
      'schoolName':'',
      'student_id':props.navigation.state.params.i.student_id,
      studentObject: props.navigation.state.params.i,
      'student_data':{},
      'student_personal_data':{},
      'student_house_data':{},
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
    //this.setState({'current_version':version_package.version});
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
    this.timer = setInterval(()=> this.refreshVersion(), 30000);

    try{
      //alert("aaa" + this.state.student_id); 
      fetch(globalAssets.IP_IN_USE+'/fetchSingleStudentCompleteDetail/'+this.state.user_token+'/'+ this.state.schoolName + '/', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: this.state.user_id,
          loginType: this.state.loginType,
          student_id: this.state.student_id,
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
          this.setState({'student_data':res.data});
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

    try{
      //alert("aaa" + this.state.student_id); 
      fetch(globalAssets.IP_IN_USE+'/fetchSingleStudentHouseDetail/'+this.state.user_token+'/'+ this.state.schoolName + '/', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: this.state.user_id,
          loginType: this.state.loginType,
          student_id: this.state.student_id,
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
          this.setState({'student_house_data':res.data});
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

    try{
      //alert("aaa" + this.state.student_id); 
      fetch(globalAssets.IP_IN_USE+'/fetchSingleStudentPersonalDetail/'+this.state.user_token+'/'+ this.state.schoolName + '/', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: this.state.user_id,
          loginType: this.state.loginType,
          student_id: this.state.student_id,
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
          this.setState({'student_personal_data':res.data});
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
  refreshVersion = async() =>{
    var isFocused = this.props.navigation.isFocused();    
    //alert(isFocused);
    if (!isFocused)
      return;
    try{
      //alert("aaa" + this.state.user_id); 
      fetch(globalAssets.IP_IN_USE+'/fetchSingleStudentCompleteDetail/'+this.state.user_token+'/'+ this.state.schoolName + '/', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: this.state.user_id,
          loginType: this.state.loginType,
          student_id: this.state.student_id,
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
          this.setState({'student_data':res.data});
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
    try{
      //alert("aaa" + this.state.student_id); 
      fetch(globalAssets.IP_IN_USE+'/fetchSingleStudentHouseDetail/'+this.state.user_token+'/'+ this.state.schoolName + '/', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: this.state.user_id,
          loginType: this.state.loginType,
          student_id: this.state.student_id,
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
          this.setState({'student_house_data':res.data});
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

    try{
      //alert("aaa" + this.state.student_id); 
      fetch(globalAssets.IP_IN_USE+'/fetchSingleStudentPersonalDetail/'+this.state.user_token+'/'+ this.state.schoolName + '/', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: this.state.user_id,
          loginType: this.state.loginType,
          student_id: this.state.student_id,
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
          this.setState({'student_personal_data':res.data});
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
  personal_detail_render(){
    if (this.state.student_personal_data && this.state.student_personal_data.hostel_resident == 'Yes'){
      return(
        <View style={stylesAdmin.InputContainer}>
          <Text>Personal Details have been added.</Text>
          <Text>Date of birth: {this.state.student_personal_data.date_of_birth}</Text>
          <Text>Hostel Resident: {this.state.student_personal_data.hostel_resident}</Text>
          <Text>Hostel Name: {this.state.student_personal_data.hostel_name}</Text>
          <Text>Hostel Address: {this.state.student_personal_data.hostel_address}</Text>
          <Text>FDB or DB: {this.state.student_personal_data.fdb_db}</Text>
          <Text style={stylesAdmin.ButtonText} style={stylesAdmin.DeleteLinkText} onPress={()=>{this.deletePersonalDetailAlert()}}>Delete Personal Details.</Text>
        </View>
      );
    }
    else if (this.state.student_personal_data && this.state.student_personal_data.hostel_resident == 'No'){
      return(
        <View style={stylesAdmin.InputContainer}>
          <Text>Personal Details have been added.</Text>
          <Text>Date of birth: {this.state.student_personal_data.date_of_birth}</Text>
          <Text>Hostel Resident: {this.state.student_personal_data.hostel_resident}</Text>
          <Text>Residential Address: {this.state.student_personal_data.residential_address}</Text>
          <Text>Transportation: {this.state.student_personal_data.transportation}</Text>
          <Text>FDB or DB: {this.state.student_personal_data.fdb_db}</Text>
          <Text style={stylesAdmin.ButtonText} style={stylesAdmin.DeleteLinkText} onPress={()=>{this.deletePersonalDetailAlert()}}>Delete Personal Details.</Text>
        </View>
      );
    }
    else{
      return(
        <View style={stylesAdmin.InputContainer}>
          <Text>Personal Details have not been added.</Text>
          <Text></Text>
          <Text style={stylesAdmin.ButtonText} style={stylesAdmin.NavigateLinkText} onPress={()=>{this.goToAddPersonalDetailPage(this.state.studentObject)}}>Add Personal Details.</Text>
        </View>
      );
    }
  }
  house_detail_render(){
    if (this.state.student_house_data){
      return(
        <View style={stylesAdmin.InputContainer}>
          <Text>House Details have been added.</Text>
          <Text>House Name: {this.state.student_house_data.house_name} House Code: {this.state.student_house_data.house_code} </Text>
          <Text style={stylesAdmin.ButtonText} style={stylesAdmin.DeleteLinkText} onPress={()=>{this.deleteHouseDetailAlert()}}>Delete house Details.</Text>
        </View>
      );
    }
    else{
      return(
        <View style={stylesAdmin.InputContainer}>
          <Text>House Details have not been added.</Text>
          <Text></Text>
          <Text style={stylesAdmin.ButtonText} style={stylesAdmin.NavigateLinkText} onPress={()=>{this.goToAddHouseDetailPage(this.state.studentObject)}}>Add hostel Details.</Text>
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
          <View style={stylesAdmin.InputContainer}>
            <Text style={stylesAdmin.HeadingText}>Full Name          : {this.state.studentObject.fullname}</Text>
            <Text style={stylesAdmin.HeadingText}>Email id           : {this.state.studentObject.emailid}</Text>
            <Text style={stylesAdmin.HeadingText}>Enrolment Number   : {this.state.studentObject.enrollment_number}</Text>
            <Text style={stylesAdmin.HeadingText}>Father Name        : {this.state.studentObject.father_name}</Text>
            <Text style={stylesAdmin.HeadingText}>Mother Name        : {this.state.studentObject.mother_name}</Text>
            <Text style={stylesAdmin.HeadingText}>Contact number     : {this.state.studentObject.phone}</Text>
            
          </View>
          {this.personal_detail_render()}
          {this.house_detail_render()}
          <Text></Text>
          <Text></Text>      
        </ScrollView>
        <View style={stylesAdmin.ButtonContainerBackground}>
          <TouchableOpacity onPress={this.goToEditPage} style={stylesAdmin.ButtonContainer}>
            <Text style={stylesAdmin.ButtonText}>Edit Student Details.</Text>
          </TouchableOpacity> 
        </View>
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
    //alert("Exams page");
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
  goToEditPage = () =>{
    this.editStudentData(this.state.studentObject);
    
  }
  editStudentData = (i) =>{
    this.props.navigation.navigate('StudentEditAdmin', {i});
  }
  deletePersonalDetailAlert = () =>{
    Alert.alert(
      'Confirm Delete Student Details',
      'Do you want to delete the student details?',
      [
        {text: 'No', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
        {text: 'Yes', onPress: () => this.deletePersonalDetail()},
      ],
      { cancelable: false }
    );
  }
  deleteHouseDetailAlert = () =>{
    Alert.alert(
      'Confirm Delete Student Details',
      'Do you want to delete the student details?',
      [
        {text: 'No', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
        {text: 'Yes', onPress: () => this.deleteHouseDetail()},
      ],
      { cancelable: false }
    );
  }
  goToAddPersonalDetailPage = (i) =>{
    this.props.navigation.navigate('StudentEditAdmin', {i});
  }
  goToAddHouseDetailPage = (i) =>{
    this.props.navigation.navigate('StudentEditAdmin', {i});
  }
  deletePersonalDetail = () =>{
    try{
      //alert("a"); 
      fetch(globalAssets.IP_IN_USE+'/deleteStudentHouse/'+ this.state.user_token+'/'+ this.state.schoolName + '/', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: this.state.user_id,
          loginType: this.state.loginType,
          student_id: this.state.student_id,
        }),
      })
      .then((response) => response.json())
      .then((res) => {
        //console.log(res);
        //alert(res.success);
        //alert("a");
        if (res.success === 1){
          alert("Student House Details deleted successfully.")

        }
        else{alert("Error deleting student house detail.");}
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
  deleteHouseDetail = () =>{
    try{
      //alert("a"); 
      fetch(globalAssets.IP_IN_USE+'/deleteStudentHostel/'+ this.state.user_token+'/'+ this.state.schoolName + '/', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: this.state.user_id,
          loginType: this.state.loginType,
          student_id: this.state.student_id,
        }),
      })
      .then((response) => response.json())
      .then((res) => {
        //console.log(res);
        //alert(res.success);
        //alert("a");
        if (res.success === 1){
          alert("Student House Details deleted successfully.")

        }
        else{alert("Error deleting student house detail.");}
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


