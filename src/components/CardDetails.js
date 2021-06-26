/**
 * Created by mac on 27/02/19.
 */
import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  AsyncStorage,
  Alert,
  TouchableOpacity
} from 'react-native';
import { Content } from 'native-base';
import CustomNavbar from '@customNavbar';
import Toast from 'react-native-simple-toast';
import { localIcons, standardColors, standardText } from '@assets/config/localdata';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import { Actions } from 'react-native-router-flux';
import CreditcardForm from '../components/Modals/CreditcardForm';
import Page from '@page';
import PageFooter from '@page/PageFooter';
import MiniHeader from "./miniHeader";
import { Metrics } from '@assets/config';
import {ASYNC_ITEMS, ASYNC_STORE} from "../assets/config/constants";
const { pagePaddingHorizontal, margins, paddings } = Metrics;
export default class CardDetails extends Component {
  constructor() {
    super()
    this.state = {
      isShowCreditcardModal: false,
      cardDetails:[],loader:false,
      userData:{},empty:false,
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
    this.setState({loader:true});
    fetch(global.baseURL+'/payments', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + this.state.userData.jwt
        }
    }).then((response) => response.json())
        .then((responseData) => {
            if(responseData.statusCode == 400){
                Alert.alert('EzPz Local', responseData.message)
              }else if (responseData.statusCode == 403){
                Alert.alert('EzPz Local', responseData.message)

              }else if (responseData.statusCode == 401){
                Alert.alert('EzPz Local', responseData.message)
              }
              else{
                console.log(responseData);
                this.setState({cardDetails:responseData},()=>{
                    this.setState({loader:false,selectedCard:this.state.cardDetails.length-1});
                    console.log(this.state.cardDetails);
                    if(this.state.cardDetails.length==0){
                      this.setState({empty:true});
                      this.setShowCreditcardModal(true);
                    }
                })
             }
            
  }).catch((error) =>{
    console.error(error);
  }) 
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

   getNewCardDetailds(data){
    this.setState({loader:true})
    console.log(data);
    let data1={
      token:data.id,
      card_type:data.card.brand,
      card_last_number:data.card.last4,
      card_id:data.card.id
    }
    console.log(data1)
    fetch(global.baseURL+'/payments', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + this.state.userData.jwt
      },
      body:JSON.stringify(data1)
  }).then((response) => response.json())
      .then((responseData) => {
        console.log(responseData);
        this.setState({loader:false});
          if(responseData.statusCode == 400){
              Alert.alert('EzPz Local', responseData.message)
            }else if (responseData.statusCode == 403){
              Alert.alert('EzPz Local', responseData.message)
  
            }else if (responseData.statusCode == 401){
              Alert.alert('EzPz Local', responseData.message)
            }
            else{
              this.setState({cardDetails:responseData},()=>{
                this.getCardDetails();
                Toast.show('Successfully added the new card',Toast.LONG);
            })
           }
          
  }).catch((error) =>{
  console.error(error);
  }) 
  }
gopayment(data){
  this.setState({loader:true})
  console.log(data);
  fetch(global.baseURL+'/orders', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + this.state.userData.jwt
    },
    body:JSON.stringify(data)
}).then((response) => response.json())
    .then((responseData) => {
      console.log(responseData);
      this.setState({loader:false})
        if(responseData.statusCode == 400){
            Alert.alert('EzPz Local', responseData.message)
          }else if (responseData.statusCode == 403){
            Alert.alert('EzPz Local', responseData.message)

          }else if (responseData.statusCode == 401){
            Alert.alert('EzPz Local', responseData.message)
          }
          else if(responseData.statusCode == 200){
            this.getCardDetails();
            this.showOrderSuccessful();
         }
        
}).catch((error) =>{
console.error(error);
}) 
}


  placeOrderMethod(){
    this.setState({loader:true})
    const { cardList } = this.props;
    const { cardDetails ,selectedCard} = this.state;
    newArray=[];
     for(let i=0;i<cardList.length;i++){
       newmod=[];
       for(let j=0;j<cardList[i].modifiers.length;j++){
        newmod.push({
          id:cardList[i].modifiers[j].modifier.id,
          name:cardList[i].modifiers[j].modifier.name,
          price:cardList[i].modifiers[j].modifier.price
        })
       }
      newArray.push({
        id:cardList[i].item.id,
        name:cardList[i].item.name,
        quantity:cardList[i].quantity,
        price:cardList[i].item.price,
        modifiers:newmod
      })
     }
     data1={
       amount:this.props.amount,
       currency:'usd',
       dishes:newArray, 
       note:'',
       token:cardDetails[selectedCard].token_id,
       customer_id:cardDetails[selectedCard].Customer_id
     }
     console.log(this.props.cardList)
     console.log(data1);
    this.setState({loader:false},()=>{
      this.gopayment(data1);
    })
}

  render() {
    const { isShowCreditcardModal, cardDetails } = this.state;

    return (
      <Page>
        <CustomNavbar />
        <View style={styles.mini}>
            <Text style={styles.menubuttonText}>Card Details</Text>
            <View style={{width: 30}}/>
        </View>
        <Content>
          <View style={this.state.loader?{opacity:0.5}:null} pointerEvents={this.state.loader? "none":"auto"}>
          <View style={styles.card}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={styles.titleText}>Saved Cards</Text>
              <TouchableOpacity onPress={() => { this.setShowCreditcardModal(true) }}>
                <Text style={styles.linkText}>Add New Card</Text>
              </TouchableOpacity>
            </View>
            {cardDetails.length > 0 ?
              (cardDetails.map((card, ind) => {
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
                    </View>
                  </TouchableOpacity>
                )
              })):(<View style={{justifyContent:'center',alignItems:'center',marginTop:scale(30)}}>
                <Text style={{color:'grey'}}>No Cards Added</Text>
              </View>)
            }
          </View>
          </View>
        </Content>
        {(isShowCreditcardModal) && <CreditcardForm
          updateState={(card_data)=>this.getNewCardDetailds(card_data)}
          setModalVisible={(isVisible) => this.setShowCreditcardModal(isVisible)}
          visible={isShowCreditcardModal} />}
      </Page>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: standardColors.lightgrey
  },
  card: {
    flexDirection: 'column',
    backgroundColor: standardColors.white,
    margin: 15,
    minHeight: 100,
    padding: 10
  },
  mini: {
    height: 35,
    backgroundColor: standardColors.appGreenColor,
    justifyContent: 'center',
    alignItems: 'center'
},
menubuttonText: { fontSize: 15, fontWeight: '400', textAlign: 'center', color: 'white' },
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
  actionButtonText: { color: 'white', textAlign: 'center' },
});
