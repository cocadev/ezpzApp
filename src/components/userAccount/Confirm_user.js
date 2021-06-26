import React, { Component } from 'react';
import { ScrollView, AsyncStorage, ImageBackground, Text, View, TextInput, Image, Platform, TouchableOpacity, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
var dismissKeyboard = require("dismissKeyboard");
import styles from './styles';
import { localIcons } from '../../assets/config/localdata';
import { Actions } from 'react-native-router-flux';
import { Auth,API} from "aws-amplify";
import Toast from 'react-native-simple-toast';
import Loading from "../LoadAnim/Loading";


export default class Confirm_user extends Component {
	constructor(props) {
		super(props);
		this.state = {
			forgotPassword_Values: { code: '' },
			scrollTo: 0,code:0,isLoading:false
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

	submit_Method = async() => {
        dismissKeyboard();
        this.setState({isLoading:true})
		let { code } = this.state.forgotPassword_Values;
			dismissKeyboard();
			this.setState({ scrollTo: 0 })
            await Auth.confirmSignUp(this.props.email, code).then( async data => {
				this.loginAPI()
                }).catch(e =>{
                    this.setState({isLoading:false});
                    Alert('EzPz Local',e.message);
                    console.log(e)
                })
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
		let { email, password } = this.props;
		try {
			let userData = await Auth.signIn(email, password);
			AsyncStorage.setItem("UserId", userData.username);
			let data = await this.getUser(userData.username);
			AsyncStorage.setItem("UserData", JSON.stringify(data));
			this.getcardList(data);
		} catch (e) {
			console.log(e);
			this.setState({isLoading:false});
			setTimeout(()=>{
				Alert.alert('EzPz Local', e.message)
			},1000)
		}
}
getUser(userId) {
  return API.get("get", "/api/get/usersTable/"+userId,{});
}

	goSignUp_Method = () => {
	//	alert("signUp as method")
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
			<View style={this.state.isLoading ? [{opacity:0.5},styles.container]:styles.container} pointerEvents={this.state.isLoading? "none":"auto"}>

				<View style={styles.logoView}>
					<Image source={localIcons.applogo} style={styles.logoImgStyles} />
				</View>

				<View style={styles.userTextinputsView}>

					<View style={styles.freshlyView}>
						<Text numberOfLines={2} style={styles.freshlyText}>CONFIRMATION</Text>
					</View>
					<ScrollView style={styles.container} ref="scrollView" >
						<View style={styles.container_TextInputs}>

							<View style={styles.SectionStyle}>
								<Icon name="envelope" size={20} style={styles.iconStyles} />
								<TextInput
									style={styles.textInputStyles}
									placeholder="Enter Your code"
									blurOnSubmit={false}
									returnKeyType={'next'}
									placeholderTextColor="darkgrey"
									autoCapitalize={"none"}
									autoCorrect={false}
									underlineColorAndroid="transparent"
									ref={input => { this.inputs["one"] = input; }}
									onChangeText={this.handleChange.bind(this, "code")}
									value={this.state.forgotPassword_Values.code}
									onSubmitEditing={() => { dismissKeyboard() }}
								/>
							</View>

							<TouchableOpacity style={styles.login_buttonStyle} onPress={()=>this.submit_Method()}>
								<Text style={styles.loginText}> SUBMIT </Text>
							</TouchableOpacity>

						</View>

					</ScrollView>
				</View>


				<View style={styles.buttonsView}>
				</View>

				<View style={styles.fottorView} >
					<TouchableOpacity onPress={this.goSignUp_Method}>
                    <Text style={styles.signUp_text_not_mem}> Have an account?</Text>
								<Text style={styles.signUp_Text}> Sign In</Text>
					</TouchableOpacity>
				</View>


			</View>
            <Loading loadingStatus={this.state.isLoading} />
			</ImageBackground>
		);
	}
};


