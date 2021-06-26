import React, { Component } from 'react';
import { View, Text, ImageBackground, PermissionsAndroid, AsyncStorage, Platform, TouchableOpacity, FlatList } from 'react-native';
import { localIcons, standardColors } from '../../assets/config/localdata';
import { Rating } from 'react-native-elements';
import styles from './styles';
import CardTile from "../CardTile/index";
import { Actions } from 'react-native-router-flux';
import { API, Storage } from "aws-amplify";
import Loading from "../LoadAnim/Loading";
import Icon from 'react-native-vector-icons/FontAwesome';
import config from "../../../config";
import { SearchBar } from 'react-native-elements';

export default class Restaurants extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showUserDetails: [],
      loading: false,
      latitude: null, longitude: null,
      search: '', searchData: [], searching: false,
      refreshing: false
    }
  }
  // refresh=()=>{
  //   this.setState({refreshing:true})
  //   console.log('Refresh')
  //   this.componentWillMount();
  // }
  componentWillReceiveProps(nextprops) {
    if (nextprops.refresh === true) {
      this.componentWillMount();
      this.props.onchange();
    }
  }

  hasLocationPermission = async () => {
    if (Platform.OS === 'ios' ||
      (Platform.OS === 'android' && Platform.Version < 23)) {
      return true;
    }

    const hasPermission = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
    );

    if (hasPermission) return true;

    const status = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
    );

    if (status === PermissionsAndroid.RESULTS.GRANTED) return true;

    if (status === PermissionsAndroid.RESULTS.DENIED) {
      ToastAndroid.show('Location permission denied by user.', ToastAndroid.LONG);
    } else if (status === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
      ToastAndroid.show('Location permission revoked by user.', ToastAndroid.LONG);
    }
    return false;
  }

  componentWillMount = async () => {

    await AsyncStorage.removeItem('restaurant');

    const hasLocationPermission = await this.hasLocationPermission();

    console.log('_where are you?_', hasLocationPermission)

    if (!hasLocationPermission) return;

    navigator.geolocation.getCurrentPosition(
      (position) => {
        console.log('positionpositionposition', position)

        this.setState({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          error: null,
        },()=>this.getCategories());
      },
      (error) => {      
        console.log('My location error', error)
         this.setState({ error: error.message })
      },
      { enableHighAccuracy: false, timeout: 200000, maximumAge: 1000 },
    );
  }

  getDistance(lat1, lon1, lat2, lon2) {
    var radlat1 = Math.PI * lat1 / 180
    var radlat2 = Math.PI * lat2 / 180
    var radlon1 = Math.PI * lon1 / 180
    var radlon2 = Math.PI * lon2 / 180
    var theta = lon1 - lon2
    var radtheta = Math.PI * theta / 180
    var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
    dist = Math.acos(dist)
    dist = dist * 180 / Math.PI
    dist = dist * 60 * 1.1515
    // if (unit=="K") { dist = dist * 1.609344 }
    dist = dist * 0.8684
    return dist.toFixed(2)
  }
  getCategories = async () => {
    this.setState({ loading: true });
    let { latitude, longitude } = this.state;
    let data = await API.get("list", "/list/restaurant?recordStatus=true", {});
    let sortList = data.sort((a, b) => {
      let dis2 = this.getDistance(latitude, longitude, b.lat, b.lng)
      let dis1 = this.getDistance(latitude, longitude, a.lat, a.lng)
      return dis1 - dis2;
    });
    console.log(sortList)
    this.setState({ showUserDetails: sortList, loading: false, refreshing: false, }, async () => {
      await AsyncStorage.setItem('allRest', JSON.stringify(sortList));
      console.log(this.state.showUserDetails);
    });

  }
  SearchFilterFunction(text) {
    //passing the inserted text in textinput
    this.setState({ searching: true })
    const newData = this.state.showUserDetails.filter(function (item) {
      //applying filter for the inserted text in search bar
      const itemData = item.restaurantName ? item.restaurantName.toUpperCase() : ''.toUpperCase();
      const textData = text.toUpperCase();
      return itemData.indexOf(textData) == 0;
    });
    this.setState({
      searchData: newData,
      search: text,
    });
  }
  home(item) {
    console.log(item);
    Actions.Home({ categories: item });
  }

  renderItem(data) {
    let { item, index } = data;
    let { latitude, longitude } = this.state;
    return (
      <TouchableOpacity onPress={() => this.home(item)}>
        <CardTile style={styles.cardContainer}>
          <View style={styles.rightSection}>
            <ImageBackground source={item.picture != 'NULL' ? { uri: config.s3.URL + item.picture } : localIcons.rest}
              style={styles.itemImage} resizeMode="contain" >
              {/* <Image source={localIcons.favIconSelected} style={{width:20,height:20,margin:5}}></Image> */}
            </ImageBackground>
          </View>
          <View style={styles.leftSection}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text numberOfLines={2} style={[styles.titleText, { flex: 0.7, justifyContent: 'flex-start', alignContent: 'flex-start' }]}>{item.restaurantName}</Text>
              {item.lat && item.lng && <View style={{ justifyContent: 'flex-end', flex: 0.3, alignContent: 'flex-end', flexDirection: 'row', paddingTop: 3 }}>
                <Icon name="map-marker" size={10} style={styles.iconStyles} color={standardColors.appGreenColor} />
                <Text style={styles.smallText}> {this.getDistance(latitude, longitude, item.lat, item.lng)} miles</Text>
              </View>}
            </View>
            {/* <View style={{flexDirection:'row'}}>
              <Rating
                  imageSize={10}
                  readonly
                  startingValue={4.5}
                  style={styles.rating}
              />
              <Text style={[styles.smallText,{color:standardColors.appGreenColor}]}> 8 Reviews</Text>
              </View> */}
            <View style={{ flexDirection: 'row' }}>
              {item.kitchenCategory != undefined && item.kitchenCategory.map((item1, index) => { return <Text key={index} style={styles.descriptionText}>{item1}{index == item.kitchenCategory.length - 1 ? "" : ", "}</Text> })}
            </View>
            <Text numberOfLines={2} style={styles.descriptionText}>Phone: {item.phone}</Text>
            <Text numberOfLines={2} style={styles.descriptionText}>{item.address}</Text>
            <View style={{ flex: 1 }}>
              <View style={styles.actionContainer}>
                {/* <Text style={[styles.priceText,{flex:0.5}]}>{item.price != 0 ? this.actual_price(item) : this.lowest_price(item)}</Text> */}
              </View>
            </View>
          </View>
        </CardTile>
      </TouchableOpacity>)
  }
  render() {
    return (
      <View>
        {this.state.showUserDetails.length != 0 && <View>
          <SearchBar
            round
            clearIcon={true}
            style={{ backgroundColor: standardColors.appGreen_light }}
            searchIcon={{ size: 24 }}
            onChangeText={text => this.SearchFilterFunction(text)}
            onClear={text => this.SearchFilterFunction('')}
            placeholder=" Search Places here..."
            value={this.state.search}
            containerStyle={{
              backgroundColor: standardColors.white, borderBottomColor: 'transparent',
              borderTopColor: 'transparent'
            }}
            inputStyle={{ backgroundColor: standardColors.appGreen_light, fontSize: 14 }}
          />
          <FlatList
            contentContainerStyle={{ paddingHorizontal: 15 }}
            data={this.state.searching ? this.state.searchData : this.state.showUserDetails}
            keyExtractor={(item, index) => index.toString()}
            // refreshControl={
            //   <RefreshControl
            //     refreshing={this.props.refresh}
            //     onRefresh={this.refresh.bind(this)}
            //   />
            // }
            initialNumToRender={10}
            renderItem={this.renderItem.bind(this)}

          />
        </View>
        }
        {
          this.state.showUserDetails.length == 0 && !this.state.loading &&
          <View style={{ marginTop: '40%', justifyContent: 'center', alignItems: 'center' }}>
            <Icon name='exclamation-triangle' size={80} color={standardColors.appGreenColor} style={{ opacity: 0.5, alignItems: 'center' }} />
            <Text style={{ color: 'white' }}>No Places Found</Text>
          </View>
        }
        <Loading loadingStatus={this.state.loading} />
      </View>
    );
  }
}