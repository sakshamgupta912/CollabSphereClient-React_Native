import React from 'react'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
import { View, Text, Platform, StatusBar } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import theme from '../core/theme'

import AnnouncementScreen from './InRoomScreens/AnnouncementScreen'
import AssignmentScreen from './InRoomScreens/AssignmentScreen'
import FileScreen from './InRoomScreens/FileScreen'
import MembersScreen from './InRoomScreens/MembersScreen'

import Icon from 'react-native-vector-icons/MaterialIcons'

const Tab = createMaterialTopTabNavigator()

export default function InRoomScreen(props) {
  const uid = props.route.params.uid
  const token = props.route.params.token
  const roomCode = props.route.params.roomCode
  const roomId = props.route.params.roomId


  const insets = useSafeAreaInsets()

  return (
    <View
      style={{
        flex: 1,
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : insets.top,
      }}
    >
      <Text style={{ textAlign: 'center' ,backgroundColor:theme.colors.tertiary }}>Room Code: {roomCode}</Text>
      <Tab.Navigator
        screenOptions={{
          tabBarLabelStyle: { fontSize: 11, textTransform: 'none' },
          tabBarIndicatorStyle: { backgroundColor: theme.colors.primary },
          tabBarStyle: { backgroundColor: theme.colors.tertiary, height: 45 },
        }}
      >
        <Tab.Screen
          name="Announcement"
          component={AnnouncementScreen}
          initialParams={{ uid: uid, token: token, roomCode: roomCode, roomId: roomId }}
          options={{
            tabBarIcon: ({ color, focused }) => (
              <Icon name="announcement" size={24} color={focused ? theme.colors.primary : color} />
            ),
            tabBarLabel: '', // Hide the label
          }}
        />
        <Tab.Screen
          name="Assignment"
          component={AssignmentScreen}
          initialParams={{ uid: uid, token: token, roomCode: roomCode, roomId: roomId }}
          options={{
            tabBarIcon: ({ color, focused }) => (
              <Icon name="assignment" size={24} color={focused ? theme.colors.primary : color} />
            ),
            tabBarLabel: '', // Hide the label
          }}
        />
        <Tab.Screen
          name="Files"
          component={FileScreen}
          initialParams={{ uid: uid, token: token, roomCode: roomCode, roomId: roomId }}
          options={{
            tabBarIcon: ({ color, focused }) => (
              <Icon name="folder" size={24} color={focused ? theme.colors.primary : color} />
            ),
            tabBarLabel: '', // Hide the label
          }}
        />
        <Tab.Screen
          name="Members"
          component={MembersScreen}
          initialParams={{ uid: uid, token: token, roomCode: roomCode, roomId: roomId }}
          options={{
            tabBarIcon: ({ color, focused }) => (
              <Icon name="people" size={24} color={focused ? theme.colors.primary : color} />
            ),
            tabBarLabel: '', // Hide the label
          }}
        />
      </Tab.Navigator>
    </View>
  )
}