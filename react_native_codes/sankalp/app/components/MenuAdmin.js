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
  Image,

} from 'react-native';

const imgObject = {
  'Kaanger_Valley_Academy_Raipur':require('../img/Kaanger_Valley_Academy_Raipur_icon.jpg'),

}

export default class MenuAdmin extends Component {
  constructor(props){
    super(props);
    //this.state={'schoolName':'Kaanger_Valley_Academy_Raipur', 'img':'../img/Kaanger_Valley_Academy_Raipur_icon.jpg'};
  }
  goToProfilePage = () =>{
    this.props._goToProfilePage();
  }
  goToStudentPage = () =>{
    this.props._goToStudentPage();
  }
  goToSubjectPage = () =>{
    this.props._goToSubjectPage();
  }
  goToTeacherPage = () =>{
    this.props._goToTeacherPage();
  }
  goToAssignSubjectToClassPage = () =>{
    this.props._goToAssignSubjectToClassPage();
  }
  goToExamsPage = () =>{
    this.props._goToExamsPage();
  }
  goToNoticePage = () =>{
    this.props._goToNoticePage();
  }
  goToViewNoticePage = () =>{
    this.props._goToViewNoticePage();
  }
  logout = () =>{
    this.props._logout();
  }
  render() {
    return (
      <View style={{ flex:1, backgroundColor: '#33cc33'}}>
        <Image
          style={{ marginTop:50, marginLeft:20, marginRight:20}}
          source={imgObject[this.props.schoolName]}
        />
        <ScrollView >
          
          <Text style={{ paddingLeft:20, paddingTop:16, fontSize: 16, color:'white', fontWeight: 'bold'}}>
            Kaanger Valley Academy Raipur
          </Text>
          <TouchableOpacity onPress={()=>this.goToProfilePage()}>
            <Text style={{color: 'white', fontSize: 16, paddingLeft: 20, paddingTop: 16}}>Profile</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={()=>this.goToStudentPage()}>
            <Text style={{color: 'white', fontSize: 16, paddingLeft: 20, paddingTop: 16}}>Students</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={()=>this.goToSubjectPage()}>
            <Text style={{color: 'white', fontSize: 16, paddingLeft: 20, paddingTop: 16}}>Subjects</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={()=>this.goToTeacherPage()}>
            <Text style={{color: 'white', fontSize: 16, paddingLeft: 20, paddingTop: 16}}>Teachers</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={()=>this.goToAssignSubjectToClassPage()}>
            <Text style={{color: 'white', fontSize: 16, paddingLeft: 20, paddingTop: 16}}>Class-Subject Assignment</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={()=>this.goToExamsPage()}>
            <Text style={{color: 'white', fontSize: 16, paddingLeft: 20, paddingTop: 16}}>Exams</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={()=>this.goToNoticePage()}>
            <Text style={{color: 'white', fontSize: 16, paddingLeft: 20, paddingTop: 16}}>Create Notices</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={()=>this.goToViewNoticePage()}>
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
