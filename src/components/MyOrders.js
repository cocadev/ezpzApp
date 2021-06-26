import React, { Component } from 'react';
import { View, Text, StyleSheet, Dimensions, Alert, TouchableOpacity, FlatList,AsyncStorage,Image,ActivityIndicator } from 'react-native';
import { Actions, Scene, Router } from 'react-native-router-flux';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import Page from '@page';
import CustomNavbar from '@customNavbar'
import CardTile from '@cardTile';
import { Metrics } from '@assets/config';
import { localIcons, standardText, standardColors, my_orders } from '@assets/config/localdata';
import MiniHeader from './miniHeader';
import { Content, Radio } from 'native-base';
import Moment from 'moment';
import { API, Storage } from "aws-amplify";
import Loading from "./LoadAnim/Loading";

const deviceHeight = Dimensions.get('window').height;
const deviceWidth = Dimensions.get('window').width;

const { pagePaddingHorizontal, margins, paddings } = Metrics;

const styles = StyleSheet.create({
  cardContainer: {flex: 1, flexDirection: 'row', ...{ ...margins.mT15 },
  },
  leftSection: { flexDirection: 'column', ...{ ...paddings.p10 } },
  titleText: { color: standardColors.black, fontSize: moderateScale(12), fontWeight: 'bold' },
  descriptionText: { fontSize: moderateScale(11), color: standardColors.black },
  markedText: { fontSize: moderateScale(10), fontWeight: 'bold', color: standardColors.appGreenColor, ...{ ...margins.mL5 } },
  reorderButton: {justifyContent: 'center', alignItems: 'center',
    borderColor: standardColors.appGreenColor,borderWidth:1, ...{ ...paddings.p10 },...{...margins.mT10},width:scale(100)
  },
  mini: {
    height: 35,
    backgroundColor: standardColors.appGreenColor,
    justifyContent: 'center',
    alignItems: 'center'
},
menubuttonText: { fontSize: 15, fontWeight: '400', textAlign: 'center', color: 'white' },
indicator:{
  flex:1,
  justifyContent:'center',
  alignItems:'center'
}
})

export default class MyOrders extends Component {
  constructor(props) {
    super(props);
    this.state={orderItems:[],loader:false,userData:{},cardList:[],empty:false,orderlength:-1,loading:false}
  }
  componentWillMount=async()=> {
    this.setState({userData:JSON.parse(await AsyncStorage.getItem("UserData"))},()=>{
      this.getOrders();
      this.getcardList();
  })
  }
  getcardList=async()=>{
    this.setState({ loading: true });
    this.setState({ cardList: await API.get("list", "/api/cart/Info?userId=" + this.state.userData.id, {}), loading: false,cardlength: 0},() => {
        console.log(this.state.cardList);
    })
}
  getOrders=async()=>{
    this.setState({ loading: true });
    this.setState({ orderItems: await API.get("list", "/list/orders?userId=" + this.state.userData.id, {}), loading: false,orderlength:0},() => {
      if(this.state.orderItems.length==0){
        this.setState({empty:true});
      }
      console.log(this.state.orderItems);
    })
}
names(item){
  return item.dishes.map((obj, index) => {
    return `${index + 1}) ${obj.itemName} `
  })
}
removeCart=async(item)=>{
  console.log('Remove card')
  this.setState({ loading: true });
  console.log("/api/cart/remove?userId="+this.state.userData.id)
  let d = await API.del("delete", "/api/cart/remove?userId="+this.state.userData.id, {});
  this.setState({ loading: false });
  console.log(d)
  if (d.message == 'success') {
    Actions.Reorder({data:item,cardList:this.state.cardList})
}
else{
  Alert.alert('Delete cart','unsuccessful')
}
}
reorder(item){
  const{ cardList}=this.state;
   if(cardList.length!=0){
    Alert.alert(
      'Items already in cart',
      'Your cart already contains items. Would you like to reset your cart before reordering',
      [
        {
          text: 'No',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {text: 'Yes', onPress: () => {
          console.log('OK Pressed')
          this.removeCart(item);
        }}
      ],
      {cancelable: false},
    );
   }
   else{
    Actions.Reorder({data:item,cardList:this.state.cardList})
   }
  
}
  renderItem = ({ item, index }) => {
    Moment.locale('en');
    return <CardTile key={index} style={styles.cardContainer}>
      <View style={styles.leftSection}>
        <View style={{ flexDirection: 'row', justifyContent: 'flex-start' }}>
        <Text numberOfLines={5}
          style={[styles.titleText]}>
          {this.names(item)}
        </Text>
        </View>
        <View><Text style={styles.descriptionText}>Order Total Amount - <Text style={styles.markedText}>{`$${item.amount}`}</Text></Text></View>
        <View><Text style={styles.descriptionText}>{item.orderDate}</Text></View>
        <TouchableOpacity style={styles.reorderButton} onPress={() => this.reorder(item)}>
          <Text style={{ fontSize: moderateScale(14), color: standardColors.appGreenColor }}>REORDER</Text>
        </TouchableOpacity>
      </View>
    </CardTile>
  }

  render() {
  if(this.state.empty){
      return (
        <Page>
           <Loading loadingStatus={this.state.loading} />
        <CustomNavbar />
        <View style={[styles.mini,{backgroundColor:'#f1cb5c'}]}>
            <Text style={styles.menubuttonText}>My Orders</Text>
            <View style={{width: 30}}/>
        </View>
        <View style={{flex:1,justifyContent:'center',alignItems:'center',backgroundColor:standardColors.white}}>
          <Image style={{height:300,width:300,marginTop:-80}} source={require('../assets/images/chhef1.png')} />
            <Text>I am empty :(</Text>
            <Text style={{color:'grey'}}>No Previous Orders</Text>
            <TouchableOpacity style={{backgroundColor:'#f1cb5c',margin:10,width:scale(200)}}
            onPress={()=>Actions.BottomTabsView()}>
            <Text style={{padding:10,textAlign:'center',color:'white'}}>Go To Menu</Text>
          </TouchableOpacity>
          </View>
          </Page>
      )
    }
    return (
      <Page>
        <CustomNavbar />
        <View style={styles.mini}>
            <Text style={styles.menubuttonText}>My Orders</Text>
            <View style={{width: 30}}/>
        </View>
        <FlatList
          contentContainerStyle={{ paddingHorizontal: pagePaddingHorizontal,marginBottom:10 }}
          data={this.state.orderItems}
          keyExtractor={(item) => item.id}
          initialNumToRender={10}
          renderItem={this.renderItem}
        />               
      </Page>
    )
  }
}    