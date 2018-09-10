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

export default class MenuTeacher extends Component {
  constructor(props){
    super(props);
  }
  goToProfilePage = () =>{
    this.props._goToProfilePage();
  }
  goToSubjectPage = () =>{
    this.props._goToSubjectPage();
  }
  goToExamsPage = () =>{
    this.props._goToExamsPage();
  }
  goToReceivedNoticePage = () =>{
    this.props._goToReceivedNoticePage();
  }
  goToSentNoticePage = () =>{
    this.props._goToSentNoticePage();
  }
  logout = () =>{
    this.props._logout();
  }
  render() {
    return (
      <View style={{ flex:1, backgroundColor: '#33cc33'}}>
        <ScrollView>
          <TouchableOpacity onPress={()=>this.goToProfilePage()}>
            <Text style={{color: 'white', fontSize: 16, paddingLeft: 20, paddingTop: 16}}>Profile</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={()=>this.goToSubjectPage()}>
            <Text style={{color: 'white', fontSize: 16, paddingLeft: 20, paddingTop: 16}}>Subjects</Text>
          </TouchableOpacity> 
          <TouchableOpacity onPress={()=>this.goToExamsPage()}>
            <Text style={{color: 'white', fontSize: 16, paddingLeft: 20, paddingTop: 16}}>Exams</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={()=>this.goToReceivedNoticePage()}>
            <Text style={{color: 'white', fontSize: 16, paddingLeft: 20, paddingTop: 16}}>Create Notices</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={()=>this.goToSentNoticePage()}>
            <Text style={{color: 'white', fontSize: 16, paddingLeft: 20, paddingTop: 16}}>View Latest Notices</Text>
          </TouchableOpacity>  
          <TouchableOpacity onPress={()=>this.logout()}>
            <Text style={{color: 'white', fontSize: 16, paddingLeft: 20, paddingTop: 16}}>Sign Out</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    );
  }
}
