import React, { useState } from 'react'
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Image,
  TextInput,
} from 'react-native'
import Icon from 'react-native-ico-material-design'

export default MemeberCard = (props) => {
  const item = props

  return (
    <View style={styles.container}>
      <View style={styles.itemContainer}>
        <View >
          <Icon
            name="round-account-button-with-user-inside"
            style={styles.image}
            height="40"
            width="40"
          />
        </View>

        <View style={styles.textContainer}>
          <Text style={styles.nameText}>{item.name}</Text>
          <Text style={styles.emailText}>{item.email}</Text>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    margin: 6,
    borderRadius: 15,
  },

  itemContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  image: {
    width: 40,
    height: 40,
    borderRadius: 24,
  },
  textContainer: {
    marginLeft: 16,
  },
  nameText: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  emailText: {
    fontSize: 13,
    color: '#999',
  },
})
