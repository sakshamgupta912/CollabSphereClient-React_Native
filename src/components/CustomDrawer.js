import React, { useState, useEffect } from 'react'
import { View, StyleSheet } from 'react-native'
import { createDrawerNavigator, DrawerItemList } from '@react-navigation/drawer'
import {
  Avatar,
  Title,
  Caption,
  Paragraph,
  Text,
  TouchableRipple,
  Switch,
  Drawer as PaperDrawer,
} from 'react-native-paper'
import { DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import Button from './Button'
import AsyncStorage from '@react-native-async-storage/async-storage' // Import AsyncStorage

import theme from '../core/theme'

export const CustomDrawer = ({ mainNavigation, ...props }) => {

  const [token, setToken] = useState()
  const [uid, setUID] = useState()
  const [name,setName]=useState()
  const [avatar,setAvatar]=useState()

  async function auth() {
    try {
      const t = await AsyncStorage.getItem('token')
      const u = await AsyncStorage.getItem('uid')
      const n = await AsyncStorage.getItem('name')
      const a = await AsyncStorage.getItem('avatar')
      setAvatar(a)
      setName(n)
      setToken(t)
      setUID(u)
    } catch (e) {
      console.log('Auth function error: ' + e)
    }
  }
  useEffect(() => {
    auth()
  }, [])
  const logout = async () => {
    try {
      // Remove user data from AsyncStorage
      await AsyncStorage.removeItem('uid');
      await AsyncStorage.removeItem('token');
      await AsyncStorage.removeItem('email');
      await AsyncStorage.removeItem('name');
      await AsyncStorage.removeItem('avatar');
  
      // Navigate to the login screen
      mainNavigation.reset({
        index: 0,
        routes: [{ name: 'StartScreen' }],
      });
    } catch (error) {
      console.error('Error while logging out:', error.message);
    }
  };
  
  
  return (
    <DrawerContentScrollView
    >
      <View style={styles.drawerContent}>
        <View style={styles.userInfoSection}>
          <Avatar.Image
            source={{
              uri: avatar,
            }}
            size={50}
          />
          <Title style={styles.title}>{name}</Title>
        </View>
        <PaperDrawer.Section style={styles.drawerSection}>
          <DrawerItemList
            {...props}
            activeTintColor="red" // Set the active item color
            inactiveTintColor="blue" // Set the inactive item color
          />
        </PaperDrawer.Section>
        <PaperDrawer.Section>
          <DrawerItem
            icon={({ color, size }) => (
              <MaterialCommunityIcons name="logout" color={color} size={size} />
            )}
            label="Logout"
            onPress={logout}
          />
        </PaperDrawer.Section>
      </View>
    </DrawerContentScrollView>
  )
}

const styles = StyleSheet.create({
  drawerContent: {
    flex: 1,
  },
  userInfoSection: {
    paddingLeft: 20,
  },
  title: {
    marginTop: 20,
    fontWeight: 'bold',
  },
  caption: {
    fontSize: 14,
    lineHeight: 14,
  },
  row: {
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  section: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
  },
  paragraph: {
    fontWeight: 'bold',
    marginRight: 3,
  },
  drawerSection: {
    marginTop: 15,
  },
  preference: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
})
