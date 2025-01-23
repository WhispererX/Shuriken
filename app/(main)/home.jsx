import { Alert, Pressable, StyleSheet, Text, View, Image, FlatList } from 'react-native'
import React, { useEffect, useState } from 'react'
import ScreenWrapper from '../../components/ScreenWrapper'
import Button from '../../components/Button'
import { useAuth } from '../../contexts/AuthContext'
import { supabase } from '../../lib/superbase'
import { getHeightPercentage, getWidthPercentage } from '../../helpers/common'
import { theme } from '../../constants/theme'
import Icon from '../../assets/icons/index'
import { useRouter } from 'expo-router'
import Avatar from '../../components/Avatar'
import { fetchPosts } from '../../services/postService'
import PostCard from '../../components/PostCard'
import Loading from '../../components/Loading'
import { getUserData } from '../../services/userService'

var limit = 0;
const Home = () => {

    const {user, setAuth} = useAuth();
    const router = useRouter();

    const [posts, setPosts] = useState([]);
    const [hasMore, setHasMore] = useState(true);

    const handlePostEvent = async(payload) => {
        if (payload.eventType === 'INSERT' && payload?.new?.id) {
            let newPost = {...payload.new};
            let res = await getUserData(newPost.userId);
            newPost.user = res.success ? res.data : {};
            setPosts(prevPosts=> [newPost, ...prevPosts]);
        }
    }

    useEffect(() => {

      let postChannel = supabase.channel('posts')
      .on('postgres_changes', {event: '*', schema: 'public', table: 'posts'}, handlePostEvent)
      .subscribe();

      return () => {
        supabase.removeChannel(postChannel);
      }
    }, []);

    const getPosts = async () => {
      if (!hasMore) return null;
      limit += 10;
      let res = await fetchPosts(limit);
      if (res.success) {
        if (posts.length == res.data.length) {
          setHasMore(false);
        }
        setPosts(res.data);
      }
    }

    // const onLogout = async () => {
    //     //setAuth(null);
    //     const {error} = await supabase.auth.signOut();
    //     if (error) {
    //         Alert.alert('Logout', 'Error logging out');
    //     }
    // }
  return (
    <ScreenWrapper background='white'>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
              
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
        {/* Posts */}
        <FlatList
           data={posts}
           showsVerticalScrollIndicator={false}
           contentContainerStyle={styles.listStyle}
           keyExtractor={(item) => item.id.toString()}
           renderItem={({item}) => <PostCard item={item} currentUser={user} router={router} />} 
           onEndReached={()=> {
            getPosts();
           }}
           onEndReachedThreshold={0}
           ListFooterComponent={hasMore ?(
            <View style={{marginVertical: posts.length == 0 ? 200 : 30}}>
              <Loading />
            </View>
           ) : (
            <View style={{marginVertical: 30}}>
              <Text style={styles.noPosts}>No more posts</Text>
            </View>
           )}
        />
      </View>
      {/* <Button title='Logout' onPress={onLogout}/> */}
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