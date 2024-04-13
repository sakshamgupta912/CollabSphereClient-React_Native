import React, { useState } from 'react'
import { View, StyleSheet, TouchableOpacity, Image, Alert } from 'react-native'
import { Text } from 'react-native-paper'
import Background from '../components/Background'
import Logo from '../components/Logo'
import Header from '../components/Header'
import Button from '../components/Button'
import TextInput from '../components/TextInput'
import BackButton from '../components/BackButton'
import { theme } from '../core/theme'
import { emailValidator } from '../helpers/emailValidator'
import { passwordValidator } from '../helpers/passwordValidator'
import { nameValidator } from '../helpers/nameValidator'
import { confirmPasswordValidator } from '../helpers/confirmPasswordValidator'
import Icon from 'react-native-ico-material-design';

import api from '../api/axios'

export default function RegisterScreen({ navigation }) {
  const [name, setName] = useState({ value: '', error: '' })
  const [email, setEmail] = useState({ value: '', error: '' })
  const [password, setPassword] = useState({ value: '', error: '' })
  const [confirmPassword, setConfirmPassword] = useState({
    value: '',
    error: '',
  })

  const onSignUpPressed = async () => {
    const nameError = nameValidator(name.value)
    const emailError = emailValidator(email.value)
    const passwordError = passwordValidator(password.value)
    const confirmPasswordError = confirmPasswordValidator(
      password.value,
      confirmPassword.value
    )

    if (emailError || passwordError || nameError || confirmPasswordError) {
      setName({ ...name, error: nameError })
      setEmail({ ...email, error: emailError })
      setPassword({ ...password, error: passwordError })
      setConfirmPassword({ ...confirmPassword, error: confirmPasswordError })
      return
    }

    // Check if password and confirm password match
    if (password.value !== confirmPassword.value) {
      setConfirmPassword({ ...confirmPassword, error: "Passwords don't match" })
      return
    }

    try {
     
      const response = await api.post(
        "/api/auth/register",
        JSON.stringify({
          name: name.value,
          email: email.value,
          password: password.value,
        }),
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
          validateStatus: () => true,
        }
      );
      // Handle response based on status
      if(response.data.code === 404){
        Alert.alert('Error', 'Registration failed. User Already Exists!')
      }else if (response.status === 200) {
        // Registration successful
        Alert.alert('Success','Registation Success')
        navigation.navigate('LoginScreen')
      }
    } catch (error) {
      console.error('Error registering:', error)
      Alert.alert('Error', 'Registration failed. Please try again.')
    }
    // Handle error
  }

  return (
    <Background>
      <BackButton goBack={navigation.goBack} />
      <Image
        source={require('../assets/logo.png')}
        style={{ width: 300, height: 150 }}
      />
      <Header>Create Account</Header>
      <TextInput
        label="Name"
        returnKeyType="next"
        value={name.value}
        onChangeText={(text) => setName({ value: text, error: '' })}
        error={!!name.error}
        errorText={name.error}
      />
      <TextInput
        label="Email"
        returnKeyType="next"
        value={email.value}
        onChangeText={(text) => setEmail({ value: text, error: '' })}
        error={!!email.error}
        errorText={email.error}
        autoCapitalize="none"
        autoCompleteType="email"
        textContentType="emailAddress"
        keyboardType="email-address"
      />
      <TextInput
        label="Password"
        returnKeyType="next"
        value={password.value}
        onChangeText={(text) => setPassword({ value: text, error: '' })}
        error={!!password.error}
        errorText={password.error}
        secureTextEntry
      />
      <TextInput
        label="Confirm Password"
        returnKeyType="done"
        value={confirmPassword.value}
        onChangeText={(text) => setConfirmPassword({ value: text, error: '' })}
        error={!!confirmPassword.error}
        errorText={confirmPassword.error}
        secureTextEntry
      />
      <Button
        labelStyle={{ color: '#ffffff' }}
        mode="contained"
        onPress={onSignUpPressed}
        style={{ marginTop: 24 }}
      >
        Sign Up
      </Button>
      <View style={styles.row}>
        <Text>Already have an account? </Text>
        <TouchableOpacity onPress={() => navigation.replace('LoginScreen')}>
          <Text style={styles.link}>Login</Text>
        </TouchableOpacity>
      </View>
    </Background>
  )
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    marginTop: 4,
  },
  link: {
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
})
