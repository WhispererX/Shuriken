import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { useRouter } from 'expo-router'
import { getHeightPercentage } from '../helpers/common';
import { theme } from '../constants/theme';
import BackButton from '../components/BackButton'

const Header = ({title, showBackButton = true, marginBottom=10}) => {
    const router = useRouter();
  return (
    <View style={[styles.container, {marginBottom: marginBottom}]}>
      {
        showBackButton && (
            <View style={styles.backButton}>
                <BackButton router={router}/>
            </View>
        )
      }
      <Text style={styles.title}>{title || ""}</Text>
    </View>
  )
}

export default Header

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 5,
        gap: 10,
    },

    title: {
        fontSize: getHeightPercentage(2.7),
        fontWeight: theme.fontWeight.semibold,
        color: theme.colors.textDark,
    },

    backButton: {
        position: 'absolute',
        left: 0,
    }
})