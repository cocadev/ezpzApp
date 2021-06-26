/**
 * Created by mac on 27/02/19.
 */
import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  AsyncStorage,
  Image,
  Alert,
  TouchableOpacity
} from 'react-native';
import Toast from 'react-native-simple-toast';
import { Content } from 'native-base';
import CustomNavbar from '@customNavbar';
import { localIcons, standardColors, standardText } from '@assets/config/localdata';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import { Actions } from 'react-native-router-flux';
import CreditcardForm from '../components/Modals/CreditcardForm';
import Page from '@page';
import PageFooter from '@page/PageFooter';
import MiniHeader from "./miniHeader";
import { Metrics } from '@assets/config';
import moment from 'moment';
import ItemModal from './Modals/ItemModal';
import { API, Storage } from "aws-amplify";
import Loading from "./LoadAnim/Loading";
const { pagePaddingHorizontal, margins, paddings } = Metrics;
export default class PaymentDetails extends Component {
  constructor() {
    super()
    this.state = {
      isShowCreditcardModal: false,
      cardDetails:[],loader:false,
      userData:{},loading:false,
      newcardDetails:{},selectedCard:-1
    }
  }

 componentWillMount=async()=>{
    this.setState({
      userData:JSON.parse(await AsyncStorage.getItem("UserData"))
    },()=>{
      this.getCardDetails();
     console.log("userData:",this.state.userData )
  })
  }
  getCardDetails(){
  //   this.setState({loader:true});
  //   fetch(global.baseURL+'/payments', {
  //       method: 'GET',
  //       headers: {
  //           'Content-Type': 'application/json',
  //           'Authorization': 'Bearer ' + this.state.userData.jwt
  //       }
  //   }).then((response) => response.json())
  //       .then((responseData) => {
  //         this.setState({loader:false});
  //           if(responseData.statusCode == 400){
  //               Alert.alert('Club19', responseData.message)
  //             }else if (responseData.statusCode == 403){
  //               Alert.alert('Club19', responseData.message)

  //             }else if (responseData.statusCode == 401){
  //               Alert.alert('Club19', responseData.message)
  //             }
  //             else{
  //               console.log(responseData);
  //               this.setState({cardDetails:responseData},()=>{
  //                 for(let i=0;i<this.state.cardDetails.length;i++){
  //                   if(this.state.cardDetails[i].default_card===true){
  //                     this.setState({selectedCard:i});
  //                   }
  //                 }
  //                   console.log(this.state.cardDetails);
  //                   if(this.state.cardDetails.length==0){
  //                     this.setShowCreditcardModal(true);
  //                   }
  //               })
  //            }
            
  // }).catch((error) =>{
  //   console.error(error);
  // }) 
  }

  setShowCreditcardModal = (flag) => {
    this.setState({ isShowCreditcardModal: flag })
  };

  changeDefaultCard(card,index) {
    this.setState({ selectedCard:index });
  }

  showOrderSuccessful(){
    Actions.BottomTabsView({ paramData: 'ORDER_SUCCESS' });
  }

   getNewCardDetailds(data,ischecked){
//     this.setState({loader:true})
//     console.log(data);
//     let data1={
//       token:data.id,
//       card_type:data.card.brand,
//       card_last_number:data.card.last4,
//       card_id:data.card.id
//     }
//     console.log(data1)
//     if(ischecked){
//     fetch(global.baseURL+'/payments', {
//       method: 'POST',
//       headers: {
//           'Content-Type': 'application/json',
//           'Authorization': 'Bearer ' + this.state.userData.jwt
//       },
//       body:JSON.stringify(data1)
//   }).then((response) => response.json())
//       .then((responseData) => {
//         console.log(responseData);
//         this.setState({loader:false});
//           if(responseData.statusCode == 400){
//               Alert.alert('Club19', responseData.message)
//             }else if (responseData.statusCode == 403){
//               Alert.alert('Club19', responseData.message)
  
//             }else if (responseData.statusCode == 401){
//               Alert.alert('Club19', responseData.message)
//             }
//             else{
//               this.setState({cardDetails:responseData},()=>{
//                 this.getCardDetails();
//                 Toast.show('Successfully added the new card',Toast.LONG);
//             })
//            }
          
//   }).catch((error) =>{
//   console.error(error);
//   }) 
// }
// else{
//   let data1={
//     token_id:data.id,
//     Card_type:data.card.brand,
//     last_digits:data.card.last4,
//     id:1,
//     Customer_id:"",
//     card_id:data.card.id,
//     default_card:true

//   }
//   let newArray=[...this.state.cardDetails];
//   newArray.push(data1);
//   this.setState({cardDetails:newArray},()=>{
//     this.setState({selectedCard:this.state.cardDetails.length-1,loader:false})
//   })
// }
 }
 removeCart=async()=>{
  console.log('Remove card')
  this.setState({ loader: true });
  let d = await API.del("delete", "/api/cart/remove?userId="+this.state.userData.id, {});
  this.setState({ loader: false });
  if (d.message == 'success') {
    this.setState({ show: true });
    this.getCardDetails();
}
else{
  Alert.alert('Delete cart','unsuccessful')
}
}
gopayment=async(data)=>{
  this.setState({ loading: true });
  API.post("post", "/api/create/orders", {
    body: data
  }).then(res =>{
    this.setState({loading:false},async()=>{
      this.removeCart();
      await AsyncStorage.removeItem('card_total');
    })
    this.showOrderSuccessful();
  }).catch(e=>{
    console.log(e)
  })
}
  placeOrderMethod=async(acc_type)=>{
    this.setState({loading:true});
    let d = await API.get("list", "/list/orders", {});
    const { cardList } = this.props;
    console.log(cardList)
    const { cardDetails ,selectedCard} = this.state;
    newArray=[];
     for(let i=0;i<cardList.length;i++){
       newmod=[];
       for(let j=0;j<cardList[i].modifiers.length;j++){
         for(let k=0;k<cardList[i].item.modifiers.length;k++){
           if(cardList[i].item.modifiers[k].id==cardList[i].modifiers[j].id){
            newmod.push({
              id:cardList[i].item.modifiers[k].id,
              modifierName:cardList[i].item.modifiers[k].modifierName,
              price:cardList[i].item.modifiers[k].price,
              modifierType:cardList[i].item.modifiers[k].modifierType
            })
           }
         }
       }
      newArray.push({
        id:cardList[i].item.id,
        itemName:cardList[i].item.itemName,
        quantity:cardList[i].quantity,
        price:cardList[i].item.price,
        modifiers:newmod
      })
     }
     data1={
       entityData:{
       amount:this.props.amount.toString(),
       tip:this.props.tip.toString(),
       tax:this.props.tax.toString(),
       paymentMode:acc_type ? 'chargeToAccount':'card',
       orderAmount:this.props.order_amount.toString(),
       orderDate:moment().format('MMMM, Do YYYY hh:mm a'),
       userId:this.state.userData.id,
       restaurantId:cardList[0].restaurantId,
       currency:'usd',
       dishes:newArray, 
       orderStatus:'new',
       note:this.props.note!=''? this.props.note:' ',
       tableNumber:this.props.tableNumber!='' ? this.props.tableNumber: ' ',
       pickupTime:this.props.pickupTime!='                                                             ' ? this.props.pickupTime: ' ',
       counterPick:this.props.counterPick,
       cardId:acc_type ? ' ' : cardDetails[selectedCard].card_id,
       tokenId:acc_type ? ' ' :cardDetails[selectedCard].token_id,
       customerId:acc_type ? ' ' :cardDetails[selectedCard].Customer_id,
       defaultCard:acc_type ? ' ' :cardDetails[selectedCard].default_card
       }
     }
     console.log(data1);
    this.setState({loading:false},()=>{
      this.gopayment(data1);
    })
}

  render() {
    const { isShowCreditcardModal, cardDetails } = this.state
    return (
      <Page>
         <Loading loadingStatus={this.state.loading} />
        <CustomNavbar />
        <MiniHeader title={standardText.paymentDetailsText} />
        <Content>
          <View style={this.state.loader?{opacity:0.5}:null} pointerEvents={this.state.loader? "none":"auto"}>
          <View style={styles.card}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={styles.titleText}>Saved Cards</Text>
              <TouchableOpacity onPress={() => { this.setShowCreditcardModal(true) }}>
                <Text style={styles.linkText}>Add New Card</Text>
              </TouchableOpacity>
            </View>
            {cardDetails.length > 0 &&
              cardDetails.map((card, ind) => {
                return (
                  <TouchableOpacity key={ind} onPress={() => { this.changeDefaultCard(card,ind) }}>
                    <View
                      style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 }}>
                      <View style={{ flex: 0.6 }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                          <View>
                            <Text>Card No</Text>
                            <Text>xxxx xxxx xxxx {card.last_digits}</Text>
                          </View>
                        </View>
                      </View>
                      <View style={{ width: 20, height: 20 }}>
                        {
                          ind==this.state.selectedCard &&
                          <Image source={localIcons.checkMarkIcon}
                            style={{ width: 15, resizeMode: 'contain' }} />
                        }
                      </View>
                    </View>
                  </TouchableOpacity>
                )
              })
            }
          </View>
          </View>

          {this.state.userData.chargeToAccount && <TouchableOpacity style={[styles.actionButton1]} onPress={()=>this.placeOrderMethod(true)}>
            <Text style={styles.actionButtonText}>Charge To Account</Text>
          </TouchableOpacity>}
        </Content>
        {this.state.cardDetails.length>0 && <PageFooter style={styles.footerWrapper}>
          <TouchableOpacity style={styles.actionButton} onPress={()=>this.placeOrderMethod(false)}>
            <Text style={styles.actionButtonText}>Place Order</Text>
          </TouchableOpacity>
        </PageFooter>}
        {(isShowCreditcardModal) && <CreditcardForm
          updateState={(card_data,ischecked)=>this.getNewCardDetailds(card_data,ischecked)}
          setModalVisible={(isVisible) => this.setShowCreditcardModal(isVisible)}
          visible={isShowCreditcardModal} />}
      </Page>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'lightgrey'
  },
  card: {
    flexDirection: 'column',
    backgroundColor: 'white',
    margin: 15,
    minHeight: 100,
    padding: 10
  },
  titleText: {
    color: '#000',
    fontSize: 16
  },
  linkText: {
    color: standardColors.appGreenColor
  },
  footerWrapper: {
    alignItems: 'center', ...{ ...margins.mT15 }
  },
  actionButton: {
    width: '100%',
    backgroundColor: standardColors.appGreenColor,
    paddingVertical: moderateScale(10), paddingHorizontal: moderateScale(40)
  },
  actionButton1: {
    width: '90%',
    backgroundColor: standardColors.appGreenColor,
    paddingVertical: moderateScale(10),
    marginHorizontal:scale(15)
  },
  actionButtonText: { color: 'white', textAlign: 'center' },
});
