import React, { Component } from 'react';
var dismissKeyboard = require("dismissKeyboard");
import {
    Alert, View, Text, ScrollView, Image, AsyncStorage, TextInput, KeyboardAvoidingView, TouchableWithoutFeedback,
    TouchableOpacity, Platform, StyleSheet
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import { localIcons, standardText, standardColors } from '../assets/config/localdata';
import { emailValidation } from '../assets/config/constants';
import styles from '../assets/styles/styles';
import CustomNavbar from "./CustomNavbar/index";
import MiniHeader from "./miniHeader";
import PageFooter from "./Page/PageFooter";
import Page from '@page';
import config from '../../config';
import Toast from 'react-native-simple-toast';
import ImagePicker from 'react-native-image-picker';
import { Content } from 'native-base';
import { API, Storage } from "aws-amplify";
import Loading from "./LoadAnim/Loading";

const localStyle = StyleSheet.create({
    mini: {
        height: 35,
        backgroundColor: standardColors.appGreenColor,
        justifyContent: 'center',
        alignItems: 'center',
    },
})

export default class ProfileDetails extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userProfileDetails: { firstName: '', lastName: '', phone: '', address: '', city: '', zipCode: '' ,picture:''},
            userData: props.userData, avatarSource: null, loader: false
        };
        this.focusNextField = this.focusNextField.bind(this);
        this.inputs = [];
    }
    getUser=async()=> {
        this.setState({ loader: true });
        this.setState({ userData: await API.get("get", "/api/get/usersTable/" + this.state.userData.id, {}), loader: false },async () => {
            await AsyncStorage.setItem('UserData', this.state.userData);
            console.log(this.state.userData)
            console.log(JSON.parse(await AsyncStorage.getItem("UserData")))
            this.mount();
        })
      }
      mount= async()=>{
        this.setState({ loader: true })
        this.jwt = this.state.userData.jwt;
        const { userData } = this.state;
        let profile = this.state.userProfileDetails;
        profile.firstName = userData.firstName;
        profile.lastName = userData.lastName;
        profile.phone = userData.phone;
        profile.picture = userData.picture;
        profile.address = userData.address? userData.address:null;
        profile.city = userData.city? userData.city:null;
        if (!userData.zipcode) {
            profile.zipCode =null;
        }
        else {
            profile.zipCode = userData.zipcode.toString();
        }
        this.setState({ userProfileDetails: profile, loader: false },()=>{
            console.log(this.state.userProfileDetails)
        })
      }
    componentWillMount = async () => {
        if(this.state.userData==null){
            this.getUser();
        }
        else{
            this.mount()
            console.log(this.state.userData)

        }
    }

    handleChange(name, e) {
        var change = this.state.userProfileDetails;
        var stringVal = e;
        change[name] = stringVal;
        this.setState({ userProfileDetails: change });
    }
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
    uploadToStorage = (pathToImageFile) => { 
        fetch(pathToImageFile).then(response =>{
            response.blob().then(blob => {
                console.log(blob)
                Storage.put(blob.data.name, blob, { contentType: 'image/jpeg', }).then(
                    res=>{
                        console.log(res);
                        let data=this.state.userProfileDetails
                        data.picture=blob.data.name;
                        this.setState({userProfileDetails:data},()=>{
                            this.loginAPI(this.state.userProfileDetails);
                        })
                    }
                ).catch(e => {
                    Alert.alert('Image Upload fail','Something went wrong while uploading profile, please upload again')
                    console.log(e)
                }) 
            }).catch(err => {console.log(err) })
        }).catch (err => {console.log(err) })
    }
    async submitMethod(){
        let { firstName, lastName, phone, address, city, zipCode } = this.state.userProfileDetails;
        if (firstName == null || firstName == '' || firstName == undefined) {
            Alert.alert('EzPz Local', 'Please enter First Name');
        }
        else if (!this.nameMatch(firstName)) {
            Alert.alert("EzPz Local", "First name should be string")
        }
        else if (lastName == null || lastName == '' || lastName == undefined) {
            Alert.alert('EzPz Local', 'Please enter Last Name')
        }
        else if (!this.nameMatch(lastName)) {
            Alert.alert("EzPz Local", "Last name should be string")
        }
        else if (phone == null || phone == '' || phone == undefined) {
            Alert.alert('EzPz Local', 'Please enter Phone');
        }
        else if (!this.phoneValidation(phone) ) {
            Alert.alert("EzPz Local", "Please enter valid phone number");
        }
        else if(phone.length!=10){
            Alert.alert("EzPz Local", "Please enter valid phone number");
        }
        else {
            dismissKeyboard();
            if (this.state.avatarSource !== null) {
                if (this.state.avatarSource.fileName === undefined || this.state.avatarSource.fileName === null || this.state.avatarSource.fileName === '') {
                    const file={
                        name: Platform.OS=== "android"?this.state.avatarSource.fileName:'Date' + new Date() + '.jpg',
                        type: this.state.avatarSource.type,
                        uri:this.state.avatarSource.uri
                    };
                    this.uploadToStorage(file.uri)
                }
                else {
                    const file={
                        name: this.state.avatarSource.fileName,
                        type: this.state.avatarSource.type,
                        uri: this.state.avatarSource.uri
                    };
                    this.uploadToStorage(file.uri)
                }
            }
            this.loginAPI(this.state.userProfileDetails);
        }

    }

    loginAPI=async(getdata) =>{
        console.log('Login')
        this.setState({ loading: true })
        data1={
            entityData:getdata
        }
        API.put("put", "/api/update/usersTable/"+this.state.userData.id, {
            body: data1
          }).then(res =>{
              console.log(res)
            this.setState({ loading: false });
            AsyncStorage.setItem("UserData", JSON.stringify(res));
            this.setState({ userData: res, avatarSource: null });
            Toast.show('Successfully updated your profile')
          }).catch(e=>{
            this.setState({ loading: false });
          })
    }

    editProfileMethod() {
        alert('editProfile')
    }
    imageupload() {
        const options = {
            title: "Select the Profile Picture",
            takePhotoButtonTitle: 'Take Photo...',
            chooseFromLibraryButtonTitle: 'Choose from Library..',
            noData: true,
            quality: 0.2
        }
        ImagePicker.showImagePicker(options, (response) => {
            console.log(response)
            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            } else {
                this.setState({
                    avatarSource: response
                },()=>{
                    console.log(this.state.avatarSource)
                }
                 );
            }
        });
    }
    picture() {
        if (this.state.avatarSource === null) {
            console.log('picture');
            if (this.state.userData.picture && this.state.userData.picture !== 'NULL') {
                return { uri: config.s3.URL + this.state.userData.picture };
            }
            else {
                return localIcons.settingsProfileImg;
            }
        }
        else {
            return { uri: this.state.avatarSource.uri};
        }

    }

    render() {

        return (
            <Page>
                <Loading loadingStatus={this.state.loading} />
                <CustomNavbar />
                <View style={this.state.loader ? [{ opacity: 0.5 }, localStyle.mini] : localStyle.mini} pointerEvents={this.state.loader ? "none" : "auto"}>
                    <Text style={styles.menubuttonText}>{standardText.editText}</Text>
                    <View style={{ width: 30 }} />
                </View>
                <Content>
                    <ScrollView scrollEnabled={true} style={{ flexGrow: 1 }} keyboardShouldPersistTaps='never' keyboardDismissMode='on-drag'>
                        <View style={this.state.loader ? [{ opacity: 0.5 }, styles.profileMainView] : styles.profileMainView} pointerEvents={this.state.loader ? "none" : "auto"}>
                            <View style={[styles.profilesubView, { marginBottom: 50 }]}>
                                <TouchableOpacity style={styles.profileView} onPress={() => this.imageupload()}>
                                    <Image style={styles.profileDetailsImg} source={this.picture()} />
                                    <Text style={styles.profileUsrname}>{this.state.userData.firstName}{' '}{this.state.userData.lastName}</Text>
                                </TouchableOpacity>
                                <View style={styles.profilesplitView}>
                                    <View style={styles.rowsplitView}>
                                        <View style={styles.halfsplitView}>
                                            <TextInput
                                                placeholder="First Name"
                                                textAlignVertical={'top'}
                                                autoCapitalize={"none"}
                                                autoCorrect={false}
                                                keyboardType={"default"}
                                                allowFontScaling={false}
                                                underlineColorAndroid={"transparent"}
                                                ref={input => { this.inputs["one"] = input; }}
                                                onSubmitEditing={() => { this.focusNextField("two"); }}
                                                style={[styles.textInputStyle]}
                                                onChangeText={this.handleChange.bind(this, 'firstName')}
                                                value={this.state.userProfileDetails.firstName}
                                            />
                                        </View>
                                        <View style={styles.halfsplitView}>
                                            <TextInput
                                                placeholder="Last Name"
                                                textAlignVertical={'top'}
                                                autoCorrect={false}
                                                keyboardType={"default"}
                                                underlineColorAndroid={"transparent"}
                                                allowFontScaling={false}
                                                ref={input => { this.inputs["two"] = input; }}
                                                onSubmitEditing={() => { this.focusNextField("three"); }}
                                                onChangeText={this.handleChange.bind(this, 'lastName')}
                                                value={this.state.userProfileDetails.lastName}
                                                style={[styles.textInputStyle]}
                                            />
                                        </View>
                                    </View>

                                    <TextInput
                                        placeholder="Phone"
                                        textAlignVertical={"top"}
                                        autoCorrect={false}
                                        keyboardType={"phone-pad"}
                                        underlineColorAndroid={"transparent"}
                                        allowFontScaling={false}
                                        ref={input => { this.inputs["three"] = input; }}
                                        minLength={10}
                                        maxLength={10}
                                        onSubmitEditing={() => { this.focusNextField("four"); }}
                                        onChangeText={this.handleChange.bind(this, 'phone')}
                                        value={this.state.userProfileDetails.phone}
                                        style={styles.textInputStyle}
                                    />
                                    <TextInput
                                        placeholder="Address"
                                        textAlignVertical={"top"}
                                        autoCorrect={false}
                                        keyboardType={"default"}
                                        underlineColorAndroid={"transparent"}
                                        allowFontScaling={false}
                                        ref={input => { this.inputs["four"] = input; }}
                                        onSubmitEditing={() => { this.focusNextField("six"); }}
                                        onChangeText={this.handleChange.bind(this, 'address')}
                                        value={this.state.userProfileDetails.address}
                                        style={styles.textInputStyle}
                                    />
                                    <View style={styles.rowsplitView}>
                                        <View style={styles.halfsplitView}>
                                            <TextInput
                                                placeholder="City"
                                                textAlignVertical={"top"}
                                                autoCorrect={false}
                                                keyboardType={"default"}
                                                underlineColorAndroid={"transparent"}
                                                allowFontScaling={false}
                                                ref={input => { this.inputs["six"] = input; }}
                                                onSubmitEditing={() => { this.focusNextField("seven"); }}
                                                onChangeText={this.handleChange.bind(this, 'city')}
                                                value={this.state.userProfileDetails.city}
                                                style={[styles.textInputStyle]}
                                            />
                                        </View>
                                        <View style={styles.halfsplitView}>
                                            <TextInput
                                                placeholder="Zipcode"
                                                textAlignVertical={"top"}
                                                autoCorrect={false}
                                                minLength={6}
                                                maxLength={6}
                                                keyboardType="phone-pad"
                                                underlineColorAndroid={"transparent"}
                                                allowFontScaling={false}
                                                ref={input => { this.inputs["seven"] = input; }}
                                                onSubmitEditing={() => dismissKeyboard()}
                                                onChangeText={this.handleChange.bind(this, 'zipCode')}
                                                value={this.state.userProfileDetails.zipCode}
                                                style={[styles.textInputStyle]}
                                            />
                                        </View>
                                    </View>

                                </View>
                                <TouchableOpacity style={[styles.confirmButton, { margin: 10 }]} onPress={() => {
                                    this.submitMethod()
                                }}>
                                    <Text style={styles.confirmButtonText}>Submit</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </ScrollView>
                </Content>
            </Page>


        );
    }
}

