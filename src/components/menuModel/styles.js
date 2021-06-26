import {StyleSheet, Dimensions, Platform} from 'react-native';
import { scale } from 'react-native-size-matters';
var deviceheight = Dimensions.get('window').height;
var deviceWidth = Dimensions.get('window').width;
import {standardColors } from '../../assets/config/localdata';
const styles = StyleSheet.create({
    scrollFlex:{ flex: 1 },
    selectedItemsView:{ flex: 1, backgroundColor: standardColors.appGreenColor },
    container:{ flex: 1, justifyContent: 'center' },
    icon_title:{ color: 'white', fontSize: 14, fontWeight: '600', textAlign: 'center', marginLeft: 10 },
    icon_TouchableView:{ padding:Platform.OS === 'ios' ? 10 : 6, flexDirection: 'row', marginVertical: 10, marginHorizontal: 20, borderBottomWidth: 1, borderBottomColor: 'white' },
    profileSplitView:{ flex: 0.32 },
    selectedSplitView:{ flex: 0.68 },
    profileView:{ flex: 1, backgroundColor: '#000000' , left: 0, top: 0},
    profileUsrname:{fontSize:18, fontWeight:'bold', color:'white', textAlign:'center'},
    editprofileText:{fontSize:12, fontWeight:'600', color:'red', textAlign:'center'},
    profileBackView:{flex:1, width:deviceWidth, height:null, justifyContent:'space-evenly', backgroundColor: standardColors.appDarkBrownColor,},
    profileStyles:{height:80, width:80, borderRadius:40, borderWidth:1, borderColor:standardColors.appGreenColor}, //deviceheight*0.142 //deviceWidth*0.243
    gridView: {marginTop: 0,flex: 1},
    itemContainer: {justifyContent: 'flex-end', borderRadius: 10, padding: 8, height: 90},
    itemName: {fontSize: 16, color: '#fff', fontWeight: '600'},
    itemCode: {fontWeight: '600', fontSize: 12, color: '#fff'},
    indicator: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        height: 80,
      },
        cardContainer: {
            flex: 1, flexDirection: 'row', marginTop: 15,
        },
        mini: {
            height: 35,
            flexDirection:'row',
            backgroundColor: standardColors.appGreenColor,
            alignItems:'center',
            justifyContent:'space-between'
        },
        menubuttonText: { fontSize: 15, fontWeight: '400', textAlign: 'center', color: 'white' },
        leftSection: { flex: 0.6, flexDirection: 'column', padding:15,marginLeft:-7},
        backbutton: { height: 15, width: 15 },
  backbuttonView: {justifyContent: 'flex-start',alignItems:'flex-start', paddingVertical: 10, paddingHorizontal: 15 },
        titleText: { color: standardColors.black, fontWeight: 'bold' },
        smallText: { color: standardColors.miniTextColor, fontSize: 10 },
        descriptionText: { color: standardColors.miniTextColor, fontSize: 12 },
        priceText: { fontSize: 18, color: standardColors.appGreenColor, fontWeight: 'bold',marginRight:scale(10)},
        actionContainer: {flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', marginTop: 10 },
        actionButton: {
            flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center',
            paddingHorizontal: 10, height: scale(30), backgroundColor: standardColors.appOrangeColor,
            borderRadius: 2,marginTop:5,width:scale(80)
        },
        rightSection: { flex: 0.4,padding:8 },
        itemImage: { flex: 1, height: undefined},
        buttonStyle:{
            justifyContent: 'center',
            alignItems:'center',
            backgroundColor: '#fff',
            height: 50,
            margin: 2,
            marginTop:10, 
            backgroundColor:'#127a3c'
          },
});
export default styles;