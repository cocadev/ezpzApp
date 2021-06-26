import {StyleSheet, Platform, Dimensions} from 'react-native';
var deviceheight = Dimensions.get('window').height;
var deviceWidth = Dimensions.get('window').width;
const styles = StyleSheet.create({
 container:{
    flex:1,
  },
  logoView:{
  	flex:0.25,
    justifyContent:'flex-end',
    alignItems:'center',
  	//backgroundColor:'rgba(255, 145, 255, 0.6)'
  },
  logoImgStyles:{height:deviceheight/5.6, width:deviceWidth/1.4,resizeMode:"contain"},
  SignUp_logoView:{
  	flex:0.25,
    justifyContent:'flex-end',
    alignItems:'center',
  },
  iconStyles:{padding:8, color:'lightgrey'},

  modalBackground: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'space-around',
    backgroundColor: 'rgba( 0 , 0 , 0 , 0.251 )'
  },
  activityIndicatorWrapper: {
    backgroundColor: '#FFFFFF',
    height: 100,
    width: 100,
    borderRadius: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-around'
  },
   freshlyView:{
  	alignSelf:'center', 
    alignItems:'flex-end',
    padding:10
  },
  freshlyText:{
  	fontSize:22, 
  	color:'white', 
  	fontWeight:'800', 
  	textAlign:'center'
  },
  userTextinputsView:{
  	flex:0.55,
  	justifyContent:'flex-start',
  	margin:5,
  	padding:5
  	//backgroundColor:'rgba(255, 145, 90, 0.6)'
  },
  textInputStyles:{ flex: 1, fontSize:14 },
  userTextinputsViewSignUp:{
  	flex:0.65,
  	justifyContent:'flex-start',
  	margin:5,
  	padding:5
  	//backgroundColor:'rgba(255, 145, 90, 0.6)'
  },
  buttonsView:{
   flex:0.05,
   justifyContent:'center',
   //backgroundColor:'rgba(155, 145, 196, 0.6)'

  },
  fottorView:{
  	 flex:0.15,
  	 justifyContent:'flex-start',
     alignItems:'center',
  	 padding:5,
  	 backgroundColor:'#170a06' // grey
  },
  forgotpasswordtext:{fontSize:18, color:'white', textAlign:'left', fontWeight:'600'},
  forgotpasswordView:{alignSelf:'flex-end',justifyContent:'flex-end'},
  forgotpasswordView1:{alignSelf:'flex-start',justifyContent:'flex-start'},
  signUp_text_not_mem: {fontSize:18, color:'white', textAlign:'center', marginTop:8, fontWeight:'600'},
  signUp_Text:{fontSize:16, color:'#127a3c', textAlign:'center', fontWeight:'700', marginTop:8},
  container_TextInputs: {
    flex: 1,
    margin: 10,
  },
  SectionStyle: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems:'center',
    backgroundColor: '#fff',
    height: 45,
    margin: 2,
    marginTop:8
  },
  login_buttonStyle:{
    justifyContent: 'center',
    alignItems:'center',
    backgroundColor: '#fff',
    height: 50,
    margin: 2,
    marginTop:10, 
    backgroundColor:'#127a3c'
  },
  loginText:{
  	textAlign:'center', 
  	fontWeight:'600', 
  	color:'white', 
  	fontSize:18
  }
});

export default styles;
