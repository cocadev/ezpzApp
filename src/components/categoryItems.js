import React, { Component } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, AsyncStorage, Image, BackHandler, ActivityIndicator } from 'react-native';
import { Actions, Scene, Router } from 'react-native-router-flux';
import Page from '@page';
import localstyles from '../assets/styles/styles';
import CustomNavbar from '@customNavbar'
import PageFooter from '@page/PageFooter';
import CardTile from '@cardTile';
import ItemModal from '@modals/ItemModal';
import MiniHeader from './miniHeader'
import { standardColors, items_Array, localIcons } from '@assets/config/localdata';
import ItemCard from "./itemCard";
import { API, Storage } from "aws-amplify";
import Loading from "./LoadAnim/Loading";
import { SearchBar } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';

var deviceheight = Dimensions.get('window').height;
var deviceWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
  cardContainer: {
    height: deviceheight / 5, flex: 1, flexDirection: 'row', marginTop: 15
  },
  leftSection: { flex: 0.50, flexDirection: 'column', padding: 15 },
  titleText: { color: standardColors.black, fontWeight: 'bold' },
  descriptionText: { color: standardColors.miniTextColor, fontSize: 12 },
  priceText: { fontSize: 18, color: standardColors.appGreenColor, textAlign: 'left', fontWeight: 'bold' },
  actionContainer: { flexDirection: 'row', justifyContent: 'space-around', marginTop: 5 },
  actionButton: {
    flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center',
    paddingHorizontal: 2,
    flex: 0.30, height: 20, backgroundColor: standardColors.appOrangeColor,
    borderRadius: 2
  },
  mini: {
    height: 35,
    flexDirection: 'row',
    backgroundColor: standardColors.appGreenColor,
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  menubuttonText: { fontSize: 15, fontWeight: '400', textAlign: 'center', color: 'white' },
  backbutton: { height: 15, width: 15 },
  backbuttonView: { justifyContent: 'flex-start', alignItems: 'flex-start', paddingVertical: 10, paddingHorizontal: 15 },
  incdecWrapper: { flex: 0.40, flexDirection: 'row', justifyContent: 'space-evenly' },
  quantityLabel: { fontSize: 14, fontWeight: '900', color: 'grey', textAlign: 'left' },
  incDecIcon: { height: 15, width: 15, borderRadius: 2 },
  editCartIcon: { height: 10, width: 10 },
  addcartIcon: { height: 12, width: 12 },
  actionButtonText: { fontSize: 10, fontWeight: '900', color: 'white', textAlign: 'left' },
  rightSection: { flex: 0.50 },
  itemImage: { flex: 1, height: undefined },
  favIconButton: { position: 'absolute', right: 0, padding: 10 },
  favIcon: { height: 20, width: 20 },
  footerWrapper: {
    flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center', marginTop: 15
  },
  totalItemLabel: { color: 'white' },
  confirmButton: {
    backgroundColor: standardColors.appGreenColor, paddingVertical: 10, paddingHorizontal: 40
  },
  confirmButtonText: { color: 'white', textAlign: 'center' },
  buttonStyle: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    height: 50,
    margin: 2,
    marginTop: 10,
    backgroundColor: '#127a3c'
  },
});

class CategoryItems extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isShowItemModal: false,
      getCategory: [], restData: props.restData,
      categories: props.item,
      desc: props.desc,
      productQuantityVal: 1, loading: false,
      title: props.item.categoryName, cardList: [], userData: {},
      search: '', searchData: [], searching: false
    };
    console.log(this.state.categories)
  }
  setShowItemModal = (flag) => {
    this.setState({ isShowItemModal: flag })
  }
  componentWillMount = async () => {
    this.getItems();
    if (await AsyncStorage.getItem("UserData") != null) {
      this.setState({ userData: JSON.parse(await AsyncStorage.getItem("UserData")) }, () => {
        this.getcardList();
      })
    }
  }
  handleBackButton() {
    Actions.popTo('BottomTabsView', { duration: 0, paramData: 'GRID_MENU' })
    return true;
  }
  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
  }
  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
  }
  onConfirmOrder = () => {
    Actions.ReviewOrder();
  }
  getItems = async () => {
    this.setState({ loading: true });
    console.log("/list/items?categoryId=" + this.state.categories.id)
    category = await API.get("list", "/list/items?categoryId=" + this.state.categories.id, {})
    console.log(category);
    this.setState({ getCategory: category, loading: false }, async () => {
      console.log(this.state.getCategory)
    });
  }
  getcardList = async () => {
    this.setState({ cardList: await API.get("list", "/api/cart/Info?userId=" + this.state.userData.id, {}) }, () => {
      this.setCartCount();
    })
  }
  setCartCount = async () => {
    await AsyncStorage.setItem('card_total', JSON.stringify(this.state.cardList.length));
  }
  getTotalCartItems() {
    let { cardList } = this.state;
    if (!cardList) {
      return;
    }
    let count = 0;
    cardList.forEach(j => {
      count = count + j.quantity
    })
    return (count + ' items');
  }
  clear = () => {
    this.search.clear();
  };
  SearchFilterFunction(text) {
    //passing the inserted text in textinput
    this.setState({ searching: true })
    const newData = this.state.getCategory.filter(function (item) {
      //applying filter for the inserted text in search bar
      const itemData = item.itemName ? item.itemName.toUpperCase() : ''.toUpperCase();
      const textData = text.toUpperCase();
      return itemData.indexOf(textData) == 0;
    });
    this.setState({
      searchData: newData,
      search: text,
    }, () => {
      console.log(this.state.searchData)
    });
  }
  getToTalAmount() {
    let { cardList, getCategory, cardModifiers } = this.state;
    if (!cardList) {
      return;
    }
    let totalAmount = 0;
    modArray = [];
    let mod_amt = 0;
    cardList.forEach(item => {
      item.modifiers.forEach((j, index) => {
        item.item.modifiers.forEach(m => {
          if (m.id == j.id) {
            mod_amt = mod_amt + Number(m.price);
          }
        })
      })
      let val = Number((Number(mod_amt) + Number(item.item.price)) * item.quantity);
      totalAmount = totalAmount + val;
      console.log("=totalAmount=", totalAmount);



      totalAmount = parseFloat(totalAmount.toFixed(2)) 
    })
    return totalAmount;
  }

  render() {
    const { isShowItemModal, title, getCategory, cardModifiers, desc, searchData, searching, loading } = this.state;
    return (
      <Page>
        <CustomNavbar />
        <View style={styles.mini}>
          <TouchableOpacity style={[styles.backbuttonView]} onPress={() => {
            Actions.popTo('Home', { duration: 0, paramData: 'GRID_MENU' });
            setTimeout(() => { }, 500)
          }}>
            <Image source={localIcons.backIcon} style={styles.backbutton} />
          </TouchableOpacity>
          <Text style={[styles.menubuttonText]}>{title}</Text>
          <View style={{ width: 30 }} />
        </View>

        {desc != null && desc != undefined && <View style={{ backgroundColor: standardColors.appGreen_light }}>
          <Text style={{ padding: 15 }}>{desc}</Text>
        </View>}
        {getCategory.length != 0 && <SearchBar
          round
          searchIcon={{ size: 24 }}
          onChangeText={text => this.SearchFilterFunction(text)}
          onClear={text => this.SearchFilterFunction('')}
          placeholder=" Search items here..."
          value={this.state.search}
          containerStyle={{
            backgroundColor: standardColors.white, borderBottomColor: 'transparent',
            borderTopColor: 'transparent'
          }}
          inputStyle={{ backgroundColor: standardColors.appGreen_light, fontSize: 14 }}
        />}
        <View style={{ flex: 1 }}>

          {getCategory.length != 0 && <ItemCard item={getCategory} searching={searching} searchData={searchData} desc={desc} allList={this.props.item} restData={this.state.restData} visible={isShowItemModal} getcardList={this.getcardList} />}
          {
            getCategory.length == 0 && !this.state.loading &&
            <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 100 }}>
              <Icon name='exclamation-triangle' size={80} color={standardColors.appGreenColor} style={{ opacity: 0.5, alignItems: 'center' }} />
              <Text>No Items Found</Text>
            </View>
          }
        </View>
        {
          this.state.cardList && this.state.cardList.length > 0 &&
          <PageFooter style={styles.footerWrapper}>
            <View>
              <Text style={styles.totalItemLabel}>${this.getToTalAmount()} ({this.getTotalCartItems()})</Text>
              { loading && <ActivityIndicator size={15} color={'#fff'}/>}
            </View>
            <TouchableOpacity style={styles.confirmButton} onPress={() => {
              this.onConfirmOrder()
            }}>
              <Text style={styles.confirmButtonText}>View Cart</Text>
            </TouchableOpacity>
          </PageFooter>
        }
        {(isShowItemModal) && <ItemModal
          setModalVisible={(isVisible) => this.setShowItemModal(isVisible)}
          visible={isShowItemModal} />}
        <Loading loadingStatus={this.state.loading} />
      </Page>
    );
  }
}

export default CategoryItems;


