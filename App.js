import React from 'react'
import { Provider } from 'react-native-paper'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { theme } from './src/core/theme'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import AnnouncementScreen from './src/screens/InRoomScreens/AnnouncementScreen'
import { SharedStateProvider } from './src/core/SharedStateContext'

import {
  StartScreen,
  LoginScreen,
  RegisterScreen,
  ResetPasswordScreen,
  Dashboard,
  InRoomScreen
} from './src/screens'

const Stack = createStackNavigator()

export default function App() {
  return (
    <SharedStateProvider>
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Provider theme={theme}>
        <NavigationContainer>
          <Stack.Navigator
            initialRouteName="StartScreen"
            screenOptions={{
              headerShown: false,
            }}
          >
            <Stack.Screen name="StartScreen" component={StartScreen} />
            <Stack.Screen name="LoginScreen" component={LoginScreen} />
            <Stack.Screen name="RegisterScreen" component={RegisterScreen} />
            <Stack.Screen name="Dashboard" component={Dashboard} />
            <Stack.Screen
              name="AnnouncementScreen"
              component={AnnouncementScreen}
            />
            <Stack.Screen
              name="InRoomScreen"
              component={InRoomScreen}
            />
            <Stack.Screen
              name="ResetPasswordScreen"
              component={ResetPasswordScreen}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </Provider>
    </GestureHandlerRootView>
    </SharedStateProvider>
  )
}
