/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
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
  ActivityIndicator,
} from 'react-native';

import Login from './app/components/Login';

import Adminarea from './app/components/Adminarea';
import Teacherarea from './app/components/Teacherarea';
import Studentarea from './app/components/Studentarea';

import SubjectViewAdmin from './app/components/SubjectViewAdmin';
import SubjectAddAdmin from './app/components/SubjectAddAdmin';
import TeacherViewAdmin from './app/components/TeacherViewAdmin';
import TeacherAddAdmin from './app/components/TeacherAddAdmin';
import StudentViewAdmin from './app/components/StudentViewAdmin';
import StudentAddAdmin from './app/components/StudentAddAdmin';
import AddClassTeacherAdmin from './app/components/AddClassTeacherAdmin';

import AddSubjectToClassAdmin from './app/components/AddSubjectToClassAdmin';
import AssignSubjectsToTeacherAdmin from './app/components/AssignSubjectsToTeacherAdmin';
import AssignSubjectsToStudentAdmin from './app/components/AssignSubjectsToStudentAdmin';

import ExamViewAdmin from './app/components/ExamViewAdmin';
import ExamAddAdmin from './app/components/ExamAddAdmin';

import SubjectViewTeacher from './app/components/SubjectViewTeacher';
import StudentsInSubjectViewTeacher from './app/components/StudentsInSubjectViewTeacher';

import ExamViewTeacher from './app/components/ExamViewTeacher';
import SingleExamViewTeacher from './app/components/SingleExamViewTeacher';
import AssignGradeTeacher from './app/components/AssignGradeTeacher';
import ViewGradeTeacher from './app/components/ViewGradeTeacher';
import AddTermValueTeacher from './app/components/AddTermValueTeacher';
import ViewTermValueTeacher from './app/components/ViewTermValueTeacher';

import SubjectViewStudent from './app/components/SubjectViewStudent';

import ExamViewStudent from './app/components/ExamViewStudent';
import ViewGradeStudent from './app/components/ViewGradeStudent';

import ExamStudentViewAdmin from './app/components/ExamStudentViewAdmin';
import StudentViewGradeAdmin from './app/components/StudentViewGradeAdmin';
import StudentViewValueAdmin from './app/components/StudentViewValueAdmin';

import CreateNoticeAdmin from './app/components/CreateNoticeAdmin';

import ReceivedNoticeViewTeacher from './app/components/ReceivedNoticeViewTeacher';
import SingleReceivedNoticeViewTeacher from './app/components/SingleReceivedNoticeViewTeacher';

import ReceivedNoticeViewStudent from './app/components/ReceivedNoticeViewStudent';
import SingleReceivedNoticeViewStudent from './app/components/SingleReceivedNoticeViewStudent';

import NoticeViewAdmin from './app/components/NoticeViewAdmin';
import SingleNoticeViewAdmin from './app/components/SingleNoticeViewAdmin';
import SendNoticeIndividualStudentAdmin from './app/components/SendNoticeIndividualStudentAdmin';

import CreateNoticeTeacher from './app/components/CreateNoticeTeacher';

import SentNoticeViewTeacher from './app/components/SentNoticeViewTeacher';
import SingleSentNoticeViewTeacher from './app/components/SingleSentNoticeViewTeacher';
import SendNoticeIndividualStudentTeacher from './app/components/SendNoticeIndividualStudentTeacher';

import SingleStudentDetailAdmin from './app/components/SingleStudentDetailAdmin';
import StudentEditAdmin from './app/components/StudentEditAdmin';
import StudentAddPersonalDetailAdmin from './app/components/StudentAddPersonalDetailAdmin';
import StudentAddHouseDetailAdmin from './app/components/StudentAddHouseDetailAdmin';

import MoreViewAdmin from './app/components/MoreViewAdmin';

import PasswordArea from './app/components/PasswordArea';

import {StackNavigator} from 'react-navigation';

const NavigationApp = StackNavigator(
  {
    Login:{screen: Login},
    Teacherarea:{screen: Teacherarea},
    Studentarea:{screen: Studentarea},
    Adminarea:{screen: Adminarea},
    SubjectViewAdmin:{screen: SubjectViewAdmin},
    SubjectAddAdmin:{screen: SubjectAddAdmin},
    TeacherViewAdmin:{screen: TeacherViewAdmin},
    TeacherAddAdmin:{screen: TeacherAddAdmin},
    StudentViewAdmin:{screen: StudentViewAdmin},
    StudentAddAdmin:{screen: StudentAddAdmin},
    AddSubjectToClassAdmin:{screen: AddSubjectToClassAdmin},
    AssignSubjectsToTeacherAdmin:{screen: AssignSubjectsToTeacherAdmin},
    AssignSubjectsToStudentAdmin:{screen: AssignSubjectsToStudentAdmin},
    ExamViewAdmin:{screen: ExamViewAdmin},
    ExamAddAdmin:{screen: ExamAddAdmin},
    SubjectViewTeacher:{screen: SubjectViewTeacher},
    ExamViewTeacher:{screen: ExamViewTeacher},
    SingleExamViewTeacher:{screen: SingleExamViewTeacher},
    AssignGradeTeacher:{screen: AssignGradeTeacher},
    ViewGradeTeacher:{screen: ViewGradeTeacher},
    SubjectViewStudent:{screen: SubjectViewStudent},
    ExamViewStudent:{screen: ExamViewStudent},
    ViewGradeStudent:{screen: ViewGradeStudent},
    ExamStudentViewAdmin:{screen: ExamStudentViewAdmin},
    StudentViewGradeAdmin:{screen: StudentViewGradeAdmin},
    StudentViewValueAdmin:{screen: StudentViewValueAdmin},
    CreateNoticeAdmin:{screen: CreateNoticeAdmin},
    ReceivedNoticeViewTeacher:{screen: ReceivedNoticeViewTeacher},
    SingleReceivedNoticeViewTeacher:{screen: SingleReceivedNoticeViewTeacher},
    ReceivedNoticeViewStudent:{screen: ReceivedNoticeViewStudent},
    SingleReceivedNoticeViewStudent:{screen: SingleReceivedNoticeViewStudent}, 
    NoticeViewAdmin:{screen: NoticeViewAdmin},
    SingleNoticeViewAdmin:{screen: SingleNoticeViewAdmin}, 
    CreateNoticeTeacher:{screen: CreateNoticeTeacher},  
    SentNoticeViewTeacher:{screen: SentNoticeViewTeacher},
    SingleSentNoticeViewTeacher:{screen: SingleSentNoticeViewTeacher},
    SendNoticeIndividualStudentAdmin:{screen: SendNoticeIndividualStudentAdmin},
    StudentsInSubjectViewTeacher:{screen: StudentsInSubjectViewTeacher},
    SendNoticeIndividualStudentTeacher:{screen: SendNoticeIndividualStudentTeacher},
    AddClassTeacherAdmin:{screen: AddClassTeacherAdmin},
    AddTermValueTeacher:{screen: AddTermValueTeacher},
    ViewTermValueTeacher:{screen: ViewTermValueTeacher},
    SingleStudentDetailAdmin:{screen: SingleStudentDetailAdmin},
    StudentEditAdmin:{screen: StudentEditAdmin},
    StudentAddPersonalDetailAdmin:{screen:StudentAddPersonalDetailAdmin},
    StudentAddHouseDetailAdmin:{screen:StudentAddHouseDetailAdmin},
    PasswordArea:{screen: PasswordArea},
    MoreViewAdmin:{screen: MoreViewAdmin},
    /*
    Memberarea:{screen: Memberarea},
    Registerarea:{screen: Registerarea},
    KYCarea:{screen:KYCarea},
    Bankarea:{screen:Bankarea},
    Marketarea:{screen:Marketarea},
    Walletarea:{screen:Walletarea},
    BitcoinWalletarea:{screen:BitcoinWalletarea},
    EtherWalletarea:{screen:EtherWalletarea},
    BitcoinMarketarea:{screen:BitcoinMarketarea},
    EtherMarketarea:{screen:EtherMarketarea},
    Tradearea:{screen:Tradearea},
    */
  },
  {
    headerMode: 'none',
    navigationOptions: {
        headerVisible: false,
    }
  },
  
);
var GLOB_IP_PROD='http://52.27.104.46'
var GLOB_IP_DEV='http://127.0.0.1:8000'

export default class App extends React.Component {
  /*
  constructor() {
    super();
    this.state = { isUserLoggedIn: false, isLoaded: false };
  }
  componentDidMount() {
    AsyncStorage.getItem('user_session').then((token) => {
      this.setState({ isUserLoggedIn: token !== null, isLoaded: true });
      //if (token !== null){
        //this.props.navigator.push({
          //id: 'Memberarea'
        //});
      //}
      
    });
  }
  */
  render() {
    //const { navigate } = this.props.navigation;
    /*
    if (!this.state.isLoaded){
      return(
        <ActivityIndicator />
      );
    }
    else{
      if (!this.state.isUserLoggedIn){
        return (
          <Navigator initialRoute={{id: 'Login'}} renderScene={this.navigatorRenderScene} />
        );  
      }
      else{
        return (
          <Navigator initialRoute={{id: 'Memberarea'}} renderScene={this.navigatorRenderScene} />
        );
      }

    }*/
    return(
      <NavigationApp/>
    );
  }

}