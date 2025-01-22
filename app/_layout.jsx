import { View, Text } from 'react-native';
import React, { useEffect } from 'react';
import { Stack, useRouter } from 'expo-router';
import { AuthProvider, useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/superbase';
import { getUserData } from '../services/userService';

/**
 * Root layout component that wraps the app in an `AuthProvider` context.
 * This ensures authentication-related functionality is accessible across the app.
 */
const _layout = () => {
  return (
    <AuthProvider>
      <MainLayout />
    </AuthProvider>
  );
};

/**
 * Main layout component responsible for handling authentication state
 * and routing the user to appropriate screens based on their session status.
 */
const MainLayout = () => {
  // Access authentication-related functions from the Auth context
  const { setAuth, setUserData } = useAuth();

  // Router instance for navigation
  const router = useRouter();

  // Effect to handle authentication state changes
  useEffect(() => {
    // Listen for authentication state changes via Supabase
    supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        // Set the authenticated user's details in the Auth context
        setAuth(session?.user);

        // Fetch and update additional user data
        updateUserData(session?.user);

        // Navigate to the home screen
        router.replace('/home');
      } else {
        // Clear authentication details in the Auth context
        setAuth(null);

        // Navigate to the welcome screen
        router.replace('/welcome');
      }
    });
  }, []);

  /**
   * Fetch and update user data based on their ID.
   * @param {Object} user - The authenticated user's data.
   */
  const updateUserData = async (user) => {
    // Call the service to fetch user data
    let res = await getUserData(user?.id);

    // If the fetch is successful, update the user data in the Auth context
    if (res.success) setUserData(res.data);
  };

  // Render the navigation stack with no headers shown
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    />
  );
};

export default _layout;
