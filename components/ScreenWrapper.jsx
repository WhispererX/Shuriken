import { View } from 'react-native';
import React from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

/**
 * A wrapper component for screens that adjusts padding for safe area insets
 * and allows customizing the background color.
 *
 * @param {Object} props - The component's props.
 * @param {React.ReactNode} props.children - The child components to render inside the wrapper.
 * @param {string} props.background - The background color of the screen.
 * @returns {JSX.Element} A styled View component with safe area padding.
 */
const ScreenWrapper = ({ children, background }) => {
  // Retrieve the safe area insets for the current device
  const { top } = useSafeAreaInsets();

  // Calculate padding for the top of the screen
  // If the top inset is greater than 0, add 5 for extra spacing; otherwise, default to 30
  const paddingTop = top > 0 ? top + 5 : 10;

  return (
    <View style={{ flex: 1, paddingTop, backgroundColor: background }}>
      {/* Render the child components */}
      {children}
    </View>
  );
};

export default ScreenWrapper;
