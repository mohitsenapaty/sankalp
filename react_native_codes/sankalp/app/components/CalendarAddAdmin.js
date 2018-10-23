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
const termArray = ['1', '2', '3', '4'];

//type Props = {};
export default class CalendarAddAdmin extends React.Component{
  
  constructor(props){
    super(props);
    this.state={
      'user_session':{},
      'user_id':'',
      'drawerClosed':true,
      'user_token':'',
      'loginType':'Admin',
      'exam_group_name':'',
      'event_start_date':'15-08-2018',
      'event_end_date':'15-08-2018',
      'exam_group_type':'All Subjects',
      'exam_maximum_major_subject_marks': '',
      'exam_maximum_minor_subject_marks': '',
      'exam_group_classes':[],
      isAllClassesChecked:true,
      classesCheckedArray:{},
      'session':'2018-2019',
      'schoolName':'',
      'term_number':'1',
      'term_final':'N',
      'occasion':'',
      'details':'',
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
              schoolName={this.state.schoolName}
            />}
        >
          <ActionBar
            containerStyle={stylesAdmin.bar}
            backgroundColor="#33cc33"
            leftIconName={'menu'}
            onLeftPress={this.toggleDrawer}/>
        <ScrollView style={stylesAdmin.Container}>
        
          <Text>Add Events here.</Text>
          <View style={stylesAdmin.InputContainer}>
            <Text>Enter Event Occasion below:</Text>
            <TextInput style={stylesAdmin.Input} onChangeText={(occasion)=>this.setState({occasion})} value={this.state.occasion}  placeholder='Event occasion'></TextInput>
            <Text>Enter Event details below:</Text>
            <TextInput style={stylesAdmin.Input} onChangeText={(details)=>this.setState({details})} value={this.state.details}  placeholder='Event details'></TextInput>
            <Text>Select Event Start Date:</Text> 
            <DatePicker
              style={{width: 200}}
              date={this.state.event_start_date}
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
              onDateChange={(date) => {this.setState({event_start_date: date})}}
            />

            <Text>Select Event End Date:</Text> 
            <DatePicker
              style={{width: 200}}
              date={this.state.event_end_date}
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
              onDateChange={(date) => {this.setState({event_end_date: date})}}
            />
            
            <Text>Select Event Session:</Text>
            <ModalDropdown options={sessions} defaultValue={sessions[0]} onSelect={this.selectedSessionMethod}
              style = {stylesAdmin.ModalDropDownStyleMedium}
            >
        
            </ModalDropdown>
            <Text>
            </Text>         
            <TouchableOpacity onPress={() => this.addExamsAlert()} style={stylesAdmin.ButtonContainer}>
              <Text style={stylesAdmin.ButtonText}>ADD Event </Text>
            </TouchableOpacity>
          </View>    
        </ScrollView>
      </DrawerLayout>
      
    );  
  }
  addExamsAlert = () =>{
    //alert(a);
    Alert.alert(
      'Confirm Add Event',
      'Do you want to create the event with given details ?',
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
    
    
    try{
      //alert("a"); 
      fetch(globalAssets.IP_IN_USE+'/addEvents/'+ this.state.user_token+'/'+ this.state.schoolName + '/', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: this.state.user_id,
          loginType: this.state.loginType,
          occasion: this.state.occasion,
          details: this.state.details,
          event_start_date: this.state.event_start_date,
          event_end_date: this.state.event_end_date,
          session: this.state.session,
        }),
      })
      .then((response) => response.json())
      .then((res) => {
        //console.log(res);
        //alert(res.success);
        //alert("a");
        if (res.success === 1){
          alert("Event added successfully.")

        }
        else{alert("Error adding event.");}
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
  selectedExamTypeMethod = (idx, value) => {
    //alert({idx} + " " + {value});
    //alert("1");
    this.setState({'term_number':value});
  }
  selectedSessionMethod = (idx, value) => {
    //alert({idx} + " " + {value});
    //alert("1");
    this.setState({'session':value});
  }
  selectedFinalMethod = (idx, value) => {
    //alert({idx} + " " + {value});
    //alert("1");
    this.setState({'term_final':value});
  }

}

