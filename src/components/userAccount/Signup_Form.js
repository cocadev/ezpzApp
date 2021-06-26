import React, { Component } from 'react';
import { ScrollView, Platform,SafeAreaView, ImageBackground, Text, View, TextInput, Image, AsyncStorage, TouchableOpacity, Alert, KeyboardAvoidingView } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
var dismissKeyboard = require("dismissKeyboard");
import styles from './styles';
import { localIcons } from '../../assets/config/localdata';
import { Actions } from 'react-native-router-flux';
import Toast from 'react-native-simple-toast';
import { Auth, API } from "aws-amplify";
import Loading from "../LoadAnim/Loading"

export default class SignUp_form extends Component {
	constructor(props) {
		super(props);
		this.state = {
			signUp_Values: { name: '', firstname: '', lastname: '', emailAddress: '', passWord: '', confirmpassWord: '', phoneno: '' },
			showPassword: true,
			confirmshowPassword: true,
			isLoading: false,
			scrollTo: 0
		}
		this.focusNextField = this.focusNextField.bind(this);
		this.inputs = {};
	}



	handleChange(name, e) {
		var change = this.state.signUp_Values;
		var string1 = e;
		change[name] = string1;
		this.setState({
			signUp_Values: change
		});
	}


	emailValidation = email => {
		var re = /^([a-zA-Z0-9_.-])+@([a-zA-Z0-9_.-])+\.([a-zA-Z])+([a-zA-Z])+/;
		return re.test(email);
	};
	phoneValidation = phoneno => {
		var re = /^\d+$/;
		return re.test(phoneno)
	}
	nameMatch = name => {
		var re = /^[A-Za-z ]+$/;
		return re.test(name);
	}
	focusNextField(id) {
		this.inputs[id].focus();
	}

	show_Password = () => {
		//alert("show password")
		this.setState({ showPassword: !this.state.showPassword });
	}

	confirm_ShowPassword = () => {
		this.setState({ confirmshowPassword: !this.state.confirmshowPassword })
	}

	SignUp_Method() {
		let { name, firstname, lastname, emailAddress, passWord, confirmpassWord, phoneno } = this.state.signUp_Values;
		if (firstname === "" || firstname === null || firstname === undefined) {
			Alert.alert("EzPz Local", "Please enter first name")

		}
		else if (!this.nameMatch(firstname)) {
			Alert.alert("EzPz Local", "First name should be string")
		}
		else if (lastname === "" || lastname === null || lastname === undefined) {
			Alert.alert("EzPz Local", "Please enter last name")
		}
		else if (!this.nameMatch(lastname)) {
			Alert.alert("EzPz Local", "Last name should be string")
		}
		else if (emailAddress === "" || emailAddress === null || emailAddress === undefined) {
			Alert.alert("EzPz Local", "Please enter e-mail");

		}
		else if (phoneno === "" || phoneno === undefined || phoneno === null) {
			Alert.alert("EzPz Local", "Please enter phone number");

		}
		else if (!this.emailValidation(emailAddress)) {
			Alert.alert("EzPz Local", "Please enter valid e-mail");
		}
		else if (!this.phoneValidation(phoneno)) {
			Alert.alert("EzPz Local", "Please enter valid phone number");
		}
		else if(phoneno.length!=10){
            Alert.alert("EzPz Local", "Please enter valid phone number");
        }
		else if (passWord === "" || passWord === null || passWord === undefined) {
			Alert.alert("EzPz Local", "Please enter password");
		}
		else if (confirmpassWord === "" || confirmpassWord === null || confirmpassWord === undefined) {
			Alert.alert("EzPz Local", "Please enter confirm password");
		}
		else if (confirmpassWord !== passWord) {
			Alert.alert("EzPz Local", "Password you confimed does not match");
		}

		else {
			//alert("sign In Method as guest" + emailAddress + passWord + name + confirmpassWord + phoneno)
			var data = { "id": '', "firstName": firstname, "lastName": lastname, "email": emailAddress, "phone": phoneno, "restaurantId": "global","userProfile":"C","picture":"NULL","recordStatus":true}
			var pass = { "password": passWord}
			//{email:emailAddress, passWord:passWord, userName:name, confirmpassWord:confirmpassWord, phoneNumber:phoneno}

			this.signUpAPI(data,pass);
			this.setState({ scrollTo: 0 })
		}
	}


	signUpAPI=async(getdata,pass) => {
		this.setState({ isLoading: true })
		let newUser;
		try{
		newUser = await Auth.signUp({
			username: getdata.email,
			password: pass.password
		  });
		}catch(e){
			newUser=e;
		}
		  if(newUser.code === "InvalidPasswordException") { 
				this.setState({ isLoading: false })
				setTimeout(()=>{
			Alert.alert("Invalid Password", "Minimum password length:6\n- Require at least one uppercase letter\n- Require at least one lowercase letter\n- Require at least one number\n- Require at least one nonalphanumeric character"); 
				},500);
		} else if(newUser.code === "UsernameExistsException") {
			this.setState({ isLoading: false })
			setTimeout(()=>{
				Alert.alert("User already exists",newUser.message)
			},500);
		  }
		  else if(newUser.code ==="InvalidParameterException"){
				this.setState({ isLoading: false })
				setTimeout(()=>{
			Alert.alert("User already exists",newUser.message)
				},500);
		  }
		  else{
			  getdata.id=newUser.userSub;
				this.signUp(getdata);
			}
	}
	signUp(data){
		console.log({entityData:data})
		this.setState({ isLoading: true });
    API.post("post", "/signup", { 
      body: {entityData:data}
		}).then(async (res)=>{
			console.log(res);
			this.setState({ isLoading: false });
			Toast.show('Successfully Registered,Please Login');
			if(this.props.item){
					Actions.confirmUser({email:this.state.signUp_Values.emailAddress,password:this.state.signUp_Values.passWord,item:this.props.item,desc:this.props.desc,restData:this.props.restData});
				}
				else{
						Actions.confirmUser({email:this.state.signUp_Values.emailAddress,password:this.state.signUp_Values.passWord});
				}
		}).catch(e =>{
			console.log(e)
			this.setState({ isLoading: false });
		 })
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
		return (
			<ImageBackground
				source={localIcons.userAccountbgImg}
				style={styles.container}
				imageStyle={{ resizeMode: 'cover' }}>
				<View style={this.state.isLoading ? [{ opacity: 0.5 }, styles.container] : styles.container} pointerEvents={this.state.isLoading ? "none" : "auto"}>
					<View style={styles.SignUp_logoView}>
						<Image source={localIcons.applogo} style={styles.logoImgStyles} />
					</View>

					<View style={styles.userTextinputsViewSignUp}>
						<View style={styles.container_TextInputs}>
							<KeyboardAvoidingView
								behavior={Platform.OS === "ios" ? "padding" : null}
								style={{ flex: 1 }}
							>
							<SafeAreaView>
							 <ScrollView>
								<View style={styles.SectionStyle}>
									<Icon name="user" size={20} style={styles.iconStyles} />
									<TextInput
										style={styles.textInputStyles}
										placeholder="Firstname"
										blurOnSubmit={false}
										returnKeyType={'next'}
										placeholderTextColor="darkgrey"
										autoCapitalize={"none"}
										autoCorrect={false}
										underlineColorAndroid="transparent"
										onSubmitEditing={() => { this.focusNextField("two"); }}
										ref={input => { this.inputs["one"] = input; }}
										onChangeText={this.handleChange.bind(this, "firstname")}
										value={this.state.signUp_Values.firstname}
									/>
								</View>
								<View style={styles.SectionStyle}>
									<Icon name="user" size={20} style={styles.iconStyles} />
									<TextInput
										style={styles.textInputStyles}
										placeholder="Lastname"
										blurOnSubmit={false}
										returnKeyType={'next'}
										placeholderTextColor="darkgrey"
										autoCapitalize={"none"}
										autoCorrect={false}
										underlineColorAndroid="transparent"
										onSubmitEditing={() => { this.focusNextField("three"); }}
										ref={input => { this.inputs["two"] = input; }}
										onChangeText={this.handleChange.bind(this, "lastname")}
										value={this.state.signUp_Values.lastname}
									/>
								</View>


								<View style={styles.SectionStyle}>
									<Icon name="envelope" size={18} style={styles.iconStyles} />
									<TextInput
										style={styles.textInputStyles}
										placeholder="Email"
										blurOnSubmit={false}
										returnKeyType={'next'}
										placeholderTextColor="darkgrey"
										autoCapitalize={"none"}
										autoCorrect={false}
										underlineColorAndroid="transparent"
										onSubmitEditing={() => { this.focusNextField("four"); }}
										ref={input => { this.inputs["three"] = input; }}
										onChangeText={this.handleChange.bind(this, "emailAddress")}
										value={this.state.signUp_Values.emailAddress}
									/>
								</View>
								<View style={styles.SectionStyle}>
									<Icon name="phone" size={20} style={styles.iconStyles} />
									<TextInput
										style={styles.textInputStyles}
										placeholder="Phone"
										blurOnSubmit={false}
										returnKeyType={'next'}
										placeholderTextColor="darkgrey"
										autoCapitalize={"none"}
										autoCorrect={false}
										minLength={10}
										maxLength={10}
										underlineColorAndroid="transparent"
										onSubmitEditing={() => { this.focusNextField("five"); }}
										ref={input => { this.inputs["four"] = input; }}
										onChangeText={this.handleChange.bind(this, "phoneno")}
										value={this.state.signUp_Values.phoneno}
									/>
								</View>

								<View style={styles.SectionStyle}>
									<Icon name="lock" size={20} style={styles.iconStyles} />
									<TextInput
										style={styles.textInputStyles}
										placeholder="Password"
										placeholderTextColor="darkgrey"
										returnKeyType={'next'}
										underlineColorAndroid="transparent"
										blurOnSubmit={false}
										ref={input => { this.inputs["five"] = input; }}
										autoCapitalize={"none"}
										secureTextEntry={this.state.showPassword}
										autoCorrect={false}
										onChangeText={this.handleChange.bind(this, "passWord")}
										value={this.state.signUp_Values.passWord}
										onSubmitEditing={() => { this.focusNextField("six"); }} />
									<Icon name="eye" size={20} style={styles.iconStyles} onPress={this.show_Password} value={!this.state.showPassword} />
								</View>

								<View style={styles.SectionStyle}>
									<Icon name="lock" size={20} style={styles.iconStyles} />
									<TextInput
										style={styles.textInputStyles}
										placeholder={"Confirm Password"}
										placeholderTextColor={"darkgrey"}
										returnKeyType={"done"}
										secureTextEntry={true}
										underlineColorAndroid="transparent"
										blurOnSubmit={false}
										ref={input => { this.inputs["six"] = input; }}
										autoCapitalize={"none"}
										secureTextEntry={this.state.confirmshowPassword}
										autoCorrect={false}
										onChangeText={this.handleChange.bind(this, "confirmpassWord")}
										value={this.state.signUp_Values.confirmpassWord}
										onSubmitEditing={() => dismissKeyboard()} />
									<Icon name="eye" size={20} style={styles.iconStyles} onPress={this.confirm_ShowPassword} value={!this.state.confirmshowPassword} />
								</View>
								</ScrollView>
								</SafeAreaView>
								</KeyboardAvoidingView>
							<TouchableOpacity style={styles.login_buttonStyle} onPress={() => this.SignUp_Method()}>
								<Text style={styles.loginText}> SIGN UP </Text>
							</TouchableOpacity>
						</View>
					</View>
					<View style={styles.buttonsView}>
					</View>
					<View style={styles.fottorView} >
						<TouchableOpacity onPress={this.SignIn_Method}>
							<Text>
								<Text style={styles.signUp_text_not_mem}> Have an account?</Text>
								<Text style={styles.signUp_Text}> Sign In</Text>
							</Text>
						</TouchableOpacity>
					</View>
				</View>
				<Loading loadingStatus={this.state.isLoading} />
			</ImageBackground>

		);
	}
};
