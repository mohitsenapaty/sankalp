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
  TextInput,

} from 'react-native';
//import { Navigator } from 'react-native-deprecated-custom-components';
import {StackNavigator} from 'react-navigation';
import ActionBar from 'react-native-action-bar';
import DrawerLayout from 'react-native-drawer-layout';
import MenuTeacher from './MenuTeacher';
import stylesLogin, {globalAssets} from './globalExports';
import {stylesAdmin} from './globalExports';
//import Login from './Login';
var GLOB_IP_PROD='http://52.27.104.46'
var GLOB_IP_DEV='http://127.0.0.1:8000'

var IP_IN_USE=GLOB_IP_PROD

//type Props = {};
export default class AddTermValueTeacher extends React.Component{
  
  constructor(props){
    super(props);
    this.state={
      'user_session':{},
      'user_id':'',
      'drawerClosed':true,
      'user_token':'',
      'numberOfSubjects':0,
      'studentDataList':[],
      'numberOfTeachers':0,
      'teacherDataList':[],
      'examDataList':[],
      'loginType':'Teacher',
      'examObject':props.navigation.state.params.i,
      'current_id':0,
      'max_id':0,
      'max_marks':'',
      'scored_marks':'',
      'schoolName':'',
      'lit_int':'',
      'com_skill':'',
      'music':'',
      'arts_craft':'',
      'discipline':'',
      'punctuality':'',
      'hygiene':'',
      'total_num_days':'',
      'present_days':'',
      'bmi':'',
      'height':'',
      'weight':'',
      'remarks':'',

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
      fetch(globalAssets.IP_IN_USE+'/fetchClassStudents/'+this.state.user_token+'/'+ this.state.schoolName + '/', {
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
          this.setState({'studentDataList':res.data});
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
      fetch(globalAssets.IP_IN_USE+'/fetchClassStudents/'+this.state.user_token+'/'+ this.state.schoolName + '/', {
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
          this.setState({'studentDataList':res.data});
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
  //no prev button if id=0
  //no next button if id=length of array-1
  displayGrading(){
    return(
      <View>
        <Text></Text>
        <Text>Co-Scholastic Activities</Text>
        <Text>Literary Interests.</Text>
        <TextInput style={stylesAdmin.Input} onChangeText={(lit_int)=>this.setState({lit_int})} value={this.state.lit_int}  placeholder='Grade ex A+'></TextInput>
        <Text>Communication Skill.</Text>
        <TextInput style={stylesAdmin.Input} onChangeText={(com_skill)=>this.setState({com_skill})} value={this.state.com_skill}  placeholder='Grade ex A+'></TextInput>
        <Text>Music.</Text>
        <TextInput style={stylesAdmin.Input} onChangeText={(music)=>this.setState({music})} value={this.state.music}  placeholder='Grade ex A+'></TextInput>
        <Text>Arts and Crafts.</Text>
        <TextInput style={stylesAdmin.Input} onChangeText={(arts_craft)=>this.setState({arts_craft})} value={this.state.arts_craft}  placeholder='Grade ex A+'></TextInput>
        
        <Text>Personal Traits</Text>
        <Text>Discipline.</Text>
        <TextInput style={stylesAdmin.Input} onChangeText={(discipline)=>this.setState({discipline})} value={this.state.discipline}  placeholder='Grade ex A+'></TextInput>
        <Text>Punctuality.</Text>
        <TextInput style={stylesAdmin.Input} onChangeText={(punctuality)=>this.setState({punctuality})} value={this.state.punctuality}  placeholder='Grade ex A+'></TextInput>
        <Text>Hygiene.</Text>
        <TextInput style={stylesAdmin.Input} onChangeText={(hygiene)=>this.setState({hygiene})} value={this.state.hygiene}  placeholder='Grade ex A+'></TextInput>
        
        <Text>Health and Attendance</Text>
        <Text>Total number of working days.</Text>
        <TextInput style={stylesAdmin.Input} onChangeText={(total_num_days)=>this.onChangeTotalNumDays(total_num_days)} value={this.state.total_num_days}  placeholder='Total working days'></TextInput>
        <Text>Number of days Present.</Text>
        <TextInput style={stylesAdmin.Input} onChangeText={(present_days)=>this.onChangePresentDays(present_days)} value={this.state.present_days}  placeholder='Days Present'></TextInput>
        <Text>Height in cm.</Text>
        <TextInput style={stylesAdmin.Input} onChangeText={(height)=>this.onChangeHeight(height)} value={this.state.height}  placeholder='Height in cm'></TextInput>
        <Text>Weight in Kg.</Text>
        <TextInput style={stylesAdmin.Input} onChangeText={(weight)=>this.onChangeWeight(weight)} value={this.state.weight}  placeholder='Weight in kg'></TextInput>
        <Text>BMI (Body Mass Index)</Text>
        <TextInput style={stylesAdmin.Input} onChangeText={(bmi)=>this.onChangeBMI(bmi)} value={this.state.bmi}  placeholder='BMI (Body Mass Index)'></TextInput>
        
        <Text>Remarks</Text>
        <Text>Enter remarks about the student:</Text>
        <TextInput style={stylesAdmin.Input} onChangeText={(remarks)=>this.setState({remarks})} value={this.state.remarks}  placeholder='Remark about the student'></TextInput>
      </View>
      );
  }
  displayStudentByRollNumber(){
    if (this.state.current_id == 0 && this.state.studentDataList.length != 0){
      //no prev button
      return(
        <View 
        style={{borderWidth:1}}
        >
          <Text>{this.state.current_id}</Text>
          <Text>Student Name: {this.state.studentDataList[this.state.current_id].fullname}</Text>
          <Text>Roll number:  {this.state.studentDataList[this.state.current_id].roll_number}</Text>
          {this.displayGrading()}
          
          <View 
            style={{
              flex:1, flexDirection:'row', justifyContent:'space-between'
            }}
          >
            <Text>No Prev</Text>
            <Text style={stylesAdmin.AssignLinkText} onPress={()=>{this.confirmAlert(this.state.studentDataList[this.state.current_id].student_id)}}>Confirm</Text>
            <Text style={stylesAdmin.NavigateLinkText} onPress={()=>{this.increaseRoll()}}>Next</Text>
          
          </View>
        </View>
      );
    }
    else if (this.state.current_id == this.state.studentDataList.length - 1 && this.state.studentDataList.length != 0){
      //no next button
      return(
        <View 
        style={{borderWidth:1}}
        >
          <Text>{this.state.current_id}</Text>
          <Text>Student Name: {this.state.studentDataList[this.state.current_id].fullname}</Text>
          <Text>Roll number:  {this.state.studentDataList[this.state.current_id].roll_number}</Text>
          {this.displayGrading()}
          <View 
            style={{
              flex:1, flexDirection:'row', justifyContent:'space-between'
            }}
          >
            <Text style={stylesAdmin.NavigateLinkText} onPress={()=>{this.decreaseRoll()}}>Previous</Text>
            <Text style={stylesAdmin.AssignLinkText} onPress={()=>{this.confirmAlert(this.state.studentDataList[this.state.current_id].student_id)}}>Confirm</Text>
            <Text>No Next</Text>
          </View>
        </View>
      );
    }
    else if (this.state.studentDataList.length != 0){
      //no next button
      return(
        <View 
        style={{borderWidth:1}}
        >
          <Text>{this.state.current_id}</Text>
          <Text>Student Name: {this.state.studentDataList[this.state.current_id].fullname}</Text>
          <Text>Roll number:  {this.state.studentDataList[this.state.current_id].roll_number}</Text>
          {this.displayGrading()}
          <View 
            style={{
              flex:1, flexDirection:'row', justifyContent:'space-between'
            }}
          >
            <Text style={stylesAdmin.NavigateLinkText} onPress={()=>{this.decreaseRoll()}}>Previous</Text>
            <Text style={stylesAdmin.AssignLinkText} onPress={()=>{this.confirmAlert(this.state.studentDataList[this.state.current_id].student_id)}}>Confirm</Text>
            <Text style={stylesAdmin.NavigateLinkText} onPress={()=>{this.increaseRoll()}}>Next</Text>
          </View>
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
          renderNavigationView={() => <MenuTeacher 
              _goToProfilePage={()=>this.goToProfilePage()}
              _goToSubjectPage={()=>this.goToSubjectPage()}
              _goToExamsPage={()=>this.goToExamPage()}
              _goToReceivedNoticePage={()=>this.goToReceivedNoticePage()}
              _goToSentNoticePage={()=>this.goToSentNoticePage()}
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
            <Text>Exam Group Term:     {this.state.examObject.term_number} </Text>
            <Text>Exam Group Session:  {this.state.examObject.session} </Text>
            <Text>Final Term:          {this.state.examObject.term_final} </Text>
            <Text> </Text>
            {this.displayStudentByRollNumber()}
            <Text> </Text>
            <Text> </Text>
            <TouchableOpacity onPress={this.goBack} style={stylesAdmin.ButtonContainer}>
              <Text>Go Back</Text>
            </TouchableOpacity>
          </ScrollView>  
        </View>
    </DrawerLayout>
      
    );  
  }
  goBack = () =>{
    i = this.state.examObject;
    this.props.navigation.navigate('SingleExamViewTeacher', {i});
  }
  isNumeric = (n) => {
    //alert(!isNaN(parseFloat(n)) && isFinite(n));
    return !isNaN(parseFloat(n)) && isFinite(n);
  }
  onChangeTotalNumDays = (total_num_days)=>{
    if (this.isNumeric(total_num_days))
    {
      this.setState({'total_num_days':total_num_days});
    }
    else if (total_num_days==''){
      this.setState({'total_num_days':0});
    }
    else{
      alert("incorrect value " + total_num_days);
    }
    
  }
  onChangePresentDays = (present_days)=>{
    if (this.isNumeric(present_days))
    {
      this.setState({'present_days':present_days});
    }
    else if (present_days==''){
      this.setState({'present_days':0});
    }
    else{
      alert("incorrect value " + present_days);
    }
    
  }
  onChangeHeight = (height)=>{
    if (this.isNumeric(height))
    {
      this.setState({'height':height});
    }
    else if (height==''){
      this.setState({'height':0});
    }
    else{
      alert("incorrect value " + height);
    }
    
  }
  onChangeWeight = (weight)=>{
    if (this.isNumeric(weight))
    {
      this.setState({'weight':weight});
    }
    else if (weight==''){
      this.setState({'weight':0});
    }
    else{
      alert("incorrect value " + weight);
    }
    
  }
  onChangeBMI = (bmi)=>{
    if (this.isNumeric(bmi))
    {
      this.setState({'bmi':bmi});
    }
    else if (bmi==''){
      this.setState({'bmi':0});
    }
    else{
      alert("incorrect value " + bmi);
    }
    
  }
  increaseRoll = () =>{
    this.setState({'current_id':this.state.current_id+1});
    //alert(this.state.current_id);
  }
  decreaseRoll = () =>{
    this.setState({'current_id':this.state.current_id-1});
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
    alert(i);
  }  
  confirmAlert = () =>{
    Alert.alert(
      'Confirm Students Grade',
      'Do you want to confirm the grading?',
      [
        {text: 'No', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
        {text: 'Yes', onPress: () => this.giveGrade()},
      ],
      { cancelable: false }
    );
  }
  giveGrade = () =>{
    //var percent = (this.state.scored_marks/this.state.max_marks)*100;
    //var grade = Math.floor(percent/14);
    //if (grade > 6) grade = 6;
    //var gradeArr=['A+', 'A', 'B+', 'B', 'C', 'D', 'E'];
    //var charGrade = gradeArr[6-grade];
    //alert(percent);
    try{
      //alert("a"); 
      fetch(globalAssets.IP_IN_USE+'/upgradeValuesForStudent/'+ this.state.user_token+'/'+ this.state.schoolName + '/', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: this.state.user_id,
          loginType: this.state.loginType,
          student_id: this.state.studentDataList[this.state.current_id].student_id,
          //subject_id: this.state.subjectObject.subject_id,
          exam_group_id: this.state.examObject.exam_group_id,
          lit_int: this.state.lit_int,
          com_skill: this.state.com_skill,
          music: this.state.music,
          arts_craft: this.state.arts_craft,
          discipline: this.state.discipline,
          punctuality: this.state.punctuality,
          hygiene: this.state.hygiene,
          total_num_days: this.state.total_num_days,
          present_days: this.state.present_days,
          height: this.state.height,
          weight: this.state.weight,
          bmi: this.state.bmi,
          remarks: this.state.remarks,

        }),
      })
      .then((response) => response.json())
      .then((res) => {
        //console.log(res);
        //alert(res.success);
        //alert("a");
        if (res.success === 1){
          alert("Exam graded successfully.")

        }
        else{alert("Error adding exam.");}
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

