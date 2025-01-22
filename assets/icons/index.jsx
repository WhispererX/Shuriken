import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { theme } from '../../constants/theme';

import ArrowLeftIcon from './arrowLeft'
import CallIcon from './call'
import CameraIcon from './camera'
import CommentIcon from './comment'
import DeleteIcon from './delete'
import EditIcon from './edit'
import EmailIcon from './email'
import HeartIcon from './heart'
import HomeIcon from './home'
import ImageIcon from './image'
import LocationIcon from './location'
import LockIcon from './lock'
import LogoutIcon from './logout'
import PlusIcon from './plus'
import SearchIcon from './search'
import SendIcon from './send'
import ShareIcon from './share'
import ThreeDotsCircleIcon from './threeDotsCircle'
import ThreeDotsHorizontalIcon from './threeDotsHorizontal'
import UserIcon from './user'
import VideoIcon from './video'

const icons = {
  arrowLeft: ArrowLeftIcon,
  call: CallIcon,
  camera: CameraIcon,
  comment: CommentIcon,
  delete: DeleteIcon,
  edit: EditIcon,
  email: EmailIcon,
  heart: HeartIcon,
  home: HomeIcon,
  image: ImageIcon,
  location: LocationIcon,
  lock: LockIcon,
  logout: LogoutIcon,
  plus: PlusIcon,
  search: SearchIcon,
  send: SendIcon,
  share: ShareIcon,
  threeDotsCircle: ThreeDotsCircleIcon,
  threeDotsHorizontal: ThreeDotsHorizontalIcon,
  user: UserIcon,
  video: VideoIcon,
}

const Icon = ({name, ...props}) => {
    const IconComponent = icons[name];
  return (
    <IconComponent 
    height={props.size || 24} 
    width={props.size || 24} 
    strokeWidth={props.strokeWidth || 1.9}
    color={theme.colors[props.color || 'textLight']}
    {...props}
    />
  )
}

export default Icon

const styles = StyleSheet.create({})