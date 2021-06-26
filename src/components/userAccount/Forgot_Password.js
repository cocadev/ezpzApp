import React, { Component } from 'react';
import { ScrollView, StyleSheet, ImageBackground, Text, View, TextInput, Image, Platform, TouchableOpacity, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
var dismissKeyboard = require("dismissKeyboard");
import styles from './styles';
import { localIcons } from '../../assets/config/localdata';
import { Actions } from 'react-native-router-flux';
import Toast from 'react-native-simple-toast';
import Loader from '../Loader';
import { Auth, API } from "aws-amplify";


export default class ForgotPassword_form extends Component {
	constructor(props) {
		super(props);
		this.state = {
			emailAddress: '' ,
			newpassword:'',
			confirmationcode:'',
			scrollTo: 0,code:0,isLoading:false,
			conformation:true,
			showPassword:true
		}
		this.inputs = {};
	}

	handleChange(name, e) {
		var change = this.state.forgotPassword_Values;
		var string1 = e;
		change[name] = string1;
		this.setState({ forgotPassword_Values: change });
	}

	emailValidation = email => {
		var re = /^([a-zA-Z0-9_.-])+@([a-zA-Z0-9_.-])+\.([a-zA-Z])+([a-zA-Z])+/;
		return re.test(email);
	};

	submit_email = () => {
		dismissKeyboard();
		let { emailAddress } = this.state;
		if (emailAddress === "" || emailAddress === null || emailAddress === undefined) {
			Alert.alert("EzPz Local", "Please enter e-mail");

		} else if (!this.emailValidation(emailAddress)) {
			Alert.alert("EzPz Local", "Please enter valid e-mail");
		} else {
			dismissKeyboard();
			this.setState({ scrollTo: 0 })
			dismissKeyboard();
			
			Auth.forgotPassword(emailAddress)
			.then(res => {			
				Actions.Reset({email:emailAddress})		 
			})	
			.catch(err => {
				Alert.alert("EzPz Local", err.message);
			});		

		// 	var data = {"email":emailAddress}
		//    this.loginAPI(emailAddress);
		 // this.setState({conformation:false});
		 // this.loginAPI();
		}
	}
	loginAPI(getdata){
		var data = getdata;
		this.setState({conformation:false});
		
	// 	console.log(data,global.baseURL+'/auth/forgot-password')
    //    fetch(global.baseURL+'/auth/forgot-password', {
	// 		method: 'POST',
	// 		headers: {
    //             'Content-Type': 'application/json'
    //         },
    //         body:JSON.stringify(data)
    //     }).then((response) => response.json())
    //         .then((responseData) => {
	// 			this.setState({isLoading:false},()=>{
	// 				console.log(responseData)
	// 				if(responseData.statusCode == 400){
	// 					Alert.alert('Club19', responseData.message)
	// 				}else if (responseData.statusCode == 403){
	// 					Alert.alert('Club19', responseData.message)
	
	// 				}else if(responseData.statusCode== 200){
	// 					this.setState({code:responseData.code},()=>{
	// 						if(this.props.item){
	// 							Actions.Reset({item:this.props.item,desc:this.props.desc,code:this.state.code,restData:this.props.restData});
	// 							}
	// 							else{
	// 								Actions.Reset({code:this.state.code});
	// 							}
	// 						this.setState({ scrollTo: 0 })
	// 					})
	// 				}
					
	// 	  })
	// 			}).catch((error) =>{
    //     console.error(error);
    //   }) 
}


	goSignUp_Method = () => {
	//	alert("signUp as method")
	if(this.props.item){
		Actions.SignUp_form({item:this.props.item,desc:this.props.desc,restData:this.props.restData});
		}
		else{
			Actions.SignUp_form();
		}
		this.setState({ scrollTo: 0 })
	}

	show_Password = () => {
		this.setState({ showPassword: !this.state.showPassword });
	}

	submit_newpass(){
const{emailAddress,confirmationcode,newpassword}=this.state
console.log(emailAddress,confirmationcode,newpassword);
Actions.Reset({code:this.state.code});


	}


	render() {
		console.log('hi')
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
						<Text numberOfLines={2} style={styles.freshlyText}>Forgot Password</Text>
					</View>
					<ScrollView style={styles.container} ref="scrollView" >
					
						<View style={styles.container_TextInputs}>
							<View style={styles.SectionStyle}>
								<Icon name="envelope" size={20} style={styles.iconStyles} />
								<TextInput
									style={styles.textInputStyles}
									placeholder="Enter Your Email Id"
									blurOnSubmit={false}
									returnKeyType={'next'}
									placeholderTextColor="darkgrey"
									autoCapitalize={"none"}
									autoCorrect={false}
									underlineColorAndroid="transparent"
									ref={input => { this.inputs["one"] = input; }}
									onChangeText={(emailAddress)=>{this.setState({emailAddress})}}
									value={this.state.emailAddress}
									onSubmitEditing={() => { dismissKeyboard() }}
								/>
							</View>
							<TouchableOpacity style={styles.login_buttonStyle} onPress={()=>this.submit_email()}>
								<Text style={styles.loginText}> SUBMIT </Text>
							</TouchableOpacity>
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
			</ImageBackground>
		);
	}
};


