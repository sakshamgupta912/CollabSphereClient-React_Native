import React from 'react'
import { Image, StyleSheet } from 'react-native'

export default function ManReadingBook() {
  return <Image source={require('../assets/ManReadingBook.png')} style={styles.image} />
}

const styles = StyleSheet.create({
  image: {
    width: 350,
    height: 350,
    marginBottom: 3,
  },
})
