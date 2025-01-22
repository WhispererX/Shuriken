import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { theme } from '../../constants/theme';

import HomeIcon from './home'
import EmailIcon from './email'

const icons = {
    home: HomeIcon,
    email: EmailIcon,
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