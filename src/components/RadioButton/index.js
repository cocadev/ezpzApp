import React from 'react';
import { View, StyleSheet } from 'react-native';
import { standardColors } from '@assets/config/localdata';
const styles = StyleSheet.create({
  container: {
    height: 12,
    width: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: standardColors.appGreenColor,
    alignItems: 'center',
    justifyContent: 'center'
  },
  selectedItem: {
    height: 6,
    width: 6,
    borderRadius: 3,
    backgroundColor: standardColors.appGreenColor,
  }
})
const RadioButton = (props) => {
  // console.log('RadioButton: ', props)
  const { selected, style = {}, selectedItemStyle = {} } = props
  return (
    <View style={[styles.container, style]}>
      {selected ? <View style={[styles.selectedItem, selectedItemStyle]} /> : null}
    </View>
  )
}
export default RadioButton
