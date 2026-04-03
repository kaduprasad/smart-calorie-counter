import React from 'react';
import { View, Text, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { styles } from './styles/settingsScreenStyles';
import { accountStyles } from './styles/accountSectionStyles';

export const AccountSection: React.FC = () => {
  const { user, isSigningIn, signIn, signOut } = useAuth();

  return (
    <View style={styles.section}>
      <View style={styles.sectionTitleRow}>
        <Ionicons name="person-circle" size={18} color="#FF7B00" />
        <Text style={styles.sectionTitleInRow}>Account</Text>
      </View>
      <View style={styles.card}>
        {user ? (
          // Signed in state
          <View>
            <View style={accountStyles.profileRow}>
              {user.photo ? (
                <Image source={{ uri: user.photo }} style={accountStyles.avatar} />
              ) : (
                <View style={accountStyles.avatarPlaceholder}>
                  <Ionicons name="person" size={24} color="#FF7B00" />
                </View>
              )}
              <View style={accountStyles.profileInfo}>
                <Text style={accountStyles.profileName}>{user.name || 'User'}</Text>
                <Text style={accountStyles.profileEmail}>{user.email}</Text>
              </View>
              <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
            </View>
            <TouchableOpacity style={accountStyles.signOutBtn} onPress={signOut} activeOpacity={0.7}>
              <Ionicons name="log-out-outline" size={16} color="#EF4444" />
              <Text style={accountStyles.signOutText}>Sign Out</Text>
            </TouchableOpacity>
          </View>
        ) : (
          // Signed out state
          <View>
            <Text style={accountStyles.description}>
              Sign in with Google to enable future features like cloud backup and sync.
            </Text>
            <TouchableOpacity
              style={accountStyles.signInBtn}
              onPress={signIn}
              disabled={isSigningIn}
              activeOpacity={0.8}
            >
              {isSigningIn ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <>
                  <Image
                    source={{ uri: 'https://developers.google.com/identity/images/g-logo.png' }}
                    style={accountStyles.googleIcon}
                  />
                  <Text style={accountStyles.signInText}>Sign in with Google</Text>
                </>
              )}
            </TouchableOpacity>
            <Text style={accountStyles.optional}>Optional — app works fully without sign-in</Text>
          </View>
        )}
      </View>
    </View>
  );
};
