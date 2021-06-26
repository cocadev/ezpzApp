import React, { Component } from 'react';
import {Modal, AsyncStorage, ScrollView, TouchableWithoutFeedback, ImageBackground, Text, View, TextInput, Image, Platform, TouchableOpacity, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
var dismissKeyboard = require("dismissKeyboard");
import styles from './styles';
import { localIcons,standardColors } from '../../assets/config/localdata';
import {emailValidation} from '../../assets/config/constants';
import { Actions } from 'react-native-router-flux';
import Toast from 'react-native-simple-toast';
import { Auth, API } from "aws-amplify";
import Loading from "../LoadAnim/Loading"

export default class Login_form extends Component {
  i=0;
	constructor(props) {
		super(props);
		this.state = {
			signIn_Values: { emailAddress: '', passWord: '' },
			scrollTo: 0,
			showPassword: true,isLoading:false
		}
		this.focusNextField = this.focusNextField.bind(this);
		this.inputs = {};
		
	}

componentWillMount(){
	console.log(global.baseURL,global.stripeKey);
}
	handleChange(name, e) {
		var change = this.state.signIn_Values;
		var string1 = e;
		change[name] = string1;
		this.setState({ signIn_Values: change });
	}

	inputFocused(refScroll) {
		if (refScroll == 'confirmpassWord') {
			var scrollResponder = this.refs.scrollView.getScrollResponder()
			scrollResponder.scrollTo({ y: 60 })
			this.setState({
				scrollTo: 75,

			})
		}
	}

	
	focusNextField(id) {
		this.inputs[id].focus();
	}

	show_Password = () => {
		this.setState({ showPassword: !this.state.showPassword });
	}

	signInas_Guest(){
		let { emailAddress, passWord } = this.state.signIn_Values;
		if (emailAddress === "" || emailAddress === null || emailAddress === undefined) {
			Alert.alert("EzPz Local", "Please enter E-Mail Address");

		} 
		else if (passWord === "" || passWord === null || passWord === undefined) {
			Alert.alert("EzPz Local", "Please enter PassWord");

		} else {
			dismissKeyboard();
		    this.loginAPI();
		}
	}
	getcardList=async(userData)=>{
		this.setState({isLoading:true})
		console.log(userData)
    this.setState({ cardList: await API.get("list", "/api/cart/Info?userId=" + userData.id, {}), isLoading: false },async () => {
              Toast.show('Successfully Logged In');
							AsyncStorage.setItem('card_total',JSON.stringify(this.state.cardList.length))
							if(this.props.item){
								console.log(this.props.item)
							Actions.CategoryItems({item:this.props.item,desc:this.props.desc,restData:this.props.restData});
							}
							else{
								Actions.BottomTabsView();
							}
							this.setState({ scrollTo: 0 })
    })
	}

	loginAPI=async()=>{
		this.setState({isLoading:true})
		let { emailAddress, passWord } = this.state.signIn_Values;
		try {
			let userData = await Auth.signIn(emailAddress, passWord);
			AsyncStorage.setItem("UserId", userData.username);
			let data = await this.getUser(userData.username);
			AsyncStorage.setItem("UserData", JSON.stringify(data));
			this.getcardList(data);
		} catch (e) {
			console.log(e);
			this.setState({isLoading:false});
			if(e.code == 'UserNotConfirmedException'){
				if(this.props.item){
				Actions.confirmUser({email:emailAddress,password:passWord,item:this.props.item,desc:this.props.desc,restData:this.props.restData});
				}
				else{
					Actions.confirmUser({email:emailAddress,password:passWord});
				}
			}
			else{
			setTimeout(()=>{
				Alert.alert('EzPz Local', e.message)
			},1000)
		}
		}
}
getUser(userId) {
  return API.get("get", "/api/get/usersTable/"+userId,{});
}

	goSignUp_Method = () => {
		if(this.props.item){
		Actions.SignUp_form({item:this.props.item,desc:this.props.desc,restData:this.props.restData});
		}
		else{
			Actions.SignUp_form();
		}
		this.setState({ scrollTo: 0 })
	}

	forgotPasswordMethod = () => {
		if(this.props.item){
		Actions.ForgotPassword_form({item:this.props.item,desc:this.props.desc,restData:this.props.restData})
		}
		else{
			Actions.ForgotPassword_form()
		}
	}
select_state(){
	this.i++;
	console.log(this.i);
	if(this.i>10){
		Actions.state();
		this.i=0;
	}
	setTimeout(()=>{
		this.i=0;
	},10000)
}
	render() {
		return (
			<ImageBackground
				source={localIcons.userAccountbgImg}
				style={styles.container}
				imageStyle={{ resizeMode: 'cover' }}>
				<View style={this.state.isLoading ? [{opacity:0.5},styles.container]:styles.container} pointerEvents={this.state.isLoading? "none":"auto"}>
					
					<View style={styles.logoView}>
					<TouchableWithoutFeedback onPress={()=>this.select_state()}>
						<Image source={localIcons.applogo} style={styles.logoImgStyles} />
						</TouchableWithoutFeedback>
					</View>
					
					<View style={styles.userTextinputsView}>
						<View style={styles.freshlyView}>
							<Text numberOfLines={3} style={styles.freshlyText}>The easiest way to order from local stores around you.</Text>
						</View>
						<ScrollView style={styles.container} ref="scrollView" >
						
							<View style={styles.container_TextInputs}>
								<View style={styles.SectionStyle}>
									<Icon name="envelope" size={20} style={styles.iconStyles} />
									<TextInput
										style={styles.textInputStyles}
										placeholder="Email"
										blurOnSubmit={false}
										returnKeyType={'next'}
										placeholderTextColor="darkgrey"
										autoCapitalize={"none"}
										autoCorrect={false}
										keyboardType='default'
										underlineColorAndroid="transparent"
										onSubmitEditing={() => { this.focusNextField("two"); }}
										ref={input => { this.inputs["one"] = input; }}
										onChangeText={this.handleChange.bind(this, "emailAddress")}
										value={this.state.signIn_Values.emailAddress}
										onFocus={this.inputFocused.bind(this, 'Email Address')}
									/>
								</View>

								<View style={styles.SectionStyle}>
									<Icon name="lock" size={25} style={styles.iconStyles} />
									<TextInput
										style={styles.textInputStyles}
										placeholder="Password"
										placeholderTextColor="darkgrey"
										returnKeyType="done"
										underlineColorAndroid="transparent"
										blurOnSubmit={false}
										ref={input => { this.inputs["two"] = input; }}
										autoCapitalize={"none"}
										secureTextEntry={this.state.showPassword}
										autoCorrect={false}
										keyboardType='default'
										onChangeText={this.handleChange.bind(this, "passWord")}
										value={this.state.signIn_Values.passWord}
										onSubmitEditing={()=>dismissKeyboard()}/>
									<Icon name="eye" size={20} style={styles.iconStyles} onPress={this.show_Password} value={!this.state.showPassword} />
								</View>
								<TouchableOpacity style={styles.login_buttonStyle} onPress={()=>this.signInas_Guest()}>
									<Text style={styles.loginText}> LOGIN </Text>
								</TouchableOpacity>
								<View style={{flexDirection:'row',justifyContent:'space-between'}}>
								<TouchableOpacity style={styles.forgotpasswordView1} onPress={()=>Actions.BottomTabsView()}>
				      	<Text style={styles.forgotpasswordtext}>Go To Home</Text>
					      </TouchableOpacity>
								<TouchableOpacity style={styles.forgotpasswordView} onPress={this.forgotPasswordMethod}>
					     	<Text style={styles.forgotpasswordtext}>Forgot Password?</Text>
					      </TouchableOpacity>
								</View>
							</View>
						</ScrollView>
					</View>
					<View style={styles.buttonsView}>
					</View>
					<View style={styles.fottorView} >
						<TouchableOpacity onPress={this.goSignUp_Method}>
							<Text style={styles.signUp_text_not_mem}> Not a member? Sign up Now </Text>
							<Text style={styles.signUp_Text}> SIGN UP </Text>
						</TouchableOpacity>
					</View>
				</View>
				<Loading loadingStatus={this.state.isLoading} />
			</ImageBackground>
		);
	}
};
