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

} from 'react-native';
//import { Navigator } from 'react-native-deprecated-custom-components';
import {StackNavigator} from 'react-navigation';
import ActionBar from 'react-native-action-bar';
import DrawerLayout from 'react-native-drawer-layout';
import MenuAdmin from './MenuAdmin';
//import Login from './Login';
var GLOB_IP_PROD='http://52.27.104.46'
var GLOB_IP_DEV='http://127.0.0.1:8000'

//type Props = {};
export default class SubjectViewAdmin extends React.Component{
  
  constructor(props){
    super(props);
    this.state={
      'user_session':{},
      'user_id':'',
      'drawerClosed':true,
      'user_token':'',
      'numberOfSubjects':0,
      'subjectDataList':[],
      'loginType':'Admin',
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

    try{
      //alert("aaa" + this.state.user_id); 
      fetch(GLOB_IP_DEV+'/fetchAllSubjects/'+this.state.user_token+'/', {
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
    
    return this.state.subjectDataList.map((row_set, i)=>{
      return (
        <View key={i}>
          <Text>{row_set.subject_id} {row_set.subject_name} {row_set.subject_code} {row_set.is_major}</Text>
        </View>
      );
    });
    
  }
  displaySubjects(){
    //fetch list of subjects
    if (this.state.numberOfSubjects == 0){
      return(
        <View style={styles.InputContainer}>
          <Text>Currently no subjects have been added yet.</Text>

        </View>
      );
    }
    else{
      //alert(this.state.subjectDataList);
      return(
        <View style={styles.InputContainer}>
          <Text>Currently these subjects have been added yet.</Text>
          { this.displaySubjectByRow() }
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
            containerStyle={styles.bar}
            backgroundColor="#33cc33"
            leftIconName={'menu'}
            onLeftPress={this.toggleDrawer}/>
        <ScrollView style={styles.Container}>
        
        <Text>Subjects Added as follows</Text>
        {this.displaySubjects()}
        <TouchableOpacity onPress={this.logout} style={styles.ButtonContainer}>
          <Text>LOG OUT</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={this.goToAddSubjectPage} style={styles.ButtonContainer}>
          <Text>Click here to add subjects</Text>
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

  goToProfilePage = () =>{
    this.props.navigation.navigate('Adminarea');
  }
  goToStudentPage = () =>{
    alert("student page");
  }
  goToSubjectPage = () =>{
    alert("subject page");
  }
  goToTeacherPage = () =>{
    alert("teacher page");
  }
  goToAddSubjectPage = () =>{
    this.props.navigation.navigate('SubjectAddAdmin');
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


const styles = StyleSheet.create({
  Container:{
    flex:1,
    padding:20,

  },
  screen: {
    backgroundColor: '#33cc33',
    flex: 1,
    paddingTop: 10,
    alignItems: 'center',
    //padding: 10
  },
  ButtonContainer:{
    alignSelf: 'stretch',
    margin: 20,
    padding: 20,
    backgroundColor: 'blue',
    borderWidth: 1,
    backgroundColor: 'rgba(255,255,255, 0.6)',
    alignItems: 'center'
  },
});

/*
<TouchableOpacity onPress={this.goToKYCPage} style={styles.ButtonContainer}>
          <Text>KYC Status:{this.state.kycDone}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={this.goToBankPage} style={styles.ButtonContainer}>
          <Text>Payment details</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={this.goToMarketPage} style={styles.ButtonContainer}>
          <Text>Market</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={this.goToWalletPage} style={styles.ButtonContainer}>
          <Text>Wallet</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={this.goToTradePage} style={styles.ButtonContainer}>
          <Text>Trade</Text>
        </TouchableOpacity>    
*/
