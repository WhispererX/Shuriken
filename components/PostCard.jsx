import { Alert, Share, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { getHeightPercentage, getWidthPercentage, stripHtmlTags } from '../helpers/common'
import { theme } from '../constants/theme'
import Avatar from './Avatar'
import moment from 'moment'
import Icon from '../assets/icons'
import RenderHTML from 'react-native-render-html'
import HTMLView from 'react-native-htmlview';
import { Image } from 'expo-image'
import { downloadFile, getSupabaseFileUrl } from '../services/imageService'
import { Video } from 'expo-av'
import { removePostLike, createPostLike } from '../services/postService'
import Loading from './Loading'
import { FontDisplay } from 'expo-font'


const PostCard = ({
    item,
    currentUser,
    router,
    hasShadow = true,
    showMoreIcon = true,
    showDelete= false,
    onDelete = ()=>{},
    onEdit = ()=>{},
}) => {
    const shadowStyles = {
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.06,
        shadowRadius: 6,
        elevation: 1
    };

    const [likes, setLikes] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLikes(item?.postLikes || []);
    }, [item?.postLikes])

    

    const createdAt = moment(item?.created_at).fromNow();
    const liked = likes?.filter(like=>like.userId === currentUser?.id)[0] ? true : false;

    const onLike = async() => {
        if (liked) {
            let updatedLikes = likes.filter(like=>like.userId !== currentUser?.id);
            setLikes(updatedLikes);
            let res = await removePostLike(item?.id, currentUser?.id);
            if (!res.success) {
                Alert.alert('Post', 'Something went wrong');
                return;
            }
        } else {
            let data = {
                postId: item?.id,
                userId: currentUser?.id,
            }
            setLikes([...likes, data]);
            let res = await createPostLike(data);
            if (!res.success) {
                Alert.alert('Post', 'Something went wrong');
                return;
            }
        }
        
    }

    const onShare = async() => {
        let content = {message: stripHtmlTags(item?.body)};
        if (item?.file) {
            setLoading(true);
            let uri = await downloadFile(getSupabaseFileUrl(item?.file).uri);
            setLoading(false);
            content.url = uri;
        }
        Share.share(content);
    }
    
    const openPostDetails = () => {
        if(!showMoreIcon) return null;
        router.push({pathname: 'postDetails', params: {postId: item?.id}});
    }

    const handlePostDelete = () => {
        Alert.alert('Delete Post', 'Are you sure you want to delete this post?', [
            {
                text: 'Cancel',
                style: 'cancel'
            },
            {
                text: 'Delete',
                onPress: () => onDelete(item),
                style: 'destructive'
            }
        ])
    }
  return (
    <View style={[styles.container, hasShadow && shadowStyles]}>
      <View style={styles.header}>
        <View style={styles.userInfo}>
            <Avatar size={getHeightPercentage(4.5)} uri={item?.user?.image} rounded={theme.radius.md} />
            <View style={{gap:2}}>
                <Text style={styles.username}>{item?.user?.name}</Text>
                <Text style={styles.postTime}>{createdAt}</Text>
            </View>
        </View>
        {
            showMoreIcon && (
                <TouchableOpacity onPress={openPostDetails}>
                    <Icon name="threeDotsHorizontal" size={getHeightPercentage(3.4)} strokeWidth={3} color={theme.colors.text} />
                </TouchableOpacity>
            )
        }
        {
            showDelete && currentUser.id == item?.userId && (
                <View style={styles.actions}>
                    <TouchableOpacity onPress={() => onEdit(item)}>
                        <Icon name="edit" size={getHeightPercentage(2.5)} color={theme.colors.text} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handlePostDelete}>
                        <Icon name="delete" size={getHeightPercentage(2.5)} color={theme.colors.rose} />
                    </TouchableOpacity>
                </View>
            )
        }

        
      </View>

      {/* Post Body */}
      <View style={styles.content}>
            <View style={styles.postBody}>
                {item?.body && (<HTMLView value={item?.body} stylesheet={styles.htmlStyles} />)}
            </View>

            {/* Post Image */}
            {
                item?.file && item?.file?.includes('postImages') && (
                    <Image 
                        source={getSupabaseFileUrl(item?.file)}
                        transition={100}
                        style={styles.postMedia}
                        contentFit='cover'
                    />
                )
            }
            {/* Post Video */}
            {
                item?.file && item?.file?.includes('postVideos') && (
                    <Video 
                        style={[styles.postMedia, {height:getHeightPercentage(30)}]}
                        source={getSupabaseFileUrl(item?.file)}
                        useNativeControls
                        resizeMode='cover'
                        isLooping
                    />
                )
            }
      </View>
      {/* Post Footer */}
      <View style={styles.footer}>
        <View style={styles.footerButton}>
            <TouchableOpacity onPress={onLike}>
                <Icon name='heart' size={24} strokeWidth={2} fill={liked ? theme.colors.rose : 'transparent'} color={liked ? theme.colors.rose : theme.colors.textLight} />
            </TouchableOpacity>
            <Text style={styles.count}>{likes?.length}</Text>
        </View>

        <View style={styles.footerButton}>
            <TouchableOpacity onPress={openPostDetails}>
                <Icon name='comment' size={24} strokeWidth={2} color={theme.colors.textLight} />
            </TouchableOpacity>
            <Text style={styles.count}>
                {
                    item?.comments[0]?.count
                }
            </Text>
        </View>

        <View style={styles.footerButton}>
            {
                loading ? (
                    <Loading size='small' />
                ) : (
                    <TouchableOpacity onPress={onShare}>
                        <Icon name='share' size={24} strokeWidth={2} color={theme.colors.textLight} />
                    </TouchableOpacity>
                )
            }
            
        </View>
      </View>
    </View>
  )
}

export default PostCard

const textStyles = {
    color: theme.colors.dark,
    fontSize: getHeightPercentage(1.75),
}

const styles = StyleSheet.create({
    container: {
        gap: 10,
        marginBottom: 15,
        borderRadius: theme.radius.xxl * 1.1,
        borderCurve: 'continuous',
        padding: 10,
        paddingVertical: 12,
        backgroundColor: 'white',
        borderWidth: 0.5,
        borderColor: theme.colors.gray,
        shadowColor: '#000',
    },
    htmlStyles: {
        p: textStyles,
        div: textStyles,
        ol: textStyles,
        ul: textStyles,
        li: textStyles,
        h1: {
            color: theme.colors.dark,
            fontSize: getHeightPercentage(3),
        },
        h4: {
            color: theme.colors.dark,
            fontSize: getHeightPercentage(2.2),
        },
        blockquote: {
            borderLeftWidth: 4,
            borderLeftColor: theme.colors.gray,
            paddingLeft: 10,
            ...textStyles
        },
        code: {
            backgroundColor: theme.colors.gray,
            ...textStyles
        },
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    userInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    username: {
        fontSize: getHeightPercentage(1.7),
        fontWeight: theme.fontWeight.medium,
        color: theme.colors.textDark,
    },
    postTime: {
        fontSize: getHeightPercentage(1.4),
        color: theme.colors.textLight,
        fontWeight: theme.fontWeight.medium,
    },
    content: {
        gap: 10,
    },
    postMedia: {
        height: getHeightPercentage(40),
        width: '100%',
        borderRadius: theme.radius.xl,
        borderCurve: 'continuous',
    },
    postBody: {
        marginLeft: 5,
    },
    footer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 15,
    },
    footerButton: {
        marginLeft: 5,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    actions: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 18,
    },  
    count: {
        color: theme.colors.text,
        fontSize: getHeightPercentage(1.8),
    }
})