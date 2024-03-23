import React from 'react'
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
import { CustomDrawer } from '../components/CustomDrawer'

import { theme } from '../core/theme'

import Home from './DashboardScreens/HomeScreen'
import AssignmentScreen from './DashboardScreens/AssignmentScreen'
import HomeScreen from './DashboardScreens/HomeScreen'
import { Header } from '@react-navigation/stack'

const Drawer = createDrawerNavigator()

export default function Dashboard({ navigation }) {
  return (
    <Drawer.Navigator
      drawerContent={(props) => (
        <CustomDrawer mainNavigation={navigation} {...props} />
      )}
      screenOptions={{
        drawerActiveBackgroundColor: theme.colors.primary,
        drawerActiveTintColor: '#fff',
      }}
    >
      <Drawer.Screen
        name="Home"
        component={HomeScreen}
        options={{
          drawerIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="home-outline"
              color={color}
              size={size}
            />
          ),
        }}
      />
      <Drawer.Screen
        name="Assignment"
        component={AssignmentScreen}
        options={{
          drawerIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="clipboard-outline"
              color={color}
              size={size}
            />
          ),
        }}
      />
    </Drawer.Navigator>
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
