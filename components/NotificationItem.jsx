import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { theme } from '../constants/theme'
import { getHeightPercentage } from '../helpers/common'
import Avatar from './Avatar'
import moment from 'moment'

const NotificationItem = ({
    item,
    router
}) => {
    const handleClick = () => {
        // Open Post Details
        let {postId, commendId} = JSON.parse(item?.data);
        router.push({pathname: 'postDetails', params: {postId, commendId}})
    }

    const createdAt = moment(item?.created_at).fromNow();
  return (
    <TouchableOpacity style={styles.container} onPress={handleClick}>
      <Avatar uri={item?.sender?.image} size={getHeightPercentage(5)} />
      <View style={styles.nameTitle}>
            <Text style={styles.text}>{item?.sender?.name}</Text>
            <Text style={[styles.text, {color: theme.colors.textDark}]}>{item?.title}</Text>
      </View>
      <Text style={[styles.text, {color: theme.colors.textLight}]}>{createdAt}</Text>
    </TouchableOpacity>
  )
}

export default NotificationItem

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 12,
        backgroundColor: 'white',
        borderWidth: 0.5,
        borderColor: theme.colors.darkLight,
        padding: 15,
        borderRadius: theme.radius.xxl,
        borderCurve: 'continuous',
    },

    nameTitle: {
        flex: 1,
        gap: 2,
    },

    text: {
        fontSize: getHeightPercentage(1.6),
        fontWeight: theme.fontWeight.medium,
        color: theme.colors.text,
    }
})