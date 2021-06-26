import React, { Component } from 'react';
import { View, Text, Image } from 'react-native';
import { localIcons, standardText } from '../assets/config/localdata';
import styles from '../assets/styles/styles'; 

export default class OrderSuccessful extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    render() {
        return (
            <View style={[styles.placeorderContainer,{backgroundColor:'#000000'}]}>
                <View style={styles.deliveryLogoView}>
                    <Image source={localIcons.successfulmarkLogo} style={styles.deliveryimglogo} />
                </View>
                <View style={styles.deliveryTextView}>
                    <Text numberOfLines={2} style={styles.deliveryText}>{standardText.successfullorderedText}</Text>
                </View>
                {/* <View style={[styles.deliveryTextView, { padding: 0 }]}>
                    <Text numberOfLines={2} style={styles.deliveryminiText}>{standardText.orderhasreceivedText}</Text>
                </View> */}

            </View>
        );
    }
}