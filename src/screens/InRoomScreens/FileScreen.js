import React, { useEffect } from 'react'
import { View, Text, StatusBar, SafeAreaView } from 'react-native'
import { useRoute } from '@react-navigation/native'

const FileScreen = (props) => {
  const uid = props.route.params.uid
  const token = props.route.params.token
  const roomCode = props.route.params.roomCode
  const roomId = props.route.params.roomId
  console.log('Token '+token)
  console.log('uid '+uid)

  return <Text></Text>
}

export default FileScreen
