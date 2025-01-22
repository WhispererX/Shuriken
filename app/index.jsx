import { View, Text, Button } from 'react-native';
import React from 'react';
import { useRouter } from 'expo-router';

// Loading component for displaying a spinner or loading state
import Loading from '../components/Loading'; 

/**
 * The index screen component serves as the initial view.
 * It displays a loading indicator centered on the screen.
 */
const index = () => {
  return (
    <View
      style={{
        flex: 1, // Takes up the full screen height
        justifyContent: 'center', // Vertically centers content
        alignItems: 'center', // Horizontally centers content
      }}
    >
      {/* Display a loading spinner */}
      <Loading />
    </View>
  );
};

export default index;
