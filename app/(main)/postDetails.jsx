import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { createComment, fetchPostDetails, removeComment, removePost } from '../../services/postService';
import { getHeightPercentage, getWidthPercentage } from '../../helpers/common';
import { theme } from '../../constants/theme';
import PostCard from '../../components/PostCard';
import { useAuth } from '../../contexts/AuthContext';
import Loading from '../../components/Loading';
import Input from '../../components/input';
import Icon from '../../assets/icons';
import CommentItem from '../../components/CommentItem';
import { supabase } from '../../lib/superbase';
import { getUserData } from '../../services/userService';

const PostDetails = () => {
    const {postId} = useLocalSearchParams();
    const [post, setPost] = useState(null);
    const [startLoading, setStartLoading] = useState(true);
    const [loading, setLoading] = useState(false);

    const {user} = useAuth();
    const router = useRouter();
    const inputRef = useRef(null);
    const commentRef = useRef('');

    const handleNewComment = async (payload) => {
        if (payload.new) {
            let newComment = {...payload.new};
            let res = await getUserData(newComment.userId);
            newComment.user = res.success ? res.data : {};
            setPost(prevPost=> {
                return {
                    ...prevPost,
                    comments: [newComment, ...prevPost?.comments]
                }
            });
        }
    }

    useEffect(() => {
        let commentChannel = supabase
        .channel('comments')
        .on('postgres_changes', {
            event: 'INSERT',
            schema: 'public',
            table: 'comments',
            filter: `postId=eq.${postId}`
        }, handleNewComment)
        .subscribe();

        getPostDetails();

        return () => {
            supabase.removeChannel(commentChannel);
        }
    }, [])

    const getPostDetails = async() => {
        // fetch post details
        let res = await fetchPostDetails(postId);
        if (res.success) setPost(res.data);
        setStartLoading(false);
    }

    const onNewComment = async() => {
        if (!commentRef.current) return null;
        let data = {
            postId: postId,
            userId: user?.id,
            text: commentRef.current
        }
        setLoading(true);
        let res = await createComment(data);
        if (res.success) {
            commentRef.current = "";
            inputRef?.current?.clear();
        } else {
            Alert.alert('Comment', res.msg);
        }
        
        setLoading(false);
    }

    const onDeleteComment = async(comment) => {
        let res = await removeComment(comment?.id);
        if (res.success) {
            let updatedComments = post?.comments?.filter(c=>c.id !== comment?.id);
            setPost(prevPost => {
                let updatedPost = {...prevPost};
                updatedPost.comments = updatedPost.comments.filter(c=>c.id !== comment?.id);
                return updatedPost;
            });
        } else {
            Alert.alert('Comment', res.msg);
        }
    }

    const onDeletePost = async(item) => {
        let res = await removePost(post.id);
        if (res.success) {
            router.back();
        } else {
            Alert.alert('Post', res.msg);
        }
    }

    const onEditPost = async(item) => {
        router.back();
        router.push({pathname: 'newPost', params: {...item}});
    }

    if (startLoading) {
        return (
            <View style={styles.center}>
                <Loading />
            </View>
        )
    };
    if (!post) return (
        <View style={[styles.center, {justifyContent: 'flex-start', marginTop: 100}]}>
            <Text style={styles.notFound}>No Post Found</Text>
        </View>
    );
  return (
    <View style={styles.container}>
        <ScrollView  showsVerticalScrollIndicator={false} contentContainerStyle={styles.list} >
            <PostCard 
                item={{...post, comments: [{count: post?.comments?.length}]}}
                currentUser={user}
                router={router}
                hasShadow={false}
                showMoreIcon={false}
                showDelete={true}
                onDelete={onDeletePost}
                onEdit={onEditPost}
            />

            {/* comments */}
            <View style={styles.inputContainer}>
                <Input 
                inputRef={inputRef}
                placeholder="Add a comment"
                onChangeText={(text) => commentRef.current = text}
                placeholderTextColor={theme.colors.textLight} 
                containerStyle={{flex: 1, height: getHeightPercentage(6.2), borderRadius: theme.radius.xl}}
                />
                {
                    loading ? (
                        <View style={styles.loading}>
                            <Loading size='small'/>
                        </View>
                    ) : (
                        <TouchableOpacity style={styles.sendIcon} onPress={onNewComment}>
                            <Icon name="send" color={theme.colors.primary} />
                        </TouchableOpacity>
                    )
                }
            </View>
            {/* Comment List */}
            <View style={{marginVertical: 15, gap: 17}}>
                {
                    post?.comments?.map(comment =>
                        <CommentItem
                            key={comment?.id.toString()}
                            item={comment}
                            onDelete={onDeleteComment}
                            canDelete={user?.id == comment?.user?.id || user?.id == post?.user?.id}
                        />
                    )
                }
                {
                    post?.comments?.length == 0 && (
                       <Text style={{color: theme.colors.text, marginLeft: 5}}>Be first to comment!</Text>
                    )
                }
            </View>
        </ScrollView>
    </View>
  )
}

export default PostDetails

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        paddingVertical: getWidthPercentage(7),
    },

    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },

    list: {
        paddingHorizontal: getWidthPercentage(4),
    },

    sendIcon: {
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 0.8,
        borderColor: theme.colors.primary,
        borderRadius: theme.radius.lg,
        borderCurve: 'continuous',
        height: getHeightPercentage(5.8),
        width: getHeightPercentage(5.8),
    },

    center: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },

    notFound: {
        fontSize: getHeightPercentage(2.5),
        color: theme.colors.text,
        fontWeight: theme.fontWeight.medium,
    },

    loading: {
        alignItems: 'center',
        justifyContent: 'center',
        height: getHeightPercentage(5.8),
        width: getHeightPercentage(5.8),
        transform: [{ scale: 1.3 }],
    }
})