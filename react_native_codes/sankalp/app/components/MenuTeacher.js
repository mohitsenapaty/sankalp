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
        <Image
          style={{ marginTop:50, marginLeft:20, marginRight:20}}
          source={imgObject[this.props.schoolName]}
        />
        <ScrollView>
          <Text style={{ paddingLeft:20, paddingTop:16, fontSize: 16, color:'white', fontWeight: 'bold'}}>
            Kaanger Valley Academy Raipur
          </Text>
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
