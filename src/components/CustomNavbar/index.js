import React from 'react'
import { TouchableOpacity, View, Image, StyleSheet } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome';
import { localIcons, standardColors, standardText } from '../../assets/config/localdata';
import { Actions } from 'react-native-router-flux';
const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: standardColors.appDarkBrownColor,
    paddingVertical: 10
  },
  headerLogo: {
    height: 70
  },
  hamburgWrapper: {
    position: 'absolute',
    left: 0,
    alignItems: 'center',
    padding: 20
  }
})
const CustomNavbar = (props) => {
  const { onPress } = props
  console.log(standardText.tabMenu)
  return (
    <View style={styles.container}>
      <Image source={localIcons.applogo} style={styles.headerLogo} resizeMode='contain' />
      <View style={styles.hamburgWrapper}>
        <TouchableOpacity onPress={() => { Actions.BottomTabsView({ paramData: standardText.tabMenu }) }}>
          <Icon name="bars" size={25} color={standardColors.white} />
        </TouchableOpacity>
      </View>
    </View>
  )
}
export default CustomNavbar