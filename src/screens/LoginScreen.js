import React, { useState, useEffect } from 'react'
import { TouchableOpacity, StyleSheet, View } from 'react-native'
import { Text } from 'react-native-paper'
import Background from '../components/Background'
import Logo from '../components/Logo'
import ManReadingBook from '../components/ManReadingBook'
import Header from '../components/Header'
import Button from '../components/Button'
import TextInput from '../components/TextInput'
import BackButton from '../components/BackButton'
import { theme } from '../core/theme'
import { emailValidator } from '../helpers/emailValidator'
import { passwordValidator } from '../helpers/passwordValidator'
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage

import api from '../api/axios'

export default function LoginScreen({ navigation }) {
  const [error, setError] = useState(null); // Server Error Changed to null to indicate no error initially
  const [email, setEmail] = useState({ value: '', error: '' })
  const [password, setPassword] = useState({ value: '', error: '' })

  useEffect(() => {
    // Check AsyncStorage for existing token and user ID
    checkUserAuthentication();
  }, []);

  const checkUserAuthentication = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const uid = await AsyncStorage.getItem('uid');
      
      // If token and uid exist, navigate to Dashboard
      if (token && uid) {
        navigation.reset({
          index: 0,
          routes: [{ name: 'Dashboard' }],
        });
      }
    } catch (error) {
      console.error('Error reading data from AsyncStorage:', error.message);
    }
  };


  const onLoginPressed = async () => {
    const emailError = emailValidator(email.value)
    const passwordError = passwordValidator(password.value)
    if (emailError || passwordError) {
      setEmail({...email, error: emailError })
      setPassword({...password, error: passwordError })
      return ;
    }
    try {
      const formData = {
        email: email.value,
        password: password.value
      };
      const response = await api.post('/api/auth/login', formData,
      {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
     
      // Handle response status
      if (response.status === 200) {
        // Navigate to Dashboard upon successful login
        const { _id, name, email ,avatar, token } = response.data.user;
        // Store user data in AsyncStorage
     
        await AsyncStorage.setItem('uid', _id);
        await AsyncStorage.setItem('token', token);
        await AsyncStorage.setItem('email', email);
        await AsyncStorage.setItem('name', name);
        await AsyncStorage.setItem('avatar', avatar);

        navigation.reset({
          index: 0,
          routes: [{ name: 'Dashboard' }],
        });
      } 

    } catch (error) {
      // Handle network errors or other errors
      console.log(error.response.status);
      if (error.response.status === 401){
        setError('Invalid email or password');
      }
      else if(error.response.status === 404){
        setError('User not found');
      }
      else{
        setError('Something went wrong. Please try again.');
      }
      
    }


    
  }

  return (
    <Background>
      <BackButton goBack={navigation.goBack} />
      <ManReadingBook />
      <Header>Welcome back!</Header>
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
        autoCapitalize="none"
        returnKeyType="done"
        value={password.value}
        onChangeText={(text) => setPassword({ value: text, error: '' })}
        error={!!password.error}
        errorText={password.error}
        secureTextEntry
      />
      <View style={styles.forgotPassword}>
        <TouchableOpacity
          onPress={() => navigation.navigate('ResetPasswordScreen')}
        >
          <Text style={styles.forgot}>Forgot your password?</Text>
        </TouchableOpacity>
      </View>
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <Button
        labelStyle={{ color: '#ffffff' }}
        mode="contained"
        onPress={onLoginPressed}
      >
        Login
      </Button>
      <View style={styles.row}>
        <Text style={styles.text}>Don’t have an account? </Text>
        <TouchableOpacity onPress={() => navigation.replace('RegisterScreen')}>
          <Text style={styles.link}>Sign up</Text>
        </TouchableOpacity>
      </View>
    </Background>
  )
}

const styles = StyleSheet.create({
  forgotPassword: {
    width: '100%',
    alignItems: 'flex-end',
    marginBottom: 24,
  },
  row: {
    flexDirection: 'row',
    marginTop: 4,
  },
  forgot: {
    fontSize: 13,
    color: theme.colors.secondary,
  },
  link: {
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
  text: {
    color: theme.colors.primary,
  },
})
