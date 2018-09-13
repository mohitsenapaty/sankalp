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
import DatePicker from 'react-native-datepicker';
import CheckBox from 'react-native-check-box';
//import Login from './Login';
var GLOB_IP_PROD='http://52.27.104.46'
var GLOB_IP_DEV='http://127.0.0.1:8000'

var IP_IN_USE=GLOB_IP_PROD

const allClass = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];
const sessions = ['2018-2019', '2019-2020', '2020-2021', '2021-2022'];

//type Props = {};
export default class ExamAddAdmin extends React.Component{
  
  constructor(props){
    super(props);
    this.state={
      'user_session':{},
      'user_id':'',
      'drawerClosed':true,
      'user_token':'',
      'loginType':'Admin',
      'exam_group_name':'',
      'exam_group_date':'15-08-2018',
      'exam_group_type':'Full',
      'exam_maximum_major_subject_marks': '',
      'exam_maximum_minor_subject_marks': '',
      'exam_group_classes':[],
      isAllClassesChecked:true,
      classesCheckedArray:{},
      'session':'2018-2019',
    };

    for (var i = 0; i < allClass.length; i++){
      this.state.classesCheckedArray[allClass[i]] = true;
    }
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
  allClassSelectDisplay (){
    return allClass.map((row_set, i)=>{
      return (
        <View key={i} style={{
          flex:1,
          borderBottomColor: 'black',
          borderBottomWidth: 1,
        }}>
          <CheckBox
            style={{flex: 1, padding: 10}}
            onClick={()=>{
              checkedDict = this.state.classesCheckedArray;
              checkedDict[row_set] = !checkedDict[row_set];
              this.setState({
                  classesCheckedArray:checkedDict
              });
            }}
            isChecked={this.state.classesCheckedArray[row_set]}
            leftText={row_set}
          />
        </View>
      );
    });
  }
  classSelectDisplay() {
    if (this.state.isAllClassesChecked == true){
      return(

        <View>
          <CheckBox
            style={{flex: 1, padding: 10}}
            onClick={()=>{
              //alert(this.state.isChecked);

              this.setState({
                  isAllClassesChecked:!this.state.isAllClassesChecked
              });
            }}
            isChecked={this.state.isAllClassesChecked}
            leftText={"ALL Classes"}
          />
        </View>

      );
    }
    else{
      return(

        <View>
          <CheckBox
            style={{flex: 1, padding: 10}}
            onClick={()=>{
              //alert(this.state.isChecked);

              this.setState({
                  isAllClassesChecked:!this.state.isAllClassesChecked
              });
              for (var i = 0; i < allClass.length; i++){
                this.state.classesCheckedArray[allClass[i]] = true;
              }
            }}
            isChecked={this.state.isAllClassesChecked}
            leftText={"ALL Classes"}
          />
          {this.allClassSelectDisplay()}
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
            />}
        >
          <ActionBar
            containerStyle={stylesAdmin.bar}
            backgroundColor="#33cc33"
            leftIconName={'menu'}
            onLeftPress={this.toggleDrawer}/>
        <ScrollView style={stylesAdmin.Container}>
        
          <Text>Add Exams here.</Text>
          <View style={stylesAdmin.InputContainer}>
            <Text>Enter Exam Group Name below:</Text>
            <TextInput style={stylesAdmin.Input} onChangeText={(exam_group_name)=>this.setState({exam_group_name})} value={this.state.exam_group_name}  placeholder='Exam group name Example: Unit Test 2'></TextInput>
            <Text>Select Exam Date:</Text> 
            <DatePicker
              style={{width: 200}}
              date={this.state.exam_group_date}
              mode="date"
              placeholder="select date"
              format="DD-MM-YYYY"
              minDate="01-01-2017"
              maxDate="01-01-2028"
              confirmBtnText="Confirm"
              cancelBtnText="Cancel"
              customStyles={{
                dateIcon: {
                  position: 'absolute',
                  left: 0,
                  top: 4,
                  marginLeft: 0
                },
                dateInput: {
                  marginLeft: 36
                }
              }}
              onDateChange={(date) => {this.setState({exam_group_date: date})}}
            />
            <Text>Select Exam Type (Full/Unit):</Text>
            <ModalDropdown options={['Full', 'Unit']} defaultValue='Full' onSelect={this.selectedExamTypeMethod}>
        
            </ModalDropdown>
            <Text>Select Exam Session:</Text>
            <ModalDropdown options={sessions} defaultValue={sessions[0]} onSelect={this.selectedSessionMethod}>
        
            </ModalDropdown>
            <Text>Enter Maximum marks for major subjects:</Text>
            <TextInput style={stylesAdmin.Input} onChangeText={(exam_maximum_major_subject_marks)=>this.onChangeMajorSubjectMarks(exam_maximum_major_subject_marks)} value={this.state.exam_maximum_major_subject_marks}  placeholder='Maximum Marks for Major Subjects'></TextInput>
            <Text>Enter Minimum marks for major subjects:</Text>
            <TextInput style={stylesAdmin.Input} onChangeText={(exam_maximum_minor_subject_marks)=>this.onChangeMinorSubjectMarks(exam_maximum_minor_subject_marks)} value={this.state.exam_maximum_minor_subject_marks}  placeholder='Maximum Marks for Minor Subjects'></TextInput> 
            <Text>Select Class: {this.state.isAllClassesChecked}</Text>
            {this.classSelectDisplay()}         
            <TouchableOpacity onPress={() => this.addExamsAlert()} style={stylesAdmin.ButtonContainer}>
              <Text>ADD Exam </Text>
            </TouchableOpacity>
          </View>    
        </ScrollView>
      </DrawerLayout>
      
    );  
  }
  addExamsAlert = () =>{
    //alert(a);
    Alert.alert(
      'Confirm Add Exam',
      'Do you want to create the exam with given details ?',
      [
        {text: 'No', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
        {text: 'Yes', onPress: () => this.addExams()},
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
  addExams = () =>{
    //alert("added Exam");
    if (!this.isNumeric(this.state.exam_maximum_major_subject_marks)){
      alert("incorrect value for maximum major subject marks.");
      return;
    }
    if (!this.isNumeric(this.state.exam_maximum_minor_subject_marks)){
      alert("incorrect value for maximum minor subject marks.");
      return;
    }
    var all_class_selected = false;
    var classes_selected = [];
    if (this.state.isAllClassesChecked == true){
      all_class_selected = true;
    }
    else{
      for (var i = 0; i < allClass.length; i++){
        if (this.state.classesCheckedArray[allClass[i]] == true){
          classes_selected.push(allClass[i]);
        }
      }
    }
    
    try{
      //alert("a"); 
      fetch(globalAssets.IP_IN_USE+'/addExams/'+ this.state.user_token+'/', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: this.state.user_id,
          loginType: this.state.loginType,
          exam_group_name: this.state.exam_group_name,
          exam_group_date: this.state.exam_group_date,
          exam_group_type: this.state.exam_group_type,
          max_major_marks: this.state.exam_maximum_major_subject_marks,
          max_minor_marks: this.state.exam_maximum_minor_subject_marks,
          all_class_selected: all_class_selected,
          classes_selected: classes_selected,
          session: this.state.session
        }),
      })
      .then((response) => response.json())
      .then((res) => {
        //console.log(res);
        //alert(res.success);
        //alert("a");
        if (res.success === 1){
          alert("Exam added successfully.")

        }
        else{alert("Error adding exam.");}
      })
      .done();
    }
    catch(error){
      alert(error);
    }
    
  }
  isNumeric = (n) => {
    //alert(!isNaN(parseFloat(n)) && isFinite(n));
    return !isNaN(parseFloat(n)) && isFinite(n);
  }
  onChangeMajorSubjectMarks = (exam_maximum_major_subject_marks)=>{
    if (this.isNumeric(exam_maximum_major_subject_marks))
    {
      this.setState({'exam_maximum_major_subject_marks':exam_maximum_major_subject_marks});
    }
    else{
      alert("incorrect value " + exam_maximum_major_subject_marks);
    }
    
  }
  onChangeMinorSubjectMarks = (exam_maximum_minor_subject_marks)=>{
    if (this.isNumeric(exam_maximum_minor_subject_marks))
    {
      this.setState({'exam_maximum_minor_subject_marks':exam_maximum_minor_subject_marks});
    }
    else{
      alert("incorrect value " + exam_maximum_minor_subject_marks);
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
  selectedExamTypeMethod = (idx, value) => {
    //alert({idx} + " " + {value});
    //alert("1");
    this.setState({'exam_group_type':value});
  }
  selectedSessionMethod = (idx, value) => {
    //alert({idx} + " " + {value});
    //alert("1");
    this.setState({'session':value});
  }

}

