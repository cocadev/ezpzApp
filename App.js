/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 * @lint-ignore-every XPLATJSCOPYRIGHT1
 */

import React, { Component } from 'react';
import { SafeAreaView, StatusBar, BackHandler, AsyncStorage, Alert,Text,PushNotificationIOS ,Platform} from 'react-native';
import { Router, Scene, ActionConst } from 'react-native-router-flux';
import SplashScreen from 'react-native-splash-screen';
import Login_form from './src/components/userAccount/Login_Form';
import SignUp_form from './src/components/userAccount/Signup_Form';
import Reset from './src/components/userAccount/Reset';
import ForgotPassword_form from './src/components/userAccount/Forgot_Password';
import MenuModelView from './src/components/menuModel/modelMain_View';
import BottomTabsView from './src/components/tabs_View';
import CategoryItems from './src/components/categoryItems';
import ReviewOrder from './src/components/ReviewOrder';
import Reorder from './src/components/Reorder';
import PaymentDetails from './src/components/paymentDetails';
import MyOrders from './src/components/MyOrders'
import styles from './src/assets/styles/styles';
import ProfileDetails from "./src/components/profileDetails";
import {standardColors} from './src/assets/config/localdata';
import CardDetails from './src/components/CardDetails';
import SelectState from './src/components/SelectState';
import HomeGridView from './src/components/menuModel/home_View';
import Confirm_user from './src/components/userAccount/Confirm_user';
import PushNotification from '@aws-amplify/pushnotification';
import { API, Storage } from "aws-amplify";
//import { PushNotification } from 'aws-amplify-react-native';


 
console.disableYellowBox = true;
export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isUserLoggedIn: false,
      isLoading: true
    }
    Text.defaultProps = Text.defaultProps || {};
    Text.defaultProps.allowFontScaling = false;
  }
  componentWillMount=async() =>{
    SplashScreen.hide();
    let stage=await AsyncStorage.getItem('stage');
    console.log(stage)
    if(!stage){
      await AsyncStorage.setItem('stage','production')
    }
    if(stage==='dev'){
      global.baseURL="http://adminstage.hawkslandingcc.com";
      global.stripeKey='sk_test_pTlP8v9XNBz06H10bPOuOtSK';
   }
   else{
       global.baseURL='http://adminstage.hawkslandingcc.com';
       global.stripeKey='sk_test_pTlP8v9XNBz06H10bPOuOtSK';
   }
   console.log(stage,global.baseURL)
    AsyncStorage.getItem("UserData").then(value => {
      // alert('value: ' + (value))
      console.log("user  ",value);
      if (value) {
        this.setState({ isUserLoggedIn: true }, () => {
          this.setState({
            isLoading: false
          });
        });
      } else {
        this.setState({ isUserLoggedIn: false }, () => {
          this.setState({
            isLoading: false
          });
        });
      }
    });  

    PushNotification.onNotification((notification) => {
      console.log('in app notification', notification);
      notification.finish(PushNotificationIOS.FetchResult.NoData);
    });
    
    PushNotification.onRegister(async(token) => {
          console.log('in app registration', token);   
          // alert(token);                
          await AsyncStorage.setItem("device_token",token);
           //await AsyncStorage.getItem("device_token").then((val)=>console.log(val))          
          var  data =  {
            "entityData":{
              "deviceToken":token,
              "deviceType":Platform.OS=="ios"?"1":"2"
            }
            }
          API.post("post", "/create/deviceTokens", {
            body: data
          }).then(res =>console.log(res))
      
    });

    // if (Platform.OS !== 'ios') {
    //   // grab token
    //   const deviceToken = await firebase.messaging().getToken();
    //   console.log('Firebase device token: ', deviceToken);
    //   if (deviceToken) {
    //     await configurePinpoint(deviceToken, userId);
    //   } else {
    //     console.log('There was an error getting the device token');
    //   }
    // }
  
    await AsyncStorage.getItem("device_token").then((val)=>console.log(val))
  }

  handleBackButton = () => {
    Alert.alert(
      'Exit App',
      'Exiting the application?', [{
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel'
      }, {
        text: 'OK', 
        onPress: () => {
          BackHandler.exitApp()
        }
      },], {
        cancelable: false
      }
    )
    return true;
  }

  componentDidMount() {
    // setTimeout(() => {
    //   SplashScreen.hide();
    // }, 100)
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
  }

  render() {
    const { isUserLoggedIn } = this.state;
    //alert(isUserLoggedIn+ 'isloading: '+this.state.isLoading)
   // StatusBar.setBarStyle('light-content', true);
    if (this.state.isLoading === false) {

      return (
        <SafeAreaView style={styles.mainview_container}>
        <StatusBar backgroundColor={standardColors.appDarkBrownColor}
           barStyle="light-content"/>
          <Router panHandlers={null} duration={0}>
            <Scene key='root'>
              <Scene key='BottomTabsView' inital={true} hideNavBar={true} component={BottomTabsView} type={ActionConst.RESET} />
              <Scene key='Login_form'  hideNavBar={true} component={Login_form}/>
              <Scene key='confirmUser'  hideNavBar={true} component={Confirm_user}/>
              <Scene key='SignUp_form' hideNavBar={true} component={SignUp_form} />
              <Scene key='Reset' hideNavBar={true} component={Reset} />
              <Scene key='ForgotPassword_form' hideNavBar={true} component={ForgotPassword_form} />
              <Scene key='MenuModelView' hideNavBar={true} component={MenuModelView} type={ActionConst.RESET} />
              <Scene key='Home' hideNavBar={true} component={HomeGridView} />
              <Scene key='CategoryItems' hideNavBar={true} component={CategoryItems} />
              <Scene key='ReviewOrder' hideNavBar={true} component={ReviewOrder}/>
              <Scene key='Reorder' hideNavBar={true} component={Reorder}/>
              <Scene key='PaymentDetails' hideNavBar={true} component={PaymentDetails}/>
              <Scene key='CardDetails' hideNavBar={true} component={CardDetails}/>
              <Scene key='MyOrders' hideNavBar={true} component={MyOrders}/>
              <Scene key='Setting' hideNavBar={true} component={ProfileDetails}/>
              <Scene key='state' hideNavBar={true} component={SelectState}/>
            </Scene>
          </Router>
        </SafeAreaView>
      );
    }
    else {
      return null;
    }
  }
};
 //token=b7518dce46dc4662e69998ee8736e1cc598386034a5d7c4dc50414d9d8924d61
 //token=fm76CxrtThc:APA91bGoJuy6vZ663FUhTHXGxKJ6kBA7USMX08uAduttowQsOIBh-d3Idl21c2GTma8yrTyykcc6LRqsH_D2gu4v3SXOB-Bdr2orOgmRj_Bi8y48dM63NDQirkWJveKnTn4vP_8wv-_o