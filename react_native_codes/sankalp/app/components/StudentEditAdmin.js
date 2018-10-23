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
import ModalDropdown from 'react-native-modal-dropdown';
import MenuAdmin from './MenuAdmin';
import stylesLogin, {globalAssets} from './globalExports';
import {stylesAdmin} from './globalExports';
import DatePicker from 'react-native-datepicker';
var version_package = require('./../../package.json');

//import Login from './Login';
var GLOB_IP_PROD='http://52.27.104.46'
var GLOB_IP_DEV='http://127.0.0.1:8000'

var IP_IN_USE=GLOB_IP_PROD

var yes_no = ['Yes', 'No']
var fdb_db_arr = ['FDB', 'DB'];
var transport_arr = ['P', 'S'];

//type Props = {};
export default class StudentEditAdmin extends React.Component{
  
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
      student_data:{},
      emailid: props.navigation.state.params.i.emailid,
      phone: props.navigation.state.params.i.phone,
      father_name: props.navigation.state.params.i.father_name,
      mother_name: props.navigation.state.params.i.mother_name,
      enrollment_number: props.navigation.state.params.i.enrollment_number,
      fullname: props.navigation.state.params.i.fullname,
      'hostel_data':[],
      'house_data':[],
      'selectedHostelId':0,
      'selectedHostelName':'',
      'selectedHostelAddress':'',
      'selectedHouseId':0,
      'selectedHouseName':'',
      'selectedHouseCode':'',
      'hostelResident':'No',
      'birthDate':'15-08-2018',
      'residentialAddress':'',
      'FDB_DB':'DB',
      'transportation':'P',

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
          if (this.state.student_house_data && this.state.student_house_data.house_id)
            //this.state.selectedHostelId = this.state.student_personal_data.hostel_id;
            this.setState({'selectedHouseId':this.state.student_house_data.house_id});
          if (this.state.student_house_data && this.state.student_house_data.house_name)
            //this.state.selectedHostelName = this.state.student_personal_data.hostel_name;
            this.setState({'selectedHouseName':this.state.student_house_data.house_name});
          if (this.state.student_house_data && this.state.student_house_data.house_code)
            this.setState({'selectedHouseCode':this.state.student_house_data.house_code});
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
          if (this.state.student_personal_data && this.state.student_personal_data.date_of_birth)
            //this.state.birthDate = this.state.student_personal_data.date_of_birth;
            this.setState({'birthDate':this.state.student_personal_data.date_of_birth});
          if (this.state.student_personal_data && this.state.student_personal_data.hostel_resident)
            //this.state.hostelResident = this.state.student_personal_data.hostel_resident;
            this.setState({'hostelResident':this.state.student_personal_data.hostel_resident});
          if (this.state.student_personal_data && this.state.student_personal_data.residential_address)
            //this.state.residentialAddress = this.state.student_personal_data.residential_address;
            this.setState({'residentialAddress':this.state.student_personal_data.residential_address});
          if (this.state.student_personal_data && this.state.student_personal_data.transportation)
            //this.state.hostelResident = this.state.student_personal_data.transportation;
            this.setState({'transportation':this.state.student_personal_data.transportation});
          if (this.state.student_personal_data && this.state.student_personal_data.fdb_db)
            //this.state.FDB_DB = this.state.student_personal_data.fdb_db;
            this.setState({'FDB_DB':this.state.student_personal_data.fdb_db});
          if (this.state.student_personal_data && this.state.student_personal_data.hostel_id)
            //this.state.selectedHostelId = this.state.student_personal_data.hostel_id;
            this.setState({'selectedHostelId':this.state.student_personal_data.hostel_id});
          if (this.state.student_personal_data && this.state.student_personal_data.hostel_name)
            //this.state.selectedHostelName = this.state.student_personal_data.hostel_name;
            this.setState({'selectedHostelName':this.state.student_personal_data.hostel_name});
          if (this.state.student_personal_data && this.state.student_personal_data.hostel_address)
            this.setState({'selectedHostelAddress':this.state.student_personal_data.hostel_address});
            //this.state.selectedHostelAddress = this.state.student_personal_data.hostel_address;
          //alert(this.state.hostelResident);
          //alert(this.state.student_personal_data.hostel_name);
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
      fetch(globalAssets.IP_IN_USE+'/fetchAllHostels/'+this.state.user_token+'/'+ this.state.schoolName + '/', {
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
          this.setState({'hostel_data':res.data});
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
          if (this.state.student_data && this.state.student_data.hostel_resident)
            this.state.hostelResident = this.state.student_data.hostel_resident;
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
          if (this.state.student_house_data && this.state.student_house_data.house_id)
            //this.state.selectedHostelId = this.state.student_personal_data.hostel_id;
            this.setState({'selectedHouseId':this.state.student_house_data.house_id});
          if (this.state.student_house_data && this.state.student_house_data.house_name)
            //this.state.selectedHostelName = this.state.student_personal_data.hostel_name;
            this.setState({'selectedHouseName':this.state.student_house_data.house_name});
          if (this.state.student_house_data && this.state.student_house_data.house_code)
            this.setState({'selectedHouseCode':this.state.student_house_data.house_code});
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
          if (this.state.student_personal_data && this.state.student_personal_data.date_of_birth)
            //this.state.birthDate = this.state.student_personal_data.date_of_birth;
            this.setState({'birthDate':this.state.student_personal_data.date_of_birth});
          if (this.state.student_personal_data && this.state.student_personal_data.hostel_resident)
            //this.state.hostelResident = this.state.student_personal_data.hostel_resident;
            this.setState({'hostelResident':this.state.student_personal_data.hostel_resident});
          if (this.state.student_personal_data && this.state.student_personal_data.residential_address)
            //this.state.residentialAddress = this.state.student_personal_data.residential_address;
            this.setState({'residentialAddress':this.state.student_personal_data.residential_address});
          if (this.state.student_personal_data && this.state.student_personal_data.transportation)
            //this.state.hostelResident = this.state.student_personal_data.transportation;
            this.setState({'transportation':this.state.student_personal_data.transportation});
          if (this.state.student_personal_data && this.state.student_personal_data.fdb_db)
            //this.state.FDB_DB = this.state.student_personal_data.fdb_db;
            this.setState({'FDB_DB':this.state.student_personal_data.fdb_db});
          if (this.state.student_personal_data && this.state.student_personal_data.hostel_id)
            //this.state.selectedHostelId = this.state.student_personal_data.hostel_id;
            this.setState({'selectedHostelId':this.state.student_personal_data.hostel_id});
          if (this.state.student_personal_data && this.state.student_personal_data.hostel_name)
            //this.state.selectedHostelName = this.state.student_personal_data.hostel_name;
            this.setState({'selectedHostelName':this.state.student_personal_data.hostel_name});
          if (this.state.student_personal_data && this.state.student_personal_data.hostel_address)
            this.setState({'selectedHostelAddress':this.state.student_personal_data.hostel_address});
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
      fetch(globalAssets.IP_IN_USE+'/fetchAllHostels/'+this.state.user_token+'/'+ this.state.schoolName + '/', {
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
          this.setState({'hostel_data':res.data});
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
  hostelRender(){
    if (this.state.student_personal_data && this.state.hostelResident == 'Yes')
      return(
        <View>
          <Text style={stylesAdmin.HeadingText}>Old Hostel Name        : {this.state.student_personal_data.hostel_name}</Text>
          <Text style={stylesAdmin.HeadingText}>Old Hostel Address     : {this.state.student_personal_data.hostel_address}</Text>
          <Text style={stylesAdmin.HeadingText}>New Hostel Name        : {this.state.selectedHostelName}</Text>
          <Text style={stylesAdmin.HeadingText}>New Hostel Address     : {this.state.selectedHostelAddress}</Text>
          <Text></Text>
          <Text>Select Hostel: </Text>            
          <ModalDropdown options={this.state.hostel_data} defaultValue={this.state.selectedHostelName}
            renderRow={this.hostelRowRender.bind(this)} 
            renderButtonText = {this.selectedHostelRowRender.bind(this)}
            onSelect={this.selectedHostelMethod}
            style={{
              borderWidth: 0,
              borderRadius: 3,
              width:200,
              backgroundColor: 'cornflowerblue',
            }}
          >
          </ModalDropdown>          
          
        </View>
      );
    else if (this.state.hostelResident == 'Yes'){
      return(
        <View>
          <Text style={stylesAdmin.HeadingText}>Old Hostel Name        : </Text>
          <Text style={stylesAdmin.HeadingText}>Old Hostel Address     : </Text>
          <Text style={stylesAdmin.HeadingText}>New Hostel Name        : {this.state.selectedHostelName}</Text>
          <Text style={stylesAdmin.HeadingText}>New Hostel Address     : {this.state.selectedHostelAddress}</Text>
          <Text></Text>
          <Text>Select Hostel: </Text>            
          <ModalDropdown options={this.state.hostel_data} defaultValue="Please select a hostel"
            renderRow={this.hostelRowRender.bind(this)} 
            renderButtonText = {this.selectedHostelRowRender.bind(this)}
            onSelect={this.selectedHostelMethod}
            style={{
              borderWidth: 0,
              borderRadius: 3,
              width:200,
              backgroundColor: 'cornflowerblue',
            }}
          >
          </ModalDropdown>
          

        </View>
      );
    }
    else if (this.state.student_personal_data && this.state.hostelResident == 'No'){
      return(
        <View>
          
          <Text>Old Residential Address: </Text>
          <TextInput style={stylesAdmin.Input} onChangeText={(residentialAddress)=>this.setState({residentialAddress})} value={this.state.residentialAddress}  placeholder='Student residential address'></TextInput>
          <Text>Old Transportation: {this.state.student_personal_data.transportation}</Text>
          <Text>Transportation: {this.state.transportation}</Text>
          <ModalDropdown options={transport_arr} defaultValue={this.state.transportation}
            onSelect={this.selectedTransportMethod}
            style={{
              borderWidth: 0,
              borderRadius: 3,
              width:200,
              backgroundColor: 'cornflowerblue',
            }}
          >
          </ModalDropdown>
          
        </View>
      );
    }
    else{
      return(
        <View>
          
          <Text>Old Residential Address: </Text>
          <TextInput style={stylesAdmin.Input} onChangeText={(residentialAddress)=>this.setState({residentialAddress})} value={this.state.residentialAddress}  placeholder='Student residential address'></TextInput>
          <Text>Old Transportation:</Text>
          <Text>Transportation: {this.state.transportation}</Text>
          <ModalDropdown options={transport_arr} defaultValue={this.state.transportation}
            onSelect={this.selectedTransportMethod}
            style={{
              borderWidth: 0,
              borderRadius: 3,
              width:200,
              backgroundColor: 'cornflowerblue',
            }}
          >
          </ModalDropdown>
          
        </View>
      );
    }
    
  }
  personal_data_render(){
    if (this.state.student_personal_data){
      return(
        <View>
          <Text>Old Date of birth: {this.state.student_personal_data.date_of_birth}</Text>
          <DatePicker
              style={{width: 200}}
              date={this.state.birthDate}
              mode="date"
              placeholder="select date"
              format="DD-MM-YYYY"
              minDate="01-01-1990"
              maxDate="01-01-2060"
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
              onDateChange={(date) => {this.setState({birthDate: date})}}
            />
          
          <Text>Is hostel resident? {this.state.hostelResident}</Text>
          <ModalDropdown options={yes_no} defaultValue={this.state.student_personal_data.hostel_resident}
            onSelect={this.selectedResidencyMethod}
            style={{
              borderWidth: 0,
              borderRadius: 3,
              width:200,
              backgroundColor: 'cornflowerblue',
            }}
          >
          
          </ModalDropdown>
          {this.hostelRender()}
          <Text>Old FDB or DB?: {this.state.student_personal_data.fdb_db}</Text>
          <Text>FDB or DB?: {this.state.FDB_DB}</Text>
          <ModalDropdown options={fdb_db_arr} defaultValue={this.state.student_personal_data.fdb_db}
            onSelect={this.selectedFDBMethod}
            style={{
              borderWidth: 0,
              borderRadius: 3,
              width:200,
              backgroundColor: 'cornflowerblue',
            }}
          >
          
          </ModalDropdown>
           
          <TouchableOpacity onPress={this.saveHostelAlert} style={stylesAdmin.ButtonContainer}>
            <Text style={stylesAdmin.ButtonText}>Save Personal Details</Text>
          </TouchableOpacity>
          
        </View>
      );
    }
    else if (this.state.student_personal_data && this.state.hostelResident == 'No'){
      return(
        <View>
          <Text>Old Date of birth: </Text>
          <DatePicker
              style={{width: 200}}
              date={this.state.birthDate}
              mode="date"
              placeholder="select date"
              format="DD-MM-YYYY"
              minDate="01-01-1990"
              maxDate="01-01-2060"
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
              onDateChange={(date) => {this.setState({birthDate: date})}}
            />
          <Text></Text>
          <Text>Is hostel resident? {this.state.hostelResident}</Text>
          <ModalDropdown options={yes_no} defaultValue="No"
            onSelect={this.selectedResidencyMethod}
            style={{
              borderWidth: 0,
              borderRadius: 3,
              width:200,
              backgroundColor: 'cornflowerblue',
            }}
          >
          
          </ModalDropdown>
          {this.hostelRender()}
          <Text>Old Residential Address: </Text>
          <TextInput style={stylesAdmin.Input} onChangeText={(residentialAddress)=>this.setState({residentialAddress})} value={this.state.residentialAddress}  placeholder='Student residential address'></TextInput>
          <Text>Old Transportation: </Text>
          <Text>Transportation: {this.state.transportation}</Text>
          <ModalDropdown options={transport_arr} defaultValue={this.state.transportation}
            onSelect={this.selectedTransportMethod}
            style={{
              borderWidth: 0,
              borderRadius: 3,
              width:200,
              backgroundColor: 'cornflowerblue',
            }}
          >
          </ModalDropdown>
          <Text>FDB or DB?: </Text>
          <Text>FDB or DB?: {this.state.FDB_DB}</Text>
          <ModalDropdown options={fdb_db_arr} defaultValue="DB"
            onSelect={this.selectedFDBMethod}
            style={{
              borderWidth: 0,
              borderRadius: 3,
              width:200,
              backgroundColor: 'cornflowerblue',
            }}
          >
          
          </ModalDropdown> 
          <TouchableOpacity onPress={this.saveHostelAlert} style={stylesAdmin.ButtonContainer}>
            <Text style={stylesAdmin.ButtonText}>Save Personal Details</Text>
          </TouchableOpacity>
          
        </View>
      );
    }
    else{
      return(
        <View>
          <Text>Old Date of birth: </Text>
          <DatePicker
              style={{width: 200}}
              date={this.state.birthDate}
              mode="date"
              placeholder="select date"
              format="DD-MM-YYYY"
              minDate="01-01-1990"
              maxDate="01-01-2060"
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
              onDateChange={(date) => {this.setState({birthDate: date})}}
            />
          
          <Text>Is hostel resident? {this.state.hostelResident}</Text>
          <ModalDropdown options={yes_no} defaultValue="No"
            onSelect={this.selectedResidencyMethod}
            style={{
              borderWidth: 0,
              borderRadius: 3,
              width:200,
              backgroundColor: 'cornflowerblue',
            }}
          >
          
          </ModalDropdown>
          {this.hostelRender()}
          <Text>FDB or DB?: </Text>
          <Text>FDB or DB?: {this.state.FDB_DB}</Text>
          <ModalDropdown options={fdb_db_arr} defaultValue="DB"
            onSelect={this.selectedFDBMethod}
            style={{
              borderWidth: 0,
              borderRadius: 3,
              width:200,
              backgroundColor: 'cornflowerblue',
            }}
          >
          
          </ModalDropdown> 
          <TouchableOpacity onPress={this.saveHostelAlert} style={stylesAdmin.ButtonContainer}>
            <Text style={stylesAdmin.ButtonText}>Save Personal Details</Text>
          </TouchableOpacity>
          
        </View>
      );
    }
  }
  house_render() {
    if (this.state.student_house_data){
      return(
        <View>
          <Text style={stylesAdmin.HeadingText}>Old House Name        : {this.state.student_house_data.house_name}</Text>
          <Text style={stylesAdmin.HeadingText}>Old House Code        : {this.state.student_house_data.house_code}</Text>
          <Text style={stylesAdmin.HeadingText}>New House Name        : {this.state.selectedHouseName}</Text>
          <Text style={stylesAdmin.HeadingText}>New House Code        : {this.state.selectedHouseCode}</Text>
          <Text></Text>
          <Text>Select House: </Text>            
          <ModalDropdown options={this.state.house_data} defaultValue={this.state.selectedHouseName}
            renderRow={this.houseRowRender.bind(this)} 
            renderButtonText = {this.selectedHouseRowRender.bind(this)}
            onSelect={this.selectedHouseMethod}
            style={{
              borderWidth: 0,
              borderRadius: 3,
              width:200,
              backgroundColor: 'cornflowerblue',
            }}
          >
          
          </ModalDropdown>
          <TouchableOpacity onPress={this.saveHouseAlert} style={stylesAdmin.ButtonContainer}>
            <Text style={stylesAdmin.ButtonText}>Save House Details</Text>
          </TouchableOpacity>
        </View>
      );
    }
    else{
      return(
        <View>
          <Text style={stylesAdmin.HeadingText}>Old House Name        : </Text>
          <Text style={stylesAdmin.HeadingText}>Old House Code        : </Text>
          <Text style={stylesAdmin.HeadingText}>New House Name        : {this.state.selectedHouseName}</Text>
          <Text style={stylesAdmin.HeadingText}>New House Code        : {this.state.selectedHouseCode}</Text>
          <Text></Text>
          <Text>Select House: </Text>            
          <ModalDropdown options={this.state.house_data} defaultValue='Please select a house'
            renderRow={this.houseRowRender.bind(this)} 
            renderButtonText = {this.selectedHouseRowRender.bind(this)}
            onSelect={this.selectedHouseMethod}
            style={{
              borderWidth: 0,
              borderRadius: 3,
              width:200,
              backgroundColor: 'cornflowerblue',
            }}
          >
          
          </ModalDropdown>
          <TouchableOpacity onPress={this.saveHouseAlert} style={stylesAdmin.ButtonContainer}>
            <Text style={stylesAdmin.ButtonText}>Save House Details</Text>
          </TouchableOpacity>
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
            <Text style={stylesAdmin.HeadingText}>Old Enrolment Number   : {this.state.studentObject.enrollment_number}</Text>
            <TextInput style={stylesAdmin.Input} onChangeText={(enrollment_number)=>this.setState({enrollment_number})} value={this.state.enrollment_number}  placeholder='Enrollment number, also username'></TextInput>
            <Text style={stylesAdmin.HeadingText}>Old Full Name          : {this.state.studentObject.fullname}</Text>
            <TextInput style={stylesAdmin.Input} onChangeText={(fullname)=>this.setState({fullname})} value={this.state.fullname}  placeholder='Full Name of the student'></TextInput>
            <Text style={stylesAdmin.HeadingText}>Old Email id           : {this.state.studentObject.emailid}</Text> 
            <TextInput onChangeText={(emailid)=>this.setState({emailid})} value={this.state.emailid} style={stylesAdmin.Input} placeholder='Email ID of the student'></TextInput>     
            <Text style={stylesAdmin.HeadingText}>Old Contact number     : {this.state.studentObject.phone}</Text>  
            <TextInput style={stylesAdmin.Input} onChangeText={(phone)=>this.setState({phone})} value={this.state.phone}  placeholder='Mobile Number of the student'></TextInput>    
            <Text style={stylesAdmin.HeadingText}>Old Father Name        : {this.state.studentObject.father_name}</Text>
            <TextInput style={stylesAdmin.Input} onChangeText={(father_name)=>this.setState({father_name})} value={this.state.father_name}  placeholder='Students Father Name'></TextInput>
            <Text style={stylesAdmin.HeadingText}>Old Mother Name        : {this.state.studentObject.mother_name}</Text>
            <TextInput style={stylesAdmin.Input} onChangeText={(mother_name)=>this.setState({mother_name})} value={this.state.mother_name}  placeholder='Students Mother name'></TextInput>
            <TouchableOpacity onPress={this.saveDetailAlert} style={stylesAdmin.ButtonContainer}>
              <Text style={stylesAdmin.ButtonText}>Save Details</Text>
            </TouchableOpacity>
            
          </View>
          <Text></Text>
          <Text></Text>

          <View style={stylesAdmin.InputContainer}>
            {this.personal_data_render()}
          </View>
          <Text></Text>
          <Text></Text>

          <View style={stylesAdmin.InputContainer}>
            {this.house_render()}            
          </View>
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
  saveDetailAlert = () =>{
    Alert.alert(
      'Confirm Edit Student Details',
      'Do you want to edit the student details?',
      [
        {text: 'No', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
        {text: 'Yes', onPress: () => this.saveDetail()},
      ],
      { cancelable: false }
    );
    
  }
  saveDetail = () =>{
    //this.props.navigation.navigate('StudentEditAdmin', {i});
    try{
      //alert("a"); 
      fetch(globalAssets.IP_IN_USE+'/editStudentLogin/'+ this.state.user_token+'/'+ this.state.schoolName + '/', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: this.state.user_id,
          loginType: this.state.loginType,
          fullname: this.state.fullname,
          emailid: this.state.emailid,
          phone: this.state.phone,
          father_name: this.state.father_name,
          mother_name: this.state.mother_name,
          enrollment_number: this.state.enrollment_number,
          student_id: this.state.student_id,
        }),
      })
      .then((response) => response.json())
      .then((res) => {
        //console.log(res);
        //alert(res.success);
        //alert("a");
        if (res.success === 1){
          alert("Student Details edited successfully.")

        }
        else{alert("Error adding student, student name or email or phone might exist already.");}
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
  saveHostelAlert = () =>{
    Alert.alert(
      'Confirm Edit Student hostel Details',
      'Do you want to edit the student hostel details?',
      [
        {text: 'No', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
        {text: 'Yes', onPress: () => this.saveHostel()},
      ],
      { cancelable: false }
    );
    
  }
  saveHostel = () =>{
    //this.props.navigation.navigate('StudentEditAdmin', {i});
    try{
      //alert("a"); 
      fetch(globalAssets.IP_IN_USE+'/editStudentHostel/'+ this.state.user_token+'/'+ this.state.schoolName + '/', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: this.state.user_id,
          loginType: this.state.loginType,
          date_of_birth: this.state.birthDate,
          student_id: this.state.student_id,
          hostel_resident: this.state.hostelResident,
          hostel_id: this.state.selectedHostelId,
          residential_address: this.state.residentialAddress,
          transportation: this.state.transportation,
          fdb_db: this.state.FDB_DB,
        }),
      })
      .then((response) => response.json())
      .then((res) => {
        //console.log(res);
        //alert(res.success);
        //alert("a");
        if (res.success === 1){
          alert("Student Hostel Details edited successfully.")

        }
        else{alert("Error adding student hostel detail.");}
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
  saveHouseAlert = () =>{
    Alert.alert(
      'Confirm Edit Student House Details',
      'Do you want to edit the student house details?',
      [
        {text: 'No', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
        {text: 'Yes', onPress: () => this.saveHouse()},
      ],
      { cancelable: false }
    );
    
  }
  saveHouse = () =>{
    //this.props.navigation.navigate('StudentEditAdmin', {i});
    try{
      //alert("a"); 
      fetch(globalAssets.IP_IN_USE+'/editStudentHouse/'+ this.state.user_token+'/'+ this.state.schoolName + '/', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: this.state.user_id,
          loginType: this.state.loginType,
          student_id: this.state.student_id,
          house_id: this.state.selectedHouseId,
        }),
      })
      .then((response) => response.json())
      .then((res) => {
        //console.log(res);
        //alert(res.success);
        //alert("a");
        if (res.success === 1){
          alert("Student House Details edited successfully.")

        }
        else{alert("Error adding student house detail.");}
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
  selectedResidencyMethod = (idx, value) => {
    //alert({idx} + " " + {value});
    //alert("1");
    this.setState({'hostelResident':value});
    
    //alert(value);
  }
  selectedFDBMethod = (idx, value) => {
    //alert({idx} + " " + {value});
    //alert("1");
    this.setState({'FDB_DB':value});
    
    //alert(value);
  }
  selectedTransportMethod = (idx, value) =>{
    this.setState({'transportation':value});
  }
  selectedHostelMethod = (idx, value) => {
    //alert({idx} + " " + {value});
    //alert("1");
    this.setState({'selectedHostelId':value.hostel_id});
    this.setState({'selectedHostelName':value.hostel_name});
    this.setState({'selectedHostelAddress':value.hostel_address});
    //alert(value);
  }
  hostelRowRender = (rowData) =>{
    return(
      <Text>{rowData.hostel_name}</Text>
    );
  }
  selectedHostelRowRender = (rowData) =>{
    return(
      <Text>{rowData.hostel_name}</Text>
    );
  }
  selectedHouseMethod = (idx, value) => {
    //alert({idx} + " " + {value});
    //alert("1");
    this.setState({'selectedHouseId':value.house_id});
    this.setState({'selectedHouseName':value.house_name});
    this.setState({'selectedHouseCode':value.house_code});
    //alert(value);
  }
  houseRowRender = (rowData) =>{
    return(
      <Text>{rowData.house_name}</Text>
    );
  }
  selectedHouseRowRender = (rowData) =>{
    return(
      <Text>{rowData.house_name}</Text>
    );
  }

}


