import React, { Component } from "react";
import { AsyncStorage, View, ScrollView, TouchableOpacity, Text, ImageBackground, Image, Linking, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Actions } from 'react-native-router-flux';
import {localIcons, standardText, menulist_Array, standardColors,menulist_Array_nologin} from '../../assets/config/localdata';
import styles from './styles';
import { Storage } from "aws-amplify";
import config from "../../../config";

export default class MenuModelView extends Component {
  constructor(props) {
    super(props);
    this.state = {
        card_length:0,User:'',userData:{},picture:'NULL',restData:null
    }
  }
componentWillMount=async()=> {
  if(await AsyncStorage.getItem("restaurant")!=null){
    await this.setState({restData:JSON.parse(await AsyncStorage.getItem("restaurant"))},()=>{
      console.log(this.state.restData)
    })
  }
  if(await AsyncStorage.getItem("UserData")!=null){
    let tot=await AsyncStorage.getItem('card_total');
    await this.setState({card_length:tot,userData:JSON.parse(await AsyncStorage.getItem("UserData"))},async()=>{
      console.log(this.state.userData)
    });
  }
  else{
        this.setState({User:await AsyncStorage.getItem("UserData")});
      }
  }
    // componentDidUpdate=async()=> {
    //   if(await AsyncStorage.getItem("UserData")!=null){
    //   let tot=await AsyncStorage.getItem('card_total');
    //   let user=JSON.parse(await AsyncStorage.getItem("UserData"));
    //   this.setState({card_length:tot,userData:user,pic:user.user.picture});
    //   }
    //   else{
    //     this.setState({User:await AsyncStorage.getItem("UserData")});
    //   }
    // }
    async getnumbers(data){
      fetch(global.baseURL+'/appsettings', {
        method: 'GET',
      }).then((response) => response.json())
        .then((responseData) => {
          console.log(responseData)
          if(responseData.statusCode == 400){
            Alert.alert('EzPz Local', responseData.message)
            }else if (responseData.statusCode == 403){
            Alert.alert('EzPz Local', responseData.message)
            }else if (responseData.statusCode == 401){
            Alert.alert('EzPz Local', responseData.message)
            }
            else{
              AsyncStorage.setItem('settings',JSON.stringify(responseData));
              if(data==='kitchen'){
                Linking.openURL(`tel:${responseData[0].settings.call_to_kitchen}`)
              }
              else{
                Linking.openURL(`tel:${responseData[0].settings.call_to_bar}`)
              }
           }
      }).catch((error) =>{
      console.error(error);
      }) 
    }
  logoutAlertMethod(){
    Alert.alert(
      'EzPz Local',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {text: 'OK', onPress: () => {
          AsyncStorage.clear();
          this.componentWillMount();
        }},
      ],
      {cancelable: false},
    );
  }
  selectItemMethod(res) {
    if(res.key === 'logout'){
      this.logoutAlertMethod()     
    } else if(res.key ==='home'){
      this.closeMethod(standardText.tabFoodMenu)
    }else if(res.key ==='CallKitchen'){
      if(this.state.restData!=null){
        Linking.openURL(`tel:${this.state.restData.phone}`)
      }
      else{
      this.getnumbers('kitchen')
      }
    }
    else if(res.key ==='callBar'){
      this.getnumbers('bar')
    }
    else{
      Actions[res.key]()
    }
  }
  closeMethod = ()=> {
      this.props.onBackPress()
  }
  profileView_Method() {
    {console.log(config.s3.URL+this.state.userData.picture)}
    if(this.state.User!=null){
    return (
      <View style={[styles.profileBackView]} source={localIcons.settingsTopBackground} >
         <TouchableOpacity style={{ marginHorizontal:18, justifyContent:'flex-end',alignItems:'flex-end'}} onPress={() => { this.closeMethod(standardText.tabFoodMenu)}}>
          <Icon name = "times-circle"  size ={30} color='white' />
         </TouchableOpacity>
        <View style={{justifyContent:'space-evenly', alignItems:'center'}}>
        <TouchableOpacity style={{justifyContent:'space-evenly', alignItems:'center'}} onPress={() => Actions.Setting({userData:this.state.userData})}>
          <Image source={this.state.userData.picture!='NULL' && this.state.userData.picture!=undefined ? ({uri:config.s3.URL+this.state.userData.picture}):(localIcons.settingsProfileImg)} style={styles.profileStyles} />
          <Text style={styles.profileUsrname}>{this.state.userData.firstName}{' '}{this.state.userData.lastName}</Text>
                <Text style={styles.editprofileText}>Edit Profile</Text>
            </TouchableOpacity>
        </View>
      </View>
    )}
    else{
      return (
        <View style={[styles.profileBackView]} source={localIcons.settingsTopBackground} >
           <TouchableOpacity style={{ marginHorizontal:18, justifyContent:'flex-end',alignItems:'flex-end'}} onPress={() => { this.closeMethod(standardText.tabFoodMenu)}}>
            <Icon name = "times-circle"  size ={30} color='white' />
           </TouchableOpacity>
          <View style={{justifyContent:'space-evenly', alignItems:'center'}}>
          <View style={{justifyContent:'space-evenly', alignItems:'center'}} >
            <Image source={localIcons.settingsProfileImg} style={styles.profileStyles} />
            <Text style={styles.profileUsrname}>Guest</Text>
              </View>
          </View>
        </View>
      )
    }
  }
  names(menuTitle){
    if(this.state.restData!=null && menuTitle == 'Call EzPzOrder'){
      return 'Call '+ this.state.restData.restaurantName
    }
    else{
      return menuTitle
    }
  }
  render() {
   let menulist=[];
    if(this.state.User!=null){
      this.menulist=menulist_Array;
    }
    else{
      this.menulist=menulist_Array_nologin;
    }
    let display_menuItems = this.menulist.map((res, i) => {
      let menuTitle = res.icon_title;
      return (
        <TouchableOpacity key={i} style={styles.icon_TouchableView}
                          onPress={this.selectItemMethod.bind(this, res)}>
            <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center'}}>
                <Icon size={22} name={res.icon_name} color='white'/>
                <Text style={styles.icon_title}>{this.names(menuTitle)}</Text>
                <View style={{ flexDirection: 'row', flex: 1, justifyContent: 'flex-end', alignItems: 'center'}}>
                    {
                        menuTitle === 'My Cart' &&
                        this.state.card_length>0 && (<View style={{
                            paddingHorizontal: 15,
                            paddingVertical: 2,
                            borderRadius: 10,
                            backgroundColor: standardColors.white
                        }}>
                            <Text
                                style={{
                                    color: standardColors.appGreenColor,
                                    fontSize: 14
                                }}
                            >{this.state.card_length}</Text>
                        </View>)
                    }
                </View>
            </View>
        </TouchableOpacity>

      )
    })
    return (
      <View style={styles.container}>
        <View style={styles.profileSplitView}>
          <View style={styles.profileView}>
            {this.profileView_Method()}
          </View>
        </View>
        <View style={styles.selectedSplitView}>
          <View style={styles.selectedItemsView}>
            <ScrollView>
              {display_menuItems}
              <View style={{justifyContent:'center',alignItems:'center'}}>
              <Text style={{color:'white'}}> V 1.1 (05/10/2019)</Text>
              </View>
            </ScrollView>
          </View>
        </View>
      </View>
    );
  }
}