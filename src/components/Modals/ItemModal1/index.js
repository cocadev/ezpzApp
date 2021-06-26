import React, { Component } from 'react'
import {
  View, Text, Dimensions, Platform,
  AsyncStorage, TouchableOpacity,FlatList,Alert
} from 'react-native'
import Modal from 'react-native-modal';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Actions } from 'react-native-router-flux';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import CheckBox from '@checkBox'
import { Metrics } from '@assets/config';
import { standardColors } from '@assets/config/localdata';
import styles from './styles';
import { ScrollView } from 'react-native-gesture-handler';
import renderIf from '../../renderIf';
import { API } from "aws-amplify";
const deviceWidth = Dimensions.get("window").width;
const deviceHeight = Platform.OS === "ios"
  ? Dimensions.get("window").height
  : require("react-native-extra-dimensions-android").get("REAL_WINDOW_HEIGHT")
const { paddings, margins } = Metrics
class ItemModal1 extends Component {
  componentWillMount=async()=>{
    let t=0,s=0,c=0;
    let newT=[], newS=[], newC=[];
    console.log(this.state.item.item.modifiers)
        for(let i=0;i<this.state.item.item.modifiers.length;i++){
            if(this.state.item.item.modifiers[i].modifierType==='Topping'){
                newT[t]=this.state.item.item.modifiers[i];
                t++;
            }
            else if(this.state.item.item.modifiers[i].modifierType==='Choice'){
                newC[c]=this.state.item.item.modifiers[i];
                c++;
            }
            else if(this.state.item.item.modifiers[i].modifierType==='Size'){
                newS[s]=this.state.item.item.modifiers[i];
                s++;
            }
          }
          let tot=this.state.total_amt;
          console.log(newC,newS,newT)
          if(newC.length!=0){
              for(let i=0;i<newC.length;i++){
                  for(let j=0;j<this.state.item.modifiers.length;j++){
                      if(newC[i].id==this.state.item.modifiers[j].id){
                          newC[i].is_checked=true;
                          tot=tot+Number(newC[i].price);
                      }
                  }
              }
          }
          if(newS.length!=0){
            for(let i=0;i<newS.length;i++){
                for(let j=0;j<this.state.item.modifiers.length;j++){
                    if(newS[i].id==this.state.item.modifiers[j].id){
                        newS[i].is_checked=true;
                          tot=tot+Number(newS[i].price);
                    }
                }
            }
        }
        if(newT.length!=0){
            for(let i=0;i<newT.length;i++){
                for(let j=0;j<this.state.item.modifiers.length;j++){
                    if(newT[i].id==this.state.item.modifiers[j].id){
                        newT[i].is_checked=true;
                          tot=tot+Number(newT[i].price);
                    }
                }
            }
        }
        this.setState({toppingItems:newT,total_amt:tot,size:newS,choices:newC,userData:JSON.parse(await AsyncStorage.getItem("UserData"))},()=>{
    });
}
  constructor(props) {
    super(props);
    this.state = {
      item:props.item,
      toppingItems:[],choices:[],
      size: [],
      userData:{},
      quantity:1,
      total_amt: Number(props.item.item.price)
    }
  }
  updatecart=async()=>{
    newArray={
      entityData:{
      modifiers:[]
      }
    }
    count=0;
    newChoice=[];
    if(this.state.choices.length!=0){
      for(let i=0;i<this.state.choices.length;i++){
        if(this.state.choices[i].is_checked==true){
          newChoice.push({id:this.state.choices[i].id})
          count++;
        }
      }
    }
    if(this.state.size.length!=0){
      for(let i=0;i<this.state.size.length;i++){
        if(this.state.size[i].is_checked==true){
          newChoice.push({id:this.state.size[i].id})
        }
      }
    }
    if(this.state.toppingItems.length!=0){
      for(let i=0;i<this.state.toppingItems.length;i++){
        if(this.state.toppingItems[i].is_checked==true){
          newChoice.push({id:this.state.toppingItems[i].id})
        }
      }
    }
    if(this.state.choices.length!=0){
      if(count<=0){
        Alert.alert('EzPz Local','Select atleast one from Type');
      }
    }
    newArray.entityData.modifiers=[...newChoice];
    let d = await API.put("put", "/api/update/cart/"+this.state.item.id, {
      body: newArray
    });
    if(d!=undefined){
      this.props.setModalVisible(false)
      this.props.getcardItems();
    }
  }
  toggleSize(item,index) {
    let tot=0;
    let newArray=[...this.state.size];
      for(let i=0;i<newArray.length;i++){
        if(newArray[i].id==newArray[index].id){
          newArray[i].is_checked=!newArray[i].is_checked;
        }
        else{
          newArray[i].is_checked=false;
        }
      }
  this.setState({ size:newArray},()=>{
    this.calAmout()
  })
  }
toggleCheck(item,index) {
  let tot=0;
  let newArray=[...this.state.choices];
  if(!this.state.item.multiSelect){
    for(let i=0;i<newArray.length;i++){
      if(newArray[i].id==newArray[index].id){
        newArray[i].is_checked=!newArray[i].is_checked;
      }
      else{
        newArray[i].is_checked=false;
      }
    }
  }
  else{
  newArray[index].is_checked=!newArray[index].is_checked;
}
this.setState({ choices:newArray},()=>{
  this.calAmout()
})
}
toggleCheck1(item,index) {
  let newArray=[...this.state.toppingItems];
  newArray[index].is_checked=!newArray[index].is_checked;
  this.setState({ toppingItems:newArray},()=>{
    this.calAmout();
  });
}
calAmout(){
const{ toppingItems,choices,size}=this.state;
let tot=0;
for(let i=0;i<size.length;i++){
  if(size[i].is_checked){
    tot=Number(tot)+Number(size[i].price);
  }
}
for(let i=0;i<choices.length;i++){
  if(choices[i].is_checked){
    tot=Number(tot)+Number(choices[i].price);
  }
}
for(let i=0;i<toppingItems.length;i++){
  if(toppingItems[i].is_checked){
    tot=Number(tot)+Number(toppingItems[i].price);
  }
}
tot=(tot+Number(this.props.item.item.price));
this.setState({total_amt:tot});
}
  updateSize(size) {
    this.setState({selectedSize: size }, () => {
      this.props.updateSize(size);
    })
  }
  render() {
    const { visible } = this.props
    const { size, toppingItems,choices } = this.state;
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
            <TouchableOpacity style={[paddings.pT10,paddings.pL10,paddings.pR10]} onPress={() => this.props.setModalVisible(false)}>
              <Icon name="close" size={30} color={standardColors.appGreenColor} />
            </TouchableOpacity>
          </View>
          <View style={[styles.contentContainer,{flex:0.9}]}>
          {renderIf(this.state.size.length!=0, (
          <View style={[styles.bodySectionContainer,{marginTop:scale(10)}]}>
              <View>
                <Text style={styles.chooseTextLable}>Choose Size :</Text>
              </View>
              <ScrollView>
              <FlatList
               data={size}
               keyExtractor = { (item, index) => index.toString() }
               style={margins.mT5}
               renderItem={({ item, index }) => (
                <TouchableOpacity
                onPress={() => { this.toggleSize(item,index) }}
                style={{ flexDirection: 'row', alignItems: 'center',marginTop:scale(6) }}>
                <CheckBox isChecked={item.is_checked} />
                <View style={margins.mL5}><Text style={{ fontSize: moderateScale(15) }}>{item.modifierName}{'  '}{renderIf(item.price>0,<Text style={{color:standardColors.appGreenColor}}>${item.price}</Text>)}</Text></View>
              </TouchableOpacity>)} />
              </ScrollView>
            </View>
            )
            )}
          {renderIf(this.state.choices.length!=0, (
             <View style={[styles.bodySectionContainer,{marginTop:scale(10)}]}>
             <View>
               <Text style={styles.chooseTextLable}>Choose (Required):</Text>
             </View>
             <ScrollView>
             <FlatList
               data={choices}
               keyExtractor = { (item, index) => index.toString() }
               style={margins.mT5}
               renderItem={({ item, index }) => (
                 <TouchableOpacity
                   onPress={() => { this.toggleCheck(item,index) }}
                   style={{ flexDirection: 'row', alignItems: 'center',marginTop:scale(6) }}>
                   <Text>{item.is_checked}</Text>
                   <CheckBox isChecked={item.is_checked} />
                   <View style={margins.mL5}><Text style={{ fontSize: moderateScale(15) }}>{item.modifierName}{'  '}{renderIf(item.price>0,<Text style={{color:standardColors.appGreenColor}}>${item.price}</Text>)}</Text></View>
                 </TouchableOpacity>
               )} />
               </ScrollView>
           </View>
          ))}
          {renderIf(this.state.toppingItems.length!=0,(
              <View style={[styles.bodySectionContainer,{marginTop:scale(10),flex:1}]}>
              <View>
                <Text style={styles.chooseTextLable}>Add-ons (Optional):</Text>
              </View>
              <ScrollView>
              <FlatList
                data={toppingItems}
                keyExtractor = { (item, index) => index.toString() }
                style={margins.mT5}
                renderItem={({ item, index }) => (
                  <TouchableOpacity
                    onPress={() => { this.toggleCheck1(item,index) }}
                    style={{ flexDirection: 'row', alignItems: 'center',marginTop:scale(6) }}>
                    <CheckBox isChecked={item.is_checked} />
                    <View style={margins.mL5}><Text style={{ fontSize: moderateScale(15) }}>{item.modifierName}{'  '}{renderIf(item.price>0,<Text style={{color:standardColors.appGreenColor}}>${item.price}</Text>)}</Text></View>
                  </TouchableOpacity>
                )} />
                </ScrollView>
            </View>
          ))}
          </View>
          <View style={[{flex:0.1,backgroundColor:standardColors.appGreenColor}]}>
                <View style={[styles.addCartButton,{flexDirection:'row',justifyContent:'space-between'}]} >
                  <Text style={styles.addCartButtonText}>Total: ${this.state.total_amt}</Text>
                  <TouchableOpacity onPress={() => { this.updatecart() }}>
                  <Text style={styles.addCartButtonText}>Update Item</Text>
                  </TouchableOpacity>
                </View>
              </View>
        </View>
      </Modal>
    )
  }
}
export default ItemModal1;