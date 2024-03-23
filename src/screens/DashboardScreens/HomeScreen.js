import React from 'react'
import { useState, useEffect, useRef } from 'react'
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native'
import Icon from 'react-native-ico-material-design'
import HomeCard from '../../components/HomeCard'

import { ScrollView } from 'react-native-gesture-handler'
import theme from '../../core/theme'
import axios from '../../api/axios'
import AsyncStorage from '@react-native-async-storage/async-storage' // Import AsyncStorage
import { ActivityIndicator } from 'react-native-paper'

import {
  BottomSheetModal,
  BottomSheetModalProvider,
} from '@gorhom/bottom-sheet'

const HomeScreen = () => {
  const [roomCollection, setRoomCollection] = useState(null)
  const [loading, setLoading] = useState(true) // Manage loading state
  const [token, setToken] = useState()
  const [uid, setUID] = useState()

  const AddPlusBottomSheetModalRef = useRef(null)
  const EnterBottomSheetModalRef = useRef(null)
  const snapPoints = ['48%']

  const handleAddPlusButtonPress = () => {
    AddPlusBottomSheetModalRef.current?.present()
  }
  const handleEnterButtonPress = () => {
    EnterBottomSheetModalRef.current?.present()
  }

  

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
    async function getTeams() {
      try {
        auth()
        const response = await axios.post(
          '/api/teams/getTeams',
          {},
          {
            headers: {
              'Content-Type': 'application/json',
              authorization: `Bearer ${token}`,
              uid: uid,
            },
            withCredentials: true,
          }
        )

        if (response.status === 200) {
          setRoomCollection(response.data)
        } else {
          console.error('Error fetching room data:', response.statusText)
        }
      } catch (error) {
        console.error('Error fetching room data:', error)
      } finally {
        setLoading(false) // Set loading to false when data fetching is complete
      }
    }

    getTeams()
  }, [uid, token])

  console.log(roomCollection)

  return (
    <BottomSheetModalProvider>
      <View style={styles.container}>
        <ScrollView>
          {loading ? ( // Render loading indicator while loading
            <ActivityIndicator size="large" color={theme.colors.primary} />
          ) : Array.isArray(roomCollection) && roomCollection.length > 0 ? (
            roomCollection.map((room) => (
              <HomeCard key={room._id} room={room} />
            ))
          ) : (
            <></>
          )}
        </ScrollView>
        {/* Floating button */}
        <TouchableOpacity
          style={styles.createButton}
          onPress={handleAddPlusButtonPress}
        >
          <Icon name="add-plus-button" size={30} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.enterButton}
          onPress={handleEnterButtonPress}
        >
          <Icon name="exit-to-app-button" size={30} color="#fff" />
        </TouchableOpacity>

        {/* Add Plus Bottom Sheet */}
        <BottomSheetModal
          style={styles.bottomSheet}
          backgroundStyle={{ borderRadius: 40 }}
          ref={AddPlusBottomSheetModalRef}
          index={0}
          snapPoints={snapPoints}
        >
          <View>
            <Text>Hello Add Plus Bottom Sheet</Text>
          </View>
        </BottomSheetModal>

        {/* Enter Bottom Sheet */}
        <BottomSheetModal
          style={styles.bottomSheet}
          backgroundStyle={{ borderRadius: 40 }}
          ref={EnterBottomSheetModalRef}
          index={0}
          snapPoints={snapPoints}
        >
          <View>
            <Text>Hello Enter Bottom Sheet</Text>
          </View>
        </BottomSheetModal>
      </View>
    </BottomSheetModalProvider>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff', // Adjust background color as needed
  },
  createButton: {
    position: 'absolute',
    bottom: 20,
    right: 80,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: theme.colors.primary, // Adjust button color as needed
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3, // Add elevation for Android shadow effect
  },
  enterButton: {
    position: 'absolute',
    bottom: 20,
    right: 10,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: theme.colors.primary, // Adjust button color as needed
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3, // Add elevation for Android shadow effect
  },
  bottomSheet: {
    paddingHorizontal: 20,
    paddingVertical: 5,
  },
})

export default HomeScreen
