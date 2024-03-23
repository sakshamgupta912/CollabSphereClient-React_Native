import React from 'react'
import { useState, useEffect } from 'react'
import { View, StyleSheet, TouchableOpacity , Text} from 'react-native'
import Icon from 'react-native-ico-material-design'
import HomeCard from '../../components/HomeCard'

import { ScrollView } from 'react-native-gesture-handler'
import theme from '../../core/theme'
import axios from '../../api/axios'
import AsyncStorage from '@react-native-async-storage/async-storage' // Import AsyncStorage
import { ActivityIndicator } from 'react-native-paper'
const HomeScreen = () => {
  const [roomCollection, setRoomCollection] = useState(null);
  const [loading, setLoading] = useState(true); // Manage loading state
  const [token, setToken] = useState();
  const [uid, setUID] = useState();
  async function auth() {
    try {
      const t = await AsyncStorage.getItem('token');
      const u = await AsyncStorage.getItem('uid');
      setToken(t);
      setUID(u);
    } catch (e) {
      console.log('Auth function error: ' + e);
    }
  }
  
  useEffect(() => {
    async function getTeams() {
      try {
        auth();
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
        );

        if (response.status === 200) {
          setRoomCollection(response.data);
        } else {
          console.error('Error fetching room data:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching room data:', error);
      } finally {
        setLoading(false); // Set loading to false when data fetching is complete
      }
    }

    getTeams();
  }, [uid,token]); 

  console.log(roomCollection);

  return (
    <View style={styles.container}>
    
       <ScrollView>
        {loading ? ( // Render loading indicator while loading
          <ActivityIndicator size="large" color={theme.colors.primary} />
        ) : Array.isArray(roomCollection) && roomCollection.length > 0 ? (
          roomCollection.map((room) => <HomeCard key={room._id} room={room} />)
        ) : (
          <></>
        )}
      </ScrollView>
      {/* Floating button */}
      <TouchableOpacity style={styles.createButton}>
        <Icon name="add-plus-button" size={30} color="#fff" />
      </TouchableOpacity>
      <TouchableOpacity style={styles.enterButton}>
        <Icon name="exit-to-app-button" size={30} color="#fff" />
      </TouchableOpacity>
    </View>
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
 
})

export default HomeScreen
