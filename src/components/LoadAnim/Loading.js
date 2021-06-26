import React, { Component } from 'react';
import { StyleSheet, View, Image, Text, Dimensions } from 'react-native';
import Modal from 'react-native-modal';
import LottieView from 'lottie-react-native';

const deviceWidth = Dimensions.get("window").width;
var deviceHeight = Dimensions.get('window').height;

class Loading extends Component {
    constructor(props) {
        super(props);
        this.state = {
            large: false,
            submitButtons: true,
            loadingButton: true,
            animation: null,

        };
        this.toggleLarge = this.toggleLarge.bind(this);
    }
    toggleLarge() {
        this.setState({
            large: !this.state.large,
        });
    }
    render() {
        return (
            <Modal
                isVisible={this.props.loadingStatus}
                transparent={true}
                swipeArea={50}
                backdropOpacity={0.8}
                animationType='fade'
                animationIn='slideInDown'
                animationOut='slideOutDown'
                hideModalContentWhileAnimating={true}
                deviceWidth={deviceWidth}
                deviceHeight={deviceHeight}
                className={'modal-lg ' + this.props.className + ' loading-model'}>
                <View style={styles.modalContent}>
                     <LottieView source={require('./loader.json')} autoPlay loop />
                </View>
            </Modal>
        );
    }
}
const styles = StyleSheet.create({
    modalContent: {
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        flexDirection: 'row',
        borderRadius: 20,
        width: 220,
        height: 220

    },
    loadingAnimation: {
        textAlign: 'center',
        color: '#aaa'
    },
    img: {
        width: 200,
        height: 200
    }
});
export default Loading
