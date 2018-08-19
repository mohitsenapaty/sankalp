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
import SubjectViewAdmin from './app/components/SubjectViewAdmin';
import SubjectAddAdmin from './app/components/SubjectAddAdmin';
import {StackNavigator} from 'react-navigation';

const NavigationApp = StackNavigator(
  {
    Login:{screen: Login},
    //Teacherarea:{screen: Teacherarea},
    Adminarea:{screen: Adminarea},
    SubjectViewAdmin:{screen: SubjectViewAdmin},
    SubjectAddAdmin:{screen: SubjectAddAdmin},
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