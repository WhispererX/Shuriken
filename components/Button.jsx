import { Pressable, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { theme } from '../constants/theme';
import { getHeightPercentage } from '../helpers/common';
import Loading from './Loading';

/**
 * A customizable button component with optional loading state and shadow effects.
 *
 * @param {Object} props - The component's props.
 * @param {Object} props.buttonStyle - Custom styles for the button container.
 * @param {Object} props.textStyle - Custom styles for the button text.
 * @param {string} props.title - The text displayed on the button (default: empty string).
 * @param {Function} props.onPress - Callback function for the button press event (default: no-op function).
 * @param {boolean} props.loading - Indicates whether the button is in a loading state (default: false).
 * @param {boolean} props.hasShadow - Determines whether the button has shadow styling (default: true).
 * @returns {JSX.Element} A button component.
 */
const Button = ({ 
  buttonStyle, 
  textStyle, 
  title = '', 
  onPress = () => {}, 
  loading = false, 
  hasShadow = true 
}) => {
  // Define shadow styling for the button
  const shadowStyle = {
    shadowColor: theme.colors.dark,
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  };

  // Render a loading indicator if the button is in a loading state
  if (loading) {
    return (
      <View style={[styles.button, buttonStyle, { backgroundColor: 'white' }]}>
        <Loading />
      </View>
    );
  }

  // Render the button with optional shadow and text
  return (
    <Pressable 
      onPress={onPress} 
      style={[styles.button, buttonStyle, hasShadow && shadowStyle]}
    >
      <Text style={[styles.text, textStyle]}>{title}</Text>
    </Pressable>
  );
};

export default Button;

const styles = StyleSheet.create({
  button: {
    // Button background color
    backgroundColor: theme.colors.primary,
    // Dynamic height based on screen size
    height: getHeightPercentage(6.6), 
    // Center align content vertically
    justifyContent: 'center', 
    // Center align content horizontally
    alignItems: 'center', 
    // Rounded corners
    borderRadius: theme.radius.xl, 
  },
  text: {
    // Dynamic font size
    fontSize: getHeightPercentage(2.5), 
    // Text color
    color: 'white', 
    // Bold text
    fontWeight: theme.fontWeight.bold, 
  },
});
