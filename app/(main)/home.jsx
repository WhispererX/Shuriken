import { Alert, Pressable, StyleSheet, Text, View, Image } from 'react-native'
import React from 'react'
import ScreenWrapper from '../../components/ScreenWrapper'
import Button from '../../components/Button'
import { useAuth } from '../../contexts/AuthContext'
import { supabase } from '../../lib/superbase'
import { getHeightPercentage, getWidthPercentage } from '../../helpers/common'
import { theme } from '../../constants/theme'
import Icon from '../../assets/icons/index'
import { useRouter } from 'expo-router'
import Avatar from '../../components/Avatar'

const Home = () => {

    const {user, setAuth} = useAuth();
    const router = useRouter();

    const onLogout = async () => {
        //setAuth(null);
        const {error} = await supabase.auth.signOut();
        if (error) {
            Alert.alert('Logout', 'Error logging out');
        }
    }
  return (
    <ScreenWrapper background='white'>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
              <Image source={require('../../assets/images/shuriken.gif')} style={styles.logoImage}/>
              <Text style={styles.title}>Shuriken</Text>
              <View style={styles.icons}>
                  <Pressable onPress={()=> router.push('notifications')}>
                    <Icon name='notification' size={getHeightPercentage(3.2)} strokeWidth={2} color={theme.colors.text}/>
                  </Pressable>
                  <Pressable onPress={()=> router.push('newPost')}>
                    <Icon name='plus' size={getHeightPercentage(3.2)} strokeWidth={2} color={theme.colors.text}/>
                  </Pressable>
                  <Pressable onPress={()=> router.push('profile')}>
                    <Avatar 
                    uri={user?.image} 
                    size={getHeightPercentage(4.3)}
                    rounded={theme.radius.sm}
                    style={{borderWidth: 2}}
                    />
                  </Pressable>
              </View>
        </View>
      </View>
      <Button title='Logout' onPress={onLogout}/>
    </ScreenWrapper>
  )
}

export default Home

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
    marginHorizontal: getWidthPercentage(4),
  },

  title: {
    color: theme.colors.text,
    fontSize: getHeightPercentage(3.2),
    fontWeight: theme.fontWeight.bold,
    marginRight: 'auto',
    fontFamily: 'Jaro',
  },

  logoImage: {
    height: getHeightPercentage(8),
    width: getHeightPercentage(8),
  },

  avatarImage: {
    height: getHeightPercentage(4.3),
    width: getHeightPercentage(4.3),
    borderRadius: theme.radius.sm,
    borderCurve: 'continuous',
    borderColor: theme.colors.gray,
    borderWidth: 3,
  },

  icons: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 18,
  },

  listStyle: {
    paddingTop: 20,
    paddingHorizontal: getWidthPercentage(4),
  },

  noPosts: {
    fontSize: getHeightPercentage(2),
    textAlign: 'center',
    color: theme.colors.text,
  },

  pill: {
    position: 'absolute',
    right: -10,
    top: -4,
    height: getHeightPercentage(2.2),
    width: getWidthPercentage(2.2),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    backgroundColor: theme.colors.roseLight,
  },

  pillText: {
    color: 'white',
    fontSize: getHeightPercentage(1.2),
    fontWeight: theme.fontWeight.bold,
  }
})