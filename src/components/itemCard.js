
import React, { Component } from 'react';
import {
  View, AsyncStorage,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image, FlatList, ActivityIndicator,
  ImageBackground,
  Dimensions, Alert
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import Modal from 'react-native-modal';
import CardTile from "./CardTile/index";
import { localIcons, standardColors } from "../assets/config/localdata";
import ItemModal from "./Modals/ItemModal/index";
import { scale } from 'react-native-size-matters';
import Icon from 'react-native-vector-icons/FontAwesome';
import { ScrollView } from 'react-native-gesture-handler';
import { API, Storage } from "aws-amplify";
import Loading from "./LoadAnim/Loading";
import config from "../../config";

const deviceWidth = Dimensions.get("window").width;
var deviceHeight = Dimensions.get('window').height;

export default class ItemCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isShowItemModal: false,
      showUserDetails: [],
      allList: props.allList,restData:props.restData,
      desc: props.desc,
      item: props.item, favList: [], favId: 0,
      userData: {}, loader: false, loader1: true, modal2: false,
      cardList: [], modalData: [], modal1: false, selectedId: -1,
      productQuantityVal: 1, show: false, showLogin: false
    }
    console.log(this.state.item,this.state.allList)
  }
  componentWillMount = async () => {
    this.setState({ userData: JSON.parse(await AsyncStorage.getItem("UserData")) }, () => {
      if (this.state.userData != null) {
        this.getcardList();
      }
    })
  }
  addFav(data1) {
    fetch(global.baseURL + '/userfavorites', {
      method: 'POST',
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
          this.getfavList();
        }

      }).catch((error) => {
        console.error(error);
      })
  }
  checkFav(item) {
    let count = false;
    for (let j = 0; j < this.state.favList.length; j++) {
      if (this.state.favList[j].item.id == item.id) {
        count = true;
      }
    }
    return count;
  }
  checkFavId(item) {
    let count = 0;
    for (let j = 0; j < this.state.favList.length; j++) {
      if (this.state.favList[j].item.id == item.id) {
        count = this.state.favList[j].id;
      }
    }
    return count;
  }
  deleteFav(data) {
    let favId = this.checkFavId(data);
    fetch(global.baseURL + '/userfavorites/' + favId, {
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
          this.getfavList();
        }

      }).catch((error) => {
        console.error(error);
      })
  }
  isFavProduct(data) {
    let data1 = {
      user_id: this.state.userData.user._id,
      item: data.item.id
    }
    let value = this.checkFav(data.item);
    if (!value) {
      this.addFav(data1);
    }
    else {
      this.deleteFav(data.item);
    }

  };

  productDecrementMethod = (data, j) => {
    count = 0;
    let newArray = [...this.state.cardList];
    for (let i = 0; i < newArray.length; i++) {
      if (newArray[j].itemId == newArray[i].itemId) {
        count = count + 1;
      }
    }
    if (count > 1) {
      this.setState({ modal2: true });
    }
    else {
      if (newArray[j].quantity > 1) {
        this.repeat(data, j, false);
      }
      else {
        this.setState({ selectedId: -1, modalData: data });
        this.deleteCart(data, j);
      }
    }
  };

  productIncrementMethod = (data, j) => {
    if (data.modifiers.length != 0) {
      this.setState({ modal1: true, selectedId: j, modalData: data });
    }
    else {
      this.repeat(data, j, true)
    }
  };
  getcardList = async () => {
    this.setState({ loader: true });
    this.setState({ cardList: await API.get("list", "/api/cart/Info?userId=" + this.state.userData.id, {}), loader: false }, () => {
      console.log(this.state.cardList)
    this.props.getcardList();
    })
  }
  getfavList() {
    this.setState({ loader: true });
    fetch(global.baseURL + '/userfavorites?user_id=' + this.state.userData.user._id, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + this.state.userData.jwt
      }
    }).then((response) => response.json())
      .then((responseData) => {
       // console.log('error',responseData)
        if (responseData.statusCode == 400) {
          Alert.alert('EzPz Local', responseData.message)
        } else if (responseData.statusCode == 403) {
          Alert.alert('EzPz Local', responseData.message)

        } else if (responseData.statusCode == 401) {
          Alert.alert('EzPz Local', responseData.message)
        }
        else {
          this.setState({ favList: responseData }, () => {
            this.setState({ loader: false, loader1: false });
          })
        }

      }).catch((error) => {       
        console.error(error);
      })
  }
  choose(index) {
    this.setState({ modal1: false }, () => {
      setTimeout(() => {
        this.setShowItemModal(true)
      }, 1000)
    })
  }
  deleteCart=async(data, index)=> {
    let d = await API.del("delete", "/api/delete/cart/"+this.state.cardList[index].id,{});
    this.getcardList();
  }
  gotocard() {
    this.setState({ modal2: false }, () => {
      Actions.ReviewOrder({ getcardList: this.getcardList.bind(this) });
    })
  }
  repeat=async(data, index, value)=> {
    console.log(data)
    this.setState({ loader: true });
    let data1 = {
      entityData:{
      quantity: 0
      }
    }
    if (value) {
      if (data.quantity != null) {
        data1 = {
          entityData:{
          quantity: this.state.cardList[index].quantity + data.quantity
          }
        }
      }
      else {
        data1 = {
          entityData:{
          quantity: this.state.cardList[index].quantity + 1
          }
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
    let d = await API.put("put", "/api/update/cart/"+this.state.cardList[index].id, {
      body: data1
    });
    if(d!=undefined){
      this.setState({ modal1: false });
      this.getcardList();
    }
  }

  addtoCartProductMethod = (getdata) => {
    console.log("cart 2",getdata)
    const { cardList } = this.state;
    match = false;
    let data={
      entityData:{
        userId:getdata.userId,
        itemId:getdata.itemId,
        quantity:getdata.quantity,
        modifiers:getdata.modifiers,
        restaurantId:this.state.restData.id
      }
    }
    if (cardList.length != 0) {
      for (let i = 0; i < cardList.length; i++) {
        var matching_items = 0;
        if (cardList[i].itemId === getdata.itemId && cardList[i].modifiers.length == getdata.modifiers.length) {
          for (let j = 0; j < cardList[i].modifiers.length; j++) {
            for (let k = 0; k < getdata.modifiers.length; k++) {
              if (cardList[i].modifiers[j].id === getdata.modifiers[k].id) {
                matching_items += 1
              }
            }
          }
        }
        if (matching_items == cardList[i].modifiers.length && cardList[i].itemId === getdata.itemId) {
          this.repeat(data, i, true);
          match = true;
          break;
        }
      }
    }
    if (!match) {this.add(data) }

  };

  removeCart=async(getdata)=>{
    console.log('Remove card');
    console.log(getdata);

    this.setState({ loader: true });
    let d = await API.del("delete", "/api/cart/remove?userId="+this.state.userData.id, {});
    this.setState({ loader: false });
    console.log(d)
    if (d.message == 'success') {
      this.setState({ show: true });
      // this.getcardList();
      this.add(getdata)
   // this.addtoCartProductMethod(getdata)
  }
  else{
    Alert.alert('Delete cart','unsuccessful')
  }
  }

  add(getdata){
    this.setState({ loader: true });
    console.log('add cart ',getdata)
    API.post("post", "/api/create/cart", {
      body: getdata
    }).then(res =>{
      console.log(res)
      this.setState({ loader: false });
      this.setState({ show: true });
      this.getcardList();
    }).catch(e =>{
      this.setState({ loader: false });
      console.log(e)
    })
  }
checkRest(getdata){
  if(this.state.cardList.length!=0){
    if(this.state.cardList[0].restaurantId==this.state.restData.id){
      this.add(getdata)
    }
  else{
    console.log("Check the Cart Items");
    Alert.alert(
      'Replace cart item?',
      'Your cart already contains items from another place. Adding this new item will remove your existing items from the cart. Do you want to continue?',
      [
        {
          text: 'No',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {text: 'Yes', onPress: () => {
          console.log('OK Pressed')
          this.removeCart(getdata);
        }}
      ],
      {cancelable: false},
    ); 
    
  }
}else{
this.add(getdata)
}
}
  onModifycartProduct = (data) => {
    if (this.state.userData != null) {
      if (data.modifiers.length != 0) {
        this.setState({ modalData: data }, () => {
          this.setShowItemModal(true);
        })
      }
      else {
        newArray = {
          entityData: {
            userId: '',
            itemId: '',
            quantity: '',
            modifiers: [],
            restaurantId:this.state.restData.id
          }
        }
        newArray.entityData.userId = this.state.userData.id;
        newArray.entityData.itemId = data.id;
        newArray.entityData.quantity = 1;
        this.checkRest(newArray)
      }
    }
    else {
      this.setState({ showLogin: true });
    }
  }

  setShowItemModal = (flag) => {
    this.setState({ isShowItemModal: flag })
  }
  listcount(data) {
    let count = 0;
    for (let j = 0; j < this.state.cardList.length; j++) {
      if (this.state.cardList[j].itemId == data.id) {
        count = count + this.state.cardList[j].quantity;
      }
    }
    return count;
  }
  renderCheck(data, index) {
    item_check = false;
    con1 = (<TouchableOpacity style={[styles.actionButton,{flex:0.5,backgroundColor: standardColors.appGreenColor }]}
      onPress={() => { this.onModifycartProduct(data) }}>
      <Icon style={styles.addcartIcon} name='cart-plus' size={20} color='white' />
      <Text style={styles.actionButtonText}>Add</Text>
    </TouchableOpacity>);
    if (this.state.userData != null) {
      this.state.cardList.map((list, j) => {
        if (list.itemId == data.id) {
          item_check = true;
          con1 = (<View style={[styles.incdecWrapper,{ flex: 0.5 }]}>
            <TouchableOpacity style={{ justifyContent: 'center' }} onPress={() => { this.productDecrementMethod(data, j) }}>
              <Icon style={[styles.incDecIcon, { marginLeft: 5 }]} name='minus' size={20} color={standardColors.appGreenColor} />
            </TouchableOpacity>
            <View style={{ justifyContent:'center'}}>
              <Text style={styles.quantityLabel}> {this.listcount(data)}</Text>
            </View>
            <TouchableOpacity style={{ justifyContent: 'center' }} onPress={() => { this.productIncrementMethod(data, j) }}>
              <Icon style={[styles.incDecIcon, { marginRight: 5 }]} name='plus' size={20} color={standardColors.appGreenColor} />
            </TouchableOpacity></View>);
        }
      })
    }
    return con1;
  }
  actual_price(item) {
    return `$${item.price}`
  }
  lowest_price(item) {
    let low = 0;
    if (item.modifiers.length != 0) {
      low = item.modifiers[0].price;
      for (let i = 0; i < item.modifiers.length; i++) {
        if (item.modifiers[i].price < low) {
          low = item.modifiers[i].price;
        }
      }
    }
    return `$${low}`
  }
  renderItem(data) {
    let { item, index } = data;
    console.log(item.picture)
    if (item.recordStatus) {
      if(item.picture !='NULL' && item.picture !='null' && item.picture !=null){
        return (<CardTile style={styles.cardContainer}>
          <View style={styles.rightSection}>
           <ImageBackground source={item.picture != 'NULL' && item.picture !=null && item.picture !='null'
            ? {uri:config.s3.URL+item.picture} : localIcons.cat}
             style={styles.itemImage} resizeMode="contain">
           </ImageBackground>
         </View>
         <View style={styles.leftSection}>
           <Text numberOfLines={2} style={styles.titleText}>{item.itemName}</Text>
           <Text numberOfLines={2} style={styles.descriptionText}>{item.itemDesc}</Text>
           <View style={{ flex: 1 }}>
             <View style={styles.actionContainer}>
               <Text style={[styles.priceText, { flex: 0.5 }]}>{item.price != 0 ? this.actual_price(item) : this.lowest_price(item)}</Text>
               {this.renderCheck(item, index)}
             </View>
           </View>
         </View>
       </CardTile>)
      }
      else{
        return (<CardTile style={styles.cardContainer}>
         <View style={{flex:1,paddingHorizontal:15,paddingTop:15}}>
          <Text numberOfLines={2} style={styles.titleText}>{item.itemName}</Text>
           {item.itemDesc!=null && item.itemDesc!= 'null' && <Text numberOfLines={2} style={styles.descriptionText}>{item.itemDesc}</Text>}
         <View style={[styles.leftSection,{flexDirection:'row'}]}>
         <View style={{flex:0.5}}></View>
           <View style={{ flex: 0.5 }}>
             <View style={styles.actionContainer}>
               <Text style={[styles.priceText, { flex: 0.5 }]}>{item.price != 0 ? this.actual_price(item) : this.lowest_price(item)}</Text>
               {this.renderCheck(item, index)}
             </View>
           </View>
         </View>
         </View>
       </CardTile>)
      }
    }
    else {
      return;
    }
  }

  names(){
    const {cardList,selectedId}= this.state;
    return cardList[selectedId].modifiers.map((item, index) => {
      return cardList[selectedId].item.modifiers.map(i =>{
        if(i.id == item.id){
         return <Text key={index} style={{ color: 'grey', fontSize: 14 }}>{i.modifierName}{index==cardList[selectedId].modifiers.length-1 ? '': ', '}</Text>
        }
      })
    })
  }
  itemName(id){
    for(let i=0;i<this.state.item.length;i++){
      if(this.state.item[i].id==id){
        return this.state.item[i].itemName;
      }
    }
  }

  render() {
    const { isShowItemModal, loader } = this.state;
    return (
      <View 
      style={loader ? { opacity: 0.5 } : null} 
      pointerEvents={loader ? "none" : "auto"}>
        <FlatList
          contentContainerStyle={{ paddingHorizontal: 15 }}
          data={this.props.searching?this.props.searchData:this.state.item}
          keyExtractor={(item, index) => index.toString()}
          initialNumToRender={10}
          renderItem={this.renderItem.bind(this)}
        />
        {(isShowItemModal) && <ItemModal
          item={this.state.modalData}
          restData={this.state.restData}
          cartList={this.state.cardList}
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
          removeCart={(data) => this.removeCart(data)}
          checkRest={(data)=> this.checkRest(data)}
          addtoCartProductMethod={(data) => {
            this.addtoCartProductMethod(data);
          }}
          visible={isShowItemModal} />}

        <Modal
          isVisible={this.state.modal1}
          transparent={true}
          swipeArea={50}
          backdropOpacity={0.7}
          animationType='fade'
          animationIn='slideInUp'
          animationOut='slideOutDown'
          hideModalContentWhileAnimating={true}
          deviceWidth={deviceWidth}
          deviceHeight={deviceHeight}
          onBackdropPress={() => this.setState({ modal1: false })}
          onBackButtonPress={() => this.setState({ modal1: false })}
        >
          {this.state.selectedId >= 0 && this.state.cardList.length > 0 ? (
            <View style={styles.modalContainer}>
              <View style={styles.modaltextBox}>
                <Text style={{ color: 'black', fontWeight: '500', fontSize: 20 }}>{this.itemName(this.state.cardList[this.state.selectedId].itemId)}</Text>
              </View>
              <View style={styles.modaltoppingsBox}>
                <Text style={{ fontWeight: '400', fontSize: 18 }}>Your previous customization</Text>
                <View style={{ flexDirection: 'row' }}>
                  <Text style={{ textAlign: 'center' }} numberOfLines={2}>
                    {this.names()}
                  </Text>
                </View>
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', margin: scale(10) }}>
                <TouchableOpacity style={styles.modalbuttonbox1} onPress={() => { this.choose() }}>
                  <Text style={[styles.modalbuttontext, { color: standardColors.appGreenColor }]}>I'LL CHOOSE</Text></TouchableOpacity>
                <TouchableOpacity style={styles.modalbuttonbox2} onPress={() => { this.repeat(this.state.modalData, this.state.selectedId, true) }}>
                  <Text style={[styles.modalbuttontext, { color: 'white' }]}>REPEAT</Text></TouchableOpacity>
              </View>
            </View>) : null}
        </Modal>
        <Modal
          isVisible={this.state.modal2}
          transparent={true}
          swipeArea={50}
          backdropOpacity={0.7}
          animationType='fade'
          animationIn='slideInDown'
          animationOut='slideOutDown'
          hideModalContentWhileAnimating={true}
          deviceWidth={deviceWidth}
          deviceHeight={deviceHeight}
          onBackdropPress={() => this.setState({ modal2: false })}
          onBackButtonPress={() => this.setState({ modal2: false })}
        >
          <View style={styles.modalContainer1}>
            <View style={styles.modaltextBox1}>
              <Text style={{ fontSize: 11 }}>This items has the multiple customizations added.</Text>
              <Text style={{ fontSize: 11 }}>Proceed to cart to remove item</Text>
            </View>
            <View style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
              <TouchableOpacity style={styles.modalbuttonbox4} onPress={() => { this.gotocard() }}>
                <Text style={[styles.modalbuttontext, { color: 'white' }]}>Go to cart</Text></TouchableOpacity>
              <TouchableOpacity style={styles.modalbuttonbox3} onPress={() => { this.setState({ modal2: false }) }}>
                <Text style={[styles.modalbuttontext, { color: standardColors.appGreenColor }]}>Cancel</Text></TouchableOpacity>
            </View>
          </View>
        </Modal>

        <Modal
          isVisible={this.state.showLogin}
          transparent={true}
          swipeArea={50}
          backdropOpacity={0.7}
          animationType='fade'
          animationIn='slideInDown'
          animationOut='slideOutDown'
          hideModalContentWhileAnimating={true}
          deviceWidth={deviceWidth}
          deviceHeight={deviceHeight}
          onBackdropPress={() => this.setState({ showLogin: false })}
          onBackButtonPress={() => this.setState({ showLogin: false })}
        >
          <View style={styles.modalContainer1}>
            <View style={styles.modaltextBox1}>
              <Text style={{ fontSize: 11 }}>To add items to cart you need to login.</Text>
              <Text style={{ fontSize: 11 }}>Proceed to login page</Text>
            </View>
            <View style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
              <TouchableOpacity style={styles.modalbuttonbox4} onPress={() => {
                this.setState({ showLogin: false });
                Actions.Login_form({ item: this.state.allList, desc: this.state.desc,restData:this.state.restData });
              }}>
                <Text style={[styles.modalbuttontext, { color: 'white' }]}>Go to Login</Text></TouchableOpacity>
              <TouchableOpacity style={styles.modalbuttonbox3} onPress={() => { this.setState({ showLogin: false }) }}>
                <Text style={[styles.modalbuttontext, { color: standardColors.appGreenColor }]}>Cancel</Text></TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    )
  }
}
const styles = StyleSheet.create({
  cardContainer: {
    flex: 1, flexDirection: 'row', marginTop: 15,
  },
  leftSection: { flex: 0.50, flexDirection: 'column', padding: 15, },
  titleText: { color: standardColors.black, fontWeight: 'bold' },
  descriptionText: { color: standardColors.miniTextColor, fontSize: 12 },
  priceText: { fontSize: 18, color: standardColors.appGreenColor, fontWeight: 'bold', marginRight: scale(10) },
  actionContainer: { flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', marginTop: 10 },
  actionButton: {
    flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center',
    paddingHorizontal: 10, height: scale(30), backgroundColor: standardColors.appOrangeColor,
    borderRadius: 2, marginTop: 5, width: scale(80)
  },
  incdecWrapper: {
    flexDirection: 'row', justifyContent: 'space-evenly',
    paddingHorizontal: 5, paddingVertical: scale(5), width: scale(80),
    borderRadius: 2, marginTop: 5, borderColor: standardColors.appGreenColor, borderWidth: 2
  },
  quantityLabel: { fontSize: 14, fontWeight: '900', color: 'grey', textAlign: 'left' },
  incDecIcon: { borderRadius: 2 },
  editCartIcon: { height: 10, width: 10 },
  addcartIcon: { height: 20, width: 20 },
  actionButtonText: { fontSize: 14, fontWeight: '900', color: 'white', textAlign: 'center' },
  rightSection: { flex: 0.50 },
  itemImage: { flex: 1, height: undefined },
  favIconButton: { position: 'absolute', right: 0, padding: 10 },
  favIcon: { height: 30, width: 30 },
  footerWrapper: {
    flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center', marginTop: 15
  },
  totalItemLabel: { color: 'white' },
  confirmButton: {
    backgroundColor: standardColors.appGreenColor, paddingVertical: 10, paddingHorizontal: 40
  },
  confirmButtonText: { color: 'white', textAlign: 'center' },
  modalContainer: {
    backgroundColor: standardColors.white,
    height: 220,
    width: deviceWidth,
    position: 'absolute',
    bottom: -20,
    left: -20
  },
  modaltextBox: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: standardColors.appGreen_light,
    paddingVertical: scale(15)
  },
  modalbuttonbox1: {
    flex: 0.5,
    borderRadius: 5,
    marginHorizontal: scale(10),
    borderColor: standardColors.appGreenColor,
    borderWidth: 2
  },
  modalbuttonbox2: {
    flex: 0.5,
    borderRadius: 5,
    marginHorizontal: scale(10),
    backgroundColor: standardColors.appGreenColor,
  },
  modalbuttontext: {
    fontSize: 16,
    padding: scale(10),
    fontWeight: '500',
    textAlign: 'center'
  },
  modaltoppingsBox: {
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: scale(15),
    paddingVertical: scale(10)
  },
  indicator: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: 80,
  },
  modalContainer1: {
    backgroundColor: standardColors.white,
    height: 210,
    width: deviceWidth - 50,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    padding: scale(20)
  },
  modaltextBox1: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: scale(15),
  },
  modalbuttonbox3: {
    borderRadius: 5,
    borderColor: standardColors.appGreenColor,
    borderWidth: 2,
    width: deviceWidth - 80,
    marginVertical: scale(5)
  },
  modalbuttonbox4: {
    borderRadius: 5,
    backgroundColor: standardColors.appGreenColor,
    width: deviceWidth - 80,
    marginVertical: scale(5)
  },
});
 