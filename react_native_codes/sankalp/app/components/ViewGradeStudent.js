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
import RNFetchBlob from 'react-native-fetch-blob'
import {StackNavigator} from 'react-navigation';
import ActionBar from 'react-native-action-bar';
import DrawerLayout from 'react-native-drawer-layout';
import MenuStudent from './MenuStudent';
import stylesLogin, {globalAssets} from './globalExports';
import {stylesAdmin} from './globalExports';
//import Login from './Login';
var GLOB_IP_PROD='http://52.27.104.46'
var GLOB_IP_DEV='http://127.0.0.1:8000'

var IP_IN_USE=GLOB_IP_PROD

//type Props = {};
export default class ViewGradeStudent extends React.Component{
  
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
      'examDataList':[],
      'loginType':'Student',
      'examObject':props.navigation.state.params.i,
      'isPDFPresent':false,
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
      this.setState({'user_id':obj_value.student_id});
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
      fetch(globalAssets.IP_IN_USE+'/fetchSubjectsForStudent/'+this.state.user_token+'/', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: this.state.user_id,
          loginType: this.state.loginType,
          exam_group_id: this.state.examObject.exam_group_id
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
          this.setState({'examDataList':res.data});
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

    try{
      //alert("aaa" + this.state.user_id); 
      fetch(globalAssets.IP_IN_USE+'/fetchPDFPresent/'+this.state.user_token+'/', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: this.state.user_id,
          loginType: this.state.loginType,
          exam_group_id: this.state.examObject.exam_group_id
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
          if (res.data.length > 0)
          {
            this.setState({'isPDFPresent':true});
          }
          //this.setState({'examDataList':res.data});
          //this.setState({'subjectDataList':res.data});
          //alert(this.state.subjectDataList);
        }
        else{}
      })
      .done();
    }
    catch(error){
      alert(error);
    }

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
      fetch(globalAssets.IP_IN_USE+'/fetchSubjectsForStudent/'+this.state.user_token+'/', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: this.state.user_id,
          loginType: this.state.loginType,
          exam_group_id: this.state.examObject.exam_group_id
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
          this.setState({'examDataList':res.data});
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

    try{
      //alert("aaa" + this.state.user_id); 
      fetch(globalAssets.IP_IN_USE+'/fetchPDFPresent/'+this.state.user_token+'/', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: this.state.user_id,
          loginType: this.state.loginType,
          exam_group_id: this.state.examObject.exam_group_id
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
          if (res.data.length > 0)
          {
            this.setState({'isPDFPresent':true});
          }
          //this.setState({'examDataList':res.data});
          //this.setState({'subjectDataList':res.data});
          //alert(this.state.subjectDataList);
        }
        else{}
      })
      .done();
    }
    catch(error){
      alert(error);
    }
  }
  displayExamsByRow(){
    return this.state.examDataList.map((row_set, i)=>{
      return (
        <View key={i} style={{
          flex:1,
          borderColor: 'black',
          borderWidth: 1,
        }}>
          <Text>Subject Name:     {row_set.subject_name} </Text>
          <Text>Subject Type:     {row_set.is_major} </Text>
          <Text>Subject Code:     {row_set.subject_code} </Text>
          <Text>Total Marks :     {row_set.max_score} </Text>
          <Text>Scored Marks:     {row_set.cur_score} </Text>
          <Text>Percentage. :     {row_set.percentage} </Text>
          <Text>Grade       :     {row_set.grade} </Text>
          
        </View>
      );
    });
  }
  displayExams(){
    if (this.state.examDataList.length == 0){
      return(
        <View style={stylesAdmin.InputContainer}>
          <Text>Currently no grades have been added yet.</Text>

        </View>
      );
    }
    else{
      //alert(this.state.subjectDataList);
      return(
        <View style={stylesAdmin.InputContainer}>
          
          { this.displayExamsByRow() }
        </View>
      );
    }
  }
  displayPDFDownloadLink(){
    if (this.state.isPDFPresent == false){
      return(
        <View>

        </View>
      );
    }
    else{
      //alert(this.state.subjectDataList);
      return(
        <View >
          <Text onPress={()=>{this.downloadPDF()}}>
            PDF Download Link
          </Text>
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
        <View style={{flex:1,}}>
          <ScrollView style={stylesAdmin.Container}>
            <Text>Exam Group Name:     {this.state.examObject.exam_group_name} </Text>
            <Text>Exam Group Date:     {this.state.examObject.exam_group_date} </Text>
            <Text>Exam Group Type:     {this.state.examObject.exam_group_type} </Text>
            {this.displayExams()}
          </ScrollView>
          <View>
            {this.displayPDFDownloadLink()}
            <TouchableOpacity onPress={this.goToPDFPage} style={stylesLogin.ButtonContainer}>
              <Text>Generate PDF</Text>
            </TouchableOpacity>
          </View>
        </View>
    </DrawerLayout>
      
    );  
  }
  goToPDFPage = () =>{
    alert("PDF page");
    //this.state.examObject.exam_group_id
    //this.state.user_id
    try{
      //alert("a"); 
      fetch(globalAssets.IP_IN_USE+'/generatePDFSingleStudent/'+ this.state.user_token+'/', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: this.state.user_id,
          loginType: this.state.loginType,
          exam_group_id: this.state.examObject.exam_group_id,
        }),
      })
      .then((response) => response.json())
      .then((res) => {
        //console.log(res);
        //alert(res.success);
        //alert("a");
        if (res.success === 1){
          alert("Exam Declared successfully.")

        }
        else{alert("Error declaring exam. Try again.");}
      })
      .done();
    }
    catch(error){
      alert(error);
    }
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
  downloadPDF = () =>{
    try{
      //alert("a"); 
      let dirs = RNFetchBlob.fs.dirs;
      RNFetchBlob
      .config({
        useDownloadManager : true, 
        fileCache : true,
        path : dirs.DocumentDir + '/report.pdf'
      })
      .fetch('POST', globalAssets.IP_IN_USE+'/fetchReportPDF/'+ this.state.user_token+'/',
        {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        JSON.stringify({
          user_id: this.state.user_id,
          loginType: this.state.loginType,
          exam_group_id: this.state.examObject.exam_group_id,
        })
      )
      .then((response) => {
        var fpath = response.path()
        alert("file was saved to " + fpath);
      })
      .done();
    }
    catch(error){
      alert(error);
    }
    

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
  goToSingleExamPage = (i) =>{
    //alert(i);
    this.props.navigation.navigate('SingleExamViewTeacher', {i});
  }  
}

