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
  TextInput,

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
export default class HouseViewAdmin extends React.Component{
  
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
      'house_data':[],
      'houseName':'',
      'houseCode':'',
      'noticePageNumMax':0,
      'noticePageLength':5,
      'noticeCurrentPageNum':0,
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
    this.timer = setInterval(()=> this.refreshVersion(), 10000);

    try{
      //alert("aaa" + this.state.student_id); 
      fetch(globalAssets.IP_IN_USE+'/fetchAllHouse/'+this.state.user_token+'/'+ this.state.schoolName + '/', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: this.state.user_id,
          loginType: this.state.loginType,
          //student_id: this.state.student_id,
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
          this.setState({'house_data':res.data});
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
      fetch(globalAssets.IP_IN_USE+'/fetchAllHouse/'+this.state.user_token+'/'+ this.state.schoolName + '/', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: this.state.user_id,
          loginType: this.state.loginType,
          //student_id: this.state.student_id,
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
          this.setState({'house_data':res.data});
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
  displayHostelByRow(){
    return this.state.house_data.map((row_set, i)=>{
      if (i >= this.state.noticeCurrentPageNum * this.state.noticePageLength && i < (this.state.noticeCurrentPageNum+1)*this.state.noticePageLength)
        return (
          <View key={i} style={{
            flex:1,
            borderBottomColor: 'black',
            borderBottomWidth: 1,
          }}>
            
            <Text>House Name      :  {row_set.house_name}</Text>
            <Text>House Code.     :  {row_set.house_code}</Text>
            <Text></Text>
            <Text style={stylesAdmin.DeleteLinkText} onPress={()=>{this.deleteHostelAlert(row_set)}}>Delete House.</Text>
            <Text></Text>
          </View>
        );
    });
  }
  displayhostels(){
    //fetch list of subjects
    //alert(this.state.studentDict[this.state.selectedClass][this.state.selectedSec].length);
    if (this.state.house_data.length == 0){
      return(
        <View style={stylesAdmin.InputContainer}>
          <Text>Currently no hostels have been added yet.</Text>

        </View>
      );
    }
    else{
      //alert(this.state.subjectDataList);
      //alert(this.state.studentDict[this.state.selectedClass][this.state.selectedSec].length);
      return(
        <View style={stylesAdmin.InputContainer}>
          <Text>Currently these houses have been added yet.</Text>
          { this.displayHostelByRow() }
          { this.displayPrevNextOptions() }
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
            <Text>House Name</Text>
            <TextInput onChangeText={(houseName)=>this.setState({houseName})} value={this.state.houseName} style={stylesAdmin.Input} placeholder='House Name'></TextInput>
            <Text>House Code</Text>
            <TextInput onChangeText={(houseCode)=>this.setState({houseCode})} value={this.state.houseCode} style={stylesAdmin.Input} placeholder='House Code'></TextInput>
            <TouchableOpacity onPress={() => this.addHostelAlert()} style={stylesAdmin.ButtonContainer}>
              <Text style={stylesAdmin.ButtonText}>ADD house</Text>
            </TouchableOpacity>
          </View>
          {this.displayhostels()}
          <Text></Text>
          <Text></Text>      
        </ScrollView>
        <View style={stylesAdmin.ButtonContainerBackground}>
           
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
  addHostelAlert = () =>{
    Alert.alert(
      'Confirm Add House',
      'Do you want to add the house?',
      [
        {text: 'No', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
        {text: 'Yes', onPress: () => this.addHostel()},
      ],
      { cancelable: false }
    );
    
  }
  addHostel = () =>{
    //this.props.navigation.navigate('StudentEditAdmin', {i});
    try{
      //alert("a"); 
      fetch(globalAssets.IP_IN_USE+'/addHouse/'+ this.state.user_token+'/'+ this.state.schoolName + '/', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: this.state.user_id,
          loginType: this.state.loginType,
          house_name: this.state.houseName,
          house_code: this.state.houseCode,
        }),
      })
      .then((response) => response.json())
      .then((res) => {
        //console.log(res);
        //alert(res.success);
        //alert("a");
        if (res.success === 1){
          alert("House added successfully.")

        }
        else{alert("Error adding House.");}
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
  deleteHostelAlert = (i) =>{
    Alert.alert(
      'Confirm Delete House',
      'Do you want to delete the house?',
      [
        {text: 'No', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
        {text: 'Yes', onPress: () => this.deleteHostel(i)},
      ],
      { cancelable: false }
    );
  }
  deleteHostel = (i) =>{
    try{
      //alert("a"); 
      fetch(globalAssets.IP_IN_USE+'/deleteHouse/'+ this.state.user_token+'/'+ this.state.schoolName + '/', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: this.state.user_id,
          loginType: this.state.loginType,
          house_id: i.house_id,
        }),
      })
      .then((response) => response.json())
      .then((res) => {
        //console.log(res);
        //alert(res.success);
        //alert("a");
        if (res.success === 1){
          alert("House deleted successfully.")

        }
        else{alert("Error deleting house.");}
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
  displayPageText(){
    var listtext = [];
    var int_arr = [];
    var int_val = 0;
    for (var i = 1; i<=(this.state.noticePageNumMax+1); ++i) {
      int_arr.push(i);
      int_val++;
      if (i == (this.state.noticeCurrentPageNum+1)){
        listtext.push(
          <Text key={i}>{i}</Text>
        );
      }
      else{
        listtext.push(
          <Text key={i} style={stylesAdmin.NavigateLinkText} onPress={()=>{alert(int_arr[int_val-1]); this.setCurrentPage(i)}}>{i}</Text>
        );
      }
    }

    return (<Text> {listtext} </Text>); 
  }
  displayPageText1(){
    var int_arr=[];
    for (var i = 1; i<=(this.state.noticePageNumMax+1); ++i) {
      int_arr.push(i);
    }
    return int_arr.map((row_set, i)=>{
      if (i == (this.state.noticeCurrentPageNum)){
        return(
          <Text key={i}>{i+1}</Text>
        );
      }
      else{
        return(
          <Text key={i} style={stylesAdmin.NavigateLinkText} onPress={()=>{ this.setCurrentPage(i+1)}}>{i+1}</Text>
        );
      }
    });
  }
  displayPrevNextOptions(){
    if (this.state.noticeCurrentPageNum == 0 && this.state.noticeCurrentPageNum == this.state.noticePageNumMax){
      //no multiple pages
      return(
        <View 
          style={{
            flex:1, flexDirection:'row', justifyContent:'space-between'
          }}
        >
          <Text>No Prev</Text>
          {this.displayPageText1()}
          <Text>No Next</Text>
        
        </View>
      );

    }
    else if (this.state.noticeCurrentPageNum == 0 && this.state.noticeCurrentPageNum != this.state.noticePageNumMax){
      //multiple pages and current element is 0
      return(
        <View 
          style={{
            flex:1, flexDirection:'row', justifyContent:'space-between'
          }}
        >
          <Text>No Prev</Text>
          {this.displayPageText1()}
          <Text style={stylesAdmin.NavigateLinkText} onPress={()=>{this.increaseRoll()}}>Next</Text>
        
        </View>
      );
    }
    else if (this.state.noticeCurrentPageNum == this.state.noticePageNumMax){
      //multiple pages and current element is last page
      return(
        <View 
          style={{
            flex:1, flexDirection:'row', justifyContent:'space-between'
          }}
        >
          <Text style={stylesAdmin.NavigateLinkText} onPress={()=>{this.decreaseRoll()}}>Prev</Text>
          {this.displayPageText1()}
          <Text>No Next</Text>
        
        </View>
      );
    }
    else{
      //multiple pages and it's something inbetween
      return(
        <View 
          style={{
            flex:1, flexDirection:'row', justifyContent:'space-between'
          }}
        >
          <Text style={stylesAdmin.NavigateLinkText} onPress={()=>{this.decreaseRoll()}}>Prev</Text>
          {this.displayPageText1()}
          <Text style={stylesAdmin.NavigateLinkText} onPress={()=>{this.increaseRoll()}}>Next</Text>
        
        </View>
      );
    }
  }
  increaseRoll = () =>{
    this.setState({'noticeCurrentPageNum':this.state.noticeCurrentPageNum+1});
    //alert(this.state.current_id);
  }
  decreaseRoll = () =>{
    this.setState({'noticeCurrentPageNum':this.state.noticeCurrentPageNum-1});
  }
  setCurrentPage = (i) =>{
    //alert(i-1);
    this.setState({'noticeCurrentPageNum':i-1});
  }

}


