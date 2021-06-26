import React, { Component } from 'react';
import {Text,View,StyleSheet,TouchableOpacity,Image,AsyncStorage} from 'react-native';
import Page from '@page';
import CustomNavbar from '@customNavbar';
import { standardColors,localIcons } from '@assets/config/localdata';
import { Content } from 'native-base';
import { Actions } from 'react-native-router-flux';
import Toast from 'react-native-simple-toast';

export default class SelectState extends Component {
    select=async(text)=>{
        console.log(text)
        if(text==='Dev'){
            await AsyncStorage.setItem('stage','dev');
            global.baseURL="http://adminstage.hawkslandingcc.com";
            global.stripeKey='sk_test_pTlP8v9XNBz06H10bPOuOtSK';
            Toast.show('Development mode ON');
        }
        else{
            await AsyncStorage.setItem('stage','production');
            global.baseURL='http://adminstage.hawkslandingcc.com';
            global.stripeKey='sk_test_pTlP8v9XNBz06H10bPOuOtSK';
            Toast.show('Production mode ON');
        }
    }
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <Page>
            <View style={styles.mini}>
            <TouchableOpacity style={[styles.backbuttonView]} onPress={() => { Actions.Login_form();
                setTimeout( () => { },500) }}>
                <Image source={localIcons.backIcon} style={styles.backbutton}/>
                </TouchableOpacity>
              <Text style={styles.menubuttonText}>Select Environment</Text>
              <View style={{ width: 30 }} />
            </View>
              <Content >
              <View style={styles.card}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={styles.titleText}>Environments</Text>
            </View>
            <TouchableOpacity onPress={() => { this.select('Production') }}>
                    <View
                      style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 }}>
                      <View style={{ flex: 1 }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                          <View>
                            <Text>Production</Text>
                            <Text>http://admin.hawkslandingcc.com</Text>
                          </View>
                        </View>
                      </View>
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => { this.select('Dev') }}>
                    <View
                      style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical: 20 }}>
                      <View style={{ flex: 1 }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                          <View>
                            <Text>Development</Text>
                            <Text>http://adminstage.hawkslandingcc.com</Text>
                          </View>
                        </View>
                      </View>
                    </View>
                  </TouchableOpacity>
            </View>
             </Content>
           </Page>
        );
    }
}
const styles = StyleSheet.create({
    indicator: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center'
    },
    mini: {
        height: 35,
        flexDirection:'row',
        backgroundColor: standardColors.appGreenColor,
        alignItems:'center',
        justifyContent:'space-between'
    },
    menubuttonText: {fontSize: 15, fontWeight: '400',textAlign:'center', color: 'white' },
    backbutton: { height: 15, width: 15 },
      backbuttonView: {justifyContent: 'flex-start',alignItems:'flex-start', paddingVertical: 10, paddingHorizontal: 15 },
      card: {
        flexDirection: 'column',
        backgroundColor: standardColors.white,
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
  });