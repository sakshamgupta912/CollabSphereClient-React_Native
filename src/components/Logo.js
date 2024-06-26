import React from 'react'
import { Image, StyleSheet } from 'react-native'

export default function Logo(props) {
  
  return <Image source={require('../assets/logo.png')} style={styles.image} />
}

const styles = StyleSheet.create({
  image: {
    width: 300,
    height: 150,
    marginBottom: 2,
  },
})
