import { Alert, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import ScreenWrapper from '../../components/ScreenWrapper'
import { useAuth } from '../../contexts/AuthContext'
import { useRouter } from 'expo-router'
import Header from '../../components/Header'
import { getHeightPercentage, getWidthPercentage } from '../../helpers/common'
import Icon from '../../assets/icons/index'
import { theme } from '../../constants/theme'
import { supabase } from '../../lib/superbase'
import Avatar from '../../components/Avatar'

const Profile = () => {
  const {user, setAuth} = useAuth();
  const router = useRouter();

  const onLogout = async () => {
          //setAuth(null);
          const {error} = await supabase.auth.signOut();
          if (error) {
              Alert.alert('Logout', 'Error logging out');
          }
      }

  const handleLogout = async() => {
    // Show confirm modal
    Alert.alert('Confirm', 'Are you sure you want to log out?', [
      {
        text: 'Cancel',
        onPress: () => {},
        style: 'cancel'
      },
      {
        text: 'Logout',
        onPress: () => onLogout(),
        style: 'destructive'
      }
    ])
  }
  return (
    <ScreenWrapper background='white'>
      <UserHeader user={user} router={router} handleLogout={handleLogout} />
    </ScreenWrapper>
  )
}

const UserHeader = ({user, router, handleLogout}) => {
  return (
    <View style={{flex: 1, backgroundColor: 'white', paddingHorizontal: getWidthPercentage(4)}}>
      {/* Header */}
      <View>
        <Header title="Profile" marginBottom={30}/>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Icon name='logout' color={theme.colors.rose} />
        </TouchableOpacity>
      </View>

      {/* Body */}
      <View style={styles.constainer}>
        <View style={{gap : 15}}>
          <View style={styles.avatarContainer}>
            <Avatar 
              uri={user?.image}
              size={getHeightPercentage(12)}
              rounded={theme.radius.xxl * 1.4}
            />
            <Pressable style={styles.editIcon} onPress={()=> router.push('editProfile')}>
              <Icon name={"edit"} strokeWidth={2.5} size={20} />
            </Pressable>
          </View>

          {/* User Name & Address*/}
          <View style={{alignItems:"center", gap:4}}>
            <Text style={styles.userName}>{user && user.name}</Text>
            <Text style={styles.infoText}>{user && user.address}</Text>
          </View>

           {/* User Email & Phone Number*/}
           <View style={{gap:10}}>
            <View style={styles.info}>
              <Icon name="email" size={20} color={theme.colors.textLight}/>
              <Text style={styles.infoText}>{user && user.email}</Text>
            </View>
            
            {/* User Bio */}
            {
              user && user.bio && (
                <Text style={styles.infoText}>{user.bio}</Text>
              )
            }
          </View>
        </View>
      </View>
    </View>
  )
}

export default Profile

const styles = StyleSheet.create({
  constainer: {
    flex: 1,
  },

  headerContainer: {
    marginHorizontal: getWidthPercentage(4),
    marginBottom: 20,
  },

  headerShape: {
    width: getWidthPercentage(100),
    height: getHeightPercentage(20),
  },

  avatarContainer: {
    height: getHeightPercentage(12),
    width: getHeightPercentage(12),
    alignSelf: 'center'
  },

  editIcon: {
    position: 'absolute',
    bottom: 0,
    right: -12,
    padding: 7,
    borderRadius: 50,
    backgroundColor: 'white',
    shadowColor: theme.colors.textLight,
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.4,
    shadowRadius: 5,
    elevation: 7,
  }, 

  userName: {
    fontSize: getHeightPercentage(3),
    fontWeight: '500',
    color: theme.colors.textDark,
  },

  info: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },

  infoText: {
    fontSize: getHeightPercentage(1.6),
    fontWeight: '500',
    color: theme.colors.textLight,
    //textAlign: 'center'
  },

  logoutButton: {
    position: 'absolute',
    right: 0,
    padding: 5,
    borderRadius: theme.radius.sm,
    backgroundColor: '#fee2e2'
  },

  listStyle: {
    paddingHorizontal: getWidthPercentage(4),
    paddingBottom: 30,
  },

  noPosts: {
    fontSize: getHeightPercentage(2),
    textAlign: 'center',
    color: theme.colors.text
  }
})