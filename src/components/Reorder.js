import React, { Component } from 'react';
var dismissKeyboard = require("dismissKeyboard");
import {
  View, Text, StyleSheet,Dimensions,Platform,
  Image, TouchableOpacity, FlatList, TextInput, AsyncStorage, Alert,ActivityIndicator
} from 'react-native';
import Modal from 'react-native-modal';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import { Actions} from 'react-native-router-flux';
import Icon from 'react-native-vector-icons/FontAwesome';
import Page from '@page';
import CustomNavbar from '@customNavbar'
import PageFooter from '@page/PageFooter';
import CardTile from '@cardTile';
import { Metrics } from '@assets/config';
import {standardColors } from '@assets/config/localdata';
import { Content, Textarea, CheckBox,List ,ListItem} from 'native-base'
import ItemModal1 from './Modals/ItemModal1';
import DateTimePicker from 'react-native-modal-datetime-picker';
import moment from 'moment';
import { API, Storage } from "aws-amplify";
import Loading from "./LoadAnim/Loading";

const deviceHeight = Dimensions.get('window').height;
const deviceWidth = Dimensions.get('window').width;
const { pagePaddingHorizontal, margins, paddings } = Metrics;

const styles = StyleSheet.create({
  indicator:{
    flex:1,
    justifyContent:'center',
    alignItems:'center'
  },
  cardContainer: {
    flex: 1, flexDirection: 'row',
    backgroundColor: 'white',
    borderColor: 'white',
    borderRadius: 2, paddingHorizontal: 10
  },
  mini: {
    height: 35,
    backgroundColor: standardColors.appGreenColor,
    justifyContent: 'center',
    alignItems: 'center'
  },
  leftSection: { flex: 0.50, justifyContent: 'center', padding: 10, },
  itemImage: { flex: 1, height: undefined },
  middleSection: {
    flex: 0.35, padding: 10, alignItems: 'flex-start', justifyContent: 'flex-start', height: scale(80)
  },
  rightSection: {
    flex: 0.25, padding: 10, alignItems: 'flex-start', justifyContent: 'flex-start', marginTop: 10
  },
  titleText: { color: standardColors.black, fontWeight: 'bold', fontSize: moderateScale(12) },
  descriptionText: { color: 'grey', fontSize: moderateScale(10) },
  priceText: { fontSize: moderateScale(14), color: standardColors.appGreenColor, fontWeight: 'bold', marginRight: scale(10) },
  footerWrapper: {
    flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center'
  },
  totalItemLabel: { color: 'white' },
  confirmButton: {
    backgroundColor: standardColors.appGreenColor, paddingVertical: 10, paddingHorizontal: 40
  },
  confirmButtonText: { color: 'white', textAlign: 'center' },
  actionContainer: { flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', },
  actionButtonText: { color: 'white', textAlign: 'center' },
  horizontalBar: {
    borderWidth: 0.2,
    borderColor: '#dddddd',
  }, menubuttonText: { fontSize: 15, fontWeight: '400', textAlign: 'center', color: 'white' },
  incdecWrapper: {
    flexDirection: 'row', justifyContent: 'space-evenly',
    paddingHorizontal: 5, paddingVertical: scale(5), height: 30,
    borderRadius: 2, borderColor: 'grey', borderWidth: 1
  },
  quantityLabel: { fontSize: 14, fontWeight: '900', color: 'grey', textAlign: 'left', ...{ ...paddings.pH10 } },
  incDecIcon: { borderRadius: 2 },
  paymentSummaryHeaderContainer: { alignItems: 'center', backgroundColor: standardColors.appGreenColor, ...{ ...paddings.pV10 } },
  summaryLabelsWrapper: { flexDirection: 'row', justifyContent: 'space-between', ...{ ...paddings.pV5 } },
  summaryText: { color: standardColors.white, fontSize: moderateScale(14), textAlign: 'center' },
  coupanContainer: { height: verticalScale(35), flexDirection: 'row', justifyContent: 'flex-start', ...{ ...margins.mT5 } },
  applyButtonWrapper: { justifyContent: 'center', backgroundColor: standardColors.appGreenColor, ...{ ...paddings.pH10 } },
  modalContainer: {
    backgroundColor: standardColors.white,
    height: deviceHeight,
    width: deviceWidth,
    alignSelf: 'center'
  },
  modalContainer1: {
    backgroundColor: standardColors.white,
    height: 300,
    width: 300,
    alignSelf: 'center'
  },
  closeWrapper: {
    flexDirection: 'row-reverse',
    ...{ ...paddings.pT10 },
    marginTop:scale(15)
  },
  contentContainer: {
    flexDirection: 'column',
    ...{ ...paddings.pV10 },
    ...{ ...paddings.pH20 },
  },
  inputLabel: { fontSize: moderateScale(12), color: standardColors.black, ...{ ...margins.mB5 } },
  input: {
    height: 70, width: '100%', borderWidth: 0.5, borderColor: standardColors.lightgrey,
    fontSize: moderateScale(12), backgroundColor: '#f2f2f2', ...{ ...paddings.pH10 },
  }, input1: {
    height: 35, width: '100%', borderWidth: 0.5, borderColor: standardColors.lightgrey,
    fontSize: moderateScale(12), backgroundColor: '#f2f2f2', ...{ ...paddings.pH10 },
  },
  submitButton: {
    backgroundColor: standardColors.appGreenColor, paddingVertical: 10, paddingHorizontal: 40
  },
  submitButtonText: { color: 'white', textAlign: 'center' },
  tipbox:{
    justifyContent:'center',alignItems:'center',borderColor:'#eff0f1',borderWidth:1,borderRadius:50,width:50,height:50
  },
  tipbox1:{
    justifyContent:'center',alignItems:'center',backgroundColor:standardColors.appGreenColor,borderRadius:50,width:50,height:50
  }
});

class Reorder extends Component {
  constructor(props) {
    super(props);
    this.inputs = [];
    this.state = {
      couponCode: '',
      productQuantityVal: 1,userData:{},
      taxRate: 6.35,loader:false,
      isShowItemModal:false,modalData:[],
      reorderList:{...props.data},
      cardList:[...props.cardList],modal:false,cartempty:false,
      promptVisible:false,note: '', tableNumber:'', time:'',
      isTimeVisible:false,currentDate:new Date(),yes:true,settings:{},day:'',
      tips:[
        {price:10},
        {price:15},
        {price:20}
      ],selectedTip:-1,tipPrice:0,tipType:false,tipModal:false
    };
    console.log(this.state.cardList,this.state.reorderList);
  }
  componentDidMount() { 
    this.setState({minuteInterval: 5});
   }
  setShowItemModal = (flag) => {
    this.setState({ isShowItemModal: flag })
}
showtime = () => {
  this.setState({ isTimeVisible: true,currentDate:new Date()})
}
getnumbers(){
  console.log(global.baseURL+'/appsettings')
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
         this.setState({settings:responseData},async()=>{
          await AsyncStorage.setItem('settings',JSON.stringify(this.state.settings));
           console.log(this.state.settings);
         })
       }
      
  }).catch((error) =>{
  console.error(error);
  }) 
}
handletime = (date) => {
  this.setState({ isTimeVisible: false }, () => {
    let day = this.state.day;
    let start = this.state.settings[0].settings[day]["start"];
    let end = this.state.settings[0].settings[day]["end"];
    let d1 = moment().format('YYYY-MM-DD');
    let starttime = d1 + ' ' + start;
    let endtime = d1 + ' ' + end;
    let startTime = moment(starttime).format('YYYY/MM/DD H:mm:ss');
    let endTime = moment(endtime).format('YYYY/MM/DD H:mm:ss');
    selectTime = moment(date).format('YYYY/MM/DD H:mm:ss');
    console.log(moment(startTime).format('hh:mm a'), selectTime, moment(endTime).format('hh:mm a'))
    console.log(Date.parse(date))
    if(Platform.OS === "android"){
      if (Date.parse(date) < Date.parse(this.gettime('min'))) {
        setTimeout(() => {
          this.setState({ time: '' });
          let date=this.gettime('min');
          Alert.alert('EzPz Local', 'Please pick a time after '+moment(date).format('hh:mm a'));
        }, 1000);
      }
      if (Date.parse(selectTime) < Date.parse(startTime)) {
        setTimeout(() => {
          this.setState({ time: '' });
          Alert.alert('EzPz Local', 'Restaurant opening time is ' + moment(startTime).format('hh:mm a'));
        }, 1000);
      }
      else if (Date.parse(selectTime) > Date.parse(endTime)) {
        setTimeout(() => {
          this.setState({ time: '' });
          Alert.alert('EzPz Local', 'Restaurant closes at '+ moment(endTime).format('hh:mm a'));
        }, 1000);
      }
      else {
        this.setState({ time: date }, () => {
          let t = moment(this.state.time).format('MMMM, Do YYYY hh:mm a');
        })
      }
    }
    else{
      if (Date.parse(selectTime) < Date.parse(startTime)) {
        setTimeout(() => {
          this.setState({ time: '' });
          Alert.alert('EzPz Local', 'Restaurant opening time is ' + moment(startTime).format('hh:mm a'));
        }, 1000);
      }
      else if (Date.parse(selectTime) > Date.parse(endTime)) {
        setTimeout(() => {
          this.setState({ time: '' });
          Alert.alert('EzPz Local', 'Restaurant closes at '+ moment(endTime).format('hh:mm a'));
        }, 1000);
      }
      else {
        this.setState({ time: date }, () => {
          let t = moment(this.state.time).format('MMMM, Do YYYY hh:mm a');
        })
      }
    }

  })
}
  componentWillMount=async()=> {
    this.setState({userData:JSON.parse(await AsyncStorage.getItem("UserData"))},()=>{
      this.addtoCartdata();
      let d=new Date();
      this.setState({day:moment(d).format('ddd').toLowerCase()})
      this.getnumbers();
  })
  }
  getcardListOnLoad=async()=> {
    this.setState({ loading: true });
    this.setState({ cardList: await API.get("list", "/api/cart/Info?userId=" + this.state.userData.id, {}), loading: false,cardlength: 0 }, async() => {
        this.setState({ loader: false, loader1: false });
        console.log(this.state.cardList)
        await AsyncStorage.setItem('card_total', JSON.stringify(this.state.cardList.length));
        if (this.state.cardList.length == 0) {
          this.setState({ cartempty: true })
        }
        else {
          this.setState({ cartempty: false })
        }
    })
  }
  getcardList=async()=> {
    this.setState({ loader: true,loader1:true });
    this.setState({ cardList: await API.get("list", "/api/cart/Info?userId=" + this.state.userData.id, {}),cardlength: 0 }, async() => {
        this.setState({ loader: false, loader1: false });
        console.log(this.state.cardList)
        await AsyncStorage.setItem('card_total', JSON.stringify(this.state.cardList.length));
        if (this.state.cardList.length == 0) {
          this.setState({ cartempty: true })
        }
        else {
          this.setState({ cartempty: false })
        }
    })
  }
addtoCartdata(){
      newArray=[];
        for(let i=0;i<this.state.reorderList.dishes.length;i++){
            newM=[];
            for(let j=0;j<this.state.reorderList.dishes[i].modifiers.length;j++){
                newM.push({id:this.state.reorderList.dishes[i].modifiers[j].id})
            }
            newArray.push({
              entityData:{
              userId:this.state.userData.id,
              itemId:this.state.reorderList.dishes[i].id,
              quantity:this.state.reorderList.dishes[i].quantity,
              modifiers:newM,
              restaurantId:this.state.reorderList.restaurantId
              }
            })
      }
      let len=newArray.length;
      newArray.map((item,index)=>{
        this.add(item,index,len);
      })
}
add(getdata,index,len){
  this.setState({ loading: true });
  API.post("post", "/api/create/cart", {
    body: getdata
  }).then(res =>{
    this.setState({ loading: false });
    if(index===len-1){
      console.log('getcardList')
       console.log(index)
      this.getcardList();
    }
  }).catch(e=>{
    this.setState({ loading: false });
    console.log(e)
  })
} 
 getTotalAmount() {
  let { cardList } = this.state;
  if (!cardList) {
    return;
  }
  let totalAmount = 0;
  cardList.forEach(item => {
    let mod_amt = 0;
    item.modifiers.forEach(j => {
      item.item.modifiers.forEach(i =>{
        if(i.id == j.id){
          mod_amt = Number(mod_amt) + Number(i.price);
        }
    })
  })
    let val = (mod_amt + Number(item.item.price)) * Number(item.quantity);
    totalAmount = totalAmount + val;
  });

  return totalAmount;
}
getAmt(item) {
  let totalAmount = 0;
  let mod_amt = 0;
  item.modifiers.forEach(j => {
    item.item.modifiers.forEach(i =>{
      if(i.id == j.id){
        mod_amt = Number(mod_amt) + Number(i.price);
      }
    })
  })
  let val = (Number(mod_amt) + Number(item.item.price)) * Number(item.quantity);
  totalAmount = totalAmount + val;

  return totalAmount;
}
  getTaxValue(totalAmount) {
    return ((this.getTotalAmount() * Number(this.state.taxRate) ) / 100).toFixed(2)
  }

  productDecrementMethod = (j) => {
  if(this.state.cardList[j].quantity>1){
        this.repeat(j,false);
    }
  else{
      this.deleteCart(j);
      }
};

  productIncrementMethod = (j) => {
    this.repeat(j,true);
  };

  deleteCart=async(index) =>{
    this.setState({ loader: true });
    let d = await API.del("delete", "/api/delete/cart/"+this.state.cardList[index].id,{});
    this.getcardList();
  }

 repeat=async(index, value) =>{
    this.setState({ loader: true });
    if (value) {
      data1 = {
        entityData:{
        quantity: this.state.cardList[index].quantity + 1
        }
      }
    }
    else {
      data1 = {
        entityData:{
        quantity: this.state.cardList[index].quantity - 1
        }
      }
    }
    console.log(data1,this.state.cardList[index].id)
    let d = await API.put("put", "/api/update/cart/"+this.state.cardList[index].id, {
      body: data1
    });
    console.log(d)
    if(d!=undefined){
      this.setState({ modal1: false });
      this.getcardList();
    }
  }

  handleChangeText = (value, name) => {
    this.setState({
      [name]: value
    })
  }

  applyCouponMethod (){
    alert('method, ')
  }
  names(item) {
    return item.modifiers.map((j, index) => {
      return item.item.modifiers.map(i =>{
       if(i.id == j.id){
          return i.modifierName + (index==item.modifiers.length-1 ? '': ', ')
        }
      })
    })
  }
openModal(data){
  this.setState({isShowItemModal:true,modalData:data})
}
  renderItem = ({ item, index }) => {
    return <View key={index} >
      <View style={styles.cardContainer}>
        <View style={styles.leftSection}>
          <Text numberOfLines={2} style={styles.titleText}>{item.item.itemName}</Text>
          <View numberOfLines={2} style={{flexDirection:'row'}}>
           {/* {this.names(item)} */}
           <Text style={styles.descriptionText} numberOfLines={2}>{this.names(item)}</Text>
          </View>
          {item.modifiers.length != 0 && <View style={styles.actionContainer}>
            <TouchableOpacity style={{ flexDirection: 'row' }} onPress={() => { this.openModal(item) }}>
              <Text style={[styles.descriptionText, { color: '#9E9E9E', paddingTop: 4 }]}>CUSTOMIZE</Text>
              <Icon name='angle-down' size={20} color={standardColors.appGreenColor} />
            </TouchableOpacity>
          </View>}
        </View>
        <View style={styles.middleSection}>
        <View style={[styles.incdecWrapper,{flex:0.4, flexDirection: 'row', justifyContent: 'center' }]}>
        <TouchableOpacity style={{ justifyContent: 'center' }} onPress={() => { this.productDecrementMethod(index) }}>
                        <Icon style={[styles.incDecIcon, { marginLeft: 5 }]} name='minus' size={20} color='grey' />
                    </TouchableOpacity>
                    <View style={{ justifyContent: 'center' }}>
                        <Text style={styles.quantityLabel}> {item.quantity} </Text>
                    </View>
                    <TouchableOpacity style={{ justifyContent: 'center' }} onPress={() => { this.productIncrementMethod(index) }}>
                        <Icon style={[styles.incDecIcon, { marginRight: 5 }]} name='plus' size={20} color={standardColors.appGreenColor} />
                    </TouchableOpacity>
            </View>
        </View>
        <View style={styles.rightSection}>
          <Text style={styles.priceText}>{`$${this.getAmt(item)}`}</Text>
        </View>
      </View>
    </View>
  }
  renderSeparator(){
    return(
       <View style={styles.horizontalBar} />
    )
 }
 onPlaceOrder = () => {
  if((Number(this.getTotalAmount()) + Number(this.getTaxValue()))<=0){
    Alert.alert('Club19','Amount should not be zero');
    return;
  }
  this.setState({ promptVisible: true })
  //Actions.PaymentDetails({cardList:this.state.cardList,amount:Number(this.getTotalAmount())+Number(this.getTaxValue())})
}
submit() {
  const { time }=this.state
    console.log(time);
    let data;
    if(this.state.yes){
      data='YES';
    }
    else{
      data='NO'
    }
    if(this.state.yes && (time==='' || time==undefined || time==null)){
      Alert.alert('Club19','Please select the Pick-Up Time');
    } 
    else{
      let amt=(Number(this.getTotalAmount()) + Number(this.getTaxValue(this.getTotalAmount())) + Number(this.getTipValue(this.getTotalAmount()))).toFixed(2);
      this.setState({ promptVisible: false });
      Actions.PaymentDetails({ cardList: this.state.cardList,
        amount:Number(amt),
        note: this.state.note, tableNumber: this.state.tableNumber, pickupTime: moment(this.state.time).toString(),
        counterPick: data,tip:Number(this.getTipValue(this.getTotalAmount())),tax:Number(this.getTaxValue()),order_amount:Number(this.getTotalAmount())
      })
    } 
}
setInputRef = (inputRef, key) => {
this.inputs[key] = inputRef
}
gettime=(flag)=>{
  let d= new Date();
  if(flag==='min'){
    d.setHours(d.getHours(),d.getMinutes()+30,0,0)
  }
  else{
    d.setHours(18,0,0,0)
  }
 
  return d;
}

focusNextField = (key) => {
  this.inputs[key].focus()
}

handleChangeText = (value, name) => {
  this.setState({
    [name]: value
  })
}

tip(item,index){
  this.setState({tipType:false,selectedTip:index,tipPrice:item.price});
}
getTipValue(totalAmount) {
  if(!this.state.tipType){
    return ((this.getTotalAmount() * Number(this.state.tipPrice)) / 100).toFixed(2)
  }
  else{
    return Number(this.state.tipPrice).toFixed(2);
  }
}
addtip(){
this.setState({tipModal:false})
}
  render() {
    return (
      <Page>
         <Loading loadingStatus={this.state.loading} />
        <CustomNavbar />
        <View style={styles.mini}>
          <Text style={styles.menubuttonText}>My Cart</Text>
          <View style={{ width: 30 }} />
        </View>
        {!this.state.cartempty ? (
          <Content >
            <View style={this.state.loader ? { opacity: 0.5 } : null} pointerEvents={this.state.loader ? "none" : "auto"}>
              <FlatList
                scrollEnabled={false}
                data={this.state.cardList}
                keyExtractor={(item) => item.id}
                initialNumToRender={10}
                ItemSeparatorComponent={this.renderSeparator}
                renderItem={this.renderItem}
              />
              {/* <View style={[styles.paymentSummaryHeaderContainer, { marginTop: scale(10) }]}>
                <Text style={styles.summaryText}>Payment Summary</Text>
              </View> */}
              <CardTile style={[paddings.p10,margins.mB10,margins.mT10]}>
              <View style={{alignItems:'center'}}>
                  <View><Text style={{ color: standardColors.black,fontWeight:'bold' }}>Add a tip</Text></View>
                </View>
                <View style={{flexDirection:'row',justifyContent:'space-around',paddingVertical:scale(10)}}>
                {this.state.tips.map((item,index)=>{
                  console.log(item.price);
                 return (<TouchableOpacity key ={index} style={this.state.selectedTip==index? styles.tipbox1:styles.tipbox} onPress={()=>this.tip(item,index)}>
                 <Text style={this.state.selectedTip==index?{color:'white'}:{ color: standardColors.black}}>{item.price}%</Text>
                 </TouchableOpacity>)
                })}
                </View>
                <TouchableOpacity style={{alignItems:'center'}} onPress={()=>{this.setState({tipType:true,tipModal:true,selectedTip:-1,tipPrice:0})}}>
                <Text style={{color:standardColors.appGreenColor}}>Enter custom amount</Text>
                </TouchableOpacity>
              </CardTile>
              <CardTile style={[paddings.p10, margins.mB10]}>
              <View style={{paddingBottom:5}}><Text style={{color:standardColors.black}}>Restaurant Bill</Text></View>
                <View style={styles.summaryLabelsWrapper}>
                  <View><Text style={{ color: 'grey' }}>Order Amount</Text></View>
                  <View><Text style={{ color: 'grey' }}>${this.getTotalAmount()}</Text></View>
                </View>
                <View style={styles.summaryLabelsWrapper}>
                  <View><Text style={{ color: 'grey' }}>Sales Tax ({this.state.taxRate}%)</Text></View>
                  <View><Text style={{ color: 'grey' }}>${this.getTaxValue(this.getTotalAmount())}</Text></View>
                </View>
                <View style={styles.summaryLabelsWrapper}>
                  <View><Text style={{ color: 'grey' }}>Tip Amount {!this.state.tipType? '('+this.state.tipPrice+'%)' : null}</Text></View>
                  <View><Text style={{ color: 'grey' }}>${this.getTipValue(this.getTotalAmount())}</Text></View>
                </View>
                <View style={{borderColor:'#eff0f1',borderWidth:0.3,marginVertical:10}}></View>
                <View style={styles.summaryLabelsWrapper}>
                  <View><Text style={{ color: standardColors.black }}>Order Total</Text></View>
                  <View><Text style={{ color: standardColors.black }}>${(Number(this.getTotalAmount()) + Number(this.getTaxValue(this.getTotalAmount())) + Number(this.getTipValue(this.getTotalAmount()))).toFixed(2)}</Text></View>
                </View>
              </CardTile>
            </View>
          </Content>
        ) : (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'white' }}>
              <Image style={{ height: 300, width: 300, marginTop: -80 }} source={require('../assets/images/nocart.jpg')} />
              <Text>GOOD FOOD IS ALWAYS COOKING</Text>
              <Text style={{ color: 'grey' }}>Your cart is empty. Add something from the menu</Text>
              <TouchableOpacity style={{ backgroundColor: standardColors.appGreenColor, margin: 10, width: scale(200) }}
                onPress={() => Actions.BottomTabsView()}
              >
                <Text style={{ padding: 10, textAlign: 'center', color: 'white' }}>Go To Menu</Text>
              </TouchableOpacity>
            </View>
          )}
        {(!this.state.cartempty) &&
          <PageFooter style={styles.footerWrapper}>
            <TouchableOpacity onPress={() => {
              Actions.BottomTabsView()
            }}>
              <Text style={styles.confirmButtonText}>Add More To Cart</Text>
            </TouchableOpacity>
            <TouchableOpacity disabled={this.state.cardList && this.state.cardList.length === 0} style={styles.confirmButton} onPress={() => {
              this.onPlaceOrder()
            }}>
              <Text style={styles.confirmButtonText}>Place Order</Text>
            </TouchableOpacity>
          </PageFooter>}
       {(!this.state.cartempty) && (<Modal
          isVisible={this.state.promptVisible}
          transparent={true}
          swipeArea={50}
          backdropOpacity={0.7}
          animationType='fade'
          animationIn='slideInDown'
          animationOut='slideOutDown'
          hideModalContentWhileAnimating={true}
          deviceWidth={deviceWidth}
          deviceHeight={deviceHeight}
          onBackdropPress={() => this.setState({ promptVisible: false })}
          onBackButtonPress={() => this.setState({ promptVisible: false })}
        >
          <View style={styles.modalContainer}>
            <View style={styles.closeWrapper}>
              <TouchableOpacity style={paddings.p10} onPress={() => this.setState({ promptVisible: false })}>
                <Icon name="close" size={20} color={standardColors.appGreenColor} />
              </TouchableOpacity>
            </View>
            <View style={styles.contentContainer}>
              <View style={{ alignItems: 'center' }}>
                <Text style={{ fontWeight: 'bold', fontSize: moderateScale(18) }}>Additional Details</Text>
              </View>
              <View style={[{ flexDirection: 'column' }, margins.mT15]}>
                  <Text style={styles.inputLabel}>Order Type</Text>
                  <View style={{ flexDirection: 'column' }}>
                  <List>
                  <View style={{flexDirection:'row'}}>
                  <ListItem style={{borderBottomColor:'white',marginTop:0}}>
                    <CheckBox color={standardColors.appGreenColor} checked={this.state.yes} onPress={()=>this.setState({yes:!this.state.yes})}>Pickup</CheckBox>
                    <Text style={{paddingHorizontal:10}}>Pick-Up at Counter</Text>
                    </ListItem>
                    </View>
                    <View style={{flexDirection:'row'}}>
                    <ListItem style={{borderBottomColor:'white',marginTop:0}}>
                    <CheckBox color={standardColors.appGreenColor} checked={!this.state.yes} onPress={()=>this.setState({yes:!this.state.yes})}></CheckBox>
                    <Text style={{paddingHorizontal:10}}>Deliver to table</Text>
                    </ListItem>
                    </View>
                    </List>
                  </View>
                </View>
              {!this.state.yes && <View style={[{ flexDirection: 'column' }, margins.mT15]}>
                <Text style={styles.inputLabel}>Table  Number</Text>
                <View style={{ flexDirection: 'row' }}>
                  <TextInput
                    style={styles.input1}
                    blurOnSubmit={false}
                    returnKeyType='next'
                    autoCapitalize='none'
                    autoCorrect={false}
                    keyboardType='default'
                    maxLength={16}
                    underlineColorAndroid='transparent'
                    ref={(ref) => this.setInputRef(ref, 'tableNumber')}
                    onChangeText={(value) => this.handleChangeText(value, 'tableNumber')}
                    value={this.state.tableNumber}
                  />
                </View>
                </View>}
                {this.state.yes && <TouchableOpacity style={[{ flexDirection: 'column' }, margins.mT15]} onPress={this.showtime}>
                  <Text style={styles.inputLabel}>Estimated Pick-Up Time</Text>
                  <View style={{ flexDirection: 'row' }}>
                  <DateTimePicker
                      date={this.gettime('min')}
                      cancelTextStyle={{color:'red'}} 
                      confirmTextStyle={{color:'green'}}
                      isVisible={this.state.isTimeVisible}
                      datePickerModeAndroid='spinner'
                      onConfirm={this.handletime}
                      minimumDate={this.gettime('min')}
                      onCancel={()=>this.setState({isTimeVisible:false})}
                      mode={'time'}
                      is24Hour={false}
                    />
                    <Text style={[styles.input1,{paddingTop:8}]} placeholder='Time'>{this.state.time!=0 && moment(this.state.time).format('MMMM, Do YYYY h:mm a')}</Text>
                 </View>
                </TouchableOpacity>}
                <View style={[{ flexDirection: 'column' }, margins.mT15]}>
                  <Text style={styles.inputLabel}>Additional Information</Text>
                  <View style={{ flexDirection: 'row' }}>
                    <Textarea
                      style={styles.input}
                      blurOnSubmit={false}
                      returnKeyType='done'
                      autoCapitalize='none'
                      autoCorrect={false}
                      keyboardType='default'
                      maxLength={500}
                      underlineColorAndroid='transparent'
                      ref={(ref) => this.setInputRef(ref, 'note')}
                      onSubmitEditing={() => dismissKeyboard()}
                      onChangeText={(value) => this.handleChangeText(value, 'note')}
                      value={this.state.note}
                    />
                  </View>
                </View>
                <View style={margins.mV15}>
                  <TouchableOpacity style={styles.submitButton} onPress={() => this.submit()}>
                    <Text style={styles.submitButtonText}>Submit</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>)}
          {(!this.state.cartempty)  && (<Modal
          isVisible={this.state.tipModal}
          transparent={true}
          swipeArea={50}
          backdropOpacity={0.7}
          animationType='fade'
          animationIn='slideInDown'
          animationOut='slideOutDown'
          hideModalContentWhileAnimating={true}
          deviceWidth={deviceWidth}
          deviceHeight={deviceHeight}
          onBackdropPress={() => this.setState({ tipModal: false })}
          onBackButtonPress={() => this.setState({ tipModal: false })}
        >
          <View style={styles.modalContainer1}>
            <View style={styles.closeWrapper}>
              <TouchableOpacity style={paddings.p10} onPress={() => this.setState({ tipModal: false })}>
                <Icon name="close" size={20} color={standardColors.appGreenColor} />
              </TouchableOpacity>
            </View>
            <View style={styles.contentContainer}>
              <View style={{ alignItems: 'center' }}>
                <Text style={{ fontWeight: 'bold', fontSize: moderateScale(18) }}>Enter Tip amount</Text>
              </View>
                <View style={[{ flexDirection: 'column' }, margins.mT15]}>
                  <Text style={styles.inputLabel}>Enter Amount</Text>
                  <View style={{ flexDirection: 'row' }}>
                    <TextInput
                      style={styles.input1}
                      blurOnSubmit={false}
                      returnKeyType='done'
                      autoCapitalize='none'
                      autoCorrect={false}
                      keyboardType='number-pad'
                      maxLength={500}
                      underlineColorAndroid='transparent'
                      ref={(ref) => this.setInputRef(ref, 'tipPrice')}
                      onSubmitEditing={() => dismissKeyboard()}
                      onChangeText={(value) => this.handleChangeText(value, 'tipPrice')}
                      value={this.state.tipPrice}
                    />
                  </View>
                </View>
                <View style={margins.mV15}>
                  <TouchableOpacity style={styles.submitButton} onPress={() => this.addtip()}>
                    <Text style={styles.submitButtonText}>Submit</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>)}
          {(this.state.isShowItemModal) && <ItemModal1
            item={this.state.modalData}
            updateToppings={(toppings) => {
              item.toppingItems = toppings;
              this.setState({ item })
            }
            }
            updateSize={(size) => {
              item.size = size;
              this.setState({ item })
            }
            }
            setModalVisible={(isVisible) => this.setShowItemModal(isVisible)}
            getcardItems={() => {
              this.getcardList();
            }}
            visible={this.state.isShowItemModal} />}
      </Page>
        );
      }
    }
    
export default Reorder;