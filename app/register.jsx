import { Alert, Pressable, StyleSheet, Text, View } from 'react-native'
import React, { useRef, useState } from 'react'
import ScreenWrapper from '../components/ScreenWrapper'
import Icon from '../assets/icons/index'
import { StatusBar } from 'expo-status-bar'
import BackButton from '../components/BackButton'
import { useRouter } from 'expo-router'
import { getWidthPercentage } from '../helpers/common'
import { getHeightPercentage } from '../helpers/common'
import { theme } from '../constants/theme'
import Input from '../components/input'
import Button from '../components/Button'
import { supabase } from '../lib/superbase'

const Register = () => {
  const router = useRouter();
  const nameRef = useRef("");
  const emailRef = useRef("");
  const passwordRef = useRef("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async () => {
    if (!emailRef.current || !passwordRef.current || !nameRef.current) {
      Alert.alert('Sign Up','Please fill in all the fields');
      return;
    }

    let name = nameRef.current.trim();
    let email = emailRef.current.trim();
    let password = passwordRef.current.trim();

    setLoading(true);

    const {data: {session}, error} = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name
        }
      }
    });
    setLoading(false);

    if (error) {
      Alert.alert('Sign Up',error.message);
    }
  }

  return (
    <ScreenWrapper background='white'>
      <StatusBar style='dark'/>
      <View style={styles.container}>
        {/* Back Button */}
        <BackButton router={router}/>

        {/* Welcome Text */}
        <View>
          <Text style={styles.welcomeText}>Lets,</Text>
          <Text style={styles.welcomeText}>Get Started!</Text>
        </View>

        {/* Form */}
        <View style={styles.form}>
          <Text style={{fontSize: getHeightPercentage(1.5), color: theme.colors.text}}>Please fill the details to create an account</Text>

          {/* Name */}
          <Input 
            icon={<Icon name='user' size={26} strokeWidth={1.6}/>}
            placeholder='Enter your name'
            onChangeText={value => nameRef.current = value}
          />

          {/* Email */}
          <Input 
            icon={<Icon name='email' size={26} strokeWidth={1.6}/>}
            placeholder='Enter your email'
            onChangeText={value => emailRef.current = value}
          />

          {/* Password */}
          <Input 
            icon={<Icon name='lock' size={26} strokeWidth={1.6}/>}
            placeholder='Enter your password'
            secureTextEntry
            onChangeText={value => passwordRef.current = value}
          />

          {/* Login Button */}
          <Button  title={'Sign Up'} loading={loading} onPress={onSubmit}/>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Already have an account?</Text>
            <Pressable onPress={() => router.push('login')}>
              <Text style={[styles.footerText, {color: theme.colors.primary, fontWeight: theme.fontWeight.semibold}]}>Login</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </ScreenWrapper>
  )
}

export default Register

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 45,
    paddingHorizontal: getWidthPercentage(5),
  },

  welcomeText: {
    fontSize: getHeightPercentage(4),
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text,
  },

  form: {
    gap: 25,
  },

  forgotPassword: {
    textAlign: 'right',
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.text,
  },

  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
  },

  footerText: {
    textAlign: 'center',
    fontSize: getHeightPercentage(1.6),
    color: theme.colors.text,
  }
})