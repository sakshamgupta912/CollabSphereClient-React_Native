import React from 'react'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
import {
  View,
  Text,
  Platform,
  StatusBar,
  Image,
  StyleSheet,
} from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import theme from '../core/theme'

import AnnouncementScreen from './InRoomScreens/AnnouncementScreen'
import AssignmentScreen from './InRoomScreens/AssignmentScreen'
import FileScreen from './InRoomScreens/FileScreen'
import MembersScreen from './InRoomScreens/MembersScreen'

import Icon from 'react-native-vector-icons/MaterialIcons'
import { useRoute, useNavigation } from '@react-navigation/native' // Import useNavigation hook
import { TouchableOpacity } from 'react-native-gesture-handler'

const Tab = createMaterialTopTabNavigator()

export default function InRoomScreen(props) {
  const uid = props.route.params.uid
  const token = props.route.params.token
  const roomCode = props.route.params.roomCode
  const roomId = props.route.params.roomId

  const navigation = useNavigation()
  const insets = useSafeAreaInsets()

  return (
    <>
 
    <View
      style={{
        flex: 1,
        // paddingTop:
        //   Platform.OS === 'android' ? StatusBar.currentHeight : insets.top,
      }}
    >
      
      <View style={styles.container}>
        {/* Wrap TouchableOpacity with a View to provide a larger touchable area */}
        <View style={styles.backContainer}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Image
              style={styles.image}
              source={require('../assets/arrow_back.png')}
            />
          </TouchableOpacity>
        </View>
        <Text style={styles.roomCodeText}>Room Code: {roomCode}</Text>
      </View>

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
          initialParams={{
            uid: uid,
            token: token,
            roomCode: roomCode,
            roomId: roomId,
          }}
          options={{
            tabBarIcon: ({ color, focused }) => (
              <Icon
                name="announcement"
                size={24}
                color={focused ? theme.colors.primary : color}
              />
            ),
            tabBarLabel: '', // Hide the label
          }}
        />
        <Tab.Screen
          name="Assignment"
          component={AssignmentScreen}
          initialParams={{
            uid: uid,
            token: token,
            roomCode: roomCode,
            roomId: roomId,
          }}
          options={{
            tabBarIcon: ({ color, focused }) => (
              <Icon
                name="assignment"
                size={24}
                color={focused ? theme.colors.primary : color}
              />
            ),
            tabBarLabel: '', // Hide the label
          }}
        />
        {/* <Tab.Screen
          name="Files"
          component={FileScreen}
          initialParams={{
            uid: uid,
            token: token,
            roomCode: roomCode,
            roomId: roomId,
          }}
          options={{
            tabBarIcon: ({ color, focused }) => (
              <Icon
                name="folder"
                size={24}
                color={focused ? theme.colors.primary : color}
              />
            ),
            tabBarLabel: '', // Hide the label
          }}
        />   */}
        <Tab.Screen
          name="Members"
          component={MembersScreen}
          initialParams={{
            uid: uid,
            token: token,
            roomCode: roomCode,
            roomId: roomId,
          }}
          options={{
            tabBarIcon: ({ color, focused }) => (
              <Icon
                name="people"
                size={24}
                color={focused ? theme.colors.primary : color}
              />
            ),
            tabBarLabel: '', // Hide the label
          }}
        />
      </Tab.Navigator>
    </View>
    </>
  )
}
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.tertiary,
  },
  backContainer: {
   position:'absolute',
   zIndex:10,
    padding: 10, // Adjust this value to increase/decrease touchable area
  },
  image: {
    width: 30,
    height: 30,
  },
  roomCodeText: {
    fontSize: 16,
    flex: 1, // Allow room code text to take up remaining space
    textAlign:'center'
  },
})
