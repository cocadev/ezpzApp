import { StyleSheet, Platform, Dimensions, StatusBar } from 'react-native';
var deviceheight = Dimensions.get('window').height;
var deviceWidth = Dimensions.get('window').width;
import { standardColors } from '../config/localdata';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? 0 : StatusBar.currentHeight;
const styles = StyleSheet.create({
  mainview_container: {
    flex: 1,
    backgroundColor: standardColors.appDarkBrownColor, // dark brown
    justifyContent: 'center'
  },
  container: {
    flex: 1,
    justifyContent: 'center'
  },
  //commonMiniHeader Buttons
  menubuttonText: { fontSize: 15, fontWeight: '400', textAlign: 'center', color: 'white' },
  menuHeaderButtonView: { height: 35, marginHorizontal: 1, backgroundColor: standardColors.appGreenColor, justifyContent: 'center' },
  //placeOrderScreen Styles Here
  placeorderContainer: { flex: 1, padding: 8 },
  deliveryLogoView: { flex: 0.50, justifyContent: 'center', alignItems: 'center', },
  deliveryimglogo: { height: scale(150), width: scale(150)},
  deliveryTextView: { flex: 0.25, padding: 4 },
  deliveryText: { fontSize: 38, textAlign: 'center', color: 'white', fontWeight: '700' },
  deliveryminiText: { fontSize: 12, fontWeight: '300', color: 'white', textAlign: 'center' },
  //TabsMainPage Styles 
  menuHeaderView: { flex: 1, flexDirection: 'row', justifyContent: 'center', marginHorizontal: 15 },
  IconView: { flex: 0.15, justifyContent: 'center' },
  logoView: { flex: 0.70, justifyContent: 'center', alignItems: 'center', margin: 8 },
  ImgStyles: { height: 70, width: 130,resizeMode:"contain" },
  foodmenuSubView: { flex: 0.76, justifyContent: 'center' },
  menuSubView: { flex: 0.89, justifyContent: 'center' },
  menuheadermainView: { flex: 0.13, justifyContent: 'center', backgroundColor: standardColors.appDarkBrownColor },
  footerSplitMainView: { flex: 1, marginHorizontal: 10, justifyContent: 'center', flexDirection: 'row' },
  footermainView: { flex: 0.11, backgroundColor: standardColors.appDarkBrownColor },
  footerIcon: { height: 30, width: 30 },
  footerTabIconsSplitViewChange: { flex: 0.5, justifyContent: 'center', alignItems: 'center', flexDirection: 'row', borderTopWidth: 2, borderTopColor: standardColors.appGreenColor, },
  footerTabIconsSplitView: { flex: 0.5, justifyContent: 'center', alignItems: 'center', flexDirection: 'row' },
  footerTabText: { textAlign: 'left', fontSize: 14, fontWeight: '800', color: 'white', marginLeft: 6 },
  footerTabTextChange: { textAlign: 'left', fontSize: 14, fontWeight: '800', color: standardColors.appGreenColor, marginLeft: 6 },
  //headerTextView
  headerTextView: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  backbutton: { height: 15, width: 15 },
  backbuttonView: { justifyContent: 'center', paddingVertical: 10, paddingHorizontal: 15 },
  headerRowView: { flex: 1, flexDirection: 'row', justifyContent: 'center' },
  //userProfileDetails......
  profileUsrname: { fontSize: 18, fontWeight: '500', color: standardColors.appGreenColor, textAlign: 'center' },
  editprofileText: { fontSize: 12, fontWeight: '600', color: 'red', textAlign: 'center' },
  profileView: { flex: 0.30, padding: 8, alignItems: 'center' },
  profileMainView: { flexGrow: 1, backgroundColor: standardColors.white, margin: 8, borderRadius: 5, borderWidth: 1, borderColor:'white' },
  profilesubView: { flex: 1 },
  textInputStyle: { height: 35, borderWidth: 1, borderColor: 'lightgrey', paddingHorizontal:10,paddingVertical:5, margin:8, borderRadius: 4 },
  profilesplitView: { flex: 0.65 },
  halfsplitView: { flex: 0.5, justifyContent: 'center' },
  rowsplitView: { flex: 1, justifyContent: 'space-between', flexDirection: 'row' },
  profileDetailsImg: { height: 80, width: 80, borderRadius: 40, borderWidth: 1, borderColor: standardColors.appGreenColor },
  // Footer
    footerWrapper: {
        flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center', marginTop: 15
    },
    confirmButton: {
        backgroundColor: standardColors.appGreenColor, paddingVertical: 10, paddingHorizontal: 40
    },
    confirmButtonText: { color: 'white', textAlign: 'center' },
    statusBar: {
    height: STATUSBAR_HEIGHT,
  },
})
export default styles; 