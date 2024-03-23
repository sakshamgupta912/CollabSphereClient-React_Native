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

const HomeScreen = () => {
  const [roomCollection, setRoomCollection] = useState(null)
  const [loading, setLoading] = useState(true) // Manage loading state
  const [token, setToken] = useState()
  const [uid, setUID] = useState()
  const [refreshing, setRefreshing] = useState(false) // Manage refreshing state

  const CreateRoomBottomSheetModalRef = useRef(null)
  const EnterRoomSheetModalRef = useRef(null)
  const snapPoints = ['48%']

  const handleCreateRoomButtonPress = () => {
    CreateRoomBottomSheetModalRef.current?.present()
  }
  const handleEnterRoomButtonPress = () => {
    EnterRoomSheetModalRef.current?.present()
  }

  // Add a function to close the Create Room BottomSheetModal
  const closeCreateRoomBottomSheet = () => {
    CreateRoomBottomSheetModalRef.current?.close()
  }

  // Add a function to close the Enter Room BottomSheetModal
  const closeEnterRoomBottomSheet = () => {
    EnterRoomSheetModalRef.current?.close()
  }

  const CreateRoomSheet = () => {
    const [createdRoomName, setCreatedRoomName] = useState({
      value: '',
      error: '',
    })
    const handleCreateRoom = async () => {
      try {
        if (createdRoomName.value.length === 0) {
          setCreatedRoomName((prevState) => ({
            ...prevState,
            error: 'Room name should not be empty!',
          }))
        } else {
          const response = await axios.post(
            '/api/teams/createTeams',
            JSON.stringify({ name: createdRoomName.value }),
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
            // Handle success - maybe navigate to another screen

            closeCreateRoomBottomSheet()
            setCreatedRoomName('')
            getTeams()
            console.log('Room Created') // Clear error
            // Optionally, you can navigate to another screen here
          }
        }
      } catch (error) {
        setCreatedRoomName((prevState) => ({
          ...prevState,
          error: 'Error creating room: ' + error.message,
        }))

        // Handle error, maybe set error state to display to the user
      }
    }

    return (
      <View style={styles.createRoomBottomSheet}>
        <Title> Create Room </Title>
        <TextInput
          label="Enter Room Name"
          returnKeyType="next"
          value={createdRoomName.value}
          onChangeText={(text) =>
            setCreatedRoomName((prevState) => ({
              ...prevState,
              value: text,
              error: '',
            }))
          }
          error={!!createdRoomName.error}
          errorText={createdRoomName.error}
        />

        <Button
          labelStyle={{ color: '#ffffff' }}
          mode="contained"
          onPress={handleCreateRoom}
        >
          Create Room
        </Button>
      </View>
    )
  }

  function hasWhiteSpace(s) {
    return /\s/g.test(s)
  }
  const EnterRoomSheet = () => {
    const [enterRoomName, setEnterRoomName] = useState({
      value: '',
      error: '',
    })
    const handleEnterRoom = async () => {
      try {
        if (enterRoomName.value.length === 0) {
          setEnterRoomName((prevState) => ({
            ...prevState,
            error: 'Room name should not be empty!',
          }))
        } else if (enterRoomName.value.length !== 6) {
          setEnterRoomName((prevState) => ({
            ...prevState,
            error: 'Code should be 6 character long!',
          }))
        } else if (hasWhiteSpace(enterRoomName.value.length)) {
          setEnterRoomName((prevState) => ({
            ...prevState,
            error: 'Code should not contain spaces!',
          }))
        } else {
          const response = await axios.post(
            '/api/teams/joinTeam',
            JSON.stringify({ code: enterRoomName.value }),
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
            // Handle success - maybe navigate to another screen
           
            closeEnterRoomBottomSheet()
            setEnterRoomName('')
            getTeams()
            console.log('Room Entered') // Clear error
            // Optionally, you can navigate to another screen here
          }
        }
      } catch (error) {
        setEnterRoomName((prevState) => ({
          ...prevState,
          error: 'Error entering room: ' + error.message,
        }))

        // Handle error, maybe set error state to display to the user
      }
    }

    return (
      <View style={styles.createRoomBottomSheet}>
        <Title> Enter Room </Title>
        <TextInput
          label="Enter Room Name"
          returnKeyType="next"
          value={enterRoomName.value}
          onChangeText={(text) =>
            setEnterRoomName((prevState) => ({
              ...prevState,
              value: text,
              error: '',
            }))
          }
          error={!!enterRoomName.error}
          errorText={enterRoomName.error}
        />

        <Button
          labelStyle={{ color: '#ffffff' }}
          mode="contained"
          onPress={handleEnterRoom}
        >
          Enter Room
        </Button>
      </View>
    )
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

  useEffect(() => {
    getTeams()
  }, [uid, token])

  // Function to handle pull-to-refresh
  const onRefresh = () => {
    setRefreshing(true) // Set refreshing state to true when pull-to-refresh is triggered
    getTeams()
    setRefreshing(false) // Set refreshing state to false when pull-to-refresh is triggered
  }

  return (
    <BottomSheetModalProvider>
      <View style={styles.container}>
        <ScrollView 
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[theme.colors.primary]} // Customize the color of the refresh indicator
            />
          }
        >
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
          onPress={handleCreateRoomButtonPress}
        >
          <Icon name="add-plus-button" size={30} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.enterButton}
          onPress={handleEnterRoomButtonPress}
        >
          <Icon name="exit-to-app-button" size={30} color="#fff" />
        </TouchableOpacity>

        {/* Add Plus Bottom Sheet */}
        <BottomSheetModal
          style={styles.bottomSheet}
          backgroundStyle={{ borderRadius: 40, backgroundColor: '#f0f0f0' }}
          ref={CreateRoomBottomSheetModalRef}
          index={0}
          snapPoints={['48%']}
        >
          <CreateRoomSheet />
        </BottomSheetModal>

        {/* Enter Bottom Sheet */}
        <BottomSheetModal
          style={styles.bottomSheet}
          backgroundStyle={{ borderRadius: 40 ,backgroundColor: '#f0f0f0' }}
          ref={EnterRoomSheetModalRef}
          index={0}
          snapPoints={snapPoints}
        >
          <EnterRoomSheet />
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
  createRoomBottomSheet: {
    flex: 1,

    alignItems: 'center',
  },
  enterRoomBottomSheet: {
    flex: 1,

    alignItems: 'center',
  },
})

export default HomeScreen
