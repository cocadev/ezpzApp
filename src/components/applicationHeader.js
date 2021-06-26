import React, { Component } from 'react';
import { Text, View, ScrollView, StyleSheet, Image, TouchableOpacity, ImageBackground } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
//import { Actions } from 'react-native-router-flux';
// import MenuModelView from './menuModel/modelMain_View';
// import HomeGridView from './menuModel/home_View'
import { localIcons, standardText, standardColors } from '../assets/config/localdata';

export default class ApplicationHeader extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    render() {
        return (
            <View style={styles.menuHeaderView}>
                <TouchableOpacity style={styles.IconView} onPress={() => { this.props.selectFooterTab(standardText.tabMenu) }}>
                    <Icon name="bars" size={25} color='white' />
                </TouchableOpacity>
                <View style={styles.logoView}>
                    <Image source={localIcons.applogo}
                        style={styles.ImgStyles} />
                </View>
                <View style={styles.IconView} />
            </View>
        );
    }
}





const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center' },
    menuHeaderView: { flex: 1, flexDirection: 'row', justifyContent: 'center', marginHorizontal: 15 },
    IconView: { flex: 0.15, justifyContent: 'center' },
    logoView: { flex: 0.70, justifyContent: 'center', alignItems: 'center', margin: 8 },
    ImgStyles: { height: 70, width:130 },
    foodmenuSubView:{ flex: 0.76, justifyContent: 'center'},
    menuSubView:{ flex: 0.89, justifyContent: 'center'},
    menubuttonText:{fontSize:15, fontWeight:'400', textAlign:'center', color:'white'},
    menuHeaderButtonView:{height:35,marginHorizontal:4, backgroundColor:standardColors.appGreenColor, justifyContent:'center'},
    menuheadermainView: { flex: 0.13, justifyContent: 'center', backgroundColor: standardColors.appDarkBrownColor },
    footerSplitMainView: { flex: 1, marginHorizontal: 10, justifyContent: 'center', flexDirection: 'row' },
    footermainView: { flex: 0.11, backgroundColor: standardColors.appDarkBrownColor },
    footerIcon: { height: 30, width: 30 },
    footerTabIconsSplitViewChange: { flex: 0.5, justifyContent: 'center', alignItems: 'center', flexDirection: 'row', borderTopWidth: 2, borderTopColor: standardColors.appGreenColor, },
    footerTabIconsSplitView: { flex: 0.5, justifyContent: 'center', alignItems: 'center', flexDirection: 'row' },
    footerTabText: { textAlign: 'left', fontSize: 14, fontWeight: '800', color: 'white', marginLeft: 6 },
    footerTabTextChange: { textAlign: 'left', fontSize: 14, fontWeight: '800', color: standardColors.appGreenColor, marginLeft: 6 },

})
