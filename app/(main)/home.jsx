import { Alert, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import ScreenWrapper from '../../components/ScreenWrapper'
import Button from '../../components/Button'
import { useAuth } from '../../contexts/AuthContext'
import { supabase } from '../../lib/superbase'

const Home = () => {

    const {setAuth} = useAuth();

    const onLogout = async () => {
        setAuth(null);
        const {error} = await supabase.auth.signOut();
        if (error) {
            Alert.alert('Logout', 'Error logging out');
        }
    }
  return (
    <ScreenWrapper>
      <Text>Home</Text>
      <Button title='Logout' onPress={onLogout}/>
    </ScreenWrapper>
  )
}

export default Home

const styles = StyleSheet.create({})