import React from 'react'
import { useState, useEffect, useRef } from 'react'
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native'
import Icon from 'react-native-ico-material-design'
import HomeCard from '../../components/HomeCard'
import TextInput from '../../components/TextInput'
import { ScrollView, RefreshControl } from 'react-native-gesture-handler'
import theme from '../../core/theme'
import axios from '../../api/axios'
import AsyncStorage from '@react-native-async-storage/async-storage' // Import AsyncStorage
import { ActivityIndicator } from 'react-native-paper'
import { Title } from 'react-native-paper'
import {
  BottomSheetModal,
  BottomSheetModalProvider,
} from '@gorhom/bottom-sheet'
import Button from '../../components/Button'


const AssignmentScreen = () => {

  const [token, setToken] = useState()
  const [uid, setUID] = useState()
  
  async function auth() {
    try {
      const t = await AsyncStorage.getItem('token')
      const u = await AsyncStorage.getItem('uid')
    
      setToken(t)
      setUID(u)
    } catch (e) {
      console.log('Auth function error: ' + e)
    }
  }
  useEffect(() => {
    auth()
  }, [])

  console.log('Token: ' + token)
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text>Assignment Screen</Text>
    </View>
  );
};
export default AssignmentScreen;