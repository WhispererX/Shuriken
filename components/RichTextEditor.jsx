import { StyleSheet, Text, View } from 'react-native'
import React, { forwardRef } from 'react'
import { actions, RichEditor, RichToolbar } from 'react-native-pell-rich-editor'
import { theme } from '../constants/theme'

const RichTextEditor = forwardRef(({ onChange }, ref) => {
  return (
    <View style={{minHeight: 285}}>
      <RichToolbar 
        editor={ref}
        actions={[
            actions.setStrikethrough,
            actions.removeFormat,
            actions.setBold,
            actions.setItalic,
            actions.insertOrderedList,
            actions.blockquote,
            actions.alignLeft,
            actions.alignCenter,
            actions.alignRight,
            actions.code,
            actions.heading1,
            actions.heading4,
            actions.insertLink,
        ]}
        iconMap={{
            [actions.heading1]: ({tintColor})=> <Text style={{color: tintColor}}>H1</Text>,
            [actions.heading4]: ({tintColor})=> <Text style={{color: tintColor}}>H4</Text>,
        }}
        style={styles.richBar}
        flatContainerStyle={styles.flatStyle}
        selectedIconTint={theme.colors.primary}
        disabled={false}
      />
      <RichEditor 
        ref={ref}
        containerStyle={styles.rich}
        editorStyle={styles.contentStyle}
        placeholder={"What's on your mind?"}
        onChange={onChange}
      />
    </View>
  )
})

export default RichTextEditor


const styles = StyleSheet.create({
    richBar: {
        borderTopRightRadius: theme.radius.xl,
        borderTopLeftRadius: theme.radius.xl,
        backgroundColor: theme.colors.gray,
    },

    rich: {
        minHeight: 240,
        flex: 1,
        borderWidth: 1.5,
        borderTopWidth: 0,
        borderBottomLeftRadius: theme.radius.xl,
        borderBottomRightRadius: theme.radius.xl,
        borderColor: theme.colors.gray,
        padding: 5,
    },

    contentStyle: {
        color: theme.colors.textDark,
        placeholderColor: 'gray',
    },

    flatStyle: {
        paddingHorizontal: 8,
        gap: 3,
    }
})