import React, { Component } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import {localIcons, standardColors, standardText} from '../assets/config/localdata';
import styles from '../assets/styles/styles';
import { Actions, Scene, Router } from 'react-native-router-flux';
export default class MiniHeader extends Component {
  constructor(props) {
    super(props);
    this.state = {
      getText: this.props.title
    };
  }

  render() {
    return (
        <View style={localStyle.container}>
            <View style={{}}>
                <TouchableOpacity style={styles.backbuttonView} onPress={() => { Actions.pop({refresh: {}});
                setTimeout( () => {
                    // Actions.refresh({});
                },500)
                 }}>
                    {
                        !this.props.hideBackButton &&
                        <Image source={localIcons.backIcon} style={styles.backbutton}/>
                    }
                </TouchableOpacity>
            </View>
            <Text style={styles.menubuttonText}>{this.props.title}</Text>
            <View style={{width: 30}}/>
        </View>
    )

  }
}

const localStyle = StyleSheet.create({
    container: {
        height: 35,
        backgroundColor: standardColors.appGreenColor,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    }
})