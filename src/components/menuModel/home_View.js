import React, { Component } from 'react';
import { View,Text, ImageBackground, TouchableOpacity, AsyncStorage,Alert,Image} from 'react-native';
import { FlatGrid } from 'react-native-super-grid';
import {localIcons, standardColors} from '../../assets/config/localdata';
import styles from './styles';
import { Actions } from 'react-native-router-flux';
import { API , Storage} from "aws-amplify";
import Loading from "../LoadAnim/Loading";
import Page from '@page';
import CustomNavbar from '@customNavbar';
import { Content} from 'native-base'
import { SearchBar } from 'react-native-elements';
import config from "../../../config";
import Icon from 'react-native-vector-icons/FontAwesome';

export default class HomeGridView extends Component {
  constructor(props){
    super(props);
    this.state = {
      showUserDetails:[],
      restData:props.categories,
      loading:false,
      search: '',searchData:[],searching:false,
      promotion:[]
    }
    console.log(this.state.restData);
  }
  updateSearch = search => {
    this.setState({ search });
  };
  selectCategory(item,index){
    Actions.CategoryItems({item:item,desc:this.state.showUserDetails[index].categoryDesc,restData:this.props.categories});
  }
  selectPromotion(item,index){
    Actions.CategoryItems({item:item,desc:"Promotion",restData:this.props.categories});
  }
   componentDidMount=async()=>{
     await AsyncStorage.setItem('restaurant',JSON.stringify(this.state.restData));
      this.getCategories();
 }
 getCategories=async()=>{
  this.setState({loading:true});
  console.log("/list/category?restaurantId="+this.state.restData.id)
  this.setState({showUserDetails:await API.get("list", "/list/category?restaurantId="+this.state.restData.id,{}),loading:false},async()=>{
     await AsyncStorage.setItem('allList',JSON.stringify(this.state.showUserDetails));
  });
  console.log("cat data",this.state.showUserDetails)
  await API.get("list", "/list/promotions?restaurantId="+this.state.restData.id,{}).then(res=>{
    console.log(res)
    this.setState({promotion:res})
   })
 }
 getUrl(pic){
  let image = Storage.vault.get(pic)
  return image
}
clear = () => {
  this.search.clear();
};
SearchFilterFunction(text) {
  //passing the inserted text in textinput
  this.setState({searching:true})
  const newData = this.state.showUserDetails.filter(function(item) {
    //applying filter for the inserted text in search bar
    const itemData = item.categoryName ? item.categoryName.toUpperCase() : ''.toUpperCase();
    const textData = text.toUpperCase();
    return itemData.indexOf(textData) == 0;
  });
  this.setState({
    searchData: newData,
    search:text,
  });
}
  render() {
    date= new Date()
    console.log(date)
    return (
      <Page>
        <CustomNavbar />
             <View style={styles.mini}>
                <TouchableOpacity style={[styles.backbuttonView]} onPress={() => { Actions.popTo('BottomTabsView', {duration: 0,paramData:'GRID_MENU'});
                setTimeout( () => { },500) }}>
                <Image source={localIcons.backIcon} style={styles.backbutton}/>
                </TouchableOpacity>
            <Text style={[styles.menubuttonText]}>CATEGORIES</Text>
            <View style={{width: 30}}/>
            </View>
        {this.state.showUserDetails.length !==0 &&
        <Content >
      <View>
      <SearchBar
        round
        style={{backgroundColor:standardColors.appGreen_light}}
        searchIcon={{ size: 24 }}
        onChangeText={text => this.SearchFilterFunction(text)}
        onClear={text => this.SearchFilterFunction('')}
        placeholder=" Search categories here..."
        value={this.state.search}
        containerStyle={{backgroundColor: standardColors.white, borderBottomColor: 'transparent',
        borderTopColor: 'transparent'}}
        inputStyle={{backgroundColor: standardColors.appGreen_light,fontSize:14}}
      />
     {  
     
       this.state.promotion&&<FlatGrid
        itemDimension={135}
        items={this.state.searching ? this.state.searchData:this.state.promotion}
        style={styles.gridView}
        renderItem={({ item, index }) => (
          <TouchableOpacity style={{flex:1}} onPress={()=>this.selectPromotion(item,index)}>  
            <ImageBackground resizeMode="cover" style={[styles.itemContainer]} source = {item.picture!='NULL' ? {uri:config.s3.URL+item.picture} : localIcons.cat}>
                   <Text style={styles.itemCode}>{"Promotion Offers"}</Text>
               </ImageBackground>          
          </TouchableOpacity>
        )}
      />}
      <FlatGrid
        itemDimension={135}
        items={this.state.searching ? this.state.searchData:this.state.showUserDetails}
        style={styles.gridView}
        renderItem={({ item, index }) => (
          <TouchableOpacity style={{flex:1}} onPress={()=>this.selectCategory(item,index)}>  
            <ImageBackground resizeMode="cover" style={[styles.itemContainer]} source = {item.picture!='NULL' ? {uri:config.s3.URL+item.picture} : localIcons.cat}>
                   <Text style={styles.itemCode}>{item.categoryName}</Text>
               </ImageBackground>          
          </TouchableOpacity>          
        )}
      />
      </View>
      </Content>
        }
        {
          this.state.showUserDetails.length == 0 && !this.state.loading && 
            <View style={{flex:1,flexDirection:'column',justifyContent:'center',alignItems:'center'}}>
              <Icon name='exclamation-triangle' size={80} color={standardColors.appGreenColor} style={{opacity:0.5,alignItems:'center'}}/>
              <Text>No Categories Found</Text>
            </View>
        }
        <Loading loadingStatus={this.state.loading} />
      </Page>
    );
  }
}