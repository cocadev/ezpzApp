import React from 'react'
import { Container } from 'native-base'
import { Dimensions, StyleSheet, View } from 'react-native'
import { standardColors } from '../../assets/config/localdata';
const { height, width } = Dimensions.get('screen')
const styles = StyleSheet.create({
  container: {
    // alignItems: 'center', 
    backgroundColor: standardColors.appDarkBrownColor,    
    padding: 15
  }
})
const PageFooter = (props) => {
  const { children, style = {} } = props
  return (
    <View style={[styles.container, style]}>
      {children}
    </View>
  )
}
export default PageFooter