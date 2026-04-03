import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  GoogleSignin,
  isSuccessResponse,
  isErrorWithCode,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import { AuthUser } from '../types';
import { GOOGLE_WEB_CLIENT_ID, STORAGE_KEYS } from '../common/constants';

interface AuthContextType {
  user: AuthUser | null;
  isSigningIn: boolean;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isSigningIn: false,
  signIn: async () => {},
  signOut: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isSigningIn, setIsSigningIn] = useState(false);

  // Configure Google Sign-In on mount
  useEffect(() => {
    GoogleSignin.configure({
      webClientId: GOOGLE_WEB_CLIENT_ID,
    });
    loadCachedUser();
  }, []);

  const loadCachedUser = async () => {
    try {
      const cached = await AsyncStorage.getItem(STORAGE_KEYS.AUTH_USER);
      if (cached) {
        setUser(JSON.parse(cached));
      }
    } catch {
      // Silently fail — user just won't be signed in
    }
  };

  const signIn = useCallback(async () => {
    try {
      setIsSigningIn(true);
      await GoogleSignin.hasPlayServices();
      const response = await GoogleSignin.signIn();

      if (isSuccessResponse(response)) {
        const { user: googleUser } = response.data;
        const authUser: AuthUser = {
          id: googleUser.id,
          email: googleUser.email,
          name: googleUser.name,
          photo: googleUser.photo,
        };
        setUser(authUser);
        await AsyncStorage.setItem(STORAGE_KEYS.AUTH_USER, JSON.stringify(authUser));
      }
    } catch (error) {
      if (isErrorWithCode(error)) {
        switch (error.code) {
          case statusCodes.SIGN_IN_CANCELLED:
            // User cancelled — do nothing
            break;
          case statusCodes.IN_PROGRESS:
            // Already signing in
            break;
          case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
            console.log('Google Play Services not available');
            break;
          default:
            console.log('Google Sign-In error:', error.code);
        }
      }
    } finally {
      setIsSigningIn(false);
    }
  }, []);

  const signOut = useCallback(async () => {
    try {
      await GoogleSignin.signOut();
      setUser(null);
      await AsyncStorage.removeItem(STORAGE_KEYS.AUTH_USER);
    } catch (error) {
      console.log('Sign-out error:', error);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, isSigningIn, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};
