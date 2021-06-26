import React from 'react'
import { TouchableOpacity, StyleSheet, View, Text } from 'react-native'
// import { View, Text } from 'native-base'
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',    
    borderColor: 'white', 
    borderRadius: 2, 
    shadowOpacity: 0.6, 
    shadowRadius: 4, 
    shadowColor: 'grey'
  }
})
const CardTile = (props) => {
  const { style = {}, children } = props
  return (
    <View style={[styles.container, style]}>
      {children}
    </View>
  )
}
export default CardTile