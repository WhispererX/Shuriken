import { Alert, Image, Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import ScreenWrapper from '../../components/ScreenWrapper'
import Header from '../../components/Header'
import { getHeightPercentage, getWidthPercentage } from '../../helpers/common'
import { theme } from '../../constants/theme'
import Avatar from '../../components/Avatar'
import { useAuth } from '../../contexts/AuthContext'
import RichTextEditor from '../../components/RichTextEditor'
import { useLocalSearchParams, useRouter } from 'expo-router'
import Icon from '../../assets/icons'
import Button from '../../components/Button'
import * as ImagePicker from 'expo-image-picker'
import { getSupabaseFileUrl } from '../../services/imageService'
import { Video } from 'expo-av'
import { createOrUpdatePost } from '../../services/postService'

const NewPost = () => {
  const post = useLocalSearchParams();
  const {user} = useAuth();
  const richText = useRef(null);
  const bodyRef = useRef("");
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(file);

  useEffect(() => {
    if (post && post?.id) {
      bodyRef.current = post?.body;
      setFile(post?.file || null);
      setTimeout(()=>{
        richText?.current?.setContentHTML(post?.body);
      }, 300);
    }
  }, [])

  const onPick = async(isImage) => {
    let mediaConfig = {
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4,3],
      quality: 0.7,
    }
    if (!isImage) {
      mediaConfig = {
        mediaTypes : ImagePicker.MediaTypeOptions.Videos,
        allowsEditing: true,
      }
    }
    let result = await ImagePicker.launchImageLibraryAsync(mediaConfig);

    if (!result.canceled) {
      setFile(result.assets[0]);
    }
  }

  const isLocalFile = file=> {
    if (!file) return null;
    if (typeof file === 'object') return true;

    return false;
  }

  const getFileType = file => {
    if (!file) return null;
    if (isLocalFile) {
      return file.type;
    }

    // Check for remote file
    if (file.includes('postImages')) {
      return 'image';
    }
    return 'video';
  }

  const getFileUri = file => {
    if (!file) return null;
    if (isLocalFile(file)) {
      return file.uri;
    }

    return getSupabaseFileUrl(file)?.uri;
  }

  const onSubmit = async() => {
    if (!bodyRef.current && !file) {
      Alert.alert('Post', 'Please add some content to your post');
      return;
    }

    let data = {
      body: bodyRef.current,
      file: file,
      userId: user?.id,
    }

    if (post && post?.id) {
      data.id = post?.id;
    }

    // Create Post
    setLoading(true);
    let res = await createOrUpdatePost(data);
    setLoading(false);
    if (res.success) {
      setFile(null);
      bodyRef.current = "";
      richText.current?.setContentHTML('');
      router.back();
    } else {
      Alert.alert('Post', res.msg);
    }
  }
  return (
    <ScreenWrapper background='white'>
      <View style={styles.container}>
        <Header title="Create Post" />
        <ScrollView contentContainerStyle={{gap:20}}>
          {/* Avatar */}
          <View style={styles.header}>
            <Avatar 
              uri={user?.image}
              size={getHeightPercentage(6.5)}
              rounded={theme.radius.xl}
            />
            {/* Username */}
            <View style={{gap:2}}>
              <Text style={styles.username}>
                {
                  user && user.name
                }
              </Text>
              <Text style={styles.publicText}>
                Public
              </Text>
            </View>
          </View>

          <View style={styles.textEditor}>
            <RichTextEditor 
              ref={richText}
              onChange={body => bodyRef.current = body} 
            />
          </View>

          {
            file && (
              <View style={styles.file}>
                {
                  getFileType(file) == 'video'? (
                    <Video 
                      style={{flex:1}} 
                      source={{uri: getFileUri(file)}}
                      resizeMode='cover'
                      isLooping
                      useNativeControls
                    />
                  ):(
                    <Image source={{uri: getFileUri(file)}} resizeMode='cover' style={{flex:1}}/>
                  )
                }
                <Pressable style={styles.closeIcon} onPress={()=>{setFile(null)}}>
                  <Icon name="delete" size={20} color="white" />
                </Pressable>
              </View>
            )
          }

          <View style={styles.media}>
                <Text style={styles.addImageText}>Add to your post</Text>
                <View style={styles.mediaIcons}>
                  <TouchableOpacity onPress={()=>{onPick(true)}}>
                    <Icon name="image" size={30} color={theme.colors.dark}/>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={()=>{onPick(false)}}>
                    <Icon name="video" size={33} color={theme.colors.dark}/>
                  </TouchableOpacity>
                </View>
          </View>
        </ScrollView>
        
        <Button 
          buttonStyle={{height: getHeightPercentage(6.2)}}
          title={post && post.id ? 'Save' : 'Post'}
          loading={loading}
          hasShadow={false}
          onPress={onSubmit}
        />
      </View>
    </ScreenWrapper>
  )
}

export default NewPost

const styles = StyleSheet.create({

  container: {
    flex: 1,
    marginBottom: 30,
    paddingHorizontal: getWidthPercentage(4),
    gap: 15,
  },

  title: {
    fontSize: getHeightPercentage(2.5),
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.text,
    textAlign: 'center',
  },  

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },  

  username: {
    fontSize: getHeightPercentage(2.2),
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.text,
  },


  avatar: {
    height: getHeightPercentage(6.5),
    width: getHeightPercentage(6.5),
    borderRadius: theme.radius.xl,
    borderCurve: 'continuous',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)'
  },


  publicText: {
    fontSize: getHeightPercentage(1.7),
    fontWeight: theme.fontWeight.medium,
    color: theme.colors.textLight,
  },


  textEditor: {

  },


  media: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1.5,
    padding: 12,
    paddingHorizontal: 18,
    borderRadius: theme.radius.xl,
    borderCurve: 'continuous',
    borderColor: theme.colors.gray,
  },


  mediaIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },


  addImageText: {
    fontSize: getHeightPercentage(1.9),
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.text,
  },


  imageIcon: {
    borderRadius: theme.radius.md,
  },


  file: {
    height: getHeightPercentage(30),
    width: '100%',
    borderRadius: theme.radius.xl,
    overflow: 'hidden',
    borderCurve: 'continuous'
  },


  video: {

  },

  closeIcon: {
    position: 'absolute',
    top: 10,
    right: 10,
    padding: 7,
    borderRadius: 50,
    backgroundColor: 'rgba(225,0,0,0.5)',
  },
})