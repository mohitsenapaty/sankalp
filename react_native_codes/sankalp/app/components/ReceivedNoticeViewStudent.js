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
import MenuAdmin from './MenuAdmin';
import stylesLogin, {globalAssets} from './globalExports';
import {stylesAdmin} from './globalExports';
//import Login from './Login';
var GLOB_IP_PROD='http://52.27.104.46'
var GLOB_IP_DEV='http://127.0.0.1:8000'

var IP_IN_USE=GLOB_IP_PROD

//type Props = {};
export default class ReceivedNoticeViewTeacher extends React.Component{
  
  constructor(props){
    super(props);
    this.state={
      'user_session':{},
      'user_id':'',
      'drawerClosed':true,
      'user_token':'',
      'numberOfSubjects':0,
      'subjectDataList':[],
      'loginType':'Student',
      current_id:0,
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
      fetch(globalAssets.IP_IN_USE+'/fetchReceivedStudentNotifications/'+this.state.user_token+'/', {
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
          this.setState({'subjectDataList':res.data});
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

    this.timer = setInterval(()=> this.refreshSubjects(), 30000)
    
  }
  refreshSubjects = async() =>{
    //alert("refresh");
    var isFocused = this.props.navigation.isFocused();    
    //alert(isFocused);
    if (!isFocused)
      return;
    try{
      //alert("aaa" + this.state.user_id); 
      fetch(globalAssets.IP_IN_USE+'/fetchReceivedTeacherNotifications/'+this.state.user_token+'/', {
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
  }
  displayNoticesByRow(){
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
    
    return this.state.subjectDataList.map((row_set, i)=>{
      return (
        <View key={i} style={{
          flex:1,
          borderBottomColor: 'black',
          borderBottomWidth: 1,
        }}>
          <Text>Notice ID:        {row_set.notification_id} </Text>
          <Text>Notice subject:   {row_set.subject} </Text>
          <Text>Created At:       {row_set.created_at} </Text>
          <Text>Notice For:       {row_set.target_type}</Text>
          <Text>Creator:          {row_set.notification_creator}</Text>
          <Text></Text>
          <Text onPress={()=>{this.ViewNotice(row_set)}}>Click here to View message.</Text>
        </View>
      );
    });
    
  }
  displayNotices(){
    //fetch list of subjects
    if (this.state.subjectDataList.length == 0){
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
          { this.displayNoticesByRow() }
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
        <ScrollView style={stylesAdmin.Container}>
        
        <Text>Notices Added as follows</Text>
        {this.displayNotices()}
        <TouchableOpacity onPress={this.logout} style={stylesAdmin.ButtonContainer}>
          <Text>LOG OUT</Text>
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
  deleteSubjectAlert = (i) =>{
    Alert.alert(
      'Confirm Delete Subject',
      'Do you want to add the subject ' + i + '?',
      [
        {text: 'No', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
        {text: 'Yes', onPress: () => this.deleteSubject(i)},
      ],
      { cancelable: false }
    );
  }
  deleteSubject = (i) =>{
    //alert("Will delete " + i);
    try{
      //alert("a"); 
      fetch(globalAssets.IP_IN_USE+'/deleteSubjects/'+ this.state.user_token+'/', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: this.state.user_id,
          loginType: this.state.loginType,
          subjectName: i,
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
    this.props.navigation.navigate('Teacherarea');
  }
  goToStudentPage = () =>{
    alert("student page");
    this.props.navigation.navigate('StudentViewAdmin');
  }
  goToSubjectPage = () =>{
    alert("already on subject page");
  }
  goToTeacherPage = () =>{
    alert("teacher page");
    this.props.navigation.navigate('TeacherViewAdmin');
  }
  goToAddSubjectPage = () =>{
    this.props.navigation.navigate('SubjectAddAdmin');
  }
  ViewNotice = (i) =>{
    this.props.navigation.navigate('SingleReceivedNoticeViewStudent', {i},);
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