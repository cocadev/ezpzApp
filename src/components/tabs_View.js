import React, { Component } from 'react';
import { Text, View, ScrollView, StyleSheet, Image, TouchableOpacity, ImageBackground, RefreshControl } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Actions } from 'react-native-router-flux';
import MenuModelView from './menuModel/modelMain_View';
import HomeGridView from './menuModel/home_View'; //<HomeGridView />
import Restaurants from './menuModel/restaurants'; //<HomeGridView />
import MiniHeader from './miniHeader';
import OrderSuccessful from './orderSuccessful';
import styles from '../assets/styles/styles';
import { localIcons, standardText, standardColors } from '../assets/config/localdata';



export default class BottomTabsView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedTabVal: (props.paramData === standardText.tabMenu) ? standardText.tabMenu : standardText.tabFoodMenu,
      currentState: 'GRID_MENU',
      refreshing: false,
    }
  }

  componentWillMount() {
    const { paramData } = this.props;
    console.log('_________paramData__________', paramData)
    this.setContentData(paramData)
  }

  componentWillReceiveProps(nextProps) {
    const { paramData } = nextProps;
    this.setState({ selectedTabVal: standardText.tabFoodMenu, currentState: paramData })
    this.setContentData(paramData)
  }

  setContentData = (paramData) => {
    if (paramData) {
      if (paramData === standardText.tabMenu) {
        this.setState({ selectedTabVal: paramData, currentState: 'GRID_MENU' })
      }
      else if (paramData === 'ORDER_SUCCESS') {
        this.setState({ selectedTabVal: standardText.tabFoodMenu, currentState: 'SUCCESS' })
      }
    }
  }


  MenuHeader_Method() {
    return (
      <View style={styles.menuHeaderView}>
        <TouchableOpacity style={styles.IconView} onPress={() => { this.selectFooterTab(standardText.tabMenu) }}>
          <Icon name="bars" size={25} color='white' />
        </TouchableOpacity>
        <View style={styles.logoView}>
          <Image source={localIcons.applogo}
            style={styles.ImgStyles} />
        </View>
        <View style={styles.IconView} />
      </View>
    )
  }

  selectFooterTab(value) {
    if (this.state.currentState == 'SUCCESS') {
      this.setState({ selectedTabVal: standardText.tabFoodMenu, currentState: 'GRID_MENU' })
    }
    this.setState({ selectedTabVal: value, currentState: 'GRID_MENU' })
  }

  onClosePress = () => {
    this.selectFooterTab(standardText.tabFoodMenu)
    this.setState({ currentState: 'GRID_MENU' })
  }

  footerTabs_Method(value) {
    var foodMenuTextcheck;
    var foodMenuIconcheck;
    var footerTabIconsSplitViewTop;
    if (value === standardText.tabFoodMenu) {
      foodMenuIconcheck = localIcons.foodActiveIcon
      foodMenuTextcheck = styles.footerTabTextChange
      footerTabIconsSplitViewTop = styles.footerTabIconsSplitViewChange
    } else {
      foodMenuIconcheck = localIcons.foodInActiveIcon
      foodMenuTextcheck = styles.footerTabText
      footerTabIconsSplitViewTop = styles.footerTabIconsSplitView
    }

    return (
      <View style={styles.footerSplitMainView}>
        <TouchableOpacity style={footerTabIconsSplitViewTop} onPress={() => { this.selectFooterTab(standardText.tabFoodMenu) }}>
          <Image source={foodMenuIconcheck} style={{width:40,height:40}} />
          <Text style={foodMenuTextcheck}> Places</Text>
        </TouchableOpacity>

        <TouchableOpacity style={value === standardText.tabMenu ? styles.footerTabIconsSplitViewChange : styles.footerTabIconsSplitView} onPress={() => { this.selectFooterTab(standardText.tabMenu) }}>
          <Image source={value === standardText.tabMenu ? localIcons.menuActiveIcon : localIcons.menuInActiveIcon} style={styles.footerIcon} />
          <Text style={value === standardText.tabMenu ? styles.footerTabTextChange : styles.footerTabText}> {standardText.tabMenu}</Text>
        </TouchableOpacity>
      </View>
    )
  }
  _onRefresh=async()=>{
    console.log('hi');
    this.setState({refreshing: true}) 
  }
  refresh_done=()=>{
   this.setState({refreshing:false})
  }


  render() {
    console.log("render")
    const { paramData } = this.props
    const { currentState } = this.state
    return (
      <View style={styles.container}>
        {this.state.selectedTabVal === standardText.tabFoodMenu ? (
          <View style={styles.container}>
            <View style={styles.menuheadermainView}>
              {this.MenuHeader_Method()}
            </View>
            <View style={styles.foodmenuSubView}>
              {(currentState === 'SUCCESS') ?
                <ImageBackground source={localIcons.entireBackgorundImg} style={{ flex: 1 }}>
                  <MiniHeader title={standardText.thankyouText} hideBackButton={true} />
                  <OrderSuccessful />
                </ImageBackground> :
                <ImageBackground source={localIcons.entireBackgorundImg} style={{ flex: 1 }}>
                  <MiniHeader title="Places" hideBackButton={true} />
                  <ScrollView style={{flex:1}} 
                   refreshControl={
                    <RefreshControl
                     refreshing={this.state.refreshing}
                      onRefresh={this._onRefresh}
                    />                
                  }  
                  >
                    <Restaurants refresh={this.state.refreshing} onchange={this.refresh_done}/>
                  </ScrollView>
                </ImageBackground>
              }
            </View>
            <View style={styles.footermainView}>
              {this.footerTabs_Method(this.state.selectedTabVal)}
            </View>
          </View>
        ) : (
            <View style={styles.container}>
              <View style={styles.menuSubView}>
                <MenuModelView onBackPress={() => { this.onClosePress() }} />
              </View>
              <View style={[styles.footermainView, { backgroundColor: standardColors.appGreenColor }]} />
            </View>
          )}
      </View>
    )
  }

}
