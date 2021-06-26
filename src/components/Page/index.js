import React from 'react'
import { Container } from 'native-base'
import { Dimensions, StyleSheet } from 'react-native'
const { height, width } = Dimensions.get('screen')

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'lightgrey'
  }
})
const Page = (props) => {
  const { children, hasDefaultNavBar = true } = props
  return (
    <Container style={styles.container}>
      {children}
    </Container>
  )
}
export default Page