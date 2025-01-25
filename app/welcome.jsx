import { Image, Pressable, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import ScreenWrapper from '../components/ScreenWrapper'
import { StatusBar } from 'expo-status-bar'
import { getHeightPercentage, getWidthPercentage } from '../helpers/common'
import { theme } from '../constants/theme'
import Button from '../components/Button'
import { useRouter } from 'expo-router'

const Welcome = () => {
    const router = useRouter();
  return (
    <ScreenWrapper background='white'>
      <StatusBar style='dark'/>
      <View style={styles.container}>

        {/* Welcome Image*/}
        <Image source={require('../assets/images/shuriken.png')} resizeMode='contain' style={styles.welcomeImage}/>

        {/* Welcome Title*/}
        <View style={{gap: 20}}>
            <Text style={styles.title}>Shuriken</Text>
            <Text style={styles.description}>Where every thought finds a home and every image tells a story.</Text>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
            <Button 
                title='Get Started' 
                buttonStyle={{marginHorizontal: getWidthPercentage(3)}}
                onPress={()=>router.push('register')}
            />
            <View style={styles.bottomTextContainer}>
                <Text style={styles.loginText}>
                    Already have an account?
                </Text>
                <Pressable onPress={() => router.push('login')}>
                    <Text style={[styles.loginText, {color: theme.colors.primary, fontWeight: theme.fontWeight.semibold}]}>
                        Login
                    </Text>
                </Pressable>
            </View>
        </View>
      </View>
    </ScreenWrapper>
  )
}

export default Welcome

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: 'white',
        paddingHorizontal: getWidthPercentage(4),
        paddingTop: getHeightPercentage(0),
    },
    welcomeImage: {
        width: getWidthPercentage(100),
        height: getHeightPercentage(40),
        alignSelf: 'center',
    },
    title: {
        fontSize: getHeightPercentage(4),
        textAlign: 'center',
        fontWeight: theme.fontWeight.extraBold,
        color: theme.colors.text, 
    },
    description: {
        textAlign: 'center',
        paddingHorizontal: getWidthPercentage(10),
        fontSize: getHeightPercentage(1.7),
        color: theme.colors.text,
    },
    footer: {
        gap: 30,
        width: '100%',
        bottom: getHeightPercentage(10),
        position: 'absolute',
    },
    bottomTextContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 5,
    },
    loginText: {
        textAlign: 'center',
        fontSize: getHeightPercentage(1.6),
        color: theme.colors.text,
    },
    
})