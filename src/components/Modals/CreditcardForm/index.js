import React, { Component } from 'react'
import {
  View, Text, Dimensions, AsyncStorage, Platform, TouchableOpacity, TextInput,Alert,Image
} from 'react-native';
import CheckBox from '@checkBox'
var dismissKeyboard = require("dismissKeyboard");
import Modal from 'react-native-modal';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Actions } from 'react-native-router-flux';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import Stripe from 'react-native-stripe-api';
import { Metrics } from '@assets/config';
import { standardColors, localIcons } from '@assets/config/localdata';
import styles from './styles';
import { ScrollView } from 'react-native-gesture-handler';
const deviceWidth = Dimensions.get("window").width;
const deviceHeight = Platform.OS === "ios"
  ? Dimensions.get("window").height
  : require("react-native-extra-dimensions-android").get("REAL_WINDOW_HEIGHT")
const { paddings, margins } = Metrics
class CreditcardForm extends Component {
  constructor() {
    super()
    this.inputs = [],
    this.state = {
      cardNumber: '',
      cvc: '',
      expMonth: '',
      expYear: '',
      ischecked:true,
      disable:false
    };
  }
  setInputRef = (inputRef, key) => {
    this.inputs[key] = inputRef
  }
  focusNextField = (key) => {
    this.inputs[key].focus()
  }
  handleChangeText = (value, name) => {
    this.setState({
      [name]: value
    })
  }
  onSubmit(){
    const {cardNumber,expMonth,expYear,cvc}=this.state;
    if(cardNumber=='' || cardNumber==null || cardNumber==undefined){
      Alert.alert('EzPz Local','Please enter the card number');
    }
    else if(expMonth=='' || expMonth==null || expMonth==undefined){
      Alert.alert('EzPz Local','Please enter the expiry month');
    }
    else if(expYear=='' || expYear==null || expYear==undefined){
      Alert.alert('EzPz Local','Please enter the expiry Year');
    }
    else if(cvc=='' || cvc==null || cvc==undefined){
      Alert.alert('EzPz Local','Please enter the cvc');
    }
    else{
      this.setState({disable:!this.state.disable});
      this.payment_Method(this.state);
    }
  }
  toggleCheck(){
    this.setState({ischecked:!this.state.ischecked})
  }
  payment_Method(){
     //const apiKey = 'pk_test_oPs4wwEI27L8Sh1qICPGKkq2';  // Now here we have to create new stripe token with cardInfo
     const apiKey = global.stripeKey;
     const client = new Stripe(apiKey);
     const token = client.createToken({
       number: this.state.cardNumber ,
       exp_month: this.state.expMonth, 
       exp_year: this.state.expYear, 
       cvc: this.state.cvc
    }).then((response)=>{
      this.setState({disable:!this.state.disable})
      if(response.error){
        Alert.alert('EzPz Local', response.error.message)
      }
      else{
        this.props.setModalVisible(false)
        this.props.updateState(response,this.state.ischecked);
      }
    }).catch((e)=>{
      console.log(e);
    })
  }
  render() {
    const { visible } = this.props
    return (
      <Modal
        isVisible={visible}
        transparent={true}
        backdropColor='rgba(0,0,0,0.8)'
        animationIn='zoomInDown'
        animationOut='zoomOutUp'
        hideModalContentWhileAnimating={true}
        deviceWidth={deviceWidth}
        deviceHeight={deviceHeight}
        onBackButtonPress={() => this.props.setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.closeWrapper}>
            <TouchableOpacity style={paddings.p10} onPress={() => this.props.setModalVisible(false)}>
              <Icon name="close" size={20} color={standardColors.appGreenColor} />
            </TouchableOpacity>
          </View>
          <View style={styles.contentContainer}>
            <View style={{ alignItems: 'center' }}>
              <Text style={{ fontWeight: 'bold', fontSize: moderateScale(18) }}>Add New Card</Text>
            </View>
            <ScrollView>
            <View style={[{ flexDirection: 'column' }, margins.mT15]}>
              <Text style={styles.inputLabel}>Card Number</Text>
              <View style={{ flexDirection: 'row' }}>
                <TextInput                  
                  style={styles.input}
                  blurOnSubmit={false}
                  returnKeyType='next'
                  autoCapitalize='none'
                  autoCorrect={false}
                  keyboardType='default'
                  maxLength={16}
                  underlineColorAndroid='transparent'
                  ref={(ref) => this.setInputRef(ref, 'cardNumber')}
                  onSubmitEditing={() => this.focusNextField('expMonth')}
                  onChangeText={(value) => this.handleChangeText(value, 'cardNumber')}
                  value={this.state.cardNumber}
                />
              </View>
            </View>
            <View style={[{ flexDirection: 'column' }, margins.mT5]}>
              <View style={{ flexDirection: 'row' }}>
                <View style={{ flex: 0.4, flexDirection: 'column' }}>
                  <Text style={styles.inputLabel}>Expiration Date</Text>
                  <View style={{ flexDirection: 'row' }}>
                    <TextInput
                      style={styles.input}
                      blurOnSubmit={false}
                      returnKeyType='next'
                      autoCapitalize='none'
                      placeholder='MM'
                      placeholderTextColor='grey'
                      autoCorrect={false}
                      keyboardType='number-pad'
                      underlineColorAndroid='transparent'
                      maxLength={2}
                      ref={(ref) => this.setInputRef(ref, 'expMonth')}
                      onSubmitEditing={() => this.focusNextField('expYear')}
                      onChangeText={(value) => this.handleChangeText(value, 'expMonth')}
                      value={this.state.expMonth}
                    />
                  </View>
                </View>
                <View style={{ flex: 0.5, flexDirection: 'column' }}>
                  <Text style={[styles.inputLabel, { color: standardColors.white }]}>year</Text>
                  <View style={{ flexDirection: 'row' }}>
                    <View style={paddings.pH10}><Text style={{ fontWeight: 'bold' }}>/</Text></View>
                    <TextInput
                      style={styles.input}
                      blurOnSubmit={false}
                      returnKeyType='next'
                      placeholder='YY'
                      placeholderTextColor='grey'
                      autoCapitalize='none'
                      autoCorrect={false}
                      keyboardType='number-pad'
                      maxLength={2}
                      underlineColorAndroid='transparent'
                      ref={(ref) => this.setInputRef(ref, 'expYear')}
                      onSubmitEditing={() => this.focusNextField('cvc')}
                      onChangeText={(value) => this.handleChangeText(value, 'expYear')}
                      value={this.state.expYear}
                    />
                  </View>
                </View>
              </View>
            </View>
            <View style={[{ flexDirection: 'column' }, margins.mT5]}>
              <Text style={styles.inputLabel}>CVV</Text>
              <View style={{ flexDirection: 'row' }}>
                <TextInput
                  style={styles.input}
                  blurOnSubmit={false}
                  returnKeyType='next'
                  autoCapitalize='none'
                  autoCorrect={false}
                  maxLength={3}
                  keyboardType='number-pad'
                  underlineColorAndroid='transparent'
                  ref={(ref) => this.setInputRef(ref, 'cvc')}
                  onChangeText={(value) => this.handleChangeText(value, 'cvc')}
                  value={this.state.cvc}
                  onSubmitEditing={()=>dismissKeyboard()}
                />
              </View>
            </View>
            <TouchableOpacity
                   onPress={() => { this.toggleCheck() }}
                   style={{ flexDirection: 'row', alignItems: 'center',marginTop:scale(10) }}>
                   <CheckBox isChecked={this.state.ischecked}/>
                   <Text style={[{fontSize: moderateScale(12)},margins.mL5]}>Save Card Details for future use</Text>
                 </TouchableOpacity>
            <View style={margins.mV15}>
              <TouchableOpacity style={styles.submitButton} disabled={this.state.disable} onPress={() =>this.onSubmit()}>
                <Text style={styles.submitButtonText}>Submit</Text>
              </TouchableOpacity>
            </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    )
  }
}
export default CreditcardForm;