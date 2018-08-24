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
import ModalDropdown from 'react-native-modal-dropdown';
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
export default class assignSubjectsToStudent extends React.Component{
  
  constructor(props){
    super(props);
    this.state={
      'user_session':{},
      'user_id':'',
      'drawerClosed':true,
      'user_token':'',
      'numberOfSubjects':0,
      'subjectDataList':[],
      'numberOfTeachers':0,
      'teacherDataList':[],
      'loginType':'Admin',
      'selectedClass':'1',
      'selectedSec':'A',
      'selectedSubject':'',
      'assignedSubjectDataList':[],
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

    //will fetch all subjects assigned to a teacher
    
    try{
      //alert("aaa" + this.state.user_id); 
      fetch(globalAssets.IP_IN_USE+'/fetchSubjectsAssignedToStudent/'+this.state.user_token+'/', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: this.state.user_id,
          loginType: this.state.loginType,
          student_id: this.props.navigation.state.params.i.student_id,
          class: this.props.navigation.state.params.i.class,
          section: this.props.navigation.state.params.i.section
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
          this.setState({'assignedSubjectDataList':res.data});
          //this.setState({'subjectDataList':res.data});
          //alert(this.state.subjectDataList);
        }
        else{alert("Invalid Login details");}
      })
      .done();
    }
    catch(error){
      alert(error);
    }
    
    //alert(this.props.navigation.state.params.i.fullname);
    //will fetch all subjects
    try{
      //alert("aaa" + this.state.user_id); 
      fetch(globalAssets.IP_IN_USE+'/fetchAllSubjects/'+this.state.user_token+'/', {
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
          this.setState({'numberOfSubjects':res.data.length,'subjectDataList':res.data});
          //this.setState({'subjectDataList':res.data});
          //alert(this.state.subjectDataList);
        }
        else{alert("Invalid Login details");}
      })
      .done();
    }
    catch(error){
      alert(error);
    }
    //alert(this.props.navigation.state.params.i.fullname);
    /*
    try{
      //alert("aaa" + this.state.user_id); 
      fetch(globalAssets.IP_IN_USE+'/fetchAllTeachers/'+this.state.user_token+'/', {
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
          this.setState({'numberOfTeachers':res.data.length,'teacherDataList':res.data});
          //this.setState({'subjectDataList':res.data});
          //alert(this.state.subjectDataList);
        }
        else{alert("Invalid Login details");}
      })
      .done();
    }
    catch(error){
      alert(error);
    }
    */

    this.timer = setInterval(()=> this.refreshTeachers(), 30000)
    
  }
  refreshTeachers = async() =>{
    //alert("refresh");
    var isFocused = this.props.navigation.isFocused();    
    //alert(isFocused);
    if (!isFocused)
      return;
    try{
      //alert("aaa" + this.state.user_id); 
      fetch(globalAssets.IP_IN_USE+'/fetchSubjectsAssignedToStudent/'+this.state.user_token+'/', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: this.state.user_id,
          loginType: this.state.loginType,
          student_id: this.props.navigation.state.params.i.student_id,
          class: this.props.navigation.state.params.i.class,
          section: this.props.navigation.state.params.i.section
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
          this.setState({'assignedSubjectDataList':res.data});
          //this.setState({'subjectDataList':res.data});
          //alert(this.state.subjectDataList);
        }
        else{alert("Invalid Login details");}
      })
      .done();
    }
    catch(error){
      alert(error);
    }
  }
  displaySubjectByRow(){
    /*
    const rowSetItems = this.state.subjectDataList.map(
      (d)=>{
        <View key={d.subject_id}>
          <Text>{d.subject_id}</Text>
        </View>
      }
    );
    return(
      <View>
        {rowSetItems}
      </View>
    );*/
    
    return this.state.assignedSubjectDataList.map((row_set, i)=>{
      return (
        <View key={i} style={{
          flex:1,
          flexDirection:'row',
          justifyContent:'space-between',
          alignItems:'center',
        }}>
          <Text>{row_set.subject_name} </Text>
          <Text>{row_set.subject_code} </Text>
          <Text>{row_set.is_major}</Text>
          <Text>{row_set.fullname}</Text>
          <Text onPress={()=>{this.deleteSubjectAssignmentAlert(row_set.subject_name,row_set.subject_id)}}>Delete Assignment</Text>
        </View>
      );
    });
    
  }
  displayTeacherByRow(){
    return this.state.teacherDataList.map((row_set, i)=>{
      return (
        <View key={i} style={{
          flex:1,
          borderBottomColor: 'black',
          borderBottomWidth: 1,
        }}>
          <Text>Full Name: {row_set.fullname} </Text>
          <Text>Email:     {row_set.emailid} </Text>
          <Text>Mobile:    {row_set.phone} </Text>
          <Text>Password:  {row_set.unencrypted}</Text>
          <Text onPress={()=>{this.deleteTeacherAlert(row_set.fullname)}}>Delete Teacher</Text>
        </View>
      );
    });
  }
  displaySubjects(){
    //fetch list of subjects
    if (this.state.assignedSubjectDataList.length == 0){
      return(
        <View style={stylesAdmin.InputContainer}>
          <Text>Currently no subjects have been added yet.</Text>

        </View>
      );
    }
    else{
      //alert(this.state.subjectDataList);
      return(
        <View style={stylesAdmin.InputContainer}>
          <Text>Currently these subjects have been added yet.</Text>
          { this.displaySubjectByRow() }
        </View>
      );
    }
  }
  displayTeachers(){
    //fetch list of subjects
    if (this.state.numberOfTeachers == 0){
      return(
        <View style={stylesAdmin.InputContainer}>
          <Text>Currently no teachers have been added yet.</Text>

        </View>
      );
    }
    else{
      //alert(this.state.subjectDataList);
      return(
        <View style={stylesAdmin.InputContainer}>
          <Text>Currently these teachers have been added yet.</Text>
          { this.displayTeacherByRow() }
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
            <Text>Subject assignment for {this.props.navigation.state.params.i.fullname}</Text>
            <Text>Student Class and Section: {this.props.navigation.state.params.i.class} {this.props.navigation.state.params.i.section}</Text>
            <Text>Student roll_number {this.props.navigation.state.params.i.roll_number}</Text>            
            <Text>Select Subject </Text>
            <ModalDropdown options={this.state.subjectDataList} defaultValue="Please select a subject"
              renderRow={this.subjectRowRender.bind(this)} 
              renderButtonText = {this.selectedRowRender.bind(this)}
              onSelect={this.selectedSubjectMethod}
              style={{
                borderWidth: 0,
                borderRadius: 3,
                width:200,
                backgroundColor: 'cornflowerblue',
              }}
            >
            
            </ModalDropdown>
            <Text> Selected Subject: {this.state.selectedSubject}</Text>
            {this.displaySubjects()}
          </ScrollView>       
          <View>
            <TouchableOpacity onPress={this.confirmAssignmentAlert} style={stylesAdmin.ButtonContainer}>
              <Text>Click here to Confirm assignment.</Text>
            </TouchableOpacity> 
          </View>
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
  subjectRowRender = (rowData) =>{
    return(
      <Text>{rowData.subject_name}</Text>
    );
  }
  selectedRowRender = (rowData) =>{
    return(
      <Text>{rowData.subject_name}</Text>
    );
  }
  deleteTeacherAlert = (i) =>{
    Alert.alert(
      'Confirm Delete Teacher',
      'Do you want to delete the teacher ' + i + '?',
      [
        {text: 'No', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
        {text: 'Yes', onPress: () => this.deleteTeacher(i)},
      ],
      { cancelable: false }
    );
  }
  deleteTeacher = (i) =>{
    //alert(i);
    try{
      //alert("a"); 
      fetch(globalAssets.IP_IN_USE+'/deleteTeachers/'+ this.state.user_token+'/', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: this.state.user_id,
          loginType: this.state.loginType,
          fullname: i,
        }),
      })
      .then((response) => response.json())
      .then((res) => {
        //console.log(res);
        //alert(res.success);
        //alert("a");
        if (res.success === 1){
          alert("Teacher deleted successfully.")

        }
        else{alert("Error deleting teacher. Try again.");}
      })
      .done();
    }
    catch(error){
      alert(error);
    }
  }
  deleteSubjectAssignmentAlert = (subject_name, subject_id) =>{
    Alert.alert(
      'Confirm Delete Teacher',
      'Do you want to delete the subject ' + subject_name + ' assigned to ' + this.props.navigation.state.params.i.fullname +'?',
      [
        {text: 'No', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
        {text: 'Yes', onPress: () => this.deleteSubjectAssignment(subject_id)},
      ],
      { cancelable: false }
    );
  }
  deleteSubjectAssignment = (subject_id) =>{
    //alert("Will delete " + i);
    try{
      //alert("a"); 
      fetch(globalAssets.IP_IN_USE+'/deleteSubjectAssignedToStudent/'+ this.state.user_token+'/', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: this.state.user_id,
          loginType: this.state.loginType,
          subject_id: subject_id,
          student_id: this.props.navigation.state.params.i.student_id
        }),
      })
      .then((response) => response.json())
      .then((res) => {
        //console.log(res);
        //alert(res.success);
        //alert("a");
        if (res.success === 1){
          alert("Subject deleted successfully.")

        }
        else{alert("Error deleting subject, subject name or subject code might exist already.");}
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
    alert("student page");
    this.props.navigation.navigate('StudentViewAdmin');
  }
  goToSubjectPage = () =>{
    alert("subject page");
    this.props.navigation.navigate('SubjectViewAdmin');
  }
  goToTeacherPage = () =>{
    //alert("already on teacher page");
    this.props.navigation.navigate('TeacherViewAdmin');
  }
  goToAddTeacherPage = () =>{
    this.props.navigation.navigate('TeacherAddAdmin');
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
  selectedSubjectMethod = (idx, value) => {
    //alert({idx} + " " + {value});
    //alert("1");
    this.setState({'selectedSubject':value.subject_name});
    //alert(value);
  }
  confirmAssignmentAlert = () =>{
    Alert.alert(
      'Confirm Subject Assignment',
      'Do you want to assign the subject ' + this.state.selectedSubject + ' to the student '+this.props.navigation.state.params.i.fullname + '?',
      [
        {text: 'No', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
        {text: 'Yes', onPress: () => this.confirmAssignemt(this.state.selectedSubject,this.props.navigation.state.params.i.fullname)},
      ],
      { cancelable: false }
    );
  }
  confirmAssignemt = (i,j) => {
    //alert(i + j);
    try{
      //alert("a"); 
      fetch(globalAssets.IP_IN_USE+'/assignSubjectToStudent/'+ this.state.user_token+'/', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: this.state.user_id,
          loginType: this.state.loginType,
          subject_name: i,
          student_name: j
        }),
      })
      .then((response) => response.json())
      .then((res) => {
        //console.log(res);
        //alert(res.success);
        //alert("a");
        if (res.success === 1){
          alert("Subject assigned to Student.")

        }
        else{alert("Error assigning subject. Subject may be assigned already.");}
      })
      .done();
    }
    catch(error){
      alert(error);
    }
  }

}

