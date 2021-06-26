import React, { Component } from 'react';
var dismissKeyboard = require("dismissKeyboard");
import {
  View, Text, StyleSheet, Dimensions,
  Image, TouchableOpacity, FlatList, TextInput, AsyncStorage, Alert, ActivityIndicator
} from 'react-native';
import Modal from 'react-native-modal';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import { Actions } from 'react-native-router-flux';
import Icon from 'react-native-vector-icons/FontAwesome';
import Page from '@page';
import CustomNavbar from '@customNavbar'
import PageFooter from '@page/PageFooter';
import CardTile from '@cardTile';
import { Metrics } from '@assets/config';
import { standardColors } from '@assets/config/localdata';
import { Content, Textarea, CheckBox, List, ListItem } from 'native-base';
import ItemModal1 from './Modals/ItemModal1';
import DateTimePicker from 'react-native-modal-datetime-picker';
import moment from 'moment';


const deviceHeight = Dimensions.get('window').height;
const deviceWidth = Dimensions.get('window').width;
const { pagePaddingHorizontal, margins, paddings } = Metrics;


class Appinfo extends Component {

  constructor(props) {
    super(props);
    this.inputs = [];
    this.state = {
      couponCode: '',
      productQuantityVal: 1, 
      userData: {},
      taxRate: 6.35, 
      loader: false,
      isShowItemModal: false, 
      modalData: [], 
      cardlength: -1,
      cardList: [], 
      cartempty: false, 
      promptVisible: false, 
      note: '', 
      tableNumber: '', 
      time: '',
      isTimeVisible: false, 
      currentDate: new Date(), 
      yes: true
    };
  }
  setShowItemModal = (flag) => {
    this.setState({ isShowItemModal: flag })
  }
  showtime = () => {
    this.setState({ isTimeVisible: true, currentDate: new Date() })
  }
  handletime = (date) => {
    this.setState({ isTimeVisible: false })
    let d = this.state.currentDate;
    let d1 = new Date();
    d.setHours(d.getHours(), d.getMinutes() + 30, 0, 0);
    d1.setHours(18, 0, 0, 0);
    if (date > d1) {
      Alert.alert('Club19', 'After 6:00 PM restaurant is closed ')
    }
    else if (date > d) {
      this.setState({ isTimeVisible: false, time: date }, () => {
        let t = moment(this.state.time).format('MMMM, Do YYYY hh:mm a')
        console.log(t)
      })
    }
    else {
      this.setState({ isTimeVisible: false, time: d }, () => {
        let t = moment(this.state.time).format('MMMM, Do YYYY hh:mm a')
        console.log(t)
      })
    }

  }
  componentWillMount = async () => {
    this.setState({ userData: JSON.parse(await AsyncStorage.getItem("UserData")) }, () => {
      this.getcardList();
    })
  }
  getcardList() {

    console.log('********** _id ************', this.state.userData.user._id)
    console.log('********** jwt ************', this.state.userData.jwt)

    this.setState({ loader: true });
    fetch(global.baseURL + '/carts?user_id=' + this.state.userData.user._id, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + this.state.userData.jwt
      }
    }).then((response) => response.json())
      .then((responseData) => {
        if (responseData.statusCode == 400) {
          Alert.alert('EzPz Local', responseData.message)
        } else if (responseData.statusCode == 403) {
          Alert.alert('EzPz Local', responseData.message)

        } else if (responseData.statusCode == 401) {
          Alert.alert('EzPz Local', responseData.message)
        }
        else {
          this.setState({ cardList: responseData, cardlength: 0 }, async () => {
            this.setState({ loader: false, loader1: false });
            console.log(this.state.cardList);
            await AsyncStorage.setItem('card_total', JSON.stringify(this.state.cardList.length));
            if (this.state.cardList.length == 0) {
              this.setState({ cartempty: true })
            }
            else {
              this.setState({ cartempty: false })
            }
          })
        }

      }).catch((error) => {
        console.error(error);
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
        mod_amt = mod_amt + j.modifier.price;
      })
      let val = (mod_amt + item.item.price) * item.quantity;
      totalAmount = totalAmount + val;
    });

    return totalAmount;
  }
  getAmt(item) {
    let totalAmount = 0;
    let mod_amt = 0;
    item.modifiers.forEach(j => {
      mod_amt = mod_amt + j.modifier.price;
    })
    let val = (mod_amt + item.item.price) * item.quantity;
    totalAmount = totalAmount + val;

    return totalAmount;
  }
  getTaxValue(totalAmount) {
    return ((this.getTotalAmount() * Number(this.state.taxRate)) / 100).toFixed(2)
  }

  productDecrementMethod = (j) => {
    if (this.state.cardList[j].quantity > 1) {
      this.repeat(j, false);
    }
    else {
      this.deleteCart(j);
    }
  };

  productIncrementMethod = (j) => {
    this.repeat(j, true);
  };

  deleteCart(index) {
    fetch(global.baseURL + '/carts/' + this.state.cardList[index].id, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + this.state.userData.jwt
      }
    }).then((response) => response.json())
      .then((responseData) => {
        if (responseData.statusCode == 400) {
          Alert.alert('EzPz Local', responseData.message)
        } else if (responseData.statusCode == 403) {
          Alert.alert('EzPz Local', responseData.message)

        } else if (responseData.statusCode == 401) {
          Alert.alert('EzPz Local', responseData.message)
        }
        else {
          this.getcardList();
        }

      }).catch((error) => {
        console.error(error);
      })
  }

  repeat(index, value) {
    if (value) {
      data1 = {
        quantity: this.state.cardList[index].quantity + 1
      }
    }
    else {
      data1 = {
        quantity: this.state.cardList[index].quantity - 1
      }
    }
    fetch(global.baseURL + '/carts/' + this.state.cardList[index].id, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + this.state.userData.jwt
      },
      body: JSON.stringify(data1)
    }).then((response) => response.json())
      .then((responseData) => {
        if (responseData.statusCode == 400) {
          Alert.alert('EzPz Local', responseData.message)
        } else if (responseData.statusCode == 403) {
          Alert.alert('EzPz Local', responseData.message)

        } else if (responseData.statusCode == 401) {
          Alert.alert('EzPz Local', responseData.message)
        }
        else {
          this.setState({ modal1: false });
          this.getcardList();
        }

      }).catch((error) => {
        console.error(error);
      })
  }

  handleChangeText = (value, name) => {
    this.setState({
      [name]: value
    })
  }

  applyCouponMethod() {
    alert('method, ')
  }
  names(item) {
    return item.modifiers.map((type, index) => {
      return type.modifier.name + ','
    })
  }
  openModal(data) {
    this.setState({ isShowItemModal: true, modalData: data })
  }
  onPlaceOrder = () => {
    this.setState({ promptVisible: true })
    //Actions.PaymentDetails({cardList:this.state.cardList,amount:Number(this.getTotalAmount())+Number(this.getTaxValue())})
  }
  submit() {
    this.setState({ promptVisible: false });
    let data;
    if (this.state.yes) {
      data = 'YES';
    }
    else {
      data = 'NO'
    }
    Actions.PaymentDetails({
      cardList: this.state.cardList,
      amount: Number(this.getTotalAmount()) + Number(this.getTaxValue()),
      note: this.state.note, tableNumber: this.state.tableNumber, pickupTime: moment(this.state.time).toString(),
      counterPick: data
    })
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
  gettime = (flag) => {
    let d = new Date();
    if (flag === 'min') {
      d.setHours(d.getHours(), d.getMinutes() + 30, 0, 0)
    }
    else {
      d.setHours(18, 0, 0, 0)
    }

    return d;
  }
  render() {
    return (
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
                <View style={{ flexDirection: 'row' }}>
                  <ListItem style={{ borderBottomColor: 'white', marginTop: 0 }}>
                    <CheckBox color={standardColors.appGreenColor} checked={this.state.yes} onPress={() => this.setState({ yes: !this.state.yes })}>Pickup</CheckBox>
                    <Text>Pick-Up at Counter</Text>
                  </ListItem>
                </View>
                <View style={{ flexDirection: 'row' }}>
                  <ListItem style={{ borderBottomColor: 'white', marginTop: 0 }}>
                    <CheckBox color={standardColors.appGreenColor} checked={!this.state.yes} onPress={() => this.setState({ yes: !this.state.yes })}></CheckBox>
                    <Text>Deliver to table</Text>
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
          <TouchableOpacity style={[{ flexDirection: 'column' }, margins.mT15]} onPress={this.showtime}>
            <Text style={styles.inputLabel}>Estimated Pick-Up Time</Text>
            <View style={{ flexDirection: 'row' }}>
              <DateTimePicker
                cancelTextStyle={{ color: 'red' }}
                confirmTextStyle={{ color: 'green' }}
                isVisible={this.state.isTimeVisible}
                minimumDate={this.gettime('min')}
                onConfirm={this.handletime}
                onCancel={() => this.setState({ isTimeVisible: false })}
                mode={'time'}

              />
              <Text style={[styles.input1, { paddingTop: 8 }]} placeholder='Time'>{this.state.time != 0 && moment(this.state.time).format('MMMM, Do YYYY h:mm a')}</Text>
            </View>
          </TouchableOpacity>
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
    );
  }
}


export default Appinfo;

const styles = StyleSheet.create({
  indicator: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  cardContainer: {
    flex: 1, flexDirection: 'row',
    backgroundColor: standardColors.white,
    borderColor: 'white',
    borderRadius: 2, paddingHorizontal: 10
  },
  mini: {
    height: 35,
    backgroundColor: standardColors.appGreenColor,
    justifyContent: 'center',
    alignItems: 'center'
  },
  leftSection: {
    flex: 0.55,
    justifyContent: 'center',
    padding: 10,
  },
  itemImage: {
    flex: 1,
    height: undefined
  },
  middleSection: {
    flex: 0.35,
    padding: 10,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    height: scale(80)
  },
  rightSection: {
    flex: 0.2,
    padding: 10,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    marginTop: 10
  },
  titleText: {
    color: standardColors.black,
    fontWeight: 'bold',
    fontSize: moderateScale(12)
  },
  descriptionText: {
    color: 'grey',
    fontSize: moderateScale(10)
  },
  priceText: {
    fontSize: moderateScale(14),
    color: standardColors.appGreenColor,
    fontWeight: 'bold',
    marginRight: scale(10)
  },
  footerWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center'
  },
  totalItemLabel: {
    color: 'white'
  },
  confirmButton: {
    backgroundColor: standardColors.appGreenColor,
    paddingVertical: 10,
    paddingHorizontal: 40
  },
  confirmButtonText: {
    color: 'white',
    textAlign: 'center'
  },
  actionContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  actionButtonText: {
    color: 'white',
    textAlign: 'center'
  },
  horizontalBar: {
    borderWidth: 0.2,
    borderColor: '#dddddd',
  },
  menubuttonText: {
    fontSize: 15,
    fontWeight: '400',
    textAlign: 'center',
    color: 'white'
  },
  incdecWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    paddingHorizontal: 5,
    paddingVertical: scale(5),
    height: 30,
    borderRadius: 2,
    borderColor: 'grey',
    borderWidth: 1
  },
  quantityLabel: {
    fontSize: 14,
    fontWeight: '900',
    color: 'grey',
    textAlign: 'left', ...{ ...paddings.pH10 }
  },
  incDecIcon: {
    borderRadius: 2
  },
  paymentSummaryHeaderContainer: {
    alignItems: 'center',
    backgroundColor: standardColors.appGreenColor, ...{ ...paddings.pV10 }
  },
  summaryLabelsWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between', ...{ ...paddings.pV5 }
  },
  summaryText: {
    color: standardColors.white, fontSize: moderateScale(14),
    textAlign: 'center'
  },
  coupanContainer: {
    height: verticalScale(35),
    flexDirection: 'row',
    justifyContent: 'flex-start', ...{ ...margins.mT5 }
  },
  applyButtonWrapper: {
    justifyContent: 'center',
    backgroundColor: standardColors.appGreenColor, ...{ ...paddings.pH10 }
  },
  modalContainer: {
    backgroundColor: standardColors.white,
    height: deviceHeight,
    width: deviceWidth,
    borderRadius: 10,
    alignSelf: 'center'
  },
  closeWrapper: {
    flexDirection: 'row-reverse',
  },
  contentContainer: {
    flex: 1,
    flexDirection: 'column',
    ...{ ...paddings.pH20 },
  },
  inputLabel: {
    fontSize: moderateScale(12),
    color: standardColors.black, ...{ ...margins.mB5 }
  },
  input: {
    height: 70,
    width: '100%',
    borderWidth: 0.5,
    borderColor: standardColors.lightgrey,
    fontSize: moderateScale(12),
    backgroundColor: '#f2f2f2', ...{ ...paddings.pH10 },
  },
  input1: {
    height: 35,
    width: '100%',
    borderWidth: 0.5,
    borderColor: standardColors.lightgrey,
    fontSize: moderateScale(12),
    backgroundColor: '#f2f2f2', ...{ ...paddings.pH10 },
  },
  submitButton: {
    backgroundColor: standardColors.appGreenColor,
    paddingVertical: 10, paddingHorizontal: 40
  },
  submitButtonText: {
    color: 'white',
    textAlign: 'center'
  }
});
