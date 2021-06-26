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
import { API , Storage} from "aws-amplify";
import Loading from "../../LoadAnim/Loading";
import renderIf from '../../renderIf';
const deviceWidth = Dimensions.get("window").width;
const deviceHeight = Platform.OS === "ios"
  ? Dimensions.get("window").height
  : require("react-native-extra-dimensions-android").get("REAL_WINDOW_HEIGHT")
const { paddings, margins } = Metrics
class ItemModal extends Component {
  componentWillMount=async()=>{
    this.setState({ loading: true });
    modArray=[];
    console.log(this.state.item.modifiers)
    for(let i=0;i<this.state.item.modifiers.length;i++){
      console.log("/get/modifiers/"+this.state.item.modifiers[i].id);
      let data =await API.get("get", "/api/get/modifiers/" + this.state.item.modifiers[i].id, {})
      modArray.push(data)
    }
    console.log(modArray);
    modArray.sort((a, b) =>{
      let data= this.compareStrings(a.modifierName, b.modifierName);
      return data
    })
    this.state.item.modifiers=modArray
    let t=0,s=0,c=0;
    let newT=[], newS=[], newC=[]; let tot=this.state.total_amt;
    for(let i=0;i<this.state.item.modifiers.length;i++){
      if(this.state.item.modifiers[i].modifierType==='Topping'){
          newT[t]=this.state.item.modifiers[i];
          newT[t].is_checked=false;
          t++;
      }
      else if(this.state.item.modifiers[i].modifierType==='Choice'){
          newC[c]=this.state.item.modifiers[i];
          newC[c].is_checked=false;
          c++;
      }
      else if(this.state.item.modifiers[i].modifierType==='Size'){
          newS[s]=this.state.item.modifiers[i];
          newS[s].is_checked=false;
          s++;
      }
      if(this.state.item.modifiers[i].is_checked==true){
        tot=tot+this.state.item.modifiers[i].price;
      }
    }
    console.log(newT,newC,newS)
    this.setState({toppingItems:newT,size:newS,choices:newC,total_amt:tot,loading:false,userData:JSON.parse(await AsyncStorage.getItem("UserData"))},()=>{
    });
}

  constructor(props) {
    super(props);
    this.state = {
      item:props.item,modifiers:[],
      toppingItems:[],choices:[],
      size: [],restData:props.restData,cardList:props.cartList,
      userData:{},
      quantity:1,loading:false,
      total_amt: props.item.price
    }
    console.log(this.state.item)
  }
  compareStrings(a, b) {
    // Assuming you want case-insensitive comparison
    a = a.toLowerCase();
    b = b.toLowerCase();
  
    return (a < b) ? -1 : (a > b) ? 1 : 0;
  }
  productIncrementMethod(){
    this.setState({quantity:this.state.quantity+1},()=>{
      this.setState({total_amt:Number((this.state.total_amt/(this.state.quantity-1))*this.state.quantity)})
    })
  }
  productDecrementMethod(){
    if(this.state.quantity>1){
      this.setState({quantity:this.state.quantity-1},()=>{
        this.setState({total_amt:Number((this.state.total_amt/(this.state.quantity+1))*this.state.quantity)})
      })
    }
  }
  checkcart(){
    newArray={
      userId:'',
      itemId:'',
      quantity:'',
      modifiers:[]
    }
    count=0;post=true;
    newChoice=[];
    newArray.userId=this.state.userData.id;
    newArray.itemId=this.state.item.id;
    newArray.quantity=this.state.quantity;
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
        post=false;
        Alert.alert('EzPz Local','Please choose atleast one required item');
      }
    }
    if(post){
      newArray.modifiers=[...newChoice];
      if(this.state.cardList.length!=0){
        console.log(this.state.cardList)
        if(this.state.cardList[0].restaurantId==this.state.restData.id){
          this.props.setModalVisible(false);
          this.props.addtoCartProductMethod(newArray);
        }
      else{      
        Alert.alert(
          'Replace cart item?',
          'Your cart already contains dishes from another restaurant. Do you want to discard the selection and add dishes from New restaurant',
          [
            {
              text: 'No',
              onPress: () => console.log('Cancel Pressed'),
              style: 'cancel',
            },
            {text: 'Yes', onPress: () => {
              console.log('OK Pressed')
              data={entityData:newArray}
              this.props.setModalVisible(false);
              console.log(data);
              this.props.removeCart(data);              

            }}
          ],
          {cancelable: false},
        ); 
        
      }
    }else{
      this.props.setModalVisible(false);
      this.props.addtoCartProductMethod(newArray);
      
    }
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
    console.log(newArray[index]);
    newArray[index].is_checked=!newArray[index].is_checked;
    this.setState({ toppingItems:newArray},()=>{
      this.calAmout();
    });
  }
calAmout(){
  const{ toppingItems,choices,size}=this.state;
  console.log(toppingItems)
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
  tot=Number((tot+Number(this.props.item.price))*this.state.quantity);
  this.setState({total_amt:tot});
}
updateSize(size) {
    this.setState({selectedSize: size }, () => {
      this.props.updateSize(size);
    })
}
render() {
    const { visible } = this.props
    const { size, toppingItems,choices,selectedSize,item } = this.state;
    return (
      // <TouchableWithoutFeedback onPress={() => { }}>
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
            <TouchableOpacity style={[paddings.pT10,paddings.pL10,paddings.pR10,]} onPress={() => this.props.setModalVisible(false)}>
              <Icon name="close" size={30} color={standardColors.appGreenColor} />
            </TouchableOpacity>
          </View>
          <View style={[styles.contentContainer,{flex:0.8}]}>
         <View style={{justifyContent:"center",alignItems:"center",paddingTop:scale(10)}}>
         <Text style={styles.chooseTextLable}>{item.itemName}</Text>
         <Text style={{textAlign:"center"}}>{item.itemDesc}</Text>
         </View>
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
          <View style={[{flex:0.1 ,backgroundColor:standardColors.appGreen_light,justifyContent:'center',paddingHorizontal:scale(20)}]}>
          <View style={{flexDirection:'row',justifyContent:'space-between'}}>
             <View style={{flex:0.5}}>
               <Text style={[styles.addCartButtonText,{color:'black'}]}>Select Quantity :</Text>
             </View>
             <View style={[styles.incdecWrapper]}>
                       <TouchableOpacity style={{ justifyContent: 'center' }} onPress={() => { this.productDecrementMethod() }}>
                        <Icon style={[styles.incDecIcon,{marginLeft:5}]} name='minus' size={20} color={standardColors.appGreenColor} />
                        </TouchableOpacity>
                        <View style={{ justifyContent: 'center' }}>
                            <Text style={styles.quantityLabel}> {this.state.quantity} </Text>
                        </View>
                        <TouchableOpacity style={{ justifyContent: 'center' }} onPress={() => { this.productIncrementMethod() }}>
                            <Icon style={[styles.incDecIcon,{marginRight:5}]} name='plus' size={20} color={standardColors.appGreenColor} />
                        </TouchableOpacity>
                    </View>
             </View>
             </View>
          <View style={[{flex:0.1,backgroundColor:standardColors.appGreenColor}]}>
                <View style={[styles.addCartButton,{flexDirection:'row',justifyContent:'space-between'}]} >
                  <Text style={styles.addCartButtonText}>Total: ${this.state.total_amt}</Text>
                  <TouchableOpacity onPress={() => { this.checkcart() }}>
                  <Text style={styles.addCartButtonText}>Add to Cart</Text>
                  </TouchableOpacity>
                </View>
              </View>
        </View>
        <Loading loadingStatus={this.state.loading} />
      </Modal>
    )
  }
}
export default ItemModal;



