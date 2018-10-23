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
  Dimensions,

} from 'react-native';
//import { Navigator } from 'react-native-deprecated-custom-components';
import {StackNavigator} from 'react-navigation';
import ActionBar from 'react-native-action-bar';
import DrawerLayout from 'react-native-drawer-layout';
import { TabView, TabBar, SceneMap } from 'react-native-tab-view';
import MenuTeacher from './MenuTeacher';
import stylesLogin, {globalAssets} from './globalExports';
import {stylesAdmin} from './globalExports';
//import Login from './Login';
var GLOB_IP_PROD='http://52.27.104.46'
var GLOB_IP_DEV='http://127.0.0.1:8000'

var IP_IN_USE=GLOB_IP_PROD
var interval_factor = 5000;
var interval_tick = 10000;

//type Props = {};
export default class CalendarViewTeacher extends React.Component{
  
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
      'loginType':'Teacher',
      'schoolName':'', 
      'tabViewOptions':{index: 0, routes:[{key:'previous', title: 'Past Events'}, {key:'next', title: 'Upcoming Events'}]},
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

    try{
      //alert("aaa" + this.state.user_id); 
      fetch(globalAssets.IP_IN_USE+'/fetchAllEvents/'+this.state.user_token+'/' + this.state.schoolName + '/', {
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
          this.setState({'examDataList':res.data});
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

    this.timer = setInterval(()=> this.refreshTeachers(), 5000)

    var new_obj =  {index: this.state.tabViewOptions.index, routes:[{key:'previous', title: 'Past Events'}, {key:'next', title: 'Upcoming Events'}]}; 
    this.setState({'tabViewOptions':new_obj});
    
  }
  refreshTeachers = async() =>{

    if (interval_factor%interval_tick == 0)
    {
      interval_factor += 5000;
      return;
    }
    else{
      interval_factor += 5000;
    }
    //alert("refresh");
    var isFocused = this.props.navigation.isFocused();    
    //alert(isFocused);
    if (!isFocused)
      return;
    try{
      //alert("aaa" + this.state.user_id); 
      fetch(globalAssets.IP_IN_USE+'/fetchAllEvents/'+this.state.user_token+'/'+ this.state.schoolName + '/', {
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
          this.setState({'examDataList':res.data});
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

    var new_obj =  {index: this.state.tabViewOptions.index, routes:[{key:'previous', title: 'Past Events'}, {key:'next', title: 'Upcoming Events'}]}; 
    this.setState({'tabViewOptions':new_obj});
  }
  displayExamsByRow(i){
    if (i == 0){
      return this.state.examDataList.map((row_set, i)=>{
        var event_date = new Date(row_set.start_dt);
        var cur_date = new Date(Date.now());
        if (event_date < cur_date)
          return (
            <View key={i} style={{
              flex:1,
              borderBottomColor: 'black',
              borderBottomWidth: 1,
            }}>
              <Text>Event occasion. :     {row_set.occasion} </Text>
              <Text>Event details   :     {row_set.details} </Text>
              <Text>Event session   :     {row_set.session} </Text>
              <Text>Event start date:     {row_set.start_date} </Text>
              <Text>Event end date  :     {row_set.end_date} </Text>         
            </View>
          );
      });
    }
    else{
      return this.state.examDataList.map((row_set, i)=>{
        var event_date = new Date(row_set.start_dt);
        var cur_date = new Date(Date.now());
        if (event_date > cur_date)
          return (
            <View key={i} style={{
              flex:1,
              borderBottomColor: 'black',
              borderBottomWidth: 1,
            }}>
              <Text>Event occasion. :     {row_set.occasion} </Text>
              <Text>Event details   :     {row_set.details} </Text>
              <Text>Event session   :     {row_set.session} </Text>
              <Text>Event start date:     {row_set.start_date} </Text>
              <Text>Event end date  :     {row_set.end_date} </Text>         
            </View>
          );
      });
    }
  }
  displayExams(i){
    if (this.state.examDataList.length == 0){
      return(
        <View style={stylesAdmin.InputContainer}>
          <Text>Currently no events have been added yet.</Text>

        </View>
      );
    }
    else{
      //alert(this.state.subjectDataList);
      return(
        <View style={stylesAdmin.InputContainer}>
          <Text>Currently these events have been added yet.</Text>
          { this.displayExamsByRow(i) }
        </View>
      );
    }
  }
  firstRoute = () => (
    <View style={{flex:1,}}> 
      <ScrollView style={stylesAdmin.Container}>
            {this.displayExams(0)}

      </ScrollView>
    </View>
  );
  secondRoute = () => (
    <View style={{flex:1,}}> 
      <ScrollView style={stylesAdmin.Container}>
            {this.displayExams(1)}

      </ScrollView>
    </View>
  );
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
              schoolName={this.state.schoolName}
            />}
        >
          <ActionBar
            containerStyle={stylesAdmin.bar}
            backgroundColor="#33cc33"
            leftIconName={'menu'}
            onLeftPress={this.toggleDrawer}/>
        <View style={{flex:1,}}>
          <TabView
            navigationState={this.state.tabViewOptions}
            renderScene={SceneMap({
              previous: this.firstRoute,
              next: this.secondRoute,
            })}
            renderTabBar={props => <TabBar {...props} style={{backgroundColor:"#33cc33"}}/>}
            onIndexChange={(index_) => { new_obj =  {index: index_, routes:[{key:'previous', title: 'Past Events'}, {key:'next', title: 'Upcoming Events'}]}; this.setState({'tabViewOptions':new_obj});}}
            
          >

          </TabView>
          <View>
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
  goToSingleExamPage = (i) =>{
    //alert(i);
    this.props.navigation.navigate('SingleExamViewTeacher', {i});
  }  
}

