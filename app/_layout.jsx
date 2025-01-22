import { View, Text } from 'react-native'
import React, { useEffect } from 'react'
import { Stack, useRouter } from 'expo-router'
import { AuthProvider, useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/superbase'

const _layout = ()=> {
  return (
    <AuthProvider>
      <MainLayout/>
    </AuthProvider>
  )
}

const MainLayout = () => {
  const {setAuth} = useAuth();
  const router = useRouter();
  useEffect(()=>{
    supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        // Set Auth
        setAuth(session?.user);
        router.replace('/home');

        // Move to home screen
      } else {
        // Set auth as null
        setAuth(null);
        // Move to welcome screen
        router.replace('/welcome');
      }
    })
  }, [])
  return (
    <Stack 
        screenOptions={{
            headerShown: false,
        }}
    />
  )
}

export default _layout