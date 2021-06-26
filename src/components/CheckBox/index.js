import React from 'react'
import { StyleSheet, View } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import { standardColors } from '@assets/config/localdata';
const styles = StyleSheet.create({
  container: {
    height: verticalScale(15),
    width: scale(15),
    borderWidth: 1,
    borderColor: standardColors.appDarkBrownColor,
    justifyContent: 'center', alignItems: 'center',
  },
  checkIcon:{

  }
})
const CheckBox = (props) => {
  const { style = {}, isChecked = false } = props
  return (
    <View style={[styles.container, style]}>
      { isChecked && 
        <Icon name="check" size={moderateScale(15)} color={standardColors.appGreenColor} />
      }
    </View>
  )
}

export default CheckBox