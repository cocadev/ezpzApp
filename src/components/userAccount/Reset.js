import React, { Component } from 'react';
import { AsyncStorage, ScrollView, StyleSheet, ImageBackground, Text, View, TextInput, Image, Platform, TouchableOpacity, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
var dismissKeyboard = require("dismissKeyboard");
import styles from './styles';
import { localIcons } from '../../assets/config/localdata';
import { Actions } from 'react-native-router-flux';
import Toast from 'react-native-simple-toast';
import Loader from '../Loader';
import { Auth, API } from "aws-amplify";

export default class Reset extends Component {
	constructor(props) {
		super(props);
		this.state = {
			signIn_Values: { passWord: '', confirmpassWord: '' },code:props.code,
			showPassword: true,
			confirmshowPassword: true,
			scrollTo: 0,isLoading:false,
			confirmation_code:'',
			email:props.email
		}
	//	console.log(this.state.signIn_Values)
		this.focusNextField = this.focusNextField.bind(this);
		this.inputs = {};
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
		let { confirmpassWord, passWord } = this.state.signIn_Values;
		if (passWord === "" || passWord === null || passWord === undefined) {
			Alert.alert("EzPz Local", "Please enter Password Address");

		} else if (confirmpassWord === "" || confirmpassWord === null || confirmpassWord === undefined) {
			Alert.alert("EzPz Local", "Please enter Password Address");

		} 
		else if (passWord !== confirmpassWord) {
			Alert.alert("EzPz Local", "Password you confimed does not match");

		} else {
			dismissKeyboard();
			var data = {"password":passWord, "passwordConfirmation":confirmpassWord,"code":this.state.code}
			// this.loginAPI(this.state.email,passWord,this.state.confirmation_code);
			Auth.forgotPasswordSubmit(this.state.email,this.state.confirmation_code,passWord)
	.then((data) =>{ 
		console.log(data)
		Toast.show('Successfully Resetted your password')
		Actions.Login_form();								 
	})
	.catch(err =>{ console.log(err)
		Alert.alert(err.code, err.message);
	});
		}
	}


	loginAPI(getdata){
		var data = getdata;
		this.setState({isLoading:true})
		Auth.forgotPasswordSubmit(this.state.email,passWord,this.state.confirmation_code)
    .then(data => console.log(data))
    .catch(err => console.log(err));
    //    fetch(global.baseURL+'/auth/reset-password', {
    //         method: 'POST',
    //         headers: {
    //             'Content-Type': 'application/json'
    //         },
    //         body:JSON.stringify(data)
    //     }).then((response) => response.json())
    //         .then((responseData) => {
	// 			this.setState({isLoading:false},()=>{

	// 				if(responseData.statusCode == 400){
	// 					Alert.alert('Club19', responseData.message)
	// 				}else if (responseData.statusCode == 403){
	// 					Alert.alert('Club19', responseData.message)
	
	// 				}else{
	// 					 Toast.show('Successfully Resetted your password')
	// 					 if(this.props.item){
	// 						Actions.Login_form({item:this.props.item,desc:this.props.desc,restData:this.props.restData});
	// 						}
	// 						else{
	// 							Actions.Login_form();
	// 						}
	// 					this.setState({ scrollTo: 0 })
	// 				}
					
	// 	  })
	// 			}).catch((error) =>{
    //     console.error(error);
    //   }) 
}
confirm_ShowPassword = () => {
	this.setState({ confirmshowPassword: !this.state.confirmshowPassword })
}
SignIn_Method = () => {
	if(this.props.item){
		Actions.Login_form({item:this.props.item,desc:this.props.desc,restData:this.props.restData});
		}
		else{
			Actions.Login_form();
		}
	this.setState({ scrollTo: 0 })
}
	render() {
		console.log('render')
		return (
			<ImageBackground
				source={localIcons.userAccountbgImg}
				style={styles.container}
				imageStyle={{ resizeMode: 'cover' }}>
				<View style={this.state.isLoading ? [{opacity:0.5},styles.container]:styles.container} pointerEvents={this.state.isLoading? "none":"auto"}>

					<View style={styles.logoView}>
						<Image source={localIcons.applogo} style={styles.logoImgStyles} />
					</View>

					<View style={styles.userTextinputsView}>

						<View style={styles.freshlyView}>
							<Text numberOfLines={2} style={styles.freshlyText}>Reset Password</Text>
						</View>
						<ScrollView style={styles.container} ref="scrollView" >
							<View style={styles.container_TextInputs}>

							<View style={styles.SectionStyle}>
									<Icon name="lock" size={25} style={styles.iconStyles} />
									<TextInput
										style={styles.textInputStyles}
										placeholder="Confirmation Code"
										placeholderTextColor="darkgrey"
										returnKeyType={"next"}
										secureTextEntry={true}
										underlineColorAndroid="transparent"
										blurOnSubmit={false}
										ref={input => { this.inputs["one"] = input; }}
										autoCapitalize={"none"}
										secureTextEntry={this.state.showPassword}
										autoCorrect={false}
										onChangeText={(confirmation_code)=>this.setState({confirmation_code})}
										value={this.state.confirmation_code}
										onSubmitEditing={() => { this.focusNextField("two"); }} />								
								</View>	

							<View style={styles.SectionStyle}>
									<Icon name="lock" size={25} style={styles.iconStyles} />
									<TextInput
										style={styles.textInputStyles}
										placeholder="Password"
										placeholderTextColor="darkgrey"
										returnKeyType={"next"}
										secureTextEntry={true}
										underlineColorAndroid="transparent"
										blurOnSubmit={false}
										ref={input => { this.inputs["two"] = input; }}
										autoCapitalize={"none"}
										secureTextEntry={this.state.showPassword}
										autoCorrect={false}
										onChangeText={this.handleChange.bind(this, "passWord")}
										value={this.state.signIn_Values.passWord}
										onSubmitEditing={() => { this.focusNextField("two"); }} />
									<Icon name="eye" size={20} style={styles.iconStyles} onPress={this.show_Password} value={!this.state.showPassword} />
								</View>

								<View style={styles.SectionStyle}>
									<Icon name="lock" size={25} style={styles.iconStyles} />
									<TextInput
										style={styles.textInputStyles}
										placeholder={"Confirm Password"}
										placeholderTextColor={"darkgrey"}
										returnKeyType={"done"}
										secureTextEntry={true}
										underlineColorAndroid="transparent"
										blurOnSubmit={false}
										ref={input => { this.inputs["three"] = input; }}
										autoCapitalize={"none"}
										secureTextEntry={this.state.confirmshowPassword}
										autoCorrect={false}
										onChangeText={this.handleChange.bind(this, "confirmpassWord")}
										value={this.state.signIn_Values.confirmpassWord}
										onFocus={this.inputFocused.bind(this, 'confirmpassWord')} 
										onSubmitEditing={()=>dismissKeyboard()}/>
									<Icon name="eye" size={20} style={styles.iconStyles} onPress={this.confirm_ShowPassword} value={!this.state.confirmshowPassword} />
								</View>

								<TouchableOpacity style={styles.login_buttonStyle} onPress={()=>this.signInas_Guest()}>
									<Text style={styles.loginText}> Reset Password </Text>
								</TouchableOpacity>


							</View>

						</ScrollView>
					</View>

					<View style={styles.buttonsView}>
					</View>

					<View style={styles.fottorView} >
						<TouchableOpacity onPress={this.SignIn_Method}>
							<Text>
								<Text style={styles.signUp_text_not_mem}> Back to Home?</Text>
								<Text style={styles.signUp_Text}>Login In</Text>
							</Text>
						</TouchableOpacity>
					</View>


				</View>
			</ImageBackground>
		);
	}
};
