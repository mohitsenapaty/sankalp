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
      'studentDictLength':{},
      'selectedClass':'1',
      'selectedSec':'A',
      'loginType':'Admin',
      'schoolName':'',
      'noticePageNumMax':{},
      'noticePageLength':5,
      'noticeCurrentPageNum':0,
    };
    for (var i = 0; i < allClass.length; i++){
      //var classDict = {};
      this.state.studentDict[allClass[i]] = {};
      this.state.noticePageNumMax[allClass[i]] = {};
      for (var j=0; j<allSec.length;j++){
        //classDict[allSec[j]]=[];
        this.state.studentDict[allClass[i]][allSec[j]] = [];
        this.state.noticePageNumMax[allClass[i]][allSec[j]] = 0;
      }
      //studentDict[allClass[i]] = classDict
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

    try{
      //alert("aaa" + this.state.user_id); 
      fetch(globalAssets.IP_IN_USE+'/fetchAllStudents/'+this.state.user_token+'/'+ this.state.schoolName + '/', {
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
          //this.setState({'numberOfTeachers':res.data.length,'teacherDataList':res.data});
          var studentDict = {};
          for (var i = 0; i < allClass.length; i++){
            //var classDict = {};
            studentDict[allClass[i]] = {}
            for (var j=0; j<allSec.length;j++){
              //classDict[allSec[j]]=[];
              studentDict[allClass[i]][allSec[j]] = [];
            }
            //studentDict[allClass[i]] = classDict
          }
          for (var i = 0; i < res.data.length; i++){
            studentDict[res.data[i].class][res.data[i].section].push(res.data[i]);
          }
          studentDictLength = {};
          noticePageNumMax = {}
          for (var k in studentDict){
            studentDictLength[k] = {};
            noticePageNumMax[k] = {};
            for (var l in studentDict[k]){
              studentDictLength[k][l] = studentDict[k][l].length;
              noticePageNumMax[k][l] = 0;
              var _noticePageNumMax = Math.floor(studentDict[k][l].length/this.state.noticePageLength);
              if (_noticePageNumMax != noticePageNumMax[k][l]){
                noticePageNumMax[k][l] = _noticePageNumMax;
              }
            }
          }
          this.setState({'studentDict':studentDict});
          this.setState({'noticePageNumMax':noticePageNumMax});
          //alert(this.state.studentDict);
        }
        else{alert("Invalid Login details");}
      })
      .catch((err)=>{
        alert("Network error. Please try again." + err);
      })
      .done();
    }
    catch(error){
      alert(error);
    }

    this.timer = setInterval(()=> this.refreshStudents(), 10000);

  }
  refreshStudents = async() =>{
    //alert("refresh");
    var isFocused = this.props.navigation.isFocused();    
    //alert(isFocused);
    if (!isFocused)
      return;
    try{
      //alert("aaa" + this.state.user_id); 
      fetch(globalAssets.IP_IN_USE+'/fetchAllStudents/'+this.state.user_token+'/'+ this.state.schoolName + '/', {
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
          //this.setState({'numberOfTeachers':res.data.length,'teacherDataList':res.data});
          var studentDict = {};
          for (var i = 0; i < allClass.length; i++){
            //var classDict = {};
            studentDict[allClass[i]] = {}
            for (var j=0; j<allSec.length;j++){
              //classDict[allSec[j]]=[];
              studentDict[allClass[i]][allSec[j]] = [];
            }
            //studentDict[allClass[i]] = classDict
          }
          for (var i = 0; i < res.data.length; i++){
            studentDict[res.data[i].class][res.data[i].section].push(res.data[i]);
          }
          studentDictLength = {};
          noticePageNumMax = {}
          for (var k in studentDict){
            studentDictLength[k] = {};
            noticePageNumMax[k] = {};
            for (var l in studentDict[k]){
              studentDictLength[k][l] = studentDict[k][l].length;
              noticePageNumMax[k][l] = 0;
              var _noticePageNumMax = Math.floor(studentDict[k][l].length/this.state.noticePageLength);
              if (_noticePageNumMax != noticePageNumMax[k][l]){
                noticePageNumMax[k][l] = _noticePageNumMax;
              }
            }
          }
          this.setState({'studentDict':studentDict});
          this.setState({'noticePageNumMax':noticePageNumMax});
          //alert(this.state.studentDict);
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
  displayStudentByRow(){
    return this.state.studentDict[this.state.selectedClass][this.state.selectedSec].map((row_set, i)=>{
      if (i >= this.state.noticeCurrentPageNum * this.state.noticePageLength && i < (this.state.noticeCurrentPageNum+1)*this.state.noticePageLength)
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
            <Text>Class:     {row_set.class}</Text>
            <Text>Section:   {row_set.section}</Text>
            <Text>RollNumber:{row_set.roll_number}</Text>
            <Text>Father Name:     {row_set.father_name}</Text>
            <Text>Mother Name:   {row_set.mother_name}</Text>
            <Text>Enrollment Number:{row_set.enrollment_number}</Text>
            <Text style={stylesAdmin.NavigateLinkText} onPress={()=>{this.goToMorePage(row_set)}}>More Student Non Academic Details.</Text>
            <Text style={stylesAdmin.AssignLinkText} onPress={()=>{this.goToAssignSubjectPage(row_set)}}>Assign Subjects to Student</Text>
            <Text style={stylesAdmin.AssignLinkText} onPress={()=>{this.goToSendNotice(row_set)}}>Send Notice to Student</Text>
            <Text style={stylesAdmin.DeleteLinkText} onPress={()=>{this.deleteStudentAlert(row_set.fullname)}}>Delete Student.</Text>
            <Text></Text>
          </View>
        );
    });
  }
  displayStudents(){
    //fetch list of subjects
    //alert(this.state.studentDict[this.state.selectedClass][this.state.selectedSec].length);
    if (this.state.studentDict[this.state.selectedClass][this.state.selectedSec].length == 0){
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
        <View style={{flex:1,}}>
          <ScrollView style={stylesAdmin.Container}>
          
            <Text style={stylesAdmin.HeadingText}>Students of Class: {this.state.selectedClass}, Sec: {this.state.selectedSec} </Text>
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
                  width:20,
                  backgroundColor: 'cornflowerblue',
                }}
              >
          
              </ModalDropdown>
            </View>
            {this.displayStudents()}
            <Text>
            </Text>
            <Text>
            </Text>
                 
          </ScrollView>
          <View style={stylesAdmin.ButtonContainerBackground}>
            <TouchableOpacity onPress={this.goToAddStudentPage} style={stylesAdmin.ButtonContainer}>
              <Text style={stylesAdmin.ButtonText}>Click here to add students</Text>
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
  deleteStudentAlert = (i) =>{
    Alert.alert(
      'Confirm Delete Student',
      'Do you want to add the student ' + i + '?',
      [
        {text: 'No', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
        {text: 'Yes', onPress: () => this.deleteStudent(i)},
      ],
      { cancelable: false }
    );
  }
  deleteStudent = (i) =>{
    //alert(i);
    try{
      //alert("a"); 
      fetch(globalAssets.IP_IN_USE+'/deleteStudents/'+ this.state.user_token+'/'+ this.state.schoolName + '/', {
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
          alert("Student deleted successfully.")

        }
        else{alert("Error deleting student. Try again.");}
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
  goToSendNotice = (i) => {
    this.props.navigation.navigate('SendNoticeIndividualStudentAdmin', {i},);
  }
  goToViewAssignSubjectPage = (i) =>{
    alert(i);
  }
  goToAssignSubjectPage = (i) =>{
    this.props.navigation.navigate('AssignSubjectsToStudentAdmin', {i},);
  }
  goToProfilePage = () =>{
    this.props.navigation.navigate('Adminarea');
  }
  goToStudentPage = () =>{
    alert("already on student page");
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
  goToAddStudentPage = () =>{
    this.props.navigation.navigate('StudentAddAdmin');
  }
  goToMorePage = (i) =>{
    this.props.navigation.navigate('SingleStudentDetailAdmin', {i},);
  }
  selectedClassMethod = (idx, value) => {
    //alert({idx} + " " + {value});
    //alert("1");
    this.setState({'selectedClass':value});
    this.refreshStudents();
    this.setState({'noticeCurrentPageNum':0});
  }
  selectedSecMethod = (idx, value) => {
    //alert({idx} + " " + {value});
    //alert("1");
    this.setState({'selectedSec':value});
    this.refreshStudents();
    this.setState({'noticeCurrentPageNum':0});
  }
  displayPageText1(){
    var int_arr=[];
    for (var i = 1; i<=(this.state.noticePageNumMax[this.state.selectedClass][this.state.selectedSec]+1); ++i) {
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
          <Text style={stylesAdmin.NavigateLinkText} key={i} onPress={()=>{ this.setCurrentPage(i+1)}}>{i+1}</Text>
        );
      }
    });
  }
  displayPrevNextOptions(){
    if (this.state.noticeCurrentPageNum == 0 && this.state.noticeCurrentPageNum == this.state.noticePageNumMax[this.state.selectedClass][this.state.selectedSec]){
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
    else if (this.state.noticeCurrentPageNum == 0 && this.state.noticeCurrentPageNum != this.state.noticePageNumMax[this.state.selectedClass][this.state.selectedSec]){
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
    else if (this.state.noticeCurrentPageNum == this.state.noticePageNumMax[this.state.selectedClass][this.state.selectedSec]){
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

